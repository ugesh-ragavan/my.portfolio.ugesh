/**
 * SHE Sites - Secure PIN Authentication System
 * Protects all pages inside sites/She/ with PIN auth (3010 or 1006).
 * Features salted SHA-256 cryptographic verification, zero-flash content masking,
 * rate limiting, keyboard support, glassmorphism UI, and header lock control.
 */
(function () {
  'use strict';

  const AUTH_KEY = 'she_vault_auth_token_2026';
  const FAILED_ATTEMPTS_KEY = 'she_vault_failed_attempts';
  const LOCKOUT_UNTIL_KEY = 'she_vault_lockout_until';

  // Salted SHA-256 Hashes for PINs:
  // "SHE_VAULT_PIN_3010" -> 504f41c935b811c009bd6bd1ef737fff6267cabb4922eef015240c6c3072017f
  // "SHE_VAULT_PIN_1006" -> 59502e34bf52e59bba927eff6ea21b5121ad87535b63ca5c8a6358abd7c0368f
  const VALID_HASHES = [
    '504f41c935b811c009bd6bd1ef737fff6267cabb4922eef015240c6c3072017f',
    '59502e34bf52e59bba927eff6ea21b5121ad87535b63ca5c8a6358abd7c0368f'
  ];

  const VALID_PINS_FALLBACK = ['3010', '1006'];

  let enteredPin = '';
  let lockoutTimer = null;
  let isChecking = false;

  // Check if session is already authenticated
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'authenticated_valid_she_access';
  }

  // Hide page content immediately to prevent flash of protected content
  let hideStyle = null;
  if (!isAuthenticated()) {
    hideStyle = document.createElement('style');
    hideStyle.id = 'she-auth-hide-style';
    hideStyle.textContent = `
      html, body {
        overflow: hidden !important;
      }
      body > *:not(#she-lock-overlay) {
        display: none !important;
      }
    `;
    if (document.head) {
      document.head.appendChild(hideStyle);
    } else {
      document.documentElement.appendChild(hideStyle);
    }
  }

  // Helper to compute SHA-256 hash using Web Crypto API
  async function computeHash(pin) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode('SHE_VAULT_PIN_' + pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.warn('Crypto API warning, utilizing verification fallback', e);
      }
    }
    return null;
  }

  // Verify PIN against cryptographic hashes
  async function verifyPin(pin) {
    const hash = await computeHash(pin);
    if (hash) {
      return VALID_HASHES.includes(hash);
    }
    return VALID_PINS_FALLBACK.includes(pin);
  }

  // Attach lock button to header on all She pages
  function attachLockButton() {
    const existingBtn = document.getElementById('she-header-lock-btn');
    if (existingBtn) return;

    const header = document.querySelector('header');
    if (!header) return;

    const lockBtn = document.createElement('button');
    lockBtn.id = 'she-header-lock-btn';
    lockBtn.type = 'button';
    lockBtn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm backdrop-blur-sm cursor-pointer ml-auto';
    lockBtn.style.cssText = 'cursor: pointer; z-index: 50;';
    lockBtn.title = 'Lock SHE Vault';
    lockBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
      <span>Lock Page</span>
    `;

    lockBtn.addEventListener('click', function () {
      sessionStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });

    header.appendChild(lockBtn);
  }

  // Build & Inject Lock Screen UI
  function initLockScreen() {
    if (document.getElementById('she-lock-overlay')) return;

    // Inject CSS animations & Lock Screen Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes shePulseGlow {
        0%, 100% { box-shadow: 0 0 25px rgba(248, 200, 220, 0.25), 0 0 50px rgba(184, 93, 56, 0.15); }
        50% { box-shadow: 0 0 45px rgba(248, 200, 220, 0.5), 0 0 75px rgba(233, 154, 178, 0.35); }
      }
      @keyframes sheShake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
      }
      @keyframes shePopIn {
        0% { opacity: 0; transform: scale(0.92); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes sheHeartBeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      .she-shake { animation: sheShake 0.45s ease-in-out; }
      .she-pin-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(248, 200, 220, 0.4);
        background: transparent;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .she-pin-dot.filled {
        background: #F8C8DC;
        border-color: #F8C8DC;
        box-shadow: 0 0 12px #F8C8DC, 0 0 20px rgba(233, 154, 178, 0.8);
        transform: scale(1.2);
      }
      .she-pin-dot.error {
        background: #EF4444;
        border-color: #EF4444;
        box-shadow: 0 0 12px #EF4444;
      }
      .she-pin-dot.success {
        background: #10B981;
        border-color: #10B981;
        box-shadow: 0 0 12px #10B981;
      }
      .she-key-btn {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(248, 200, 220, 0.18);
        color: #F8F6F0;
        font-size: 1.5rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        transition: all 0.18s ease;
        backdrop-filter: blur(10px);
        -webkit-tap-highlight-color: transparent;
      }
      .she-key-btn:hover {
        background: rgba(248, 200, 220, 0.2);
        border-color: rgba(248, 200, 220, 0.45);
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.3);
      }
      .she-key-btn:active {
        transform: scale(0.92);
        background: rgba(233, 154, 178, 0.35);
      }
      .she-key-action {
        font-size: 0.9rem;
        font-weight: 600;
        color: #F8C8DC;
      }
    `;
    document.head.appendChild(styleEl);

    // Create Lock Overlay Element
    const overlay = document.createElement('div');
    overlay.id = 'she-lock-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: #0F0C15;
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(233, 154, 178, 0.18), transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(184, 93, 56, 0.15), transparent 50%),
        radial-gradient(circle at 10% 90%, rgba(244, 213, 141, 0.1), transparent 40%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      color: #F8F6F0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
    `;

    overlay.innerHTML = `
      <div id="she-lock-card" style="
        width: 100%;
        max-width: 380px;
        background: rgba(25, 20, 34, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(248, 200, 220, 0.25);
        border-radius: 2rem;
        padding: 2.25rem 1.75rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        animation: shePulseGlow 4s infinite alternate, shePopIn 0.4s ease-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        box-sizing: border-box;
      ">
        <!-- Heart Header Icon -->
        <div style="
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(233, 154, 178, 0.15);
          border: 1px solid rgba(248, 200, 220, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin-bottom: 1rem;
          animation: sheHeartBeat 2.5s infinite ease-in-out;
        ">💖</div>

        <h2 style="
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin: 0;
          background: linear-gradient(135deg, #F8C8DC 0%, #E28458 50%, #F4D58D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        ">SHE VAULT</h2>

        <p style="
          font-size: 0.825rem;
          color: rgba(248, 246, 240, 0.75);
          margin: 0.4rem 0 1.5rem 0;
          line-height: 1.4;
        ">Protected Area • Enter 4-Digit PIN Access</p>

        <!-- PIN Display Dots -->
        <div id="she-pin-dots-container" style="
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
        ">
          <div class="she-pin-dot" id="dot-0"></div>
          <div class="she-pin-dot" id="dot-1"></div>
          <div class="she-pin-dot" id="dot-2"></div>
          <div class="she-pin-dot" id="dot-3"></div>
        </div>

        <!-- Status Message -->
        <div id="she-status-msg" style="
          min-height: 24px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(248, 200, 220, 0.85);
          margin-bottom: 1.25rem;
          transition: all 0.2s ease;
        ">Enter PIN to unlock</div>

        <!-- Keypad Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.9rem;
          width: 100%;
          max-width: 250px;
          justify-items: center;
        ">
          <button class="she-key-btn" data-key="1" type="button">1</button>
          <button class="she-key-btn" data-key="2" type="button">2</button>
          <button class="she-key-btn" data-key="3" type="button">3</button>
          <button class="she-key-btn" data-key="4" type="button">4</button>
          <button class="she-key-btn" data-key="5" type="button">5</button>
          <button class="she-key-btn" data-key="6" type="button">6</button>
          <button class="she-key-btn" data-key="7" type="button">7</button>
          <button class="she-key-btn" data-key="8" type="button">8</button>
          <button class="she-key-btn" data-key="9" type="button">9</button>
          <button class="she-key-btn she-key-action" data-action="clear" type="button">CLR</button>
          <button class="she-key-btn" data-key="0" type="button">0</button>
          <button class="she-key-btn she-key-action" data-action="backspace" type="button">⌫</button>
        </div>
      </div>

      <div style="
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.4);
        text-align: center;
      ">
        Crafted with love by Ugesh • Private Access
      </div>
    `;

    document.body.appendChild(overlay);
    checkLockoutState();

    // Keypad Click Listeners
    overlay.querySelectorAll('.she-key-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const key = this.getAttribute('data-key');
        const action = this.getAttribute('data-action');

        if (key !== null) {
          handleDigitInput(key);
        } else if (action === 'clear') {
          handleClear();
        } else if (action === 'backspace') {
          handleBackspace();
        }
      });
    });

    // Keyboard Events Listener
    window.addEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (isAuthenticated()) return;

    if (e.key >= '0' && e.key <= '9') {
      handleDigitInput(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
      handleClear();
    }
  }

  function updateDots(statusClass = '') {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (!dot) continue;
      dot.className = 'she-pin-dot';
      if (statusClass) {
        dot.classList.add(statusClass);
      } else if (i < enteredPin.length) {
        dot.classList.add('filled');
      }
    }
  }

  function setStatus(msg, isError = false, isSuccess = false) {
    const msgEl = document.getElementById('she-status-msg');
    if (!msgEl) return;
    msgEl.textContent = msg;
    if (isError) {
      msgEl.style.color = '#F87171';
    } else if (isSuccess) {
      msgEl.style.color = '#34D399';
    } else {
      msgEl.style.color = 'rgba(248, 200, 220, 0.85)';
    }
  }

  function checkLockoutState() {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_UNTIL_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      startLockoutCountdown(Math.ceil((lockoutUntil - now) / 1000));
      return true;
    }
    return false;
  }

  function startLockoutCountdown(seconds) {
    isChecking = true;
    updateDots('error');

    function tick() {
      if (seconds <= 0) {
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
        isChecking = false;
        enteredPin = '';
        updateDots();
        setStatus('Lockout expired. Enter PIN to unlock.');
        return;
      }
      setStatus(`Too many failed attempts. Try again in ${seconds}s`, true);
      seconds--;
      lockoutTimer = setTimeout(tick, 1000);
    }
    tick();
  }

  async function handleDigitInput(digit) {
    if (isChecking || checkLockoutState()) return;
    if (enteredPin.length >= 4) return;

    enteredPin += digit;
    updateDots();

    if (enteredPin.length === 4) {
      isChecking = true;
      setStatus('Verifying security PIN...');

      const isValid = await verifyPin(enteredPin);
      if (isValid) {
        // SUCCESS
        updateDots('success');
        setStatus('✨ Access Granted! Opening...', false, true);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
        sessionStorage.setItem(AUTH_KEY, 'authenticated_valid_she_access');

        setTimeout(() => {
          const overlay = document.getElementById('she-lock-overlay');
          if (overlay) {
            overlay.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(1.05)';
            setTimeout(() => {
              overlay.remove();
              if (hideStyle && hideStyle.parentNode) {
                hideStyle.parentNode.removeChild(hideStyle);
              }
              document.body.style.overflow = '';
              attachLockButton();
            }, 400);
          }
        }, 400);
      } else {
        // FAILED PIN
        updateDots('error');
        const card = document.getElementById('she-lock-card');
        if (card) {
          card.classList.remove('she-shake');
          void card.offsetWidth; // trigger reflow
          card.classList.add('she-shake');
        }

        let attempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
        localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

        if (attempts >= 5) {
          const lockoutUntil = Date.now() + 30000; // 30s lockout
          localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
          startLockoutCountdown(30);
        } else {
          const remaining = 5 - attempts;
          setStatus(`Incorrect PIN. ${remaining} attempt${remaining > 1 ? 's' : ''} left.`, true);
          setTimeout(() => {
            enteredPin = '';
            updateDots();
            isChecking = false;
          }, 800);
        }
      }
    }
  }

  function handleBackspace() {
    if (isChecking || checkLockoutState()) return;
    if (enteredPin.length > 0) {
      enteredPin = enteredPin.slice(0, -1);
      updateDots();
    }
  }

  function handleClear() {
    if (isChecking || checkLockoutState()) return;
    enteredPin = '';
    updateDots();
  }

  // Initialize Lock UI when DOM is parsed
  if (!isAuthenticated()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLockScreen);
    } else {
      initLockScreen();
    }
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachLockButton);
    } else {
      attachLockButton();
    }
  }
})();
