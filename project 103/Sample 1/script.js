/* ==================== SAMPLE MENU DATA ==================== */
const menuData = [
    { id: 1, name: "Paneer Tikka", price: 220, category: "appetizer", type: "veg", rating: 4.5, reviews: 120, emoji: "🧀", description: "Marinated cottage cheese with Indian spices", available: true },
    { id: 2, name: "Tandoori Chicken", price: 280, category: "appetizer", type: "non-veg", rating: 4.7, reviews: 200, emoji: "🍗", description: "Grilled chicken with tandoori spices", available: true },
    { id: 3, name: "Biryani", price: 320, category: "main", type: "veg", rating: 4.6, reviews: 180, emoji: "🍚", description: "Fragrant rice cooked with aromatic spices", available: true },
    { id: 4, name: "Butter Chicken", price: 380, category: "main", type: "non-veg", rating: 4.8, reviews: 250, emoji: "🍛", description: "Tender chicken in creamy tomato sauce", available: true },
    { id: 5, name: "Masala Dosa", price: 180, category: "main", type: "veg", rating: 4.4, reviews: 150, emoji: "🥘", description: "Crispy rice crepe with spiced potato filling", available: true },
    { id: 6, name: "Garlic Naan", price: 60, category: "main", type: "veg", rating: 4.5, reviews: 100, emoji: "🍞", description: "Soft bread with garlic and butter", available: true },
    { id: 7, name: "Gulab Jamun", price: 120, category: "dessert", type: "veg", rating: 4.7, reviews: 180, emoji: "🍮", description: "Sweet milk solids in sugar syrup", available: true },
    { id: 8, name: "Mango Lassi", price: 90, category: "beverage", type: "veg", rating: 4.6, reviews: 140, emoji: "🥤", description: "Refreshing yogurt-based mango drink", available: true },
];

let cart = [];
let currentUser = null;
let orders = [];
let bookings = [];

/* ==================== INITIALIZE PAGE ==================== */
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeAuth();
    loadMenuItems();
    setupEventListeners();
    displayCart();
    updateCartBadge();
});

/* ==================== MENU DISPLAY ==================== */
function loadMenuItems() {
    const productGrid = document.getElementById('productGrid');
    const menuGrid = document.getElementById('menuGrid');

    if (productGrid) renderProducts(productGrid, menuData);
    if (menuGrid) renderProducts(menuGrid, menuData);
}

function renderProducts(container, products) {
    container.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.type}" data-filter="${product.type}">
            <div class="product-image">
                ${product.emoji}
                <div class="veg-indicator">
                    ${product.type === 'veg' ? '🟢' : '🔴'}
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">₹${product.price}</div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-review">
                    <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/* ==================== SEARCH & FILTER ==================== */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        const matches = name.includes(searchTerm);
        card.style.display = matches ? 'block' : 'none';
    });
}

function handleFilter(e) {
    const filterValue = e.target.dataset.filter;
    const cards = document.querySelectorAll('.product-card');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    cards.forEach(card => {
        if (filterValue === 'all' || card.dataset.filter === filterValue) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ==================== SHOPPING CART ==================== */
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartBadge();
    saveData();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div>
                <strong>${item.name}</strong><br>
                Qty: ${item.quantity} × ₹${item.price}
            </div>
            <div class="item-actions">
                <button class="btn-qty-control" onclick="updateQty(${item.id}, -1)">−</button>
                <button class="btn-qty-control" onclick="updateQty(${item.id}, 1)">+</button>
                <button class="btn-delete" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            displayCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = '₹' + subtotal;
        document.getElementById('tax').textContent = '₹' + tax;
        document.getElementById('total').textContent = '₹' + total;
    }
}

/**
 * Update cart badge count in navbar
 */
function updateCartBadge() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');

    if (badge) {
        if (cartCount > 0) {
            badge.style.display = 'block';
            badge.textContent = cartCount;
        } else {
            badge.style.display = 'none';
        }
    }
}

/* ==================== MODAL MANAGEMENT ==================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function closeCart() {
    closeModal('cartModal');
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
};

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').classList.remove('show');
    });
});

/* ==================== BANNER SLIDER ==================== */
let slideIndex = 1;

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(slide => slide.classList.remove('fade'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('fade');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

// Auto-advance slides every 5 seconds
setInterval(() => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        changeSlide(1);
    }
}, 5000);

// Initialize slider on page load
document.addEventListener('DOMContentLoaded', function() {
    showSlide(slideIndex);
});

/* ==================== CHECKOUT ==================== */
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (!currentUser) {
        alert('Please login first to proceed with checkout');
        openModal('authModal');
        return;
    }

    // For now, show a simple checkout confirmation
    // In production, this would redirect to payment page
    const total = document.getElementById('total').textContent;
    alert(`Proceeding to checkout with total: ${total}`);

    // Initialize Razorpay payment (see payment.js)
    initiateRazorpayPayment(total.replace('₹', ''));
}

/* ==================== TABLE BOOKING ==================== */
function handleBooking(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('Please login first');
        openModal('authModal');
        return;
    }

    const booking = {
        id: Date.now(),
        userId: currentUser.phone,
        name: document.getElementById('userName').value,
        phone: document.getElementById('userPhone').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        guests: document.getElementById('guests').value,
        occasion: document.getElementById('occasion').value,
        specialRequest: document.getElementById('specialRequest').value,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert(`✅ Table booked successfully! Booking ID: ${booking.id}`);
    document.getElementById('bookingForm').reset();
    loadUserBookings();
}

function loadUserBookings() {
    if (!currentUser) return;

    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;

    const userBookings = bookings.filter(b => b.userId === currentUser.phone);
    bookingsList.innerHTML = userBookings.map(booking => `
        <div class="booking-item">
            <div>
                <strong>Booking ID: ${booking.id}</strong><br>
                Date: ${booking.date} at ${booking.time}<br>
                Guests: ${booking.guests}<br>
                Status: <span class="status-delivered">${booking.status}</span>
            </div>
        </div>
    `).join('');
}

/* ==================== ORDER TRACKING ==================== */
function displayOrderTracking() {
    if (!currentUser) {
        document.getElementById('activeOrders').innerHTML = '<p>Please login to view orders</p>';
        return;
    }

    const userOrders = orders.filter(o => o.userId === currentUser.phone);
    const activeOrders = userOrders.filter(o => o.status !== 'delivered');
    const pastOrders = userOrders.filter(o => o.status === 'delivered');

    if (document.getElementById('activeOrders')) {
        document.getElementById('activeOrders').innerHTML = activeOrders.length === 0
            ? '<p>No active orders</p>'
            : activeOrders.map(order => renderOrderCard(order)).join('');
    }

    if (document.getElementById('pastOrders')) {
        document.getElementById('pastOrders').innerHTML = pastOrders.map(order => renderOrderCard(order)).join('');
    }
}

function renderOrderCard(order) {
    const statusClass = `status-${order.status}`;
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${statusClass}">${order.status.toUpperCase()}</div>
            </div>
            <p>📅 ${order.date} | 🕐 ${order.time}</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-timeline">
                ${renderTimeline(order.status)}
            </div>
            <p><strong>Total: ₹${order.total}</strong></p>
        </div>
    `;
}

function renderTimeline(status) {
    const statuses = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = statuses.indexOf(status);

    return statuses.map((s, i) => `
        <div class="timeline-item ${i <= currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}">
            <div>${s.charAt(0).toUpperCase() + s.slice(1)}</div>
        </div>
    `).join('');
}

/* ==================== LOCAL STORAGE ==================== */
function saveData() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function loadData() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    bookings = JSON.parse(localStorage.getItem('bookings')) || [];
}

window.addEventListener('beforeunload', saveData);
loadData();
