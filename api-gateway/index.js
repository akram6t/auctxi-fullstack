const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve the public HTML page for root
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to dynamically check service status
app.get('/status', async (req, res) => {
    
    const checkService = (url) => {
        return new Promise((resolve) => {
            const request = http.get(url, (response) => {
                // Read data to free up socket
                response.on('data', () => {});
                response.on('end', () => {
                    resolve(response.statusCode >= 200 && response.statusCode < 400);
                });
            }).on('error', () => {
                resolve(false);
            });
            request.setTimeout(1500, () => {
                request.destroy();
                resolve(false);
            });
        });
    };

    const javaStatus = await checkService('http://127.0.0.1:8080/api/settings');
    const pythonStatus = await checkService('http://127.0.0.1:5000/api/chat/health');
    const paymentStatus = await checkService('http://127.0.0.1:5001/api/payments/ping');
    const notificationStatus = await checkService('http://127.0.0.1:4000/api/ping');

    res.json({
        gateway: true,
        java: javaStatus,
        python: pythonStatus,
        payment: paymentStatus,
        notification: notificationStatus
    });
});

// Proxy for WebSocket and HTTP to Chatbot Service (Python)
app.use('/api/chat', createProxyMiddleware({
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
    ws: true, // proxy websockets
    logLevel: 'debug',
}));

// Proxy for HTTP to .NET Payment Service
app.use('/api/payment', createProxyMiddleware({
    target: 'http://127.0.0.1:5001',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/'
    },
    logLevel: 'debug',
}));

// Proxy for HTTP to Node.js Notification Server
app.use('/api/notification', createProxyMiddleware({
    target: 'http://127.0.0.1:4000',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/' // maps /api/notification/send -> /api/send on port 4000
    },
    logLevel: 'debug',
}));

// Proxy for HTTP to Spring Boot Backend (Java)
app.use('/api/auction', createProxyMiddleware({
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    pathRewrite: {
        // Express strips '/api/auction', so req.url starts with '/'
        '^/': '/api/'
    },
    logLevel: 'debug',
}));

// Catch-all fallback for other /api routes just in case
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    logLevel: 'debug',
}));

// Provide a healthcheck endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`[API Gateway] Server started on http://localhost:${PORT}`);
});
