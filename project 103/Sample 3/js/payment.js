function payBookingFee() {
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        alert("Payment system not available. Please try again.");
        return;
    }

    // ⚠️ IMPORTANT: Replace with your actual Razorpay API Key from dashboard
    const razorpayKey = "YOUR_RAZORPAY_KEY_ID";

    if (razorpayKey === "YOUR_RAZORPAY_KEY_ID") {
        alert("⚠️ Demo Mode: Payment system not configured yet.\n\nFor production:\n1. Get your Razorpay Key from dashboard\n2. Replace it in payment.js\n3. Ensure backend is running");
        // Allow demo booking
        handleDemoBooking();
        return;
    }

    const options = {
        "key": razorpayKey,
        "amount": 9900, // ₹99 in paise
        "currency": "INR",
        "name": "ZestyBite Restaurant",
        "description": "Table Reservation Fee",
        "image": "https://via.placeholder.com/150",
        "handler": function (response) {
            console.log("Payment Success:", response.razorpay_payment_id);
            alert("✓ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
            window.location.href = "tracking.html";
        },
        "prefill": {
            "email": "customer@zestybite.com",
            "contact": "9876543210"
        },
        "notes": {
            "note_key": "ZestyBite Reservation"
        },
        "theme": {
            "color": "#FF4500"
        },
        "modal": {
            "ondismiss": function() {
                alert("Payment cancelled. You can try booking again.");
            }
        }
    };

    try {
        const rzp1 = new Razorpay(options);
        rzp1.open();
    } catch (err) {
        console.error("Razorpay Error:", err);
        alert("Error initializing payment. Please refresh and try again.");
    }
}

function handleDemoBooking() {
    // Demo mode for testing
    const bookingData = {
        bookingId: "ZB" + Date.now(),
        date: new Date().toLocaleDateString(),
        amount: "₹99",
        status: "Confirmed"
    };
    sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));
    setTimeout(() => {
        window.location.href = "tracking.html";
    }, 1500);
}