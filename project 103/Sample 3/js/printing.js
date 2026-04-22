function printReceipt(orderData) {
    // Validate order data
    if (!orderData || !orderData.id) {
        alert("❌ Invalid order data for printing");
        return;
    }

    const printWindow = window.open('', '_blank', 'width=400,height=600');

    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Receipt - ${orderData.id}</title>
        </head>
        <body style="font-family: 'Courier New', Courier, monospace; width: 58mm; padding: 10px; line-height: 1.4;">
            <div style="text-align: center; margin-bottom: 10px;">
                <h2 style="margin: 5px 0; font-size: 16px;">🍽️ ZESTYBITE</h2>
                <p style="margin: 0; font-size: 12px;">Deliciously Yours</p>
                <p style="margin: 5px 0; font-size: 11px; color: #666;">Premium Restaurant</p>
            </div>
            <hr style="border: none; border-top: 1px dashed #000; margin: 5px 0;">

            <div style="font-size: 12px;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderData.id}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>

            <hr style="border: none; border-top: 1px dashed #000; margin: 5px 0;">

            <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span><strong>Item</strong></span>
                    <span><strong>Price</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>${orderData.item || 'N/A'}</span>
                    <span>₹${orderData.price || '0'}</span>
                </div>
            </div>

            <hr style="border: none; border-top: 1px dashed #000; margin: 5px 0;">

            <div style="font-size: 12px; text-align: right; margin: 5px 0;">
                <strong>Total: ₹${orderData.price || '0'}</strong>
            </div>

            <hr style="border: none; border-top: 1px solid #000; margin: 5px 0;">

            <div style="text-align: center; font-size: 11px; margin-top: 10px;">
                <p style="margin: 5px 0;">✓ THANK YOU FOR YOUR ORDER!</p>
                <p style="margin: 5px 0;">VISIT AGAIN</p>
                <p style="margin: 5px 0; color: #666;">www.zestybite.com</p>
            </div>

            <script>
                window.print();
                setTimeout(() => { window.close(); }, 1000);
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    console.log("✓ Receipt printed for Order:", orderData.id);
}