/* ==========================================
   1. GLOBAL STATE & UI TRIGGERS
   ========================================== */
let cartItems = [];
let currentOrder = {};

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('cartItems');
    cartItems = saved ? JSON.parse(saved) : [];
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Opens/Closes the Premium Cart Sidebar
function toggleCart() {
    const cart = document.getElementById('sideCart');
    if (cart) {
        cart.classList.toggle('open');
        updateCartDisplay();
    }
}

// Updates the highlighted cart number
function updateCartUI() {
    const cartDisplay = document.getElementById('cartCount');
    if (cartDisplay) {
        cartDisplay.innerText = cartItems.length;
    }
}

// Updates the detailed cart display
function updateCartDisplay() {
    const cartList = document.getElementById('cartItemsList');
    if (!cartList) return;

    if (cartItems.length === 0) {
        cartList.innerHTML = '<p style="color: #999;">Your cart is empty.</p>';
        return;
    }

    let total = 0;
    let html = '<div style="max-height: 400px; overflow-y: auto;">';

    cartItems.forEach((item, idx) => {
        total += item.price;
        html += `
            <div style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <span><strong>${item.name}</strong><br><small>₹${item.price}</small></span>
                <button onclick="removeFromCart(${idx})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">✕</button>
            </div>
        `;
    });

    html += `</div><hr style="margin: 15px 0;">
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px;">
                Total: ₹${total}
            </div>`;

    cartList.innerHTML = html;
}

// Add item to cart
function addToCart(itemName, price) {
    if (!itemName || !price) {
        alert("Error adding item to cart");
        return;
    }

    cartItems.push({ name: itemName, price: price });
    saveCart();
    updateCartUI();
    alert(`✓ ${itemName} added to cart!`);
}

// Remove item from cart
function removeFromCart(index) {
    cartItems.splice(index, 1);
    saveCart();
    updateCartUI();
    updateCartDisplay();
}

// Clear cart
function clearCart() {
    if (confirm('Clear all items from cart?')) {
        cartItems = [];
        saveCart();
        updateCartUI();
        updateCartDisplay();
    }
}

/* ==========================================
   2. DELIVERY & MODAL LOGIC
   ========================================== */

// Opens the modal for Phone and Location
function openDeliveryModal(itemName, price) {
    currentOrder = { name: itemName, price: price };
    const modalName = document.getElementById('selectedItemName');
    const modal = document.getElementById('deliveryModal');

    if (modalName && modal) {
        modalName.innerText = `Adding: ${itemName} - ₹${price}`;
        modal.style.display = 'flex';
    }
}

// Confirms details and pushes to Node.js server
function confirmOrder() {
    const phone = document.getElementById('deliveryPhone').value;
    const address = document.getElementById('deliveryAddress').value;

    if (phone.length < 10 || address.length < 5) {
        alert("Please provide a valid 10-digit phone number and full delivery address.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must contain 10 digits only.");
        return;
    }

    const orderPayload = {
        item: currentOrder.name,
        price: currentOrder.price,
        customerPhone: phone,
        deliveryLocation: address,
        timestamp: new Date().toISOString()
    };

    // Add to cart
    addToCart(currentOrder.name, currentOrder.price);

    // Attempt server connection (optional)
    fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    })
    .then(res => res.json())
    .then(data => {
        alert("✓ Order Success! Order ID: " + data.orderId);
        document.getElementById('deliveryModal').style.display = 'none';
        document.getElementById('deliveryPhone').value = '';
        document.getElementById('deliveryAddress').value = '';
        toggleCart();
    })
    .catch(err => {
        console.warn("Server connection info:", err.message);
        alert("✓ Order added to cart! (Server not available - using local storage)");
        document.getElementById('deliveryModal').style.display = 'none';
        document.getElementById('deliveryPhone').value = '';
        document.getElementById('deliveryAddress').value = '';
    });
}

/* ==========================================
   3. SEARCH & FILTERING
   ========================================== */
function filterMenu() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');

    if (!searchInput || !typeFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    // Works with both .product-card and .dish-card classes
    const cards = document.querySelectorAll('.product-card, .dish-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name')?.toLowerCase() || "";
        const id = card.getAttribute('data-id')?.toLowerCase() || "";
        const type = card.getAttribute('data-type');

        const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);
        const matchesType = (selectedType === 'all' || type === selectedType);

        card.style.display = (matchesSearch && matchesType) ? 'block' : 'none';
    });
}

/* ==========================================
   4. PREMIUM HERO SLIDER
   ========================================== */
const offers = [
    { t: "TASTE THE EXTRAORDINARY", s: "Handcrafted meals delivered to your doorstep." },
    { t: "FLAT 20% OFF", s: "On your first order! Use: ZESTYFIRST" },
    { t: "WEEKEND SPECIAL", s: "Free Garlic Bread on orders above ₹499" }
];

let slideIdx = 0;
function runSlider() {
    const title = document.querySelector('.hero-bg h1');
    const sub = document.querySelector('.hero-bg p');
    if (title && sub) {
        title.innerText = offers[slideIdx].t;
        sub.innerText = offers[slideIdx].s;
        slideIdx = (slideIdx + 1) % offers.length;
    }
}

/* ==========================================
   5. INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Load cart
    loadCart();

    // Start slider if we are on the homepage
    if (document.querySelector('.hero-bg')) {
        runSlider(); // Show first offer immediately
        setInterval(runSlider, 5000);
    }
});