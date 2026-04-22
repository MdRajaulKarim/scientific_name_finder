function payBookingFee() {
    var options = {
        "key": "YOUR_RAZORPAY_KEY", // Enter your API Key from Razorpay Dashboard
        "amount": 9900, // Amount is in currency subunits (9900 = ₹99)
        "currency": "INR",
        "name": "ZestyBite Restaurant",
        "description": "Table Reservation Fee",
        "handler": function (response){
            alert("Payment Successful! ID: " + response.razorpay_payment_id);
            window.location.href = "tracking.html"; // Redirect to status page
        },
        "theme": {
            "color": "#FF4500" // Our Accent Color
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}