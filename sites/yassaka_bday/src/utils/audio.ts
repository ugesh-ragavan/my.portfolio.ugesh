/**
 * Inline Web Audio synthesizer engine for Yasakka's Birthday Universe.
 * Soft acoustic wooden taps, shimmering harp cascades, and glass wind chimes.
 * 100% locally synthesized, zero broken external links.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('yasakka_sfx_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('yasakka_sfx_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.pop();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('yasakka_sfx_muted', String(muted));
  }

  /**
   * Soft wooden tap / velvet click
   */
  public pop() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Shimmering glass wind chime / celeste harmonic reveal
   */
  public chime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // E6, G#6, B6, E7 glass chime frequencies
    const notes = [1318.51, 1661.22, 1975.53, 2637.02];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(8, now);

      osc.type = 'sine';
      const noteTime = now + idx * 0.055;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.08, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.9);
    });
  }

  /**
   * Shimmering harp arpeggio cascade when a chapter or lock clears
   */
  public unlock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Pentatonic harp sweep (C5, D5, E5, G5, A5, C6, E6, G6)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51, 1567.98];
    const now = ctx.currentTime;

    scale.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now);

      osc.type = 'sine';
      const startTime = now + i * 0.065;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  /**
   * Gentle wooden resonance for incorrect attempt
   */
  public buzz() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(105, now + 0.12);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Warm orchestral celebration chime chord progression
   */
  public tada() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [
      { delay: 0.0, notes: [329.63, 392.00, 523.25], duration: 0.25, vol: 0.08 },
      { delay: 0.22, notes: [349.23, 440.00, 523.25, 659.25], duration: 0.3, vol: 0.1 },
      { delay: 0.52, notes: [392.00, 493.88, 587.33, 783.99], duration: 0.35, vol: 0.12 },
      { delay: 0.85, notes: [523.25, 659.25, 783.99, 1046.50, 1318.51], duration: 1.4, vol: 0.15 },
    ];

    chords.forEach(({ delay, notes, duration, vol }) => {
      const startTime = now + delay;
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, startTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(vol / notes.length, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    });
  }

  /**
   * Gentle match strike and warm low-pass tone
   */
  public candleLight() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    oscGain.gain.setValueAtTime(0.06, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);

    const bufferSize = Math.floor(ctx.sampleRate * 0.2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.22);
  }

  /**
   * Breath/wind puff followed by warm celebration chimes
   */
  public candleBlow() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const puffDuration = 0.55;
    const bufferSize = Math.floor(ctx.sampleRate * puffDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const puffSource = ctx.createBufferSource();
    puffSource.buffer = buffer;

    const puffFilter = ctx.createBiquadFilter();
    puffFilter.type = 'bandpass';
    puffFilter.frequency.setValueAtTime(500, now);
    puffFilter.frequency.exponentialRampToValueAtTime(220, now + puffDuration);
    puffFilter.Q.setValueAtTime(1.2, now);

    const puffGain = ctx.createGain();
    puffGain.gain.setValueAtTime(0.01, now);
    puffGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    puffGain.gain.exponentialRampToValueAtTime(0.001, now + puffDuration);

    puffSource.connect(puffFilter);
    puffFilter.connect(puffGain);
    puffGain.connect(ctx.destination);

    puffSource.start(now);
    puffSource.stop(now + puffDuration);

    setTimeout(() => {
      this.chime();
    }, 450);
    setTimeout(() => {
      this.tada();
    }, 680);
  }

  public tap() {
    this.pop();
  }
}

export const sfx = new SoundEngine();
