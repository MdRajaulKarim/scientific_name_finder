# 💳 Razorpay Integration Guide

This document provides step-by-step instructions to set up Razorpay payment integration for Savory Haven.

## 📋 Overview

Razorpay is integrated into the application for:
- **Order Payments**: Customers can pay for food orders
- **Table Booking Fees**: Refundable booking deposit (₹99)
- **Multiple Payment Methods**: Card, NetBanking, UPI, Wallet, etc.

## 🚀 Step 1: Create Razorpay Account

1. **Visit Razorpay**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Click "Sign Up" button

2. **Fill Registration Form**
   ```
   - Email: Your business email
   - Mobile: Your phone number
   - Password: Strong password
   ```

3. **Verify Email**
   - Check your email for verification link
   - Click the link to verify

4. **Complete KYC** (Know Your Customer)
   - Business Details
   - PAN Card
   - Bank Account
   - Address Proof

## 🔑 Step 2: Get API Keys

### Test Keys (for development/testing)

1. **Login to Dashboard**
   - Visit [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
   - Login with your credentials

2. **Go to Settings**
   - Click on your profile/settings icon
   - Select "API Keys" or "Developers"

3. **Copy Test Keys**
   - You'll see "Test Mode" is enabled by default
   - **Key ID**: `rzp_test_XXXXXXXXXXXXXX`
   - **Key Secret**: `XXXXXXXXXXXXXX`
   
   ⚠️ **Important**: Key Secret is sensitive! Never share it or commit to GitHub.

### Live Keys (for production)

1. **Activate Live Mode**
   - In settings, switch from "Test Mode" to "Live Mode"
   - Complete additional verification if required

2. **Copy Live Keys**
   - **Key ID**: `rzp_live_XXXXXXXXXXXXXX`
   - **Key Secret**: (Keep secure)

## 🔧 Step 3: Update Configuration

### For Testing (Development)

The app currently uses a demo test key. To use your test keys:

1. **Open `payment.js`**
   - Find line ~6 with `KEY_ID`
   - Replace demo key with your test Key ID:
   
   ```javascript
   const RAZORPAY_CONFIG = {
       KEY_ID: 'rzp_test_YOUR_TEST_KEY_ID', // Replace with your test key
       MERCHANT_NAME: 'Savory Haven',
       MERCHANT_IMAGE: 'https://via.placeholder.com/100/D84315/FFFFFF?text=SH',
   };
   ```

2. **Save the file**

### For Production

1. **Replace with Live Key**
   ```javascript
   const RAZORPAY_CONFIG = {
       KEY_ID: 'rzp_live_YOUR_LIVE_KEY_ID', // Your live key
       MERCHANT_NAME: 'Savory Haven',
       MERCHANT_IMAGE: 'https://your-domain.com/logo.png',
   };
   ```

2. **Update Logo URL**
   - Replace placeholder image with your actual logo URL
   - Image should be at least 100x100px

3. **Deploy to Production**
   - Update your backend to verify payments
   - Use environment variables for sensitive keys

## 💰 Step 4: Test Payment Flow

### Test Orders

Use these test card details in **Test Mode** only:

#### Successful Payment
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3-digit number (e.g., 123)
```

#### Failed Payment
```
Card Number: 4222 2222 2222 2220
Expiry: Any future date
CVV: Any 3-digit number
```

### Testing Steps

1. **Open Homepage**
   - Go to `index.html` in your browser
   - Local: `http://localhost:8000`

2. **Login**
   - Click "Login" button
   - Enter phone: `9999999999`
   - Enter OTP: `123456` (demo mode)

3. **Add Items to Cart**
   - Click any "Add to Cart" button
   - Add multiple items

4. **Checkout**
   - Open cart
   - Click "Proceed to Checkout"
   - Razorpay modal will open

5. **Complete Payment**
   - Use test card details above
   - Fill OTP with: `123456`
   - Payment should process

6. **Verify Order**
   - After success, you'll be redirected to `tracking.html`
   - Order will appear in "Active Orders"

## 📊 Dashboard Features

### Monitor Transactions

1. **View Payments**
   - Dashboard → Payments
   - See all successful and failed payments
   - Download reports

2. **Manage Customers**
   - Dashboard → Customers
   - Track customer information
   - View payment history

3. **Webhooks** (Advanced)
   - Set up webhooks to get real-time updates
   - Dashboard → Webhooks
   - Configure payment success/failure endpoints

### Settlement & Payouts

- **View Settlements**: Dashboard → Settlements
- **Payment Schedule**: Usually daily at 2 AM IST
- **Settlement Fees**: Check your account for applicable fees

## 🔒 Security Best Practices

### ⚠️ NEVER Do This:

❌ Store Key Secret in client-side code
❌ Commit API keys to GitHub
❌ Share keys via email or messages
❌ Use the same key for test and production
❌ Skip payment verification on backend

### ✅ DO This:

✅ Use environment variables for API keys
✅ Store keys only in backend `.env` file
✅ Verify payments server-side using Key Secret
✅ Use different test and live keys
✅ Enable 2FA on Razorpay dashboard
✅ Rotate keys periodically

## 🛠️ Backend Payment Verification (Production)

### Node.js/Express Example

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

app.post('/api/payment/verify', express.json(), (req, res) => {
    const { payment_id, order_id, signature } = req.body;

    // Create signature
    const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');

    // Verify signature
    if (generated_signature === signature) {
        console.log('Payment verified successfully');
        res.json({ verified: true });
    } else {
        console.log('Payment verification failed');
        res.json({ verified: false });
    }
});

app.listen(3000);
```

## 🧪 Testing Webhooks Locally

### Using ngrok for Local Testing

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start your server**
   ```bash
   node server.js
   ```

3. **Expose to internet**
   ```bash
   ngrok http 3000
   ```
   You'll get a URL like: `https://abc123.ngrok.io`

4. **Configure webhook**
   - Dashboard → Webhooks
   - URL: `https://abc123.ngrok.io/webhooks/payment`
   - Select events: `payment.authorized`, `payment.failed`

5. **View logs**
   - ngrok shows all requests
   - Check both request and response

## 📞 Razorpay Support

### Contact & Resources

- **Documentation**: https://razorpay.com/docs/
- **Support Email**: support@razorpay.com
- **Community Chat**: https://razorpay.com/community/
- **Phone Support**: +91-8999885044

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Check Key ID format starts with `rzp_test_` or `rzp_live_` |
| "Payment modal not opening" | Check Razorpay script loads, console for errors |
| "Merchant name not showing" | Update `MERCHANT_NAME` in RAZORPAY_CONFIG |
| "Amount not correct" | Ensure amount is in paise (multiply by 100) |
| "Payment success but order not created" | Check if `handlePaymentSuccess` is called |

## 🚀 Deployment Checklist

Before going live:

- [ ] Switch to Live API Key
- [ ] Update merchant logo URL
- [ ] Implement backend payment verification
- [ ] Set up webhooks for payment status
- [ ] Test full payment flow
- [ ] Enable HTTPS (required for production)
- [ ] Set up proper error handling
- [ ] Configure email notifications
- [ ] Document payment procedures
- [ ] Train support team

## 📝 Environment Variables (.env)

Create a `.env` file in your backend:

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY

# Payment Settings
PAYMENT_CURRENCY=INR
BOOKING_FEE=99
GST_RATE=0.05

# Backend
NODE_ENV=production
PORT=3000
```

## 💡 Tips & Tricks

### Recurring Payments (Subscriptions)

```javascript
// For subscription plans
const options = {
    key: RAZORPAY_CONFIG.KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    recurring: true,
    description: 'Monthly Subscription',
    customer_notify: 1,
    // ... other options
};
```

### Payment Links (No Integration Code)

Generate payment links directly:
1. Dashboard → Payment Links
2. Share link with customers
3. Automatic order creation on payment

### Invoices & Receipts

- Dashboard → Invoices
- Create and send invoices
- Automatic receipt generation
- Email to customers automatically

## 📈 Growth Tips

1. **Optimize Checkout**
   - Keep payment form simple
   - Pre-fill known information
   - Minimize required fields

2. **Payment Methods**
   - Enable all payment methods
   - Show popular methods first
   - Display payment logos

3. **Customer Support**
   - Save transaction IDs
   - Quick refund process
   - Issue resolution SLA

4. **Analytics**
   - Track conversion rates
   - Monitor failed payments
   - Analyze payment method preferences

---

**For more information, visit:** https://razorpay.com/docs/

**Last Updated:** 2026-04-21
