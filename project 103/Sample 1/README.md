# 🍽️ Savory Haven - Professional Restaurant Website

A modern, multi-page restaurant website with separate User and Admin panels. Built with vanilla HTML, CSS, and JavaScript following the "One-Function, One-File" architecture principle.

## 📁 Project Structure

```
Savory Haven/
├── index.html              # Homepage with banner slider and products
├── menu.html               # Complete menu with filtering
├── booking.html            # Table booking system
├── tracking.html           # Order tracking page
├── admin.html              # Admin dashboard
├── style.css               # Global styles with color registry
├── script.js               # Core application logic
├── auth.js                 # OTP authentication system
├── payment.js              # Razorpay payment integration
├── printing.js             # Thermal printer integration
├── admin.js                # Admin panel functionality
└── README.md               # This file
```

## 🎨 Design System

### Color Registry (60-30-10 Rule)

The application uses a professional food-industry color palette:

- **60% - Dominant (Base/Background)**: `#F5E6D3` - Warm Cream
- **30% - Secondary (Headers/Cards)**: `#D84315` - Warm Red-Orange
- **10% - Accent (CTA/Icons)**: `#4CAF50` - Fresh Green

All colors are defined as CSS variables in `style.css` for easy global changes:

```css
:root {
    --color-base: #FFF8F0;
    --color-secondary: #D84315;
    --color-accent: #4CAF50;
    /* ... more variables */
}
```

### Veg/Non-Veg Indicators

- **Vegetarian**: 🟢 Green Circle (`--color-veg: #4CAF50`)
- **Non-Vegetarian**: 🔴 Red Triangle (`--color-non-veg: #E53935`)

## 🚀 Features

### 👥 User Panel

#### Homepage (`index.html`)
- Automatic sliding image banner with current offers
- Product grid with search and filtering
- Search by item name, ID, or category
- Filter by Veg/Non-Veg categories
- Product cards with:
  - Item image/emoji
  - Veg/Non-Veg indicator
  - Price and rating
  - Review count
  - Add to cart functionality

#### Menu Page (`menu.html`)
- Complete categorized menu
- Multiple filtering options
- Detailed product information
- Easy add-to-cart functionality

#### OTP Login
- Phone-based authentication (no passwords)
- SMS OTP verification
- Automatic user detection
- Persistent session storage

#### Shopping Cart
- Add/remove items
- Adjust quantities
- Real-time total calculation
- Tax calculation (5% GST)

#### Checkout & Payment (`payment.js`)
- Razorpay integration
- Secure online payment
- Order confirmation
- Receipt generation

#### Order Tracking (`tracking.html`)
- Real-time order status
- Timeline visualization
- Order history
- Delivery details

#### Table Booking (`booking.html`)
- Date/time selection
- Guest count selection
- Special requests
- Booking fee (₹99, refundable)
- Booking management

### 🛠️ Admin Panel (`admin.html`)

#### Dashboard
- Daily sales metrics
- Active orders count
- Total bookings
- Menu items count

#### Menu Management
- Add new items
- Edit prices and availability
- Delete items
- Category and type management

#### Order Management
- Real-time order tracking
- Status updates (Pending → Preparing → Ready → Delivered)
- Auto-print receipt to thermal printer
- Order filtering

#### Booking Management
- View all table reservations
- Accept/Cancel bookings
- Track upcoming reservations

#### Offer Management
- Create time-limited offers
- Set discount percentages
- Display on homepage banner
- Manage active offers

#### Location Management
- Add delivery service areas
- Set delivery charges per area
- Restrict delivery locations
- Manage restricted areas

#### Analytics Dashboard
- Daily sales tracking
- Order statistics
- Revenue reports
- Performance metrics

#### Thermal Printer Integration (`printing.js`)
- ESC/POS format support
- WebUSB API support
- Web Serial API support
- Browser print fallback
- Auto-print on order ready

## 🔐 Authentication System (`auth.js`)

### OTP Flow

```
User enters phone number
        ↓
OTP sent to phone
        ↓
User enters OTP
        ↓
Authentication successful
        ↓
User logged in
```

### Demo Admin Credentials

To access the admin panel:
- **Phone**: `9999999999`
- **OTP**: `123456` (demo mode)

### Session Management

- Sessions stored in `localStorage`
- Auto-login on page reload
- Logout clears session
- User-specific features enabled after login

## 💳 Payment Integration (`payment.js`)

### Razorpay Setup

1. **Get Razorpay Credentials**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Get Key ID and Secret from dashboard

2. **Update Key in Code**
   ```javascript
   // In payment.js, update the Razorpay key
   key: 'YOUR_RAZORPAY_KEY_ID'
   ```

3. **Server-Side Verification** (Production)
   ```javascript
   // Call backend API to verify signature
   const verified = await verifyPaymentSignature(
       paymentId, 
       orderId, 
       signature
   );
   ```

### Payment Flow

```
User clicks Checkout
        ↓
Cart data prepared
        ↓
Razorpay modal opens
        ↓
User completes payment
        ↓
Payment success callback
        ↓
Order created
        ↓
Receipt printed
        ↓
User redirected to tracking
```

## 🖨️ Thermal Printer Integration (`printing.js`)

### Supported Printers

- USB Thermal Printers
- Serial Thermal Printers
- Bluetooth Thermal Printers
- Network Thermal Printers

### Setup Instructions

#### USB Printer (WebUSB)

```javascript
// Request printer connection
await navigator.usb.requestDevice({
    filters: [
        { vendorId: 0x065a } // Update with your printer's vendor ID
    ]
});
```

#### Serial Printer (Web Serial API)

```javascript
// Request serial port
const port = await navigator.serial.requestPort();
await port.open({ baudRate: 9600 });
```

#### Network Printer

```javascript
// Send to local print server
fetch('http://localhost:9100', {
    method: 'POST',
    body: receiptData
});
```

### Receipt Format

Receipts are printed in ESC/POS format with:
- Restaurant header
- Receipt number and timestamp
- Item list with quantities
- Tax calculation
- Total amount
- Payment confirmation
- Thank you message

### Auto-Print Feature

Receipts automatically print when:
- Order status changes to "Ready"
- Admin clicks "Print Receipt" button
- Manual trigger from admin dashboard

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Desktop**: 1200px+ (full 4-column grid)
- **Tablet**: 768px - 1199px (2-3 columns)
- **Mobile**: < 768px (stacked layout)

## 🔧 Installation & Setup

### 1. Clone or Download

```bash
git clone <repository-url>
cd Scientific_Name_Finder
```

### 2. No Build Process Required

This is a vanilla JavaScript project with zero dependencies. Simply open `index.html` in your browser.

```bash
# Using Python's built-in server (recommended)
python -m http.server 8000

# Or using Node.js
npx http-server

# Then visit: http://localhost:8000
```

### 3. Backend Setup (Production)

For production deployment, you'll need:

#### Node.js/Express Backend

```javascript
// Example: backend/server.js
const express = require('express');
const app = express();

// OTP API
app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    // Send actual SMS OTP
    res.json({ success: true });
});

// Payment verification
app.post('/api/payment/verify', (req, res) => {
    const { payment_id, signature } = req.body;
    // Verify with Razorpay
    res.json({ verified: true });
});

// Orders API
app.get('/api/orders/:userId', (req, res) => {
    // Fetch user orders
});

app.listen(3000, () => console.log('Server running'));
```

#### Database Schema (MongoDB)

```javascript
// Users Collection
{
    _id: ObjectId,
    phone: String,
    otp: String,
    otpExpiry: Date,
    createdAt: Date,
    isAdmin: Boolean
}

// Orders Collection
{
    _id: ObjectId,
    userId: String,
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: Number,
    status: String, // pending, preparing, ready, delivered
    paymentId: String,
    createdAt: Date
}

// Menu Items Collection
{
    _id: ObjectId,
    name: String,
    price: Number,
    category: String,
    type: String, // veg or non-veg
    available: Boolean
}
```

### 4. Environment Variables

Create a `.env` file for production:

```env
# Backend
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/savory_haven

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# SMS Provider
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🧪 Testing

### Demo Mode

1. **Access Homepage**: Open `index.html`
2. **Login**: Click "Login" button
3. **Enter Phone**: `9999999999`
4. **OTP**: `123456`
5. **Admin Access**: Automatically granted

### Test Orders

The system comes with sample menu items:
- Paneer Tikka (Veg)
- Tandoori Chicken (Non-Veg)
- Biryani (Veg)
- And more...

### Local Storage

Data is stored in browser `localStorage`:
- User sessions
- Cart items
- Orders
- Bookings
- Menu data

## 📊 Code Statistics

- **Total HTML**: 4 user pages + 1 admin page
- **CSS**: 500+ lines with responsive design
- **JavaScript**: Modular architecture across 6 files
- **Functions**: 80+ utility functions
- **Zero Dependencies**: Pure vanilla JavaScript

## 🎯 Architecture Principles

1. **One-Function, One-File Rule**
   - Each major feature isolated in its own file
   - Clear separation of concerns

2. **Modular JavaScript**
   - Functions organized by feature
   - Easy to test and maintain
   - Reusable components

3. **CSS Variable System**
   - Global color registry
   - Easy theme changes
   - Consistent styling

4. **Responsive First**
   - Mobile-first design
   - Flexible grid layouts
   - Touch-friendly interfaces

## 🚀 Deployment

### Hosting Options

1. **Static Host**: Netlify, Vercel, GitHub Pages (frontend only)
2. **VPS**: AWS EC2, DigitalOcean (with Node.js backend)
3. **Serverless**: AWS Lambda, Google Cloud Functions (backend)

### Deploy Steps

```bash
# 1. Build (if using a bundler)
npm run build

# 2. Deploy frontend files
# (index.html, menu.html, booking.html, etc.)

# 3. Deploy backend
# (API endpoints for auth, payment, orders)

# 4. Configure DNS and SSL
```

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the code comments
2. Review JavaScript console for errors
3. Verify backend API endpoints
4. Test with demo credentials

## 🔐 Security Notes

⚠️ **Important for Production**:

1. Never store sensitive data in localStorage
2. Validate all inputs on backend
3. Use HTTPS for all connections
4. Implement proper CORS headers
5. Sanitize user inputs to prevent XSS
6. Validate payments on backend only
7. Use environment variables for API keys
8. Implement rate limiting on authentication

## 📖 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/var)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Built with ❤️ for Savory Haven**

*Professional Restaurant Management System*
