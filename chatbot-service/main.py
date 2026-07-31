import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from openai import AsyncOpenAI
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
import models
from database import engine, get_db

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Initialize OpenAI async client
client = AsyncOpenAI(
    api_key="42c298f68e994933a9f1af4f4afd0042.GGS95z3Zy2AxSC2X",
    base_url="https://api.z.ai/api/paas/v4/"
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

def save_message(db: Session, session_id: str, role: str, content: str):
    msg = models.ChatMessage(session_id=session_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

def get_history(db: Session, session_id: str, limit: int = 15):
    msgs = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.created_at.desc()).limit(limit).all()
    history = [{"role": msg.role, "content": msg.content} for msg in msgs[::-1]]
    return history

# --- Agent Tools Definitions ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_sql_query",
            "description": "Execute a MySQL SELECT query to dynamically analyze the database. ONLY read queries (SELECT) are permitted.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The raw MySQL SELECT query to execute. Example: 'SELECT name, purse FROM teams ORDER BY purse DESC LIMIT 5'"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

def execute_tool(db: Session, function_name: str, arguments: dict) -> str:
    try:
        if function_name == "execute_sql_query":
            query_str = arguments.get("query", "").strip()
            
            # Security: Basic check to ensure it's a SELECT query
            if not query_str.lower().startswith("select"):
                return "Error: Only SELECT queries are permitted for safety reasons."
                
            # Execute the query
            result_proxy = db.execute(text(query_str))
            
            # Fetch all rows
            rows = result_proxy.fetchall()
            if not rows:
                return "Query executed successfully, but returned 0 results."
                
            # Convert rows to a list of dicts using column names
            columns = result_proxy.keys()
            results = [dict(zip(columns, row)) for row in rows]
            
            # Return as JSON string for the LLM to analyze
            return json.dumps(results, default=str) # default=str handles dates/decimals

        else:
            return f"Error: Function {function_name} not found."
    except Exception as e:
        return f"Database error: {str(e)}"

# --- WebSockets ---

@app.websocket("/api/chat/ws")
async def websocket_endpoint(websocket: WebSocket, session_id: str = "default", db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            
            # Save user message
            save_message(db, session_id, "user", data)
            
            # Build messages for OpenAI
            history = get_history(db, session_id)
            system_prompt = """You are the AuctXI Assistant, a friendly and highly knowledgeable Data Analyst AI that helps users manage their sports auctions.
You speak like a real human—warm, engaging, and enthusiastic about sports and strategy. 

You have access to a 'execute_sql_query' tool. Whenever a user asks a question about data, analytics, teams, players, transactions, or auctions, you must write a MySQL SELECT query to fetch the exact data needed to answer their question. 

Here is the database schema you can query:
- `teams` (id, name, owner_email, purse, squad_size, logo_url, status, owner_name, short_name)
- `players` (id, base_price, country, name, role, status, team_id, image_url)
- `auctions` (id, budget_cap, date, name, status, total_players, rules, timer_timeout)
- `transactions` (id, amount, date, reference, status, type, event_name, player_name, team_name)

Join `players` and `teams` using `players.team_id = teams.id` when needed. 
Once you receive the raw JSON data from your tool, analyze it and format your final response to the user using Markdown. Use bolding for emphasis, bullet points for lists, and tables when presenting statistical data. Be concise but helpful."""

            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(history)
            
            # Start Chat Completion Loop to handle tool calls
            max_loops = 5
            for loop in range(max_loops):
                try:
                    response = await client.chat.completions.create(
                        model="GLM-4.7-Flash",
                        messages=messages,
                        tools=tools,
                        tool_choice="auto"
                    )
                    
                    response_message = response.choices[0].message
                    
                    if response_message.tool_calls:
                        messages.append(response_message)
                        for tool_call in response_message.tool_calls:
                            func_name = tool_call.function.name
                            args = json.loads(tool_call.function.arguments)
                            print(f"[Agent] Calling tool: {func_name} with {args}")
                            
                            # Execute local function
                            tool_result = execute_tool(db, func_name, args)
                            
                            messages.append({
                                "tool_call_id": tool_call.id,
                                "role": "tool",
                                "name": func_name,
                                "content": tool_result
                            })
                        # Continue the loop to let the model generate the final answer based on the tool results
                        continue
                    else:
                        # Model is done, stream the final answer manually since we couldn't stream during tool calls easily
                        final_content = response_message.content or ""
                        # Send it in small chunks to simulate streaming
                        chunk_size = 20
                        for i in range(0, len(final_content), chunk_size):
                            await websocket.send_text(json.dumps({"type": "chunk", "content": final_content[i:i+chunk_size]}))
                            await asyncio.sleep(0.01)
                            
                        await websocket.send_text(json.dumps({"type": "done"}))
                        save_message(db, session_id, "assistant", final_content)
                        break
                        
                except Exception as e:
                    print(f"OpenAI API Error: {e}")
                    await websocket.send_text(json.dumps({"type": "error", "content": "Sorry, I encountered an error."}))
                    break
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")

@app.get("/api/chat/health")
def health_check():
    return {"status": "Chatbot Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
