/* ==================== RAZORPAY PAYMENT INTEGRATION ==================== */

// Configuration - Update these with your actual Razorpay credentials
const RAZORPAY_CONFIG = {
    // Test Key (Replace with your live key for production)
    KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L', // Demo test key
    MERCHANT_NAME: 'Savory Haven',
    MERCHANT_IMAGE: 'https://via.placeholder.com/100/D84315/FFFFFF?text=SH',
    // For production, add your live key:
    // KEY_ID: 'rzp_live_YOUR_ACTUAL_KEY_ID',
};

/**
 * Initialize Razorpay payment
 * Loads the Razorpay script and initiates payment
 */
function initiateRazorpayPayment(amount) {
    // Validate amount
    if (!amount || amount <= 0) {
        alert('Invalid amount. Please try again.');
        return;
    }

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
        loadRazorpayScript(() => processPayment(amount));
    } else {
        processPayment(amount);
    }
}

/**
 * Load Razorpay script dynamically
 */
function loadRazorpayScript(callback) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
        alert('Failed to load Razorpay. Please check your internet connection.');
        console.error('Failed to load Razorpay script');
    };
    script.onload = callback;
    document.head.appendChild(script);
}

/**
 * Process payment with Razorpay
 */
function processPayment(amount) {
    const user = getCurrentUser();

    if (!user) {
        alert('Please login first');
        return;
    }

    // Convert amount to smallest currency unit (paise)
    const amountInPaise = Math.round(amount * 100);

    // Log for debugging
    console.log('Processing payment:', {
        amount: amount,
        amountInPaise: amountInPaise,
        user: user.phone
    });

    const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: RAZORPAY_CONFIG.MERCHANT_NAME,
        description: 'Order Payment',
        image: RAZORPAY_CONFIG.MERCHANT_IMAGE,
        prefill: {
            name: 'Guest User',
            contact: user.phone,
            email: 'customer@savoryhahen.com'
        },
        notes: {
            address: 'Savory Haven, 123 Food Street, Culinary City',
            userId: user.phone
        },
        handler: handlePaymentSuccess,
        modal: {
            ondismiss: handlePaymentCancel,
            backdrop: true,
            escape: true
        },
        theme: {
            color: '#D84315' // Restaurant brand color
        }
    };

    try {
        const razorpay = new Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error('Razorpay error:', error);
        alert('Payment initiation failed. Please try again.');
    }
}

/**
 * Handle successful payment
 */
function handlePaymentSuccess(response) {
    const paymentId = response.razorpay_payment_id;
    const user = getCurrentUser();

    console.log(`Payment successful:`, response);

    if (!user) {
        alert('Session expired. Please login again.');
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    // Create order from cart items
    const order = {
        id: Math.floor(100000 + Math.random() * 900000),
        userId: user.phone,
        items: [...cart],
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentId: paymentId,
        status: 'pending', // pending → preparing → ready → delivered
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        deliveryLocation: 'Demo Address', // In production: get from checkout form
        createdAt: new Date().toISOString()
    };

    // Save order
    orders.push(order);
    saveData();

    // Clear cart
    cart = [];
    displayCart();
    updateCartBadge();
    closeModal('cartModal');

    // Success message
    alert(`✅ Order placed successfully!\n\nOrder ID: ${order.id}\nPayment ID: ${paymentId}\n\nTotal: ₹${total}`);

    console.log('Order created:', order);

    // Redirect to tracking page after 2 seconds
    setTimeout(() => {
        window.location.href = 'tracking.html';
    }, 2000);
}

/**
 * Handle payment cancellation
 */
function handlePaymentCancel(reason) {
    console.log(`Payment cancelled:`, reason);
    alert('Payment cancelled. Your cart has been saved. You can continue shopping or try again later.');
}

/**
 * Verify payment on backend (server-side)
 * This should be called from your backend for security
 */
async function verifyPaymentSignature(paymentId, orderId, signature) {
    try {
        const response = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_id: paymentId,
                order_id: orderId,
                signature: signature
            })
        });

        const data = await response.json();
        return data.verified;
    } catch (error) {
        console.error('Payment verification error:', error);
        return false;
    }
}

/**
 * Get payment status
 */
function getPaymentStatus(paymentId) {
    // This would typically call a backend API to get the payment status
    // For now, returning a mock status
    return {
        id: paymentId,
        status: 'completed',
        amount: 0,
        currency: 'INR',
        created_at: new Date().toISOString()
    };
}

/* ==================== TABLE BOOKING PAYMENT ==================== */

/**
 * Process table booking payment
 */
function processBookingPayment(bookingFee) {
    const user = getCurrentUser();

    if (!user) {
        alert('Please login first');
        return;
    }

    if (!window.Razorpay) {
        loadRazorpayScript(() => initiateBookingPayment(bookingFee));
    } else {
        initiateBookingPayment(bookingFee);
    }
}

/**
 * Initiate booking payment
 */
function initiateBookingPayment(bookingFee) {
    const amountInPaise = Math.round(bookingFee * 100);
    const user = getCurrentUser();

    if (!user) {
        alert('Please login first');
        return;
    }

    const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: RAZORPAY_CONFIG.MERCHANT_NAME,
        description: 'Table Booking Fee',
        image: RAZORPAY_CONFIG.MERCHANT_IMAGE,
        prefill: {
            contact: user.phone,
            email: 'booking@savoryhahen.com'
        },
        notes: {
            type: 'booking',
            userId: user.phone
        },
        handler: handleBookingPaymentSuccess,
        modal: {
            ondismiss: () => alert('Booking cancelled. Please try again.'),
            backdrop: true
        },
        theme: {
            color: '#4CAF50'
        }
    };

    try {
        const razorpay = new Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error('Razorpay booking error:', error);
        alert('Booking payment failed. Please try again.');
    }
}

/**
 * Handle successful booking payment
 */
function handleBookingPaymentSuccess(response) {
    alert(`✅ Booking fee paid successfully!\nTransaction ID: ${response.razorpay_payment_id}`);
}

/* ==================== PAYMENT HELPERS ==================== */

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

/**
 * Calculate transaction fees
 */
function calculateTransactionFee(amount) {
    const platformFee = 0.025; // 2.5% platform fee
    return amount * platformFee;
}

/**
 * Calculate total with taxes
 */
function calculateTotal(subtotal) {
    const gst = subtotal * 0.05; // 5% GST
    return {
        subtotal: subtotal,
        gst: gst,
        total: subtotal + gst
    };
}

/* ==================== DEMO MODE ==================== */

/**
 * Enable demo mode for testing
 * This creates test transactions without actual payment
 */
function enableDemoMode() {
    window.DEMO_MODE = true;
    console.log('Demo mode enabled. No real payments will be processed.');
}

/**
 * Mock payment for demo purposes
 */
function mockPayment(amount) {
    if (!window.DEMO_MODE) return false;

    const order = {
        id: Math.floor(100000 + Math.random() * 900000),
        userId: getCurrentUser().phone,
        items: [...cart],
        total: amount,
        paymentId: 'DEMO_' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        isDemo: true,
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    saveData();

    alert(`✅ [DEMO] Order created successfully!\nOrder ID: ${order.id}`);
    return true;
}

// Initialize Razorpay in demo mode if needed
// enableDemoMode();
