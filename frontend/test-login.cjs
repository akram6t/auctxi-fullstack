const axios = require('axios');
async function test() {
  try {
    console.log("Attempting login...");
    const res = await axios.post('http://localhost:5173/api/auth/login', {
      email: 'comeingame72@gmail.com',
      password: 'mypassword',
      role: 'client'
    });
    console.log("Login success! Response:", res.data);
    const token = res.data.token;
    
    console.log("\nAttempting to access /api/dashboard/stats...");
    const statsRes = await axios.get('http://localhost:5173/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Stats success! Response:", statsRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Error status:", err.response.status);
      console.error("Error data:", err.response.data);
    } else {
      console.error("Network error:", err.message);
    }
  }
}
test();
