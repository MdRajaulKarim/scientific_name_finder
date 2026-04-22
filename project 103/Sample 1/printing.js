/* ==================== THERMAL PRINTER INTEGRATION ==================== */

/**
 * Print receipt to thermal printer
 * Supports ESC/POS format for most thermal printers
 */
function printReceipt(order) {
    if (!order) {
        console.error('Order not found');
        return;
    }

    // Check if printer is available
    if (!isPrinterAvailable()) {
        console.warn('Thermal printer not available. Falling back to browser print.');
        printBrowserPreview(order);
        return;
    }

    const receiptData = generateReceiptData(order);
    sendToPrinter(receiptData);
}

/**
 * Check if thermal printer is available
 */
function isPrinterAvailable() {
    // In production: Check for USB/Serial printer connection
    // This is a placeholder - actual implementation depends on your printer setup
    return localStorage.getItem('printerConnected') === 'true';
}

/**
 * Generate thermal printer receipt data (ESC/POS format)
 */
function generateReceiptData(order) {
    const ESC = '\x1B'; // ESC character
    const GS = '\x1D';
    const NUL = '\x00';

    let receipt = '';

    // Initialize printer
    receipt += ESC + '@'; // Reset printer

    // Set print mode (condensed)
    receipt += ESC + '!' + '\x00'; // Normal mode

    // Center align
    receipt += ESC + 'a' + '\x01';

    // Large text
    receipt += GS + '!' + '\x31';
    receipt += 'SAVORY HAVEN\n';
    receipt += 'Premium Restaurant\n';

    // Normal text
    receipt += GS + '!' + '\x00';
    receipt += '================================\n';
    receipt += ESC + 'a' + '\x00'; // Left align

    // Receipt details
    receipt += `Receipt #${order.id}\n`;
    receipt += `Date: ${order.date}\n`;
    receipt += `Time: ${order.time}\n`;
    receipt += `Customer: ${order.userId}\n`;
    receipt += '================================\n\n';

    // Items
    receipt += 'ITEMS:\n';
    receipt += '--------------------------------\n';
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receipt += `${item.name}\n`;
        receipt += `  Qty: ${item.quantity} x ₹${item.price} = ₹${itemTotal}\n`;
    });

    receipt += '--------------------------------\n';

    // Totals
    const subtotal = order.total * (100 / 105); // Remove 5% GST for display
    const gst = order.total - subtotal;

    receipt += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    receipt += `GST (5%): ₹${gst.toFixed(2)}\n`;

    // Center align for total
    receipt += ESC + 'a' + '\x01';
    receipt += GS + '!' + '\x31';
    receipt += `TOTAL: ₹${order.total.toFixed(2)}\n`;
    receipt += GS + '!' + '\x00';

    receipt += ESC + 'a' + '\x00'; // Left align
    receipt += '================================\n';
    receipt += 'Payment: Online\n';
    receipt += `Transaction ID: ${order.paymentId || 'N/A'}\n';
    receipt += '\n\n';

    // Center align for footer
    receipt += ESC + 'a' + '\x01';
    receipt += 'Thank you for ordering!\n';
    receipt += 'Enjoy your meal!\n';
    receipt += '\n\n\n';

    // Cut paper
    receipt += ESC + 'm'; // Partial cut

    return receipt;
}

/**
 * Send receipt to thermal printer
 * Requires printer driver/connection to be set up
 */
function sendToPrinter(receiptData) {
    try {
        // Method 1: WebUSB API (modern browsers)
        if (navigator.usb) {
            sendViaBluetooth(receiptData);
        }
        // Method 2: Web Serial API (for serial connection)
        else if (navigator.serial) {
            sendViaSerial(receiptData);
        }
        // Method 3: HTTP to local print server
        else {
            sendViaHTTP(receiptData);
        }
    } catch (error) {
        console.error('Printer error:', error);
        alert('Failed to print receipt');
    }
}

/**
 * Send receipt via WebUSB (Bluetooth printers)
 */
async function sendViaBluetooth(receiptData) {
    try {
        const device = await navigator.usb.requestDevice({
            filters: [
                { vendorId: 0x065a }, // Example thermal printer vendor ID
            ]
        });

        await device.open();
        await device.claimInterface(0);

        const encoder = new TextEncoder();
        await device.transferOut(1, encoder.encode(receiptData));

        await device.close();
        console.log('Receipt printed successfully');
    } catch (error) {
        console.error('USB print error:', error);
    }
}

/**
 * Send receipt via Web Serial API
 */
async function sendViaSerial(receiptData) {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(receiptData));
        writer.releaseLock();

        await port.close();
        console.log('Receipt printed via serial port');
    } catch (error) {
        console.error('Serial print error:', error);
    }
}

/**
 * Send receipt via HTTP to local print server
 */
async function sendViaHTTP(receiptData) {
    try {
        const response = await fetch('http://localhost:9100', {
            method: 'POST',
            body: receiptData,
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        if (response.ok) {
            console.log('Receipt sent to print server');
        } else {
            console.error('Print server error:', response.status);
        }
    } catch (error) {
        console.error('HTTP print error:', error);
    }
}

/**
 * Print receipt in browser (fallback)
 */
function printBrowserPreview(order) {
    const printWindow = window.open('', '', 'height=600,width=800');

    let receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - Order #${order.id}</title>
            <style>
                body { font-family: 'Courier New', monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
                h1 { text-align: center; font-size: 18px; }
                .divider { border-top: 1px dashed #000; margin: 10px 0; }
                .row { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { font-weight: bold; font-size: 16px; text-align: center; }
                @media print { body { margin: 0; padding: 0; } }
            </style>
        </head>
        <body>
            <h1>SAVORY HAVEN</h1>
            <p style="text-align: center;">Premium Restaurant</p>
            <div class="divider"></div>
            <div class="row"><strong>Receipt #${order.id}</strong></div>
            <div class="row"><strong>Date:</strong> ${order.date}</div>
            <div class="row"><strong>Time:</strong> ${order.time}</div>
            <div class="divider"></div>
            <p><strong>ITEMS:</strong></p>
    `;

    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptHTML += `
            <div class="row">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    const subtotal = order.total * (100 / 105);
    const gst = order.total - subtotal;

    receiptHTML += `
            <div class="divider"></div>
            <div class="row"><strong>Subtotal:</strong> <strong>₹${subtotal.toFixed(2)}</strong></div>
            <div class="row"><strong>GST (5%):</strong> <strong>₹${gst.toFixed(2)}</strong></div>
            <div class="row total">TOTAL: ₹${order.total.toFixed(2)}</div>
            <div class="divider"></div>
            <p style="text-align: center; font-size: 12px;">Thank you for your order!</p>
            <p style="text-align: center; font-size: 12px;">${order.paymentId || 'Transaction ID: N/A'}</p>
        </body>
        </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 250);
}

/**
 * Connect to thermal printer
 */
async function connectToPrinter() {
    try {
        if (!navigator.serial) {
            alert('Web Serial API is not supported in this browser');
            return;
        }

        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        localStorage.setItem('printerConnected', 'true');
        alert('✅ Printer connected successfully!');
        return port;
    } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect to printer');
    }
}

/**
 * Disconnect printer
 */
function disconnectPrinter() {
    localStorage.setItem('printerConnected', 'false');
    alert('Printer disconnected');
}

/**
 * Test printer connection by printing a test receipt
 */
async function testPrinter() {
    const testOrder = {
        id: 'TEST001',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        userId: '9999999999',
        items: [
            { name: 'Test Item 1', price: 100, quantity: 2 },
            { name: 'Test Item 2', price: 200, quantity: 1 }
        ],
        total: 500,
        paymentId: 'TEST_PAYMENT_123'
    };

    printReceipt(testOrder);
}

/**
 * Auto-print receipt when order is confirmed
 * This should be called from the admin panel when order is marked as ready
 */
function autoPrintReceipt(orderId) {
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        console.error(`Order ${orderId} not found`);
        return;
    }

    // Update order status
    order.status = 'ready';

    // Print receipt
    printReceipt(order);

    // Notify kitchen/customer
    console.log(`Receipt printed for order ${orderId}`);
}

/* ==================== PRINTER MANAGEMENT ==================== */

/**
 * Get printer status
 */
function getPrinterStatus() {
    return {
        connected: isPrinterAvailable(),
        lastPrinted: localStorage.getItem('lastPrintedTime') || 'Never',
        printCount: parseInt(localStorage.getItem('printCount') || 0)
    };
}

/**
 * Reset printer stats
 */
function resetPrinterStats() {
    localStorage.removeItem('lastPrintedTime');
    localStorage.setItem('printCount', '0');
}

/**
 * Update print statistics
 */
function updatePrintStats() {
    const count = parseInt(localStorage.getItem('printCount') || 0);
    localStorage.setItem('printCount', (count + 1).toString());
    localStorage.setItem('lastPrintedTime', new Date().toISOString());
}

// Update stats when printing
const originalPrintReceipt = printReceipt;
printReceipt = function(order) {
    originalPrintReceipt(order);
    updatePrintStats();
};
