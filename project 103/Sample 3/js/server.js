const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serves HTML, CSS, JS files
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Store orders in memory (replace with MongoDB in production)
let orders = [];

// Endpoint to place order
app.post('/api/place-order', (req, res) => {
    try {
        const orderData = req.body;

        // Validate input
        if (!orderData.item || !orderData.price || !orderData.customerPhone) {
            return res.status(400).json({
                message: "Invalid order data",
                orderId: null
            });
        }

        const order = {
            orderId: "ZB" + Date.now(),
            ...orderData,
            createdAt: new Date().toISOString(),
            status: "Confirmed"
        };

        orders.push(order);
        console.log("✓ New Order Received:", order);

        res.status(200).json({
            message: "Order Received",
            orderId: order.orderId,
            status: "Confirmed"
        });
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({
            message: "Server error",
            orderId: null
        });
    }
});

// Endpoint to get orders (for admin)
app.get('/api/orders', (req, res) => {
    res.status(200).json({
        count: orders.length,
        orders: orders
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "Server running", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`\n🍽️  ZestyBite Server running at http://localhost:${PORT}`);
    console.log(`📍 API Endpoints:`);
    console.log(`   - POST /api/place-order`);
    console.log(`   - GET /api/orders`);
    console.log(`   - GET /api/health\n`);
});