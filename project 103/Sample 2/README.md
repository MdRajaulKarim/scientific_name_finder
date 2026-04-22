# ZestyBite Restaurant Website

## Structure
- `/css/style.css`: Contains the central **Color Registry**.
- `/js/main.js`: Handles cart count, search filtering, and the slider.
- `/js/payment.js`: (Placeholder) Add your Razorpay API Key here.
- `/js/printing.js`: (Placeholder) Connects your thermal printer drivers to the web browser.

## Key Features
1. **Highlight Cart:** The cart number is bold and colored, with no circular background.
2. **Veg/Non-Veg:** Professional icons in top-right squares.
3. **Admin:** Manage locations and print receipts directly.
# ZestyBite Web Architecture

## 🚀 Getting Started
1. **Host the Files:** Place all HTML files in your root directory.
2. **Assets:** Put your food images in `/assets/images/products/`.
3. **Database:** Since this is a frontend template, use **Node.js (Express)** and **MongoDB** to store the user orders and admin menu changes.

## 🎨 Design System (60-30-10)
- **Primary (60%):** `--color-base` (Cream/Off-white)
- **Secondary (30%):** `--color-secondary` (Pure White)
- **Accent (10%):** `--color-accent` (Vibrant Orange-Red)

## 🛠️ Features for Admin
- **Restricting Delivery:** Add Zip Codes to the `restrictedZipCodes` array in `admin-logic.js`.
- **Receipts:** The `printing.js` file opens a formatted window designed for 58mm thermal paper.

## 🛒 Features for User
- **Cart:** Highlighted number in the Nav bar (No circle background).
- **Veg/Non-Veg:** Icons appear as a Circle (Veg) or Triangle (Non-Veg) in a square box.
- **Login:** Mobile + OTP layout provided in `login.html`.