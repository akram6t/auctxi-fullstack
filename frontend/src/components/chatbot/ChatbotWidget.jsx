import { useState, useEffect, useRef } from 'react';
import { IconMessageCircle, IconX, IconSend, IconMaximize, IconMinimize } from '@tabler/icons-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const ws = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Connect to WebSocket when widget opens
  useEffect(() => {
    if (isOpen && !ws.current) {
      // Connect to the API Gateway WebSocket route
      // Use wss:// if on https, otherwise ws://
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // In development Vite proxy handles /api, but WebSockets might need exact host if proxy doesn't catch it
      // Vite proxy is configured to ws:true, so we can just use the current host
      const wsUrl = `${protocol}//${window.location.host}/api/chat/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('[Chatbot] Connected to WebSocket');
        if (messages.length === 0) {
            setMessages([{ role: 'assistant', content: 'Hi! I am the AuctXI Assistant. How can I help you today?' }]);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'chunk') {
            setIsTyping(false);
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: lastMsg.content + data.content }
                ];
              } else {
                return [...prev, { role: 'assistant', content: data.content, isStreaming: true }];
              }
            });
          } else if (data.type === 'done') {
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, isStreaming: false }
                ];
              }
              return prev;
            });
          } else if (data.type === 'error') {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', content: data.content, isError: true }]);
          }
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };

      ws.current.onclose = () => {
        console.log('[Chatbot] Disconnected from WebSocket');
        ws.current = null;
      };
    }

    return () => {
      // Don't auto-close websocket on unmount if we want to keep session, but good for cleanup
      if (!isOpen && ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Max size is 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        content: event.target.result
      });
    };
    reader.onerror = () => {
      alert('Failed to read file.');
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  const removeAttachment = () => {
    setAttachedFile(null);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!input.trim() && !attachedFile) return;
    
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        alert("The Chatbot is currently disconnected. Please refresh the page or ensure the backend services are running.");
        return;
    }
    
    let finalMsg = '';
    let displayMsg = '';
    
    if (attachedFile) {
        finalMsg += `[Attached File: ${attachedFile.name}]\n${attachedFile.content}\n[End File]\n\n`;
        displayMsg += `📎 Attached File: ${attachedFile.name}\n\n`;
    }
    
    if (input.trim()) {
        finalMsg += input.trim();
        displayMsg += input.trim();
    }
    
    setMessages(prev => [...prev, { role: 'user', content: displayMsg }]);
    setInput('');
    setAttachedFile(null);
    setIsTyping(true);
    
    // Send to python backend
    ws.current.send(finalMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={clsx(
            "bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
            isExpanded 
              ? "fixed inset-4 sm:inset-8 md:inset-12 z-[100]" 
              : "mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] transform origin-bottom-right"
          )}
        >
          {/* Header */}
          <div className="h-14 bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-between px-4 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <IconMessageCircle size={20} />
              <span className="font-semibold">AuctXI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <IconMinimize size={18} stroke={2} /> : <IconMaximize size={18} stroke={2} />}
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false); // Reset expansion on close
                }}
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
                title="Close"
              >
                <IconX size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-50 dark:bg-secondary-950/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary-600 text-white self-end ml-auto rounded-tr-none" 
                    : "bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 border border-secondary-100 dark:border-secondary-700 self-start rounded-tl-none"
                )}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          table: ({node, ...props}) => (
                              <div className="overflow-x-auto my-2">
                                  <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700" {...props} />
                              </div>
                          ),
                          th: ({node, ...props}) => <th className="px-3 py-2 bg-secondary-100 dark:bg-secondary-800 text-left text-xs font-semibold" {...props} />,
                          td: ({node, ...props}) => <td className="px-3 py-2 border-t border-secondary-200 dark:border-secondary-700 text-sm" {...props} />,
                          a: ({node, ...props}) => <a className="text-primary-600 dark:text-primary-400 hover:underline" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 self-start rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5 w-16">
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 flex-shrink-0 flex flex-col gap-2">
            {attachedFile && (
                <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg text-xs">
                    <span className="truncate flex-1 font-medium">📎 {attachedFile.name}</span>
                    <button type="button" onClick={removeAttachment} className="ml-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-200">
                        <IconX size={14} />
                    </button>
                </div>
            )}
            <form onSubmit={sendMessage} className="flex items-center gap-2 relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.csv,.json,.md,.js,.jsx,.py"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 flex items-center justify-center transition-colors flex-shrink-0"
                title="Attach text-based file"
              >
                <span className="text-xl">📎</span>
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-secondary-100 dark:bg-secondary-800 border-none rounded-full py-2.5 px-4 text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={(!input.trim() && !attachedFile) || isTyping}
                className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 transition-colors flex-shrink-0"
              >
                <IconSend size={18} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30",
          isOpen ? "bg-secondary-600 hover:bg-secondary-700" : "bg-primary-600 hover:bg-primary-700"
        )}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <IconX size={28} /> : <IconMessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
