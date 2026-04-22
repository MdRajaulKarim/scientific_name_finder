# 🔧 Razorpay Key Update Guide

## Quick Reference: How to Update Your Key

### Current Status (Demo Mode)
```javascript
// File: payment.js
// Line: ~6

const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L', // ← Demo test key
    MERCHANT_NAME: 'Savory Haven',
    MERCHANT_IMAGE: 'https://via.placeholder.com/100/D84315/FFFFFF?text=SH',
};
```

---

## 📝 Step-by-Step Update Process

### Step 1️⃣: Get Your Razorpay Key

**For Testing (Test Mode)**:
1. Sign up at [razorpay.com](https://razorpay.com)
2. Login to dashboard
3. Go to Settings → API Keys
4. You'll see a Key ID starting with `rzp_test_`
5. Copy the entire Key ID (e.g., `rzp_test_AbCdEfGhIjKlMnOp`)

**For Production (Live Mode)**:
1. Complete KYC verification on Razorpay
2. Go to Settings → API Keys
3. Switch to "Live Mode" (toggle at top)
4. Copy your Live Key ID starting with `rzp_live_`
5. Example: `rzp_live_XyZ123AbCdEfGhIj`

---

### Step 2️⃣: Open payment.js

**Location**: `payment.js` at the top of the file (around line 6)

```javascript
// Look for this section:
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L',
    // ↑ Replace this entire string
};
```

---

### Step 3️⃣: Replace the Key

#### Option A: Just Replace the Key ID
```javascript
// BEFORE:
KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L',

// AFTER (replace with YOUR key):
KEY_ID: 'rzp_test_AbCdEfGhIjKlMnOp',
```

#### Option B: Update All Config (Recommended)
```javascript
// BEFORE:
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L',
    MERCHANT_NAME: 'Savory Haven',
    MERCHANT_IMAGE: 'https://via.placeholder.com/100/D84315/FFFFFF?text=SH',
};

// AFTER:
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_AbCdEfGhIjKlMnOp', // Your key here
    MERCHANT_NAME: 'Your Restaurant Name',
    MERCHANT_IMAGE: 'https://yourwebsite.com/logo.png',
};
```

---

### Step 4️⃣: Save File

- In your editor: `Ctrl+S` (Windows) or `Cmd+S` (Mac)
- Git: 
  ```bash
  git add payment.js
  git commit -m "Update Razorpay key"
  git push
  ```

---

### Step 5️⃣: Test

1. Refresh your app
2. Add items to cart
3. Click "Proceed to Checkout"
4. Razorpay modal should open with YOUR merchant name
5. Complete test payment
6. ✅ Done!

---

## 🔑 Key Formats Reference

### Valid Key Formats:

| Mode | Format | Example |
|------|--------|---------|
| **Test** | `rzp_test_XXXXX...` | `rzp_test_1DP5Z8AB9Z3P8L` |
| **Live** | `rzp_live_XXXXX...` | `rzp_live_AbCdEfGhIjKlMnOp` |

### Invalid Formats ❌:
- `1DP5Z8AB9Z3P8L` (missing prefix)
- `rzp_1DP5Z8AB9Z3P8L` (wrong prefix)
- `rzp_test_XXXX` (too short)
- `rzp_live_` (incomplete)

---

## 🧪 Testing After Update

### Quick Test:
```javascript
// Open browser Console (F12)
// Type this and press Enter:

console.log(RAZORPAY_CONFIG.KEY_ID);
// Should show: your key (e.g., rzp_test_AbCdEfGhIjKlMnOp)
```

### Full Test Flow:
1. Add item to cart
2. Open cart
3. Click "Proceed to Checkout"
4. Check Razorpay modal shows:
   - Correct merchant name
   - Correct amount
   - Test/Live mode indicator

---

## ⚠️ Common Mistakes

### ❌ Don't Do This:

```javascript
// WRONG: Only the numbers
KEY_ID: '1DP5Z8AB9Z3P8L',

// WRONG: Copied with quotes
KEY_ID: "'rzp_test_1DP5Z8AB9Z3P8L'",

// WRONG: Used Key Secret instead of Key ID
KEY_ID: 'skGR8hTT1ksdfh782...',

// WRONG: Test key for production
KEY_ID: 'rzp_test_XYZ', // Live site needs rzp_live_XYZ
```

### ✅ Do This:

```javascript
// CORRECT: Include the full prefix
KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L',

// CORRECT: No extra quotes
KEY_ID: 'rzp_live_AbCdEfGhIjKlMnOp',

// CORRECT: Use Key ID, not Key Secret
// (Key Secret stays on backend only)

// CORRECT: Use right mode for environment
// Test site: rzp_test_XXX
// Live site: rzp_live_XXX
```

---

## 🔒 Security Note

### ⚠️ IMPORTANT:

- **Key ID** (public): Safe to use in frontend code
- **Key Secret** (private): NEVER put in frontend code
- **Never commit** Key Secret to GitHub
- **Use environment variables** for production secrets

---

## 📍 Where to Find Your Keys

### In Razorpay Dashboard:

1. Login to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Click profile icon (top right)
3. Select "Settings"
4. Select "API Keys"
5. Choose "Test Mode" or "Live Mode"
6. You'll see:
   - **Key ID**: Starts with `rzp_test_` or `rzp_live_`
   - **Key Secret**: Long secret (don't copy to frontend!)

---

## 🚀 Switching Between Test and Production

### Test Mode (Development):
```javascript
KEY_ID: 'rzp_test_1DP5Z8AB9Z3P8L', // Demo key for testing
```

### Live Mode (Production):
```javascript
KEY_ID: 'rzp_live_YOUR_ACTUAL_KEY_ID', // Your real key
```

---

## ✅ Verification Checklist

After updating your key:

- [ ] Key starts with `rzp_test_` or `rzp_live_`
- [ ] No extra quotes around the key
- [ ] File saved (Ctrl+S)
- [ ] Page refreshed (Ctrl+R or F5)
- [ ] Razorpay modal opens when checkout clicked
- [ ] Correct merchant name appears in modal
- [ ] Correct amount shown
- [ ] Payment can be completed

---

## 🆘 Troubleshooting

### Problem: "Invalid API Key" Error

**Solution**:
1. Copy the full key including `rzp_test_` or `rzp_live_`
2. Check for extra spaces or characters
3. Verify it matches exactly in Razorpay dashboard

---

### Problem: Modal Shows Old Merchant Name

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check `MERCHANT_NAME` is updated in payment.js

---

### Problem: "Razorpay script failed to load"

**Solution**:
1. Check internet connection
2. Check if third-party scripts are blocked (browser settings)
3. Check browser console for errors
4. Try different browser

---

## 📞 Need Help?

### Quick Checks:
1. Is the key copied exactly from Razorpay dashboard?
2. Does it start with `rzp_test_` or `rzp_live_`?
3. Is the file saved?
4. Did you refresh the page?

### If Still Issues:
1. Check Razorpay support: https://razorpay.com/support
2. Check browser console (F12) for errors
3. Verify test credentials are correct

---

## 📋 Copy-Paste Template

### For Test Key:
```javascript
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_YOUR_KEY_HERE',
    MERCHANT_NAME: 'Savory Haven',
    MERCHANT_IMAGE: 'https://via.placeholder.com/100/D84315/FFFFFF?text=SH',
};
```

### For Live Key:
```javascript
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_live_YOUR_LIVE_KEY_HERE',
    MERCHANT_NAME: 'Your Restaurant Name',
    MERCHANT_IMAGE: 'https://yourdomain.com/logo.png',
};
```

---

## 🎯 One-Minute Update

1. Get key from Razorpay dashboard
2. Open payment.js
3. Find line with `KEY_ID: 'rzp_test_...`
4. Replace with your key
5. Save file
6. Done! ✅

---

**Quick Tip**: If you want both test and production versions, you can use environment variables or multiple keys - just update this one line to switch between them.
