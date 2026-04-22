// ==========================================
// 1. CART & UI STATE
// ==========================================
let cartItems = 0;
let currentOrder = {};

// Updates the highlighted cart number (No circle/roundness)
function updateCartCount() {
    cartItems++;
    const cartDisplay = document.getElementById('cartCount');
    if(cartDisplay) {
        cartDisplay.innerText = cartItems;
    }
}

// ==========================================
// 2. DELIVERY & ORDER LOGIC
// ==========================================

// Opens the modal for Phone and Location
function openDeliveryModal(itemName, price) {
    currentOrder = { name: itemName, price: price };
    const modalName = document.getElementById('selectedItemName');
    const modal = document.getElementById('deliveryModal');
    
    if(modalName && modal) {
        modalName.innerText = `Adding: ${itemName} - ₹${price}`;
        modal.style.display = 'flex';
    }
}

// Sends delivery data to the Node.js server
function confirmOrder() {
    const phone = document.getElementById('deliveryPhone').value;
    const address = document.getElementById('deliveryAddress').value;

    // Validation for Phone and Location
    if (phone.length < 10 || address.length < 5) {
        alert("Please provide a valid 10-digit phone number and full delivery address.");
        return;
    }

    const orderPayload = {
        item: currentOrder.name,
        price: currentOrder.price,
        customerPhone: phone,
        deliveryLocation: address,
        timestamp: new Date()
    };

    // Communication with server.js
    fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    })
    .then(res => res.json())
    .then(data => {
        alert("Order Success! Order ID: " + data.orderId);
        document.getElementById('deliveryModal').style.display = 'none';
        updateCartCount(); 
    })
    .catch(err => {
        console.error("Server Error:", err);
        alert("Could not connect to server. Ensure server.js is running.");
    });
}

// ==========================================
// 3. SEARCH & FILTER LOGIC
// ==========================================
function filterMenu() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    
    if(!searchInput || !typeFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const id = card.getAttribute('data-id').toLowerCase();
        const type = card.getAttribute('data-type');

        const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);
        const matchesType = (selectedType === 'all' || type === selectedType);

        if (matchesSearch && matchesType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
// 4. AUTOMATIC SLIDER LOGIC
// ==========================================
const offers = [
    { t: "FLAT 20% OFF", s: "On your first order! Use: ZESTYFIRST" },
    { t: "WEEKEND SPECIAL", s: "Free Garlic Bread on orders above ₹499" },
    { t: "ZESTY REWARDS", s: "Earn points on every table booking" }
];

let slideIdx = 0;
function runSlider() {
    const title = document.getElementById('slideTitle');
    const sub = document.getElementById('slideSub');
    if(title && sub) {
        title.innerText = offers[slideIdx].t;
        sub.innerText = offers[slideIdx].s;
        slideIdx = (slideIdx + 1) % offers.length;
    }
}

// Initialize Slider and Events
document.addEventListener('DOMContentLoaded', () => {
    setInterval(runSlider, 4000);
    runSlider();
});