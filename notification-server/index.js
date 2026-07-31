require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Check if credentials exist, warn if not
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("⚠️ WARNING: SMTP_USER or SMTP_PASS not set in .env file! Email sending will fail.");
}

// Configure Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'manager',
  database: 'auctxi-notification',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint
app.get('/api/ping', (req, res) => {
  res.json({ status: "Notification Server is running!" });
});

// Main Send Email Endpoint
app.post('/api/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: "Missing required fields 'to' and 'subject'." });
  }

  const mailOptions = {
    from: `"AuctXI Notifications" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: html || text // Fallback to text if html is not provided
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] To: ${to} | Subject: ${subject} | ID: ${info.messageId}`);
    
    // Save to database
    const [result] = await pool.execute(
      'INSERT INTO messages (user_email, subject, message_text, message_html) VALUES (?, ?, ?, ?)',
      [to, subject, text || '', html || text || '']
    );
    
    return res.status(200).json({ success: true, messageId: info.messageId, dbId: result.insertId });
  } catch (error) {
    console.error(`[Email Failed] Error sending to ${to}:`, error);
    return res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// Get messages for a user
app.get('/api/messages/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM messages WHERE user_email = ? ORDER BY created_at DESC',
      [email]
    );
    return res.json(rows);
  } catch (err) {
    console.error('[DB Fetch Error]', err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute(
      'UPDATE messages SET is_read = TRUE WHERE id = ?',
      [id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('[DB Update Error]', err);
    return res.status(500).json({ error: "Failed to update message" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [Notification Server] Running on http://localhost:${PORT}`);
});
