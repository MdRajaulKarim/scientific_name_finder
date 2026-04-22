/* ==================== OTP AUTHENTICATION ==================== */

/**
 * Initialize authentication UI
 * Show/hide login button and tracking links based on user login status
 */
function initializeAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        currentUser_global = currentUser;
        updateAuthUI(currentUser);
    } else {
        updateAuthUI(null);
    }

    setupAuthModalListeners();
}

/**
 * Update UI based on authentication status
 */
function updateAuthUI(user) {
    const authBtn = document.getElementById('authBtn');
    const trackingLink = document.getElementById('trackingLink');
    const adminLink = document.getElementById('adminLink');

    if (user) {
        if (authBtn) {
            authBtn.textContent = `👤 ${user.phone}`;
            authBtn.onclick = logout;
            authBtn.style.background = 'var(--color-accent)';
        }
        if (trackingLink) trackingLink.style.display = 'block';
        if (adminLink && user.isAdmin) adminLink.style.display = 'block';

        currentUser = user;
        displayOrderTracking();
        loadUserBookings();
    } else {
        if (authBtn) {
            authBtn.textContent = 'Login';
            authBtn.onclick = () => openModal('authModal');
            authBtn.style.background = 'var(--color-accent)';
        }
        if (trackingLink) trackingLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

/**
 * Setup OTP modal event listeners
 */
function setupAuthModalListeners() {
    const authModal = document.getElementById('authModal');
    const closeBtn = authModal?.querySelector('.close');

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeModal('authModal');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('authModal'));
    }
}

/**
 * Handle OTP submission (send OTP)
 * In production, this would call a backend API
 */
function handleOTPSubmit(e) {
    e.preventDefault();

    const phone = document.getElementById('phoneInput').value;

    if (!validatePhoneNumber(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Simulate OTP sending
    console.log(`OTP sent to ${phone}`);

    // Show verification form
    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('verifyForm').style.display = 'block';

    // In production: Call API endpoint
    // await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) })

    // For demo: Generate a fake OTP (in production, backend generates this)
    const demoOTP = '123456';
    console.log(`Demo OTP: ${demoOTP}`);
    alert(`Demo Mode: OTP is ${demoOTP}`);

    // Store phone for verification
    sessionStorage.setItem('tempPhone', phone);
}

/**
 * Handle OTP verification
 */
function handleOTPVerify(e) {
    e.preventDefault();

    const otp = document.getElementById('otpInput').value;
    const phone = sessionStorage.getItem('tempPhone');

    if (otp !== '123456') { // In production: verify against backend
        alert('Invalid OTP. Try again.');
        return;
    }

    // Create user object
    const user = {
        phone: phone,
        isAdmin: false, // Set to true for admin users (demo: use phone 9999999999)
        loginTime: new Date().toISOString()
    };

    // Check if this is admin phone
    if (phone === '9999999999') {
        user.isAdmin = true;
    }

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;

    // Close modal and reset
    closeModal('authModal');
    resetAuthForm();
    updateAuthUI(user);

    alert(`✅ Welcome ${phone}!`);
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('tempPhone');
        currentUser = null;
        resetAuthForm();
        updateAuthUI(null);
        window.location.href = 'index.html';
    }
}

/**
 * Validate phone number format
 */
function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
}

/**
 * Reset authentication form
 */
function resetAuthForm() {
    const otpForm = document.getElementById('otpForm');
    const verifyForm = document.getElementById('verifyForm');

    if (otpForm) {
        otpForm.reset();
        otpForm.style.display = 'block';
    }

    if (verifyForm) {
        verifyForm.reset();
        verifyForm.style.display = 'none';
    }

    document.getElementById('phoneInput').value = '';
    document.getElementById('otpInput').value = '';
}

/**
 * Check if user is authenticated
 */
function isUserAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

/**
 * Get current authenticated user
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.isAdmin === true;
}

// Global user variable
let currentUser_global = null;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
