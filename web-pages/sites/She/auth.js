/**
 * SHE Sites - Secure Role-Based PIN Authentication System
 * 
 * Configured PINs & Roles:
 * - 1511 : Admin Access -> Unlocks ALL pages (*).
 * - 1006 : Selective Access -> Unlocks designated pages only (floral.html, feel-better.html).
 * 
 * Features:
 * - Salted SHA-256 cryptographic verification via Web Crypto API.
 * - Zero-flash content protection (styles injected in head before DOM paint).
 * - Role-based authorization per page with seamless session upgrade.
 * - Gentle restricted-access guidance with one-click direct links.
 * - Rate limiting & lockout protection for invalid PINs.
 * - Keyboard support (numpad/keys 0-9, Backspace, Escape/Delete).
 * - Premium glassmorphism UI with ambient pulse glow.
 * - Dynamic lock controls (header lock button or top-right floating pill).
 */
(function () {
  'use strict';

  // Session & Local Storage Keys
  const AUTH_KEY = 'she_vault_auth_token_2026_v2';
  const AUTH_ROLE_KEY = 'she_vault_auth_role_2026_v2';
  const FAILED_ATTEMPTS_KEY = 'she_vault_failed_attempts';
  const LOCKOUT_UNTIL_KEY = 'she_vault_lockout_until';

  // Role Definitions & Salted Hashes:
  // Salt format: "SHE_VAULT_PIN_" + pin
  // "SHE_VAULT_PIN_1511" -> a04cb74e9d9ee74c1390eb62cd2512273b223e09ae028de6f21b88f281252005
  // "SHE_VAULT_PIN_1006" -> 59502e34bf52e59bba927eff6ea21b5121ad87535b63ca5c8a6358abd7c0368f
  const PIN_CONFIG = {
    '1511': {
      role: 'admin',
      label: 'Admin Access',
      hash: 'a04cb74e9d9ee74c1390eb62cd2512273b223e09ae028de6f21b88f281252005'
    },
    '1006': {
      role: 'selective',
      label: 'Selective Access',
      hash: '59502e34bf52e59bba927eff6ea21b5121ad87535b63ca5c8a6358abd7c0368f'
    }
  };

  // Selective Role Authorized Pages Whitelist
  // Admin role automatically has wildcard ('*') access to all pages.
  const SELECTIVE_ALLOWED_PAGES = [
    'floral.html',
    'feel-better.html',
    '1-month-book'
  ];

  let enteredPin = '';
  let lockoutTimer = null;
  let isChecking = false;

  // Resolve canonical page filename from current URL
  function getCurrentPage() {
    const path = window.location.pathname || '';
    const normalized = path.replace(/\\/g, '/');
    if (normalized.includes('/1-month-book')) {
      return '1-month-book';
    }
    const filename = normalized.substring(normalized.lastIndexOf('/') + 1).toLowerCase();
    if (!filename || filename === 'she' || filename === '') {
      return 'index.html';
    }
    return filename;
  }

  // Check if given page is allowed for given role
  function isPagePermittedForRole(page, role) {
    if (!role) return false;
    if (role === 'admin') return true;
    if (role === 'selective') {
      return SELECTIVE_ALLOWED_PAGES.includes(page);
    }
    return false;
  }

  // Get current session authenticated role (null if unauthenticated)
  function getSessionRole() {
    const token = sessionStorage.getItem(AUTH_KEY);
    if (token !== 'authenticated_valid_she_access_v2') {
      return null;
    }
    return sessionStorage.getItem(AUTH_ROLE_KEY) || null;
  }

  // Check if current page is authorized for current active session
  function isCurrentPageAuthorized() {
    const role = getSessionRole();
    if (!role) return false;
    return isPagePermittedForRole(getCurrentPage(), role);
  }

  // Hide page content immediately if not yet authorized for current page
  let hideStyle = null;
  if (!isCurrentPageAuthorized()) {
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

  // Compute SHA-256 hash using Web Crypto API
  async function computeHash(pin) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode('SHE_VAULT_PIN_' + pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.warn('Web Crypto API issue, utilizing verification fallback', e);
      }
    }
    return null;
  }

  // Identify role matching entered PIN (via SHA-256 or plaintext fallback)
  async function identifyPinRole(pin) {
    const hash = await computeHash(pin);
    for (const [code, info] of Object.entries(PIN_CONFIG)) {
      if (hash && hash === info.hash) {
        return info.role;
      }
      if (!hash && pin === code) {
        return info.role;
      }
    }
    return null;
  }

  // Attach lock button to header on all pages (or floating badge if header is absent)
  function attachLockButton(role) {
    const existingBtn = document.getElementById('she-header-lock-btn');
    if (existingBtn) return;

    const currentRole = role || getSessionRole() || 'guest';
    const lockBtn = document.createElement('button');
    lockBtn.id = 'she-header-lock-btn';
    lockBtn.type = 'button';
    lockBtn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm backdrop-blur-sm cursor-pointer ml-auto';
    lockBtn.style.cssText = 'cursor: pointer; z-index: 50;';
    lockBtn.title = 'Lock SHE Vault';

    const roleBadge = currentRole === 'admin'
      ? '<span style="font-size: 0.65rem; background: rgba(226, 132, 88, 0.35); border: 1px solid rgba(226, 132, 88, 0.55); padding: 1px 6px; border-radius: 9999px; color: #F4D58D; font-weight: 700; text-transform: uppercase;">Admin</span>'
      : '<span style="font-size: 0.65rem; background: rgba(233, 154, 178, 0.25); border: 1px solid rgba(233, 154, 178, 0.45); padding: 1px 6px; border-radius: 9999px; color: #F8C8DC; font-weight: 700; text-transform: uppercase;">Guest</span>';

    lockBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
      <span>Lock</span>
      ${roleBadge}
    `;

    lockBtn.addEventListener('click', function () {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_ROLE_KEY);
      window.location.reload();
    });

    const header = document.querySelector('header');
    if (header) {
      header.appendChild(lockBtn);
    } else {
      // Floating lock control for headerless pages (e.g. floral.html)
      const floatWrap = document.createElement('div');
      floatWrap.id = 'she-floating-lock-wrap';
      floatWrap.style.cssText = 'position: fixed; top: 1rem; right: 1rem; z-index: 99999; display: flex; align-items: center; gap: 0.5rem;';
      floatWrap.appendChild(lockBtn);
      document.body.appendChild(floatWrap);
    }
  }

  // Build & Inject Lock Screen UI
  function initLockScreen() {
    if (document.getElementById('she-lock-overlay')) return;

    const currentPage = getCurrentPage();
    const existingSessionRole = getSessionRole();

    // Check if this page is admin-only
    const isAdminOnlyPage = !SELECTIVE_ALLOWED_PAGES.includes(currentPage);

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
      .she-pin-dot.warn {
        background: #F59E0B;
        border-color: #F59E0B;
        box-shadow: 0 0 12px #F59E0B;
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
      .she-quick-link:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
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

    const subtitleText = isAdminOnlyPage
      ? 'Protected Area • Admin PIN Required'
      : 'Protected Area • Enter 4-Digit PIN Access';

    const initialStatusText = existingSessionRole === 'selective' && isAdminOnlyPage
      ? '🔒 Session PIN (1006) is restricted. Enter Admin PIN.'
      : 'Enter PIN to unlock';

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
        <!-- Header Heart Icon -->
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
          margin: 0.4rem 0 1.25rem 0;
          line-height: 1.4;
        ">${subtitleText}</p>

        <!-- PIN Display Dots -->
        <div id="she-pin-dots-container" style="
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
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
        ">${initialStatusText}</div>

        <!-- Selective Navigation Suggestions (shown when 1006 visits restricted page) -->
        <div id="she-nav-suggestions" style="
          display: ${existingSessionRole === 'selective' && isAdminOnlyPage ? 'flex' : 'none'};
          flex-direction: column;
          width: 100%;
          margin-bottom: 1.25rem;
          background: rgba(248, 200, 220, 0.08);
          border: 1px solid rgba(248, 200, 220, 0.22);
          border-radius: 1.25rem;
          padding: 0.85rem;
          text-align: center;
          box-sizing: border-box;
        ">
          <div style="font-size: 0.72rem; color: #F4D58D; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700;">
            PIN 1006 has access to:
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <a href="1-month-book/index.html" class="she-quick-link" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 0.9rem; background: rgba(212, 175, 55, 0.22); border: 1px solid rgba(212, 175, 55, 0.45); border-radius: 9999px; color: #F4D58D; text-decoration: none; font-size: 0.78rem; font-weight: 600; transition: all 0.2s ease;">
              <span>📖 Open 1-Month Keepsake Book</span>
            </a>
            <a href="floral.html" class="she-quick-link" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 0.9rem; background: rgba(233, 154, 178, 0.2); border: 1px solid rgba(233, 154, 178, 0.4); border-radius: 9999px; color: #F8C8DC; text-decoration: none; font-size: 0.78rem; font-weight: 600; transition: all 0.2s ease;">
              <span>🌸 Open Floral Surprise</span>
            </a>
            <a href="feel-better.html" class="she-quick-link" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 0.9rem; background: rgba(184, 93, 56, 0.22); border: 1px solid rgba(184, 93, 56, 0.45); border-radius: 9999px; color: #F4D58D; text-decoration: none; font-size: 0.78rem; font-weight: 600; transition: all 0.2s ease;">
              <span>🤍 Open Feel Better Sanctuary</span>
            </a>
          </div>
        </div>

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
    if (isCurrentPageAuthorized()) return;

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

  function setStatus(msg, isError = false, isSuccess = false, isWarn = false) {
    const msgEl = document.getElementById('she-status-msg');
    if (!msgEl) return;
    msgEl.textContent = msg;
    if (isError) {
      msgEl.style.color = '#F87171';
    } else if (isSuccess) {
      msgEl.style.color = '#34D399';
    } else if (isWarn) {
      msgEl.style.color = '#FBBF24';
    } else {
      msgEl.style.color = 'rgba(248, 200, 220, 0.85)';
    }
  }

  function showNavSuggestions() {
    const navEl = document.getElementById('she-nav-suggestions');
    if (navEl) {
      navEl.style.display = 'flex';
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

      const role = await identifyPinRole(enteredPin);
      const currentPage = getCurrentPage();

      if (role) {
        // PIN is valid: Check if current page is allowed for this role
        const allowed = isPagePermittedForRole(currentPage, role);

        if (allowed) {
          // SUCCESSFUL AUTHENTICATION
          updateDots('success');
          const successMsg = role === 'admin'
            ? '✨ Admin Access Granted! Opening...'
            : '🌸 Access Granted! Opening...';
          setStatus(successMsg, false, true);

          localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
          sessionStorage.setItem(AUTH_KEY, 'authenticated_valid_she_access_v2');
          sessionStorage.setItem(AUTH_ROLE_KEY, role);

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
                attachLockButton(role);
              }, 400);
            }
          }, 400);
        } else {
          // RESTRICTED PIN (e.g. 1006 entered on admin-only page like love.html or index.html)
          updateDots('warn');
          const card = document.getElementById('she-lock-card');
          if (card) {
            card.classList.remove('she-shake');
            void card.offsetWidth;
            card.classList.add('she-shake');
          }

          // Do NOT penalize lockout for using valid selective PIN
          setStatus('🔒 PIN 1006 is restricted.', false, false, true);
          showNavSuggestions();

          setTimeout(() => {
            enteredPin = '';
            updateDots();
            isChecking = false;
          }, 1200);
        }
      } else {
        // INVALID PIN (failed attempt)
        updateDots('error');
        const card = document.getElementById('she-lock-card');
        if (card) {
          card.classList.remove('she-shake');
          void card.offsetWidth;
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

  // Initialize Lock UI or Lock Button based on authorization status
  if (!isCurrentPageAuthorized()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLockScreen);
    } else {
      initLockScreen();
    }
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => attachLockButton());
    } else {
      attachLockButton();
    }
  }
})();
