function printReceipt(orderData) {
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    
    printWindow.document.write(`
        <html>
            <body style="font-family: 'Courier New', Courier, monospace; width: 58mm; padding: 10px;">
                <center>
                    <h2 style="margin:0;">ZESTYBITE</h2>
                    <p>Deliciously Yours</p>
                </center>
                <hr>
                <p>Order ID: ${orderData.id}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <hr>
                <table style="width:100%">
                    <tr><td>${orderData.item}</td><td>₹${orderData.price}</td></tr>
                </table>
                <hr>
                <center><p>THANK YOU! VISIT AGAIN</p></center>
                <script>window.print(); window.close();</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}