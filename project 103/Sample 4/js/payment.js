/**
 * ZestyBite — payment.js
 * Razorpay payment gateway integration.
 *
 * Setup:
 *  1. Create an account at https://razorpay.com
 *  2. Copy your Key ID from Settings → API Keys
 *  3. Replace RAZORPAY_KEY_ID below with your actual key
 *  4. In production, NEVER expose Key Secret in frontend.
 *     Generate the order server-side in server.js
 */

/* ============================================================
   CONFIG — Replace with your Razorpay credentials
   ============================================================ */
const RAZORPAY_KEY_ID = 'rzp_test_XXXXXXXXXXXXXXXXX'; // ← Replace this

/* ============================================================
   1. CREATE RAZORPAY ORDER (via backend)
   ============================================================ */
async function createRazorpayOrder(amount, orderId) {
  try {
    const res = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount * 100,   // Razorpay expects paise (₹1 = 100 paise)
        currency: 'INR',
        receipt: orderId
      })
    });

    if (!res.ok) throw new Error('Server error creating order');
    const data = await res.json();
    return data.id;  // Razorpay order_id

  } catch (err) {
    // Fallback: create a mock order_id for testing without backend
    console.warn('[Payment] Backend not available — using mock order ID');
    return 'order_mock_' + Date.now();
  }
}

/* ============================================================
   2. LAUNCH RAZORPAY CHECKOUT
   ============================================================ */
async function initiatePayment(orderDetails) {
  const {
    orderId,
    amount,
    userName = '',
    userPhone = '',
    userEmail = ''
  } = orderDetails;

  if (!window.Razorpay) {
    showToast('Payment gateway not loaded. Please refresh.', 'error');
    loadRazorpayScript().then(() => initiatePayment(orderDetails));
    return;
  }

  showToast('Initialising payment…', 'info');

  const razorpayOrderId = await createRazorpayOrder(amount, orderId);

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100,         // paise
    currency: 'INR',
    name: 'ZestyBite',
    description: `Order #${orderId}`,
    image: '/assets/logo.png',    // Optional: your logo
    order_id: razorpayOrderId,
    prefill: {
      name:   userName,
      email:  userEmail,
      contact: '+91' + userPhone
    },
    notes: {
      order_id: orderId
    },
    theme: {
      color: '#FF4500'            // Accent color matches brand
    },
    modal: {
      ondismiss: () => {
        showToast('Payment cancelled. Your order is saved.', 'warning');
      }
    },
    handler: function(response) {
      // Payment successful — called with payment details
      handlePaymentSuccess(response, orderId);
    }
  };

  const rzp = new window.Razorpay(options);

  // Handle payment failure
  rzp.on('payment.failed', function(response) {
    handlePaymentFailure(response, orderId);
  });

  rzp.open();
}

/* ============================================================
   3. PAYMENT SUCCESS HANDLER
   ============================================================ */
async function handlePaymentSuccess(response, orderId) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

  showToast('Payment successful! Verifying…', 'success');

  try {
    // ── PRODUCTION: Verify signature on server ─────────────
    // const verifyRes = await fetch('/api/verify-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     payment_id: razorpay_payment_id,
    //     order_id:   razorpay_order_id,
    //     signature:  razorpay_signature,
    //     zb_order:   orderId
    //   })
    // });
    // const verify = await verifyRes.json();
    // if (!verify.success) throw new Error('Signature mismatch');
    // ─────────────────────────────────────────────────────────

    // Update order payment status in localStorage
    updateOrderPaymentStatus(orderId, {
      status: 'paid',
      paymentId: razorpay_payment_id,
      paidAt: new Date().toISOString()
    });

    showToast(`🎉 Payment ₹confirmed! Order #${orderId} is being prepared.`, 'success', 5000);

    // Trigger thermal print
    if (typeof printReceipt === 'function') {
      const order = getOrderById(orderId);
      if (order) printReceipt(order);
    }

    // Redirect to tracking
    setTimeout(() => {
      window.location.href = `tracking.html?order=${orderId}`;
    }, 2000);

  } catch (err) {
    showToast('Payment received but verification failed. Contact support.', 'error', 6000);
    console.error('[Payment] Verification error:', err);
  }
}

/* ============================================================
   4. PAYMENT FAILURE HANDLER
   ============================================================ */
function handlePaymentFailure(response, orderId) {
  const { error } = response;
  console.error('[Payment] Failed:', error);

  updateOrderPaymentStatus(orderId, { status: 'payment_failed' });

  showToast(`Payment failed: ${error.description || 'Unknown error'}. Please retry.`, 'error', 6000);
}

/* ============================================================
   5. TABLE BOOKING PAYMENT (minimal fee)
   ============================================================ */
async function payBookingFee(bookingDetails) {
  const {
    bookingId,
    guestCount,
    dateTime,
    userName,
    userPhone
  } = bookingDetails;

  const fee = calculateBookingFee(guestCount);

  if (!window.Razorpay) {
    await loadRazorpayScript();
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: fee * 100,
    currency: 'INR',
    name: 'ZestyBite',
    description: `Table booking — ${guestCount} guests on ${dateTime}`,
    prefill: { name: userName, contact: '+91' + userPhone },
    theme: { color: '#FF4500' },
    notes: { booking_id: bookingId },
    handler: function(response) {
      handleBookingPaymentSuccess(response, bookingId, fee);
    },
    modal: {
      ondismiss: () => showToast('Booking fee payment cancelled.', 'warning')
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

function calculateBookingFee(guests) {
  // ₹100 per guest, capped at ₹500
  return Math.min(guests * 100, 500);
}

function handleBookingPaymentSuccess(response, bookingId, amount) {
  // Save booking payment to localStorage
  const bookings = JSON.parse(localStorage.getItem('zb_bookings') || '[]');
  const booking  = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.paymentStatus = 'paid';
    booking.paymentId     = response.razorpay_payment_id;
    booking.feePaid       = amount;
    localStorage.setItem('zb_bookings', JSON.stringify(bookings));
  }
  showToast(`✅ Booking confirmed! Fee of ₹${amount} paid.`, 'success', 5000);
  setTimeout(() => { window.location.href = 'index.html'; }, 2500);
}

/* ============================================================
   6. UTILITY HELPERS
   ============================================================ */

/** Dynamically load Razorpay checkout script */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script  = document.createElement('script');
    script.src    = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

function getOrderById(orderId) {
  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');
  return orders.find(o => o.id === orderId);
}

function updateOrderPaymentStatus(orderId, paymentInfo) {
  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');
  const order  = orders.find(o => o.id === orderId);
  if (order) {
    Object.assign(order, paymentInfo);
    localStorage.setItem('zb_orders', JSON.stringify(orders));
  }
}

/* ============================================================
   7. INIT — load Razorpay script on payment-related pages
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Only load on pages that need it
  const isPaymentPage = ['booking.html', 'menu.html', 'tracking.html'].some(p =>
    window.location.pathname.includes(p)
  );

  if (isPaymentPage) {
    loadRazorpayScript()
      .then(() => console.info('[Payment] Razorpay loaded'))
      .catch(err => console.warn('[Payment] Could not load Razorpay:', err));
  }

  // Pay booking fee button
  document.getElementById('payBookingBtn')?.addEventListener('click', () => {
    const pending = JSON.parse(sessionStorage.getItem('pending_booking') || 'null');
    if (pending) payBookingFee(pending);
  });
});

// Expose globally
window.initiatePayment  = initiatePayment;
window.payBookingFee    = payBookingFee;
window.loadRazorpayScript = loadRazorpayScript;