/**
 * ZestyBite — auth.js
 * Handles mobile OTP login flow:
 *  Step 1 — Enter phone number → request OTP
 *  Step 2 — Enter 6-digit OTP → verify
 *
 * NOTE: In production, replace the mock OTP logic with
 * real SMS API calls (Twilio / MSG91 / 2Factor) via server.js.
 */

/* ============================================================
   CONFIG
   ============================================================ */
const OTP_LENGTH      = 6;
const OTP_EXPIRY_SECS = 60;  // Resend available after 60s
const MOCK_OTP        = '123456'; // Dev only — remove in production

/* ============================================================
   STATE
   ============================================================ */
let resendTimer  = null;
let timerSeconds = OTP_EXPIRY_SECS;
let currentPhone = '';
let generatedOTP = '';

/* ============================================================
   STEP 1 — SEND OTP
   ============================================================ */
async function sendOTP() {
  const phoneInput = document.getElementById('phoneInput');
  const phone = phoneInput?.value.trim().replace(/\D/g, ''); // strip non-digits

  if (!phone || phone.length !== 10) {
    showAuthError('phoneError', 'Please enter a valid 10-digit mobile number.');
    phoneInput?.focus();
    return;
  }

  currentPhone = phone;
  const btn = document.getElementById('sendOtpBtn');
  setButtonLoading(btn, true, 'Sending…');

  try {
    // ── PRODUCTION: replace with real API call ────────────────
    // const res = await fetch('/api/send-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone: '+91' + phone })
    // });
    // const data = await res.json();
    // if (!data.success) throw new Error(data.message);
    // ─────────────────────────────────────────────────────────

    // ── MOCK (dev) ─────────────────────────────────────────────
    await simulateDelay(1000);
    generatedOTP = MOCK_OTP;
    console.info(`[DEV] OTP for ${phone}: ${generatedOTP}`);
    // ─────────────────────────────────────────────────────────

    // Show step 2
    showStep('stepPhone', false);
    showStep('stepOTP', true);

    // Display masked phone number
    const maskedEl = document.getElementById('maskedPhone');
    if (maskedEl) maskedEl.textContent = `+91 ${phone.slice(0,2)}***${phone.slice(-3)}`;

    // Focus first OTP digit
    document.getElementById('otp0')?.focus();

    // Start resend countdown
    startResendTimer();

    showToast('OTP sent to your mobile number ✉️', 'success');

  } catch (err) {
    showAuthError('phoneError', 'Failed to send OTP. Please try again.');
    console.error('[Auth] Send OTP error:', err);
  } finally {
    setButtonLoading(btn, false, 'Get OTP');
  }
}

/* ============================================================
   STEP 2 — VERIFY OTP
   ============================================================ */
async function verifyOTP() {
  const otp = getOTPValue();

  if (otp.length !== OTP_LENGTH) {
    showAuthError('otpError', `Please enter all ${OTP_LENGTH} digits.`);
    return;
  }

  const btn = document.getElementById('verifyOtpBtn');
  setButtonLoading(btn, true, 'Verifying…');
  clearAuthError('otpError');

  try {
    // ── PRODUCTION ─────────────────────────────────────────────
    // const res = await fetch('/api/verify-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone: '+91' + currentPhone, otp })
    // });
    // const data = await res.json();
    // if (!data.success) throw new Error(data.message || 'Invalid OTP');
    // ─────────────────────────────────────────────────────────

    // ── MOCK ──────────────────────────────────────────────────
    await simulateDelay(1200);
    if (otp !== generatedOTP) throw new Error('Invalid OTP. Use 123456 in dev mode.');
    // ─────────────────────────────────────────────────────────

    // Save user session
    const user = {
      phone: currentPhone,
      name: '',
      isLoggedIn: true,
      loginTime: Date.now()
    };
    localStorage.setItem('zb_user', JSON.stringify(user));

    // Stop timer
    clearInterval(resendTimer);

    showToast('🎉 Logged in successfully!', 'success');

    // Show success step / redirect
    showStep('stepOTP', false);
    showStep('stepSuccess', true);

    setTimeout(() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirect;
    }, 1500);

  } catch (err) {
    // Shake the OTP inputs
    document.getElementById('otpContainer')?.classList.add('shake');
    setTimeout(() => document.getElementById('otpContainer')?.classList.remove('shake'), 500);

    showAuthError('otpError', err.message || 'Incorrect OTP. Please try again.');
    clearOTPInputs();
    document.getElementById('otp0')?.focus();
  } finally {
    setButtonLoading(btn, false, 'Verify OTP');
  }
}

/* ============================================================
   OTP INPUT BEHAVIOUR
   Auto-advance, backspace, paste handling
   ============================================================ */
function initOTPInputs() {
  for (let i = 0; i < OTP_LENGTH; i++) {
    const input = document.getElementById(`otp${i}`);
    if (!input) continue;

    input.setAttribute('maxlength', 1);
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('autocomplete', 'one-time-code');

    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/, '');
      e.target.value = val;
      e.target.classList.toggle('filled', val !== '');
      if (val && i < OTP_LENGTH - 1) {
        document.getElementById(`otp${i + 1}`)?.focus();
      }
      // Auto-submit when last digit filled
      if (i === OTP_LENGTH - 1 && val) {
        const fullOTP = getOTPValue();
        if (fullOTP.length === OTP_LENGTH) {
          setTimeout(verifyOTP, 200);
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        document.getElementById(`otp${i - 1}`)?.focus();
      }
      if (e.key === 'ArrowLeft' && i > 0) document.getElementById(`otp${i - 1}`)?.focus();
      if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) document.getElementById(`otp${i + 1}`)?.focus();
    });

    // Handle paste of full OTP
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      [...pasted].forEach((digit, idx) => {
        const el = document.getElementById(`otp${idx}`);
        if (el) { el.value = digit; el.classList.add('filled'); }
      });
      const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
      document.getElementById(`otp${lastFilled}`)?.focus();
      if (pasted.length === OTP_LENGTH) setTimeout(verifyOTP, 200);
    });
  }
}

function getOTPValue() {
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += document.getElementById(`otp${i}`)?.value || '';
  }
  return otp;
}

function clearOTPInputs() {
  for (let i = 0; i < OTP_LENGTH; i++) {
    const el = document.getElementById(`otp${i}`);
    if (el) { el.value = ''; el.classList.remove('filled'); }
  }
}

/* ============================================================
   RESEND TIMER
   ============================================================ */
function startResendTimer() {
  timerSeconds = OTP_EXPIRY_SECS;
  updateTimerDisplay();

  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) resendBtn.disabled = true;

  clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(resendTimer);
      if (resendBtn) resendBtn.disabled = false;
      updateTimerDisplay(true);
    }
  }, 1000);
}

function updateTimerDisplay(expired = false) {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  el.textContent = expired
    ? ''
    : `Resend OTP in ${timerSeconds}s`;
}

async function resendOTP() {
  clearOTPInputs();
  document.getElementById('otp0')?.focus();
  await sendOTP();
}

/* ============================================================
   BACK — go back to phone step
   ============================================================ */
function backToPhone() {
  showStep('stepOTP', false);
  showStep('stepPhone', true);
  clearInterval(resendTimer);
  clearOTPInputs();
  clearAuthError('otpError');
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  localStorage.removeItem('zb_user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => { window.location.href = 'index.html'; }, 800);
}

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */
function showStep(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('active', visible);
}

function showAuthError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.style.display = 'block'; }
}

function clearAuthError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

function setButtonLoading(btn, loading, label) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = label;
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================================
   CSS for OTP shake animation (injected once)
   ============================================================ */
(function injectAuthStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    .shake { animation: shake 0.45s ease; }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initOTPInputs();

  // Wire up buttons
  document.getElementById('sendOtpBtn')?.addEventListener('click', sendOTP);
  document.getElementById('verifyOtpBtn')?.addEventListener('click', verifyOTP);
  document.getElementById('resendBtn')?.addEventListener('click', resendOTP);
  document.getElementById('backToPhoneBtn')?.addEventListener('click', backToPhone);
  document.getElementById('logoutBtn')?.addEventListener('click', logout);

  // Phone input: allow only numbers
  document.getElementById('phoneInput')?.addEventListener('keypress', e => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  });

  // Allow Enter key on phone input
  document.getElementById('phoneInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendOTP();
  });
});

// Expose globally
window.sendOTP    = sendOTP;
window.verifyOTP  = verifyOTP;
window.resendOTP  = resendOTP;
window.backToPhone = backToPhone;
window.logout     = logout;