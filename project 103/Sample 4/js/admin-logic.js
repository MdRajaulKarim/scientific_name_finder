/**
 * ZestyBite — admin-logic.js
 * Admin Panel Backend Controls:
 *  - Dashboard stats & live order feed
 *  - Order management (status updates)
 *  - Table booking management
 *  - Menu item management (add / edit / toggle)
 *  - Offer/Slider management (push to homepage hero)
 *  - Delivery zone management (zip codes)
 *  - Analytics (sales chart)
 *  - Admin authentication
 */

/* ============================================================
   1. ADMIN AUTH — simple password gate
   Change this in production to a proper JWT / session system.
   ============================================================ */
const ADMIN_PASSWORD = 'admin123';   // ← Change this!
const ADMIN_SESSION_KEY = 'zb_admin_session';

function checkAdminAuth() {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) {
    // Show login modal
    document.getElementById('adminAuthOverlay')?.classList.add('open');
    return false;
  }
  return true;
}

function adminLogin() {
  const pwd = document.getElementById('adminPassword')?.value;
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    document.getElementById('adminAuthOverlay')?.classList.remove('open');
    initAdminDashboard();
    showToast('Welcome back, Admin! 👋', 'success');
  } else {
    showToast('Incorrect password', 'error');
    document.getElementById('adminPassword')?.classList.add('shake');
    setTimeout(() => document.getElementById('adminPassword')?.classList.remove('shake'), 500);
  }
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = 'index.html';
}

/* ============================================================
   2. DASHBOARD STATS
   ============================================================ */
function computeStats() {
  const orders   = JSON.parse(localStorage.getItem('zb_orders')   || '[]');
  const bookings = JSON.parse(localStorage.getItem('zb_bookings') || '[]');

  const todayOrders = orders.filter(o => {
    const oDate = new Date(o.time);
    const today = new Date();
    return oDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter(o =>
    ['confirmed', 'preparing'].includes(o.status)
  ).length;

  return {
    totalOrders:   orders.length,
    todayOrders:   todayOrders.length,
    totalRevenue:  totalRevenue,
    pendingOrders: pendingOrders,
    totalBookings: bookings.length
  };
}

function renderDashboardStats() {
  const stats = computeStats();

  setEl('statTotalOrders',  stats.totalOrders);
  setEl('statTodayOrders',  stats.todayOrders);
  setEl('statRevenue',      '₹' + stats.totalRevenue.toLocaleString('en-IN'));
  setEl('statPending',      stats.pendingOrders);
  setEl('statBookings',     stats.totalBookings);
}

/* ============================================================
   3. ORDERS TABLE
   ============================================================ */
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]').reverse();

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--color-text-muted);">No orders yet</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>#${order.id}</strong></td>
      <td>${order.phone || '—'}</td>
      <td>${order.items?.map(i => `${i.name} x${i.qty}`).join(', ').substring(0, 40) || '—'}</td>
      <td>₹${order.total || 0}</td>
      <td>
        <span class="status-badge ${order.status || 'pending'}">${capitalize(order.status || 'pending')}</span>
      </td>
      <td>${formatDateTime(order.time)}</td>
      <td>
        <div style="display:flex;gap:8px;">
          <select class="form-control" style="padding:4px 8px;font-size:0.78rem;width:auto;"
                  onchange="updateOrderStatus('${order.id}', this.value)">
            <option value="confirmed"  ${order.status === 'confirmed'  ? 'selected' : ''}>Confirmed</option>
            <option value="preparing"  ${order.status === 'preparing'  ? 'selected' : ''}>Preparing</option>
            <option value="delivered"  ${order.status === 'delivered'  ? 'selected' : ''}>Delivered</option>
            <option value="cancelled"  ${order.status === 'cancelled'  ? 'selected' : ''}>Cancelled</option>
          </select>
          <button class="btn btn-ghost btn-sm" onclick="getReceiptPreview('${order.id}')">🖨️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');
  const order  = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    // Update step timestamps
    const stepMap = {
      confirmed: 1,
      preparing: 2,
      delivered: 4
    };
    if (order.steps && stepMap[newStatus] !== undefined) {
      for (let i = 0; i <= stepMap[newStatus]; i++) {
        if (order.steps[i]) {
          order.steps[i].done = true;
          order.steps[i].time = order.steps[i].time || new Date().toLocaleTimeString();
        }
      }
    }
    localStorage.setItem('zb_orders', JSON.stringify(orders));
    renderDashboardStats();
    showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  }
}

/* ============================================================
   4. BOOKINGS TABLE
   ============================================================ */
function renderBookingsTable() {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  const bookings = JSON.parse(localStorage.getItem('zb_bookings') || '[]').reverse();

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--color-text-muted);">No bookings yet</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td><strong>#${b.id}</strong></td>
      <td>${b.name || '—'}</td>
      <td>${b.phone || '—'}</td>
      <td>${b.date} ${b.time || ''}</td>
      <td>${b.guests || '—'} guests</td>
      <td>
        <span class="status-badge ${b.status || 'pending'}">${capitalize(b.status || 'pending')}</span>
        <select class="form-control" style="padding:4px 8px;font-size:0.78rem;width:auto;margin-top:4px;"
                onchange="updateBookingStatus('${b.id}', this.value)">
          <option value="pending"   ${b.status === 'pending'   ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirm</option>
          <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancel</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateBookingStatus(bookingId, newStatus) {
  const bookings = JSON.parse(localStorage.getItem('zb_bookings') || '[]');
  const booking  = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = newStatus;
    localStorage.setItem('zb_bookings', JSON.stringify(bookings));
    showToast(`Booking #${bookingId} ${newStatus}`, 'success');
  }
}

/* ============================================================
   5. MENU MANAGEMENT
   ============================================================ */
function renderAdminMenuTable() {
  const tbody = document.getElementById('menuTableBody');
  if (!tbody) return;

  // Use MENU_DATA from main.js (globally available)
  const items = window.MENU_DATA || [];

  // Merge with any admin additions from localStorage
  const customItems = JSON.parse(localStorage.getItem('zb_custom_menu') || '[]');
  const allItems    = [...items, ...customItems];

  tbody.innerHTML = allItems.map(item => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.4rem;">${item.emoji || '🍽️'}</span>
          <div>
            <div style="font-weight:600;">${item.name}</div>
            <div style="font-size:0.75rem;color:var(--color-text-muted);">${item.category}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="food-type-badge ${item.type}" style="position:static;width:20px;height:20px;display:inline-flex;"></span>
        ${capitalize(item.type)}
      </td>
      <td>₹${item.price}</td>
      <td>
        <label class="toggle" title="Toggle visibility">
          <input type="checkbox" ${item.hidden ? '' : 'checked'}
                 onchange="toggleMenuItemVisibility('${item.id}', this.checked)">
          <span class="toggle-track"></span>
        </label>
      </td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-ghost btn-sm" onclick="editMenuItem('${item.id}')">✏️ Edit</button>
          ${item._custom ? `<button class="btn btn-ghost btn-sm" style="color:var(--color-error)" onclick="deleteCustomItem('${item.id}')">🗑️</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleMenuItemVisibility(itemId, visible) {
  const prefs = JSON.parse(localStorage.getItem('zb_menu_prefs') || '{}');
  prefs[itemId] = { hidden: !visible };
  localStorage.setItem('zb_menu_prefs', JSON.stringify(prefs));
  showToast(`Item ${visible ? 'shown' : 'hidden'} on menu`, 'success');
}

function addMenuItemFromForm() {
  const name     = document.getElementById('newItemName')?.value.trim();
  const category = document.getElementById('newItemCategory')?.value;
  const type     = document.getElementById('newItemType')?.value;
  const price    = parseFloat(document.getElementById('newItemPrice')?.value);
  const desc     = document.getElementById('newItemDesc')?.value.trim();
  const emoji    = document.getElementById('newItemEmoji')?.value.trim() || '🍽️';

  if (!name || !category || !type || !price) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const newItem = {
    id: 'ZBC' + Date.now().toString().slice(-4),
    name, category, type, price, description: desc, emoji,
    rating: 4.0, ratingCount: 0, badge: '', originalPrice: null,
    _custom: true
  };

  const customItems = JSON.parse(localStorage.getItem('zb_custom_menu') || '[]');
  customItems.push(newItem);
  localStorage.setItem('zb_custom_menu', JSON.stringify(customItems));

  renderAdminMenuTable();
  closeModal('addItemModal');
  showToast(`✅ ${name} added to menu!`, 'success');
}

function deleteCustomItem(itemId) {
  if (!confirm('Delete this menu item?')) return;
  const items = JSON.parse(localStorage.getItem('zb_custom_menu') || '[]').filter(i => i.id !== itemId);
  localStorage.setItem('zb_custom_menu', JSON.stringify(items));
  renderAdminMenuTable();
  showToast('Item deleted', 'info');
}

function editMenuItem(itemId) {
  // Pre-fill the add/edit modal
  const allItems = [...(window.MENU_DATA || []), ...(JSON.parse(localStorage.getItem('zb_custom_menu') || '[]'))];
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('newItemName',     item.name);
  setVal('newItemCategory', item.category);
  setVal('newItemType',     item.type);
  setVal('newItemPrice',    item.price);
  setVal('newItemDesc',     item.description);
  setVal('newItemEmoji',    item.emoji);

  openModal('addItemModal');
}

/* ============================================================
   6. OFFER / HERO SLIDER MANAGEMENT
   Admin can push new offers to the homepage slider.
   ============================================================ */
function renderOffersManager() {
  const container = document.getElementById('slidesManager');
  if (!container) return;

  const saved  = localStorage.getItem('zb_slides');
  const slides = saved ? JSON.parse(saved) : (window.DEFAULT_SLIDES || []);

  container.innerHTML = slides.map((slide, i) => `
    <div class="admin-card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <h5 style="font-family:var(--font-heading);">Slide ${i + 1}: ${slide.badge}</h5>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="editSlide(${i})">✏️ Edit</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--color-error)" onclick="deleteSlide(${i})">🗑️</button>
        </div>
      </div>
      <div style="padding:16px;border-radius:12px;color:#fff;font-size:0.9rem;" style="background:${slide.bgColor}">
        <strong>${slide.title.replace(/<[^>]+>/g, '')}</strong><br>
        <small style="opacity:0.8;">${slide.desc.substring(0, 80)}…</small>
      </div>
    </div>
  `).join('');
}

function addNewSlide() {
  const badge = document.getElementById('slideBadge')?.value.trim();
  const title = document.getElementById('slideTitle')?.value.trim();
  const desc  = document.getElementById('slideDesc')?.value.trim();
  const cta1  = document.getElementById('slideCta1')?.value.trim() || 'Order Now';
  const color = document.getElementById('slideColor')?.value || '#3d1500';

  if (!badge || !title || !desc) {
    showToast('Fill badge, title and description', 'error');
    return;
  }

  const saved  = localStorage.getItem('zb_slides');
  const slides = saved ? JSON.parse(saved) : (window.DEFAULT_SLIDES || []);

  slides.push({
    id: 'slide_' + Date.now(),
    badge,
    title,
    desc,
    cta1: { text: cta1, href: 'menu.html' },
    cta2: { text: 'View Menu', href: 'menu.html' },
    bgColor: `linear-gradient(135deg, #1a0a00 0%, ${color} 100%)`,
    emoji: '🍽️'
  });

  localStorage.setItem('zb_slides', JSON.stringify(slides));
  renderOffersManager();
  closeModal('addSlideModal');
  showToast('✅ Offer added to homepage slider!', 'success');
}

function deleteSlide(index) {
  if (!confirm('Remove this slide?')) return;
  const saved  = localStorage.getItem('zb_slides');
  const slides = saved ? JSON.parse(saved) : (window.DEFAULT_SLIDES || []);
  slides.splice(index, 1);
  localStorage.setItem('zb_slides', JSON.stringify(slides));
  renderOffersManager();
  showToast('Slide removed', 'info');
}

/* ============================================================
   7. DELIVERY ZONE MANAGEMENT
   Admin sets allowed zip codes / areas for delivery.
   ============================================================ */
function renderDeliveryZones() {
  const container = document.getElementById('deliveryZones');
  if (!container) return;

  const zones = JSON.parse(localStorage.getItem('zb_delivery_zones') || '[]');

  if (zones.length === 0) {
    container.innerHTML = `<p style="color:var(--color-text-muted);font-style:italic;">No zones configured — delivery is unrestricted.</p>`;
    return;
  }

  container.innerHTML = zones.map((zone, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--color-base);border-radius:8px;margin-bottom:8px;">
      <div>
        <strong>${zone.name}</strong>
        <span style="margin-left:8px;font-size:0.8rem;color:var(--color-text-muted);">PIN: ${zone.pin || '—'}</span>
        <span style="margin-left:8px;font-size:0.78rem;color:${zone.active ? 'var(--color-success)' : 'var(--color-error)'};">
          ${zone.active ? '● Active' : '● Inactive'}
        </span>
      </div>
      <button class="btn btn-ghost btn-sm" style="color:var(--color-error)" onclick="removeDeliveryZone(${i})">Remove</button>
    </div>
  `).join('');
}

function addDeliveryZone() {
  const name = document.getElementById('zoneName')?.value.trim();
  const pin  = document.getElementById('zonePin')?.value.trim();

  if (!name) { showToast('Enter area name', 'error'); return; }

  const zones = JSON.parse(localStorage.getItem('zb_delivery_zones') || '[]');
  zones.push({ name, pin, active: true });
  localStorage.setItem('zb_delivery_zones', JSON.stringify(zones));
  renderDeliveryZones();

  if (document.getElementById('zoneName')) document.getElementById('zoneName').value = '';
  if (document.getElementById('zonePin'))  document.getElementById('zonePin').value  = '';

  showToast(`📍 Zone "${name}" added`, 'success');
}

function removeDeliveryZone(index) {
  const zones = JSON.parse(localStorage.getItem('zb_delivery_zones') || '[]');
  zones.splice(index, 1);
  localStorage.setItem('zb_delivery_zones', JSON.stringify(zones));
  renderDeliveryZones();
  showToast('Zone removed', 'info');
}

/* ============================================================
   8. ANALYTICS — Sales Chart
   ============================================================ */
function renderSalesChart() {
  const chartEl = document.getElementById('salesChart');
  if (!chartEl) return;

  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');

  // Build last 7 days revenue
  const days = [];
  const revenues = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push(label);

    const dayRev = orders
      .filter(o => {
        const oDate = new Date(o.time);
        return oDate.toDateString() === d.toDateString() && o.status !== 'cancelled';
      })
      .reduce((s, o) => s + (o.total || 0), 0);
    revenues.push(dayRev);
  }

  const maxRev = Math.max(...revenues, 1);

  chartEl.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:12px;height:180px;padding:12px;">
      ${revenues.map((rev, i) => {
        const pct = Math.max(10, (rev / maxRev) * 100);
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="font-size:0.7rem;color:var(--color-text-muted);">${rev > 0 ? '₹'+rev : ''}</div>
            <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
              <div class="chart-bar" style="width:100%;height:${pct}%;background:var(--color-accent);border-radius:4px 4px 0 0;animation-delay:${i * 0.1}s;"></div>
            </div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);">${days[i]}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Top items
  const itemCounts = {};
  orders.forEach(o => o.items?.forEach(item => {
    itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
  }));

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topEl = document.getElementById('topItems');
  if (topEl) {
    topEl.innerHTML = topItems.map(([name, qty], i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--color-border);">
        <span style="font-weight:700;color:var(--color-accent);min-width:20px;">${i + 1}</span>
        <span style="flex:1;">${name}</span>
        <span style="font-weight:600;">${qty} sold</span>
      </div>
    `).join('') || '<p style="color:var(--color-text-muted);">No sales data yet</p>';
  }
}

/* ============================================================
   9. ADMIN SECTION NAVIGATION
   ============================================================ */
function showAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(sectionId)?.classList.add('active');
  document.querySelector(`.admin-nav-item[data-section="${sectionId}"]`)?.classList.add('active');

  // Re-render relevant section
  const renders = {
    'sec-dashboard': () => { renderDashboardStats(); renderOrdersTable(); },
    'sec-orders':    () => renderOrdersTable(),
    'sec-bookings':  () => renderBookingsTable(),
    'sec-menu':      () => renderAdminMenuTable(),
    'sec-offers':    () => renderOffersManager(),
    'sec-zones':     () => renderDeliveryZones(),
    'sec-analytics': () => renderSalesChart()
  };

  if (renders[sectionId]) renders[sectionId]();
}

/* ============================================================
   10. LIVE REFRESH (poll every 30 seconds)
   ============================================================ */
function startLiveRefresh() {
  // Initial render
  renderDashboardStats();

  setInterval(() => {
    const activeSection = document.querySelector('.admin-section.active');
    if (activeSection?.id === 'sec-dashboard') {
      renderDashboardStats();
      renderOrdersTable();
    } else if (activeSection?.id === 'sec-orders') {
      renderOrdersTable();
    }
  }, 30000);
}

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' +
         d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/* ============================================================
   11. INIT
   ============================================================ */
function initAdminDashboard() {
  // Nav items
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section) showAdminSection(section);
    });
  });

  // Default section
  showAdminSection('sec-dashboard');
  startLiveRefresh();

  // Admin sidebar mobile toggle
  document.getElementById('adminSidebarToggle')?.addEventListener('click', () => {
    document.getElementById('adminSidebar')?.classList.toggle('mobile-open');
  });

  // Form handlers
  document.getElementById('addMenuItemBtn')?.addEventListener('click', addMenuItemFromForm);
  document.getElementById('addSlideBtn')?.addEventListener('click', addNewSlide);
  document.getElementById('addZoneBtn')?.addEventListener('click', addDeliveryZone);
  document.getElementById('adminLoginBtn')?.addEventListener('click', adminLogin);
  document.getElementById('adminLogoutBtn')?.addEventListener('click', adminLogout);

  // Allow Enter on admin password
  document.getElementById('adminPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') adminLogin();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const authed = checkAdminAuth();
  if (authed) initAdminDashboard();

  // Also wire login button even before auth
  document.getElementById('adminLoginBtn')?.addEventListener('click', adminLogin);
  document.getElementById('adminPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') adminLogin();
  });
});

// Expose globally
window.showAdminSection     = showAdminSection;
window.updateOrderStatus    = updateOrderStatus;
window.updateBookingStatus  = updateBookingStatus;
window.toggleMenuItemVisibility = toggleMenuItemVisibility;
window.addMenuItemFromForm  = addMenuItemFromForm;
window.deleteCustomItem     = deleteCustomItem;
window.editMenuItem         = editMenuItem;
window.addNewSlide          = addNewSlide;
window.deleteSlide          = deleteSlide;
window.addDeliveryZone      = addDeliveryZone;
window.removeDeliveryZone   = removeDeliveryZone;
window.adminLogin           = adminLogin;
window.adminLogout          = adminLogout;