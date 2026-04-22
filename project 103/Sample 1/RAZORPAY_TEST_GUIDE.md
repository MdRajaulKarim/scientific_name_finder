# 🧪 Razorpay Payment Integration - Test Verification Guide

## ✅ Pre-Test Checklist

Before testing the payment flow:

- [ ] Browser has JavaScript enabled
- [ ] Internet connection is stable
- [ ] You have the demo admin phone number: `9999999999`
- [ ] You know the demo OTP: `123456`
- [ ] You're using Chrome, Firefox, Safari, or Edge (modern browser)

## 🎯 Step-by-Step Testing Guide

### Stage 1: Login & Cart Setup

#### Step 1: Open Homepage
```
✓ Open http://localhost:8000/index.html (or your URL)
✓ Verify you see the Savory Haven header
✓ Verify products are displayed in grid
✓ Verify cart button shows 🛒 icon
```

**Expected Result**: Homepage loads, no console errors

**Check Console**: Press F12 → Console tab (should be empty of errors)

---

#### Step 2: Login
```
✓ Click "Login" button (top right)
✓ Verify auth modal appears with phone input
```

**If modal doesn't appear**:
- Check console for errors
- Verify `openModal('authModal')` is being called
- Check CSS for `.modal.show` class styling

```
✓ Enter phone: 9999999999
✓ Click "Send OTP"
✓ Verify demo OTP alert appears (should show "123456")
✓ Enter OTP: 123456
✓ Click "Verify OTP"
✓ Verify login button changes to phone number
```

**Expected Result**: 
- User logged in
- Admin link appears in navbar
- Cart modal closes

---

#### Step 3: Add Items to Cart
```
✓ Click "Add to Cart" on any product (e.g., Paneer Tikka)
✓ Verify cart badge appears with "1"
✓ Repeat for 2-3 more items
✓ Verify badge shows increasing count (2, 3, 4...)
```

**If cart badge doesn't update**:
- Check `updateCartBadge()` function
- Verify cart items are in localStorage

---

#### Step 4: Open Cart Modal
```
✓ Click cart button (🛒 Cart with badge)
✓ Verify cart modal appears
✓ Verify all items are listed
✓ Verify quantities and prices are correct
✓ Verify total and tax are calculated
```

**Expected Calculations**:
```
Example: 2x Paneer Tikka (₹220 each)
Subtotal = 440
Tax (5%) = 22
Total = 462
```

**If cart doesn't show**:
- Check `displayCart()` is being called
- Verify items are in cart array
- Check for console errors

---

### Stage 2: Checkout & Payment

#### Step 5: Initiate Checkout
```
✓ Click "Proceed to Checkout" button in cart
✓ Verify no alert about empty cart
✓ Verify no alert about login requirement
```

**If alerts appear**:
- Check if you're logged in
- Verify cart is not empty
- Check `proceedToCheckout()` logic

---

#### Step 6: Razorpay Modal Opens
```
✓ Watch for Razorpay modal to appear
✓ Modal should show:
  - Amount (e.g., ₹462)
  - "Savory Haven" name
  - Payment methods (Card, NetBanking, UPI, etc.)
```

**If Razorpay modal doesn't appear**:
- Check console for "Razorpay undefined" error
- Verify internet connection (Razorpay script needs to load)
- Check if third-party scripts are blocked
- Wait 3-5 seconds for script to load

**Console Debug**:
```javascript
// Run in console:
console.log(typeof Razorpay); // Should show "function"
console.log(RAZORPAY_CONFIG); // Should show config object
```

---

#### Step 7: Select Payment Method
```
✓ Click on "Card" option (if not selected)
✓ Verify card input form appears
```

**Available Test Methods**:
- Card (4111 1111 1111 1111)
- UPI
- NetBanking
- Wallet

---

#### Step 8: Enter Test Card Details
```
✓ Card Number: 4111 1111 1111 1111
✓ Expiry: 12/25 (any future date)
✓ CVV: 123 (any 3 digits)
✓ Name: Test User (any name)
```

**For Failed Payment Test** (optional):
- Use card: 4222 2222 2222 2220

---

#### Step 9: Complete OTP
```
✓ Enter OTP: 123456 (or as displayed)
✓ Click verify/submit
```

---

#### Step 10: Payment Success
```
✓ Razorpay modal closes
✓ Success alert appears showing:
  - ✅ symbol
  - "Order placed successfully"
  - Order ID (6 digits)
  - Payment ID
  - Total amount
```

**If payment fails**:
- Check console for error messages
- Verify test card details were correct
- Try test card: 4111 1111 1111 1111

---

### Stage 3: Post-Payment Verification

#### Step 11: Cart Cleared
```
✓ After closing success alert
✓ Verify you're redirected to tracking.html (wait 2 seconds)
✓ Verify cart badge disappears
```

**If not redirected**:
- May need to manually click "My Orders" link
- Check console for errors
- Verify window.location.href is working

---

#### Step 12: Verify Order in Tracking
```
✓ Once on tracking page, look for "Active Orders"
✓ Verify order appears with:
  - Order ID (matches alert)
  - "PENDING" status
  - Items list
  - Total amount
  - Timeline with "Pending" status active
```

---

## 🧬 Console Debugging

### Enable Detailed Logging

Open browser console (F12) and check these:

#### 1. Check Payment Initiation
```javascript
// Look for this log when checkout starts:
// "Processing payment: {amount: X, amountInPaise: X, user: {phone}}"
```

#### 2. Check Payment Success
```javascript
// Look for this log after successful payment:
// "Payment successful: {razorpay_payment_id: "...", ...}"
// "Order created: {id: X, userId: "...", ...}"
```

#### 3. Check for Errors
```javascript
// Should NOT see errors like:
// "Razorpay is not defined" - Script didn't load
// "Cannot read property 'phone' of null" - User not logged in
// "Cart is empty" - No items to checkout
```

---

## ❌ Troubleshooting

### Problem: "Razorpay is not defined"

**Cause**: Razorpay script failed to load

**Solution**:
1. Check internet connection
2. Check if third-party scripts are blocked
3. Check console for network errors
4. Try refreshing page
5. Check browser allows external scripts

---

### Problem: Payment Modal Doesn't Open

**Cause**: Script loaded but Razorpay initialization failed

**Solution**:
1. Check console for JavaScript errors
2. Verify `processPayment()` is being called
3. Verify amount is greater than 0
4. Check RAZORPAY_CONFIG.KEY_ID is valid format

---

### Problem: Payment Succeeds But No Order Created

**Cause**: `handlePaymentSuccess()` not called correctly

**Solution**:
1. Check if payment.js is loaded (check <script> tags)
2. Verify handlePaymentSuccess function exists
3. Check localStorage has orders array
4. Try refreshing and checking My Orders page

---

### Problem: Cart Not Clearing After Payment

**Cause**: `cart = []` not executing

**Solution**:
1. Check `handlePaymentSuccess()` is reached
2. Verify `displayCart()` is called
3. Verify `updateCartBadge()` is called
4. Check for JavaScript errors

---

### Problem: Getting Redirected to Wrong Page

**Cause**: tracking.html path incorrect or page doesn't exist

**Solution**:
1. Verify tracking.html exists in same directory
2. Check file path is correct
3. Manually navigate to tracking.html
4. Check console for 404 errors

---

## 📊 Test Results Template

Use this template to document your test:

```
Date: ___________
Tester: ___________

✓ Stage 1: Login & Cart
  - Login successful: YES / NO
  - Items added to cart: YES / NO
  - Cart badge shows count: YES / NO
  - Cart modal displays items: YES / NO

✓ Stage 2: Checkout
  - Checkout button works: YES / NO
  - Razorpay modal opens: YES / NO
  - Payment modal has correct amount: YES / NO
  - Payment initiated: YES / NO

✓ Stage 3: Payment Result
  - Success alert appears: YES / NO
  - Order ID shows: YES / NO
  - Redirected to tracking: YES / NO
  - Order visible in My Orders: YES / NO
  - Cart cleared: YES / NO

Notes:
_________________________________________________________________
_________________________________________________________________

Issues Found:
_________________________________________________________________
_________________________________________________________________

Status: ✅ PASSED / ⚠️ PARTIAL / ❌ FAILED
```

---

## 🎓 Expected Behavior Summary

| Action | Expected Result | Success Indicator |
|--------|-----------------|-------------------|
| Click Login | Auth modal opens | Modal visible with phone input |
| Enter phone & OTP | User logged in | Button shows phone number, admin link appears |
| Add item to cart | Cart count increases | Badge shows number |
| Open cart | Modal shows items | Items list visible with totals |
| Click checkout | Razorpay opens | Modal with payment form appears |
| Complete payment | Order created | Success alert shows order ID |
| After success | Redirected to tracking | My Orders shows new order |

---

## 🚀 Production Testing

Once you deploy with live Razorpay key:

```
⚠️ WARNING: You will be processing REAL payments

✓ Use small test amount (₹1 or ₹10)
✓ Process with actual payment method
✓ Verify amount debited from account
✓ Verify order created in system
✓ Verify payment ID in tracking page
✓ Process refund if needed
✓ Verify refund appears in account
```

---

## 📞 Quick Reference

| Test Item | Expected | Check |
|-----------|----------|-------|
| Demo Key | rzp_test_1DP5Z8AB9Z3P8L | payment.js line ~6 |
| Test Phone | 9999999999 | Try login |
| Test OTP | 123456 | Alert shows this |
| Test Card | 4111 1111 1111 1111 | Razorpay accepts this |
| Admin Access | Automatic | After login with 9999999999 |

---

**Last Tested**: [Your date]

**Status**: ✅ Ready for Testing

**Next Step**: Follow the step-by-step guide above
