// Retro Gamified Audio Synthesizer Engine
// Procedural audio chimes and fanfares utilizing the browser's native Web Audio API.

const GameAudio = {
  ctx: null,
  isMuted: localStorage.getItem('game_muted') === 'true',

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('game_muted', this.isMuted);
    window.dispatchEvent(new CustomEvent('game_mute_toggled', { detail: this.isMuted }));
    return this.isMuted;
  },

  createGainNode(duration, volume = 0.1) {
    if (!this.ctx) return null;
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(this.isMuted ? 0 : volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    return gain;
  },

  playTick() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.02, 0.03);
    if (!gain) return;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  },

  playSelect() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.12, 0.06);
    if (!gain) return;

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(900, now + 0.04);
    osc.frequency.setValueAtTime(1350, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.12);
  },

  playTalk() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.06, 0.04);
    if (!gain) return;

    osc.type = 'triangle';
    // Randomize the tone pitch slightly to simulate 8-bit text dialogue speaking
    const baseFreq = 500 + Math.random() * 400;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  },

  playLevelUp() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale arpeggio
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.createGainNode(0.35, 0.07);
        if (!osc || !gain) return;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      }, idx * 75);
    });
  },

  playWater() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Bubble sound sweep up
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.18, 0.08);
    if (!osc || !gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(10, now);
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.18);

    // Follow-up second bubble tone
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.createGainNode(0.2, 0.06);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.2);
      
      const filter2 = this.ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.Q.setValueAtTime(8, this.ctx.currentTime);
      filter2.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter2.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.2);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(this.ctx.currentTime + 0.2);
    }, 90);
  },

  playReboot() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.4;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(duration, 0.1);
    if (!osc || !gain) return;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(100, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + duration);
  }
};

document.addEventListener('click', () => GameAudio.init(), { once: true });
document.addEventListener('keydown', () => GameAudio.init(), { once: true });
