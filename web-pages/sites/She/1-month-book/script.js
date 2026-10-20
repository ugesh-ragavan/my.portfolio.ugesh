/**
 * ═══════════════════════════════════════════════════════════════════════
 * OUR FIRST CHAPTER — 3D PHYSICAL STORYBOOK ENGINE
 * Powered by St.PageFlip with Side-by-Side Spreads & Adaptive Centering
 * ═══════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookEl = document.getElementById('book');
  const bookScaler = document.getElementById('book-scaler');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const zoomBtn = document.getElementById('zoom-btn');
  const zoomText = document.getElementById('zoom-text');
  const readAgainBtn = document.getElementById('read-again-btn');
  const ambientCanvas = document.getElementById('ambient-canvas');

  // Book Dimensions (Per Page)
  const PAGE_WIDTH = 420;
  const PAGE_HEIGHT = 590;
  const OPEN_BOOK_WIDTH = PAGE_WIDTH * 2; // 840px
  const TOTAL_PAGES = 25; // 0 (front cover) to 24 (back cover)

  // State
  let currentPageIndex = 0;
  let isSoundEnabled = true;
  let isZoomed = false;
  let audioCtx = null;
  let pageFlipInstance = null;

  // ═══════════════════════════════════════════════
  // WEB AUDIO SYNTHESIZER
  // ═══════════════════════════════════════════════
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cover Open Harmonious Chime (E4, G#4, B4, E5)
  function playCoverChime() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const freqs = [329.63, 415.30, 493.88, 659.25, 830.61];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const delay = idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.18, now + delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.25);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Realistic Paper Turn Rustle Sweep
  function playPaperRustle() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.35;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);
      filter.Q.setValueAtTime(1.8, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);

      whiteNoise.start(now);
      subOsc.start(now);
      whiteNoise.stop(now + 0.35);
      subOsc.stop(now + 0.18);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Book Close Sweet Harmony
  function playBookCloseSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const freqs = [783.99, 659.25, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const delay = idx * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.14, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.85);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Sound Button Toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundBtn.classList.toggle('active', !isSoundEnabled);
      if (soundIcon && soundText) {
        soundIcon.textContent = isSoundEnabled ? '🔔' : '🔕';
        soundText.textContent = isSoundEnabled ? 'Sound' : 'Muted';
      }
    });
  }

  // ═══════════════════════════════════════════════
  // ADAPTIVE VIEWPORT SCALER & COVER CENTERING
  // Keeps side-by-side spread intact on all devices!
  // ═══════════════════════════════════════════════
  function updateBookLayout(pageIndex = currentPageIndex) {
    if (!bookScaler) return;
    currentPageIndex = pageIndex;

    const isCover = pageIndex === 0;
    const isBackCover = pageIndex >= TOTAL_PAGES - 1;

    bookScaler.classList.toggle('is-cover', isCover);
    bookScaler.classList.toggle('is-open', !isCover && !isBackCover);
    bookScaler.classList.toggle('is-back-cover', isBackCover);

    const availW = window.innerWidth * (window.innerWidth < 600 ? 0.95 : 0.92);
    const availH = window.innerHeight * 0.90;

    let scale;
    let offsetX = 0;

    if (isCover) {
      offsetX = -PAGE_WIDTH / 2; // -210px centers the right-half cover
      scale = Math.min((availW * 0.90) / PAGE_WIDTH, availH / PAGE_HEIGHT);
      if (scale > 1.05) scale = 1.05;
    } else if (isBackCover) {
      offsetX = PAGE_WIDTH / 2; // +210px centers the left-half back cover
      scale = Math.min((availW * 0.90) / PAGE_WIDTH, availH / PAGE_HEIGHT);
      if (scale > 1.05) scale = 1.05;
    } else {
      offsetX = 0;
      scale = Math.min(availW / OPEN_BOOK_WIDTH, availH / PAGE_HEIGHT);
    }

    if (isZoomed) {
      scale = Math.max(scale * 1.55, 0.85);
    }

    bookScaler.style.transform = `scale(${scale}) translateX(${offsetX}px)`;
  }

  window.addEventListener('resize', () => updateBookLayout());

  // Reading Zoom Toggle
  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isZoomed = !isZoomed;
      zoomBtn.classList.toggle('active', isZoomed);
      if (zoomText) {
        zoomText.textContent = isZoomed ? 'Reset' : 'Zoom';
      }
      updateBookLayout();
    });
  }

  // ═══════════════════════════════════════════════
  // STPAGEFLIP INITIALIZATION
  // ═══════════════════════════════════════════════
  if (window.St && window.St.PageFlip && bookEl) {
    pageFlipInstance = new St.PageFlip(bookEl, {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      size: 'fixed',
      minWidth: 280,
      maxWidth: 600,
      minHeight: 400,
      maxHeight: 800,
      drawShadow: true,
      maxShadowOpacity: 0.65,
      showCover: true,
      usePortrait: false, // MANDATORY: Keeps side-by-side on mobile!
      autoSize: true,
      flippingTime: 850,
      mobileScrollSupport: false,
      swipeDistance: 35,
      clickEventForward: true,
      useMouseEvents: true,
      showPageCorners: true,
      disableFlipByClick: false,
    });

    const pages = document.querySelectorAll('.page');
    pageFlipInstance.loadFromHTML(pages);

    bookEl.style.display = 'block';
    updateBookLayout(0);

    // Event: Page Flip
    pageFlipInstance.on('flip', (e) => {
      initAudio();
      updateBookLayout(e.data);

      if (e.data === 0 || e.data === 1) {
        playCoverChime();
      } else {
        playPaperRustle();
      }

      // Sparkle burst at center
      setTimeout(() => {
        spawnSparkles(window.innerWidth * 0.5, window.innerHeight * 0.5);
      }, 400);
    });

    // Close Book & Read Again Ribbon Handler
    if (readAgainBtn) {
      readAgainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        initAudio();
        playBookCloseSound();
        pageFlipInstance.flip(0);
        updateBookLayout(0);
        spawnSparkles(window.innerWidth * 0.5, window.innerHeight * 0.5, 20);
      });
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      initAudio();
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        pageFlipInstance.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        pageFlipInstance.flipPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        pageFlipInstance.flip(0);
      }
    });
  }

  // Unlock Audio on First Click
  document.addEventListener('click', () => {
    initAudio();
  }, { once: true });

  // ═══════════════════════════════════════════════
  // SPARKLE BURST CELEBRATION
  // ═══════════════════════════════════════════════
  function spawnSparkles(originX, originY, count = 12) {
    const emojis = ['✨', '✦', '♡', '⭐', '🌸'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'sparkle-particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 30;
      const rot = (Math.random() - 0.5) * 120 + 'deg';

      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;
      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--rot', rot);
      el.style.color = Math.random() > 0.5 ? '#D4AF37' : '#F8C8DC';

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1250);
    }
  }

  // ═══════════════════════════════════════════════
  // AMBIENT DUST MOTES (CANVAS)
  // ═══════════════════════════════════════════════
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
      updateBookLayout();
    });

    const particlesCount = 38;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.12 - Math.random() * 0.3,
      radius: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.5 + 0.2,
      alpha: 0,
      phase: Math.random() * Math.PI * 2,
    }));

    function renderAmbient() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderAmbient);
    }
    renderAmbient();
  }
});
