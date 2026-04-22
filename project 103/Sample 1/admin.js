/* ==================== ADMIN PANEL LOGIC ==================== */

/**
 * Initialize admin dashboard
 */
function initializeAdminPanel() {
    if (!isAdmin()) {
        alert('Access denied. Admin only.');
        window.location.href = 'index.html';
        return;
    }

    loadDashboardStats();
    loadMenuItems();
    loadOrders();
    loadBookings();
    loadOffers();
    loadLocations();
    setupLogout();
}

/**
 * Setup logout button
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }
}

/**
 * Show/hide admin tabs
 */
function showAdminTab(e, tabName) {
    e.preventDefault();

    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('active');
        e.target.classList.add('active');
    }

    // Reload data when switching tabs
    switch(tabName) {
        case 'orders':
            loadOrders();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'offers':
            loadOffers();
            break;
        case 'locations':
            loadLocations();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

/* ==================== DASHBOARD ==================== */

/**
 * Load and display dashboard statistics
 */
function loadDashboardStats() {
    const daySales = calculateDailySales();
    const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
    const totalBookings = bookings.length;
    const menuItemsCount = menuData.length;

    document.getElementById('daySales').textContent = daySales.toFixed(2);
    document.getElementById('activeOrdersCount').textContent = activeOrdersCount;
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('menuItemsCount').textContent = menuItemsCount;
}

/**
 * Calculate daily sales
 */
function calculateDailySales() {
    const today = new Date().toLocaleDateString();
    return orders
        .filter(o => o.date === today)
        .reduce((sum, o) => sum + o.total, 0);
}

/* ==================== MENU MANAGEMENT ==================== */

/**
 * Show add item form
 */
function showAddItemForm() {
    document.getElementById('addItemForm').style.display = 'block';
}

/**
 * Hide add item form
 */
function hideAddItemForm() {
    document.getElementById('addItemForm').style.display = 'none';
    document.getElementById('addItemForm').reset();
}

/**
 * Handle adding new menu item
 */
function handleAddItem(e) {
    e.preventDefault();

    const item = {
        id: Math.max(...menuData.map(m => m.id), 0) + 1,
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDesc').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        type: document.getElementById('itemType').value,
        available: document.getElementById('itemAvailable').value === 'true',
        rating: 4.5,
        reviews: 0,
        emoji: '🍽️'
    };

    menuData.push(item);
    localStorage.setItem('menuData', JSON.stringify(menuData));

    hideAddItemForm();
    loadMenuItems();
    alert(`✅ ${item.name} added to menu!`);
}

/**
 * Load and display menu items
 */
function loadMenuItems() {
    const menuItems = document.getElementById('menuItems');
    if (!menuItems) return;

    menuItems.innerHTML = menuData.map(item => `
        <div class="menu-item">
            <div class="menu-item-info">
                <strong>${item.emoji} ${item.name}</strong><br>
                <small>${item.description}</small><br>
                <strong>Price: ₹${item.price}</strong> | <strong>Category: ${item.category}</strong><br>
                <strong>Type: ${item.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</strong> |
                <strong>Available: ${item.available ? '✅' : '❌'}</strong>
            </div>
            <div class="menu-item-actions">
                <button class="btn-edit" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="btn-delete" onclick="deleteMenuItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Edit menu item
 */
function editMenuItem(id) {
    const item = menuData.find(m => m.id === id);
    if (!item) return;

    const newPrice = prompt(`Edit price for ${item.name}:`, item.price);
    if (newPrice !== null) {
        item.price = parseFloat(newPrice);
        localStorage.setItem('menuData', JSON.stringify(menuData));
        loadMenuItems();
        alert(`✅ ${item.name} price updated!`);
    }
}

/**
 * Delete menu item
 */
function deleteMenuItem(id) {
    if (confirm('Are you sure?')) {
        const item = menuData.find(m => m.id === id);
        menuData.splice(menuData.indexOf(item), 1);
        localStorage.setItem('menuData', JSON.stringify(menuData));
        loadMenuItems();
        alert(`✅ Item deleted!`);
    }
}

/* ==================== ORDER MANAGEMENT ==================== */

/**
 * Load and display orders
 */
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders yet</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-admin-card">
            <div>
                <strong>Order #${order.id}</strong><br>
                Customer: ${order.userId}<br>
                Total: ₹${order.total}<br>
                Date: ${order.date} | Time: ${order.time}<br>
                Status: <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="menu-item-actions">
                <select class="btn-update" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="">Update Status</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                </select>
                <button class="btn-edit" onclick="printOrderReceipt(${order.id})">Print Receipt</button>
            </div>
        </div>
    `).join('');
}

/**
 * Filter orders by status
 */
function filterOrders(status) {
    const ordersList = document.getElementById('ordersList');
    const filteredOrders = status === 'all' ? orders : orders.filter(o => o.status === status);

    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-admin-card">
            <div>
                <strong>Order #${order.id}</strong><br>
                Customer: ${order.userId}<br>
                Total: ₹${order.total}<br>
                Date: ${order.date} | Time: ${order.time}
            </div>
            <div class="menu-item-actions">
                <select class="btn-update" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="">Update Status</option>
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
                <button class="btn-edit" onclick="printOrderReceipt(${order.id})">Print</button>
            </div>
        </div>
    `).join('');
}

/**
 * Update order status
 */
function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;

    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;

        // Auto-print when status changes to ready
        if (newStatus === 'ready') {
            autoPrintReceipt(orderId);
        }

        saveData();
        loadDashboardStats();
        loadOrders();
        alert(`✅ Order status updated to ${newStatus}`);
    }
}

/**
 * Print order receipt
 */
function printOrderReceipt(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        printReceipt(order);
    }
}

/* ==================== BOOKING MANAGEMENT ==================== */

/**
 * Load and display bookings
 */
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings yet</p>';
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-admin-card">
            <div>
                <strong>Booking #${booking.id}</strong><br>
                Name: ${booking.name}<br>
                Phone: ${booking.phone}<br>
                Date: ${booking.date} | Time: ${booking.time}<br>
                Guests: ${booking.guests} | Occasion: ${booking.occasion}<br>
                Status: <span class="status-delivered">${booking.status}</span>
            </div>
            <div class="menu-item-actions">
                <button class="btn-delete" onclick="cancelBooking(${booking.id})">Cancel</button>
            </div>
        </div>
    `).join('');
}

/**
 * Cancel booking
 */
function cancelBooking(bookingId) {
    if (confirm('Cancel this booking?')) {
        bookings = bookings.filter(b => b.id !== bookingId);
        saveData();
        loadBookings();
        alert('✅ Booking cancelled');
    }
}

/* ==================== OFFER MANAGEMENT ==================== */

/**
 * Show add offer form
 */
function showAddOfferForm() {
    document.getElementById('addOfferForm').style.display = 'block';
}

/**
 * Hide add offer form
 */
function hideAddOfferForm() {
    document.getElementById('addOfferForm').style.display = 'none';
    document.getElementById('addOfferForm').reset();
}

/**
 * Handle adding new offer
 */
function handleAddOffer(e) {
    e.preventDefault();

    const offer = {
        id: Date.now(),
        title: document.getElementById('offerTitle').value,
        description: document.getElementById('offerDesc').value,
        discount: parseInt(document.getElementById('offerDiscount').value),
        expiry: document.getElementById('offerExpiry').value,
        createdAt: new Date().toISOString()
    };

    if (!window.offers) window.offers = [];
    window.offers.push(offer);
    localStorage.setItem('offers', JSON.stringify(window.offers));

    hideAddOfferForm();
    loadOffers();
    alert(`✅ Offer created with ${offer.discount}% discount!`);
}

/**
 * Load and display offers
 */
function loadOffers() {
    const offersList = document.getElementById('offersList');
    if (!offersList) return;

    const offers = JSON.parse(localStorage.getItem('offers')) || [];

    if (offers.length === 0) {
        offersList.innerHTML = '<p>No active offers</p>';
        return;
    }

    offersList.innerHTML = offers.map(offer => `
        <div class="offer-card">
            <div>
                <strong>${offer.title}</strong> - ${offer.discount}% OFF<br>
                ${offer.description}<br>
                Valid until: ${offer.expiry}
            </div>
            <div class="menu-item-actions">
                <button class="btn-delete" onclick="deleteOffer(${offer.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Delete offer
 */
function deleteOffer(offerId) {
    if (confirm('Delete this offer?')) {
        let offers = JSON.parse(localStorage.getItem('offers')) || [];
        offers = offers.filter(o => o.id !== offerId);
        localStorage.setItem('offers', JSON.stringify(offers));
        loadOffers();
        alert('✅ Offer deleted');
    }
}

/* ==================== LOCATION MANAGEMENT ==================== */

/**
 * Show add location form
 */
function showAddLocationForm() {
    document.getElementById('addLocationForm').style.display = 'block';
}

/**
 * Hide add location form
 */
function hideAddLocationForm() {
    document.getElementById('addLocationForm').style.display = 'none';
    document.getElementById('addLocationForm').reset();
}

/**
 * Handle adding delivery location
 */
function handleAddLocation(e) {
    e.preventDefault();

    const location = {
        id: Date.now(),
        area: document.getElementById('locationArea').value,
        zip: document.getElementById('locationZip').value,
        deliveryCharge: parseFloat(document.getElementById('deliveryCharge').value),
        createdAt: new Date().toISOString()
    };

    if (!window.locations) window.locations = [];
    window.locations.push(location);
    localStorage.setItem('locations', JSON.stringify(window.locations));

    hideAddLocationForm();
    loadLocations();
    alert(`✅ Location ${location.area} added!`);
}

/**
 * Load and display delivery locations
 */
function loadLocations() {
    const locationsList = document.getElementById('locationsList');
    if (!locationsList) return;

    const locations = JSON.parse(localStorage.getItem('locations')) || [];

    if (locations.length === 0) {
        locationsList.innerHTML = '<p>No delivery locations configured</p>';
        return;
    }

    locationsList.innerHTML = locations.map(location => `
        <div class="location-card">
            <div>
                <strong>${location.area}</strong><br>
                Postal Code: ${location.zip}<br>
                Delivery Charge: ₹${location.deliveryCharge}
            </div>
            <div class="menu-item-actions">
                <button class="btn-delete" onclick="deleteLocation(${location.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

/**
 * Delete location
 */
function deleteLocation(locationId) {
    if (confirm('Remove this location?')) {
        let locations = JSON.parse(localStorage.getItem('locations')) || [];
        locations = locations.filter(l => l.id !== locationId);
        localStorage.setItem('locations', JSON.stringify(locations));
        loadLocations();
        alert('✅ Location removed');
    }
}

/* ==================== ANALYTICS ==================== */

/**
 * Load analytics data
 */
function loadAnalytics() {
    const analytics = calculateAnalytics();
    displayAnalyticsChart(analytics);
    displayAnalyticsTable(analytics);
}

/**
 * Calculate analytics data
 */
function calculateAnalytics() {
    const byDate = {};

    orders.forEach(order => {
        if (!byDate[order.date]) {
            byDate[order.date] = { sales: 0, orders: 0 };
        }
        byDate[order.date].sales += order.total;
        byDate[order.date].orders += 1;
    });

    return byDate;
}

/**
 * Display analytics chart
 */
function displayAnalyticsChart(analytics) {
    const chartDiv = document.getElementById('analyticsChart');
    if (!chartDiv) return;

    let chartHTML = '<h3>Sales Trend</h3><div style="overflow-x: auto;">';
    chartHTML += '<table style="width: 100%; border-collapse: collapse;"><tr><th>Date</th><th>Sales</th></tr>';

    Object.entries(analytics).sort().forEach(([date, data]) => {
        const barWidth = Math.min(data.sales, 500);
        chartHTML += `
            <tr>
                <td>${date}</td>
                <td><div style="background: #4CAF50; width: ${barWidth/10}px; height: 30px; display: inline-block;"></div> ₹${data.sales}</td>
            </tr>
        `;
    });

    chartHTML += '</table></div>';
    chartDiv.innerHTML = chartHTML;
}

/**
 * Display analytics table
 */
function displayAnalyticsTable(analytics) {
    const tableDiv = document.getElementById('analyticsTable');
    if (!tableDiv) return;

    let tableHTML = '<h3>Detailed Statistics</h3><table style="width: 100%; border-collapse: collapse;">';
    tableHTML += '<tr><th>Date</th><th>Orders</th><th>Total Sales</th><th>Avg Order Value</th></tr>';

    Object.entries(analytics).sort().forEach(([date, data]) => {
        const avgOrder = (data.sales / data.orders).toFixed(2);
        tableHTML += `
            <tr>
                <td>${date}</td>
                <td>${data.orders}</td>
                <td>₹${data.sales.toFixed(2)}</td>
                <td>₹${avgOrder}</td>
            </tr>
        `;
    });

    tableHTML += '</table>';
    tableDiv.innerHTML = tableHTML;
}

// Initialize admin panel on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminPanel);
} else {
    initializeAdminPanel();
}
