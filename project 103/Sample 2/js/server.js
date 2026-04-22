const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serves your HTML, CSS, JS files

// Endpoint to receive orders
app.post('/api/place-order', (req, res) => {
    const orderData = req.body;
    console.log("New Order Received:", orderData);
    
    // Here you would connect to MongoDB and save the order
    res.status(200).json({ message: "Order Received", orderId: "ZB" + Date.now() });
});

app.listen(PORT, () => {
    console.log(`ZestyBite Server running at http://localhost:${PORT}`);
});