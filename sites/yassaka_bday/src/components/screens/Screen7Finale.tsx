import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sfx } from '../../utils/audio';
import { fireGrandFinaleConfetti } from '../../utils/confetti';
import { RippedPaperCard } from '../RippedPaperCard';
import { Sparkles, Wind, Flame, RotateCcw, Heart, Copy, Check } from 'lucide-react';

interface Screen7FinaleProps {
  candleLit: boolean;
  candleBlown: boolean;
  onUpdateCandle: (lit: boolean, blown: boolean) => void;
  onReplay?: () => void;
}

export const Screen7Finale: React.FC<Screen7FinaleProps> = ({
  candleLit = true,
  candleBlown = false,
  onUpdateCandle,
  onReplay,
}) => {
  const [isLit, setIsLit] = useState(candleBlown ? false : true);
  const [isBlown, setIsBlown] = useState(candleBlown);
  const [showLetter, setShowLetter] = useState(candleBlown);
  const [copied, setCopied] = useState(false);
  const [isBlowingMode, setIsBlowingMode] = useState(false);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [breathLevel, setBreathLevel] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blowProgressRef = useRef(0);
  const isExtinguishingRef = useRef(false);

  const stopListening = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsBlowingMode(false);
    setBreathLevel(0);
    blowProgressRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const triggerBlow = useCallback(() => {
    if (isExtinguishingRef.current || isBlown) return;
    isExtinguishingRef.current = true;
    stopListening();

    sfx.candleBlow();
    setIsBlown(true);
    setIsLit(false);
    onUpdateCandle(false, true);

    setTimeout(() => {
      fireGrandFinaleConfetti();
      setShowLetter(true);
      isExtinguishingRef.current = false;
    }, 600);
  }, [isBlown, onUpdateCandle, stopListening]);

  // Interactive animated blow countdown when microphone is not accessible (e.g. mobile HTTP / file://)
  const startInteractiveBlow = useCallback(() => {
    let elapsed = 0;
    const duration = 2800;
    const interval = 50;
    setCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      elapsed += interval;
      const progress = elapsed / duration;
      const flicker = Math.sin(elapsed / 100) * 0.15 + progress * 0.85;
      setBreathLevel(Math.min(1, Math.max(0.2, flicker)));

      const secondsRemaining = Math.max(1, Math.ceil((duration - elapsed) / 1000));
      setCountdown(secondsRemaining);

      if (elapsed >= duration) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        triggerBlow();
      }
    }, interval);
  }, [triggerBlow]);

  const handleStartBlow = async () => {
    if (isBlown || isBlowingMode) return;

    isExtinguishingRef.current = false;
    blowProgressRef.current = 0;
    setIsBlowingMode(true);
    setBreathLevel(0.15);

    // Initialize AudioContext synchronously during user gesture for iOS Safari compatibility
    let audioCtx: AudioContext | null = null;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
        audioContextRef.current = audioCtx;
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }

    const canUseMic =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';

    if (canUseMic) {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        streamRef.current = stream;
        setHasMic(true);

        if (!audioCtx) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
        }

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.2;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const freqData = new Uint8Array(analyser.frequencyBinCount);
        const timeData = new Uint8Array(analyser.fftSize);

        const checkMic = () => {
          if (isExtinguishingRef.current) return;

          analyser.getByteFrequencyData(freqData);
          analyser.getByteTimeDomainData(timeData);

          let lowSum = 0;
          const lowBins = Math.min(6, freqData.length);
          for (let i = 0; i < lowBins; i++) {
            lowSum += freqData[i];
          }
          const lowAvg = lowSum / lowBins;

          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const norm = (timeData[i] - 128) / 128;
            sumSquares += norm * norm;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);

          const lowScore = Math.max(0, (lowAvg - 22) / 50);
          const rmsScore = Math.max(0, (rms - 0.10) / 0.25);
          const currentBlow = Math.min(Math.max(lowScore * 0.65 + rmsScore * 0.35, 0), 1);

          if (currentBlow > 0.35) {
            blowProgressRef.current += 0.25;
            if (blowProgressRef.current >= 1.0) {
              triggerBlow();
              return;
            }
          } else {
            blowProgressRef.current = Math.max(0, blowProgressRef.current - 0.04);
          }

          setBreathLevel(Math.max(currentBlow, blowProgressRef.current));
          animFrameRef.current = requestAnimationFrame(checkMic);
        };

        animFrameRef.current = requestAnimationFrame(checkMic);
        return;
      } catch (err) {
        console.warn('Microphone permission or hardware unavailable:', err);
      }
    }

    // Fallback: If microphone is not accessible, wait with an animated countdown & flame flutter
    setHasMic(false);
    startInteractiveBlow();
  };

  const handleLight = () => {
    stopListening();
    sfx.candleLight();
    setIsLit(true);
    setIsBlown(false);
    setShowLetter(false);
    onUpdateCandle(true, false);
  };

  const letterText = `Happy 30th Birthday, Yasakkaaa! 🎂❤️

An official birthday letter from your brother (vera yaaru naantha)

Halloooo Yasakkaaa! 😂❤️

A random reel scroll somehow reminded me of you and Rheanyra, and then it hit me — Adei, Yasakka is turning 30! its time for kids to give you the bus seat ka. Don't worry, Age it just a number until your back starts hurting for no reason :)

But jokes apart, there's something I've always wanted to tell you.

You know ? The way you receive my art ( art maathiri ). Whether it's a song, a podcast, some random lyrics, a story, or a painting — you don't just see it and move on. You actually enjoy it. You listen, you react, you appreciate it, and sometimes the way you respond makes me feel like you're my 1st audience. 🥹

And honestly, akka, I'm a big fan of that. Not just because you appreciate what I make, but because I get to see someone genuinely enjoy something that came from my head and heart. You make me want to keep creating more things, keep exploring, and keep sharing those random bits of me with the world. So, thank you for being someone who keeps my little creative payanam alive. ❤️

And there's another thing about you that I really admire. You're one of those people who can help someone feel a little more human when life has completely broken them down. Sometimes, when a person is hurting, they don't need a lecture or someone to fix their entire life. They just need someone who understands, listens, and helps them find a little hope again. And akka, when it comes to healing a broken person, you're almost GOD-level.

I hope you know how special that quality is. The world has enough people who know how to point out what's broken. People who can help someone believe they're not beyond repair? Those people are rare.

And then there's Rheanyra. 🥹

Akka, the way you raise her deserves to be a book. Seriously. Someone should document all those little moments, the patience, the love, the things you teach her, and all the ways you're helping her grow into her own little person. One day, when she's older, I hope she realises just how much love has been quietly shaping her world all along.

You're not just raising a daughter, akka. You're building a little human's understanding of what love, safety, kindness, and home feel like. And I think that's one of the most beautiful things a person can do. Rheanyra is lucky to have you as her mom. ❤️

Now, before you start blaming your thambi for making you light'a emotional on your birthday, let me stop here. i have told you many things about you.... but these things i think i didnt express it much before

For your 30s, I wish you more reasons to laugh until your stomach hurts, more time for the things you love, more peaceful days, more adventures with Rheanyra, and more moments where you look at your life and think, "Yeah, this is nice."

I hope you keep being the person who heals people, the mom who fills her little one's world with love, the akka who makes us feel warm and loved and the fan who makes a mokka creator feel like his art is worth sharing.

And please, in between taking care of everyone else, remember to take care of Yaswanthi, too. She deserves that same love. ❤️

Happy 30th birthday, Yasakkaaa! 🎂

Have the loveliest year ahead. Give Rheanyra and hariesh anna lots of love and you both take my love and kisses from me, and tell her that her amma is pretty awesome. (She'll probably figure that out herself. 😂)

Always smart, occasionally sensible, forever your brother,

Ugesh 🫂❤️`;

  const handleCopyLetter = () => {
    sfx.pop();
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-8 relative text-[#2B211E]">
      {/* Warm Ambient Candlelight Spotlight around cake */}
      {isLit && (
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
          style={{
            background:
              'radial-gradient(circle at 50% 28%, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.09) 45%, transparent 75%)',
          }}
        />
      )}

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header & Instructions */}
        <div className="text-center mb-6">
          <div className="gold-foil-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-[#2B211E] bg-white/90 border border-[#D4AF37]/35 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="font-serif text-sm tracking-wide">
              Chapter 30 · The Candlelit Finale
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-tight tracking-tight text-[#2B211E]">
            The Grand 30th Candle Wish 🎂
          </h1>

          {/* Prominent Directive to Blow Candle */}
          <div
            className={`mt-2.5 py-1.5 px-5 rounded-full inline-block font-serif text-base sm:text-lg transition-all ${
              isLit
                ? 'bg-[#C59B27]/15 text-[#785918] border border-[#D4AF37]/45 animate-pulse shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
            }`}
          >
            {!isBlown ? (
              isBlowingMode ? (
                <span>🌬️ Ippo Nalla Oothunga! Blow onto your screen or mic 💨</span>
              ) : (
                <span>🕯️ Blow the candle to reveal your birthday letter! 💌</span>
              )
            ) : (
              <span>✨ Wish sent into the universe! Scroll down for your letter 📜</span>
            )}
          </div>
        </div>

        {/* Enhanced Artisanal Keepsake Cake with Burning '30' Candle */}
        <div className="relative mx-auto w-84 sm:w-98 h-[340px] flex flex-col items-center justify-end mb-8 select-none">
          
          {/* Flame & Smoke Container */}
          <div className="relative mb-2 flex flex-col items-center z-30">
            {isLit && (
              <div
                className="relative flex flex-col items-center transition-transform duration-75"
                style={{
                  transform:
                    breathLevel > 0.05
                      ? `scale(${Math.max(0.4, 1 - breathLevel * 0.6)}, ${Math.max(0.4, 1 - breathLevel * 0.5)}) skewX(${(breathLevel * 28).toFixed(1)}deg)`
                      : undefined,
                  opacity: breathLevel > 0.1 ? Math.max(0.35, 1 - breathLevel * 0.6) : 1,
                }}
              >
                <div className="absolute -inset-5 bg-[#C59B27]/40 blur-xl rounded-full animate-pulse" />
                <div className="w-8 h-13 bg-gradient-to-t from-[#A25B50] via-[#FBBF24] to-[#FFFBEB] rounded-full animate-candle-flame" />
                <div className="absolute bottom-1 w-3.5 h-6 bg-white/95 rounded-full blur-[0.5px]" />
              </div>
            )}

            {isBlown && (
              <div className="animate-smoke flex flex-col items-center text-neutral-400">
                <span className="text-2xl opacity-75">💨</span>
                <span className="text-xs font-serif italic text-[#C59B27]">wish sent ✨</span>
              </div>
            )}

            <div className="w-1 h-3.5 bg-neutral-800 rounded-t" />
          </div>

          {/* Royal Sculpted "30" Candle with Gilded Bevels & Crowns */}
          <div className="relative flex items-center justify-center gap-3 z-30 -mb-2 drop-shadow-xl">
            <div className="relative group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-[#C59B27] filter drop-shadow">👑</span>
              <div className="px-4.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FFFDF5] via-[#F3D58C] to-[#B38728] text-[#24130A] font-serif font-black text-3xl sm:text-4xl shadow-[0_6px_20px_rgba(212,175,55,0.4)] border-2 border-[#FFF9E6] tracking-wider transform -rotate-1 hover:rotate-0 transition-transform">
                3
              </div>
            </div>
            <div className="relative group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-[#C59B27] filter drop-shadow">👑</span>
              <div className="px-4.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FFFDF5] via-[#F3D58C] to-[#B38728] text-[#24130A] font-serif font-black text-3xl sm:text-4xl shadow-[0_6px_20px_rgba(212,175,55,0.4)] border-2 border-[#FFF9E6] tracking-wider transform rotate-1 hover:rotate-0 transition-transform">
                0
              </div>
            </div>
          </div>

          {/* Top Royal Tier (Ivory Silk Velvet & French Berry Patisserie) */}
          <div className="w-56 sm:w-64 h-24 bg-gradient-to-b from-[#FFFDF9] via-[#FDF5EB] to-[#F5E6D3] rounded-t-3xl border-2 border-[#EAD5AA] shadow-lg relative overflow-hidden flex flex-col justify-between pt-1.5 z-20">
            {/* Scalloped Gourmet Toppings (Glazed Berries, Gold Flakes & Blossom) */}
            <div className="flex items-center justify-around px-3 text-lg z-10">
              <span className="filter drop-shadow hover:scale-125 transition-transform cursor-pointer">🍓</span>
              <span className="text-[11px] text-[#D4AF37] font-bold animate-pulse">✦</span>
              <span className="filter drop-shadow hover:scale-125 transition-transform cursor-pointer">🫐</span>
              <span className="text-xs text-[#E6C675] animate-pulse delay-200">✨</span>
              <span className="filter drop-shadow hover:scale-125 transition-transform cursor-pointer">🍓</span>
              <span className="text-[11px] text-[#D4AF37] font-bold animate-pulse delay-500">✦</span>
              <span className="filter drop-shadow hover:scale-125 transition-transform cursor-pointer">🌸</span>
            </div>

            {/* Draped Champagne White-Chocolate Glaze Drippings */}
            <div className="w-full relative py-0.5">
              <div className="w-full h-2 bg-gradient-to-r from-white via-[#FFF8EB] to-white opacity-95 shadow-xs" />
              {/* Dripping Glaze Drops */}
              <div className="flex justify-around px-4 -mt-0.5">
                <div className="w-2.5 h-3 bg-white rounded-b-full shadow-xs" />
                <div className="w-3 h-4 bg-white rounded-b-full shadow-xs" />
                <div className="w-2 h-2.5 bg-white rounded-b-full shadow-xs" />
                <div className="w-3.5 h-5 bg-white rounded-b-full shadow-xs" />
                <div className="w-2.5 h-3 bg-white rounded-b-full shadow-xs" />
                <div className="w-3 h-4 bg-white rounded-b-full shadow-xs" />
              </div>
            </div>

            {/* Gilded Pearl Piping Border along base of top tier */}
            <div className="w-full flex justify-center gap-1.5 pb-1 z-10">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-b from-[#FFFDF5] via-[#FFF3D1] to-[#E6C675] shadow-xs border border-[#D4AF37]/40"
                />
              ))}
            </div>
          </div>

          {/* Regal Gold Ribbon Band with Filigree Emblem Separator */}
          <div className="w-64 sm:w-72 h-5 bg-gradient-to-r from-[#B38728] via-[#FBEBB5] to-[#B38728] rounded-md shadow-md border-y border-[#FFF5D6] relative z-25 flex items-center justify-center -my-1">
            <span className="text-[10px] tracking-widest text-[#5A3E09] font-serif font-bold flex items-center gap-2">
              ✦ ⚜ · ROYAL JUBILEE · ⚜ ✦
            </span>
          </div>

          {/* Bottom Cake Tier (Grand Palace Tier with Quilted Fondant & Royal Plaque) */}
          <div className="w-76 sm:w-88 h-30 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#EBDCC3] rounded-2xl border-2 border-[#D4AF37]/70 shadow-2xl relative overflow-hidden flex flex-col justify-between p-2.5 z-10">
            {/* Subtle Royal Diamond Lattice / Quilted Fondant Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#C59B27 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px'
            }} />

            {/* Top Filigree Accent Border */}
            <div className="w-full flex items-center justify-between px-4 text-[#D4AF37] text-xs z-10">
              <span>⚜</span>
              <div className="h-[1px] flex-1 mx-2 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              <span className="text-[10px] tracking-widest uppercase font-serif font-medium text-[#8F6A18]">Chapter 30</span>
              <div className="h-[1px] flex-1 mx-2 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              <span>⚜</span>
            </div>

            {/* Grand Royal Inscription Plaque (Replaced Dr. Yasakka 3.0 with Yassakka 3.0) */}
            <div className="relative z-10 mx-auto px-6 sm:px-8 py-1.5 rounded-full bg-gradient-to-r from-[#200D30] via-[#351542] to-[#200D30] border-2 border-[#E6C675] shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center justify-center">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#FDF3D1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                <span className="text-[#F3D58C]">👑</span>
                <span>Yassakka 3.0</span>
                <span className="text-[#F3D58C]">👑</span>
              </span>
            </div>

            {/* Royal French Shell Border with Edible Gold Beads along the base */}
            <div className="w-full flex justify-center gap-1 z-10 pt-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-3 rounded-t-full bg-gradient-to-b from-white via-[#FFF8E7] to-[#E6C675] border border-[#D4AF37]/50 shadow-xs flex items-start justify-center pt-0.5"
                >
                  <div className="w-1 h-1 rounded-full bg-[#B88E28]" />
                </div>
              ))}
            </div>
          </div>

          {/* Ornate Royal Palace Pedestal Stand */}
          <div className="w-84 sm:w-98 h-6 bg-gradient-to-r from-[#967114] via-[#FFF3D1] to-[#785918] rounded-full shadow-xl border-2 border-[#FFE8A3] relative z-0 flex items-center justify-center">
            <div className="w-4/5 h-1.5 bg-white/70 rounded-full blur-[0.5px]" />
          </div>
          <div className="w-40 h-4 bg-gradient-to-b from-[#C59B27] via-[#967114] to-[#5C430B] shadow-md border-x-2 border-[#D4AF37]/60" />
          <div className="w-60 h-4 bg-gradient-to-r from-[#785918] via-[#E6C675] to-[#785918] rounded-b-3xl shadow-2xl border-2 border-[#D4AF37]/80" />
          
          {/* Ambient Warm Golden Ground Glow */}
          <div className="w-80 h-4 bg-[#D4AF37]/25 blur-lg rounded-full mt-0.5" />
        </div>

        {/* Blow Controls */}
        {!isBlown && (
          <div className="flex flex-col items-center gap-3.5 mb-8 animate-in zoom-in-95">
            {!isBlowingMode ? (
              <>
                <button
                  type="button"
                  onClick={handleStartBlow}
                  className="py-4 px-8 sm:px-12 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#CA8A04] hover:from-[#C59B27] hover:to-[#B45309] text-[#200D30] font-sans-body font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_14px_40px_rgba(212,175,55,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer border-2 border-white/80"
                >
                  <Wind className="w-5 h-5 text-[#200D30]" />
                  <span>Button'a click pantu, Oothunga</span>
                  <span className="text-xl">🎂💨</span>
                </button>
                <p className="text-xs font-serif italic text-neutral-500 text-center">
                  Make a silent 30th birthday wish, click the button, and blow! ✨
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={triggerBlow}
                  className="py-3.5 px-7 sm:px-9 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#E11D48] text-white font-sans-body font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(245,158,11,0.6)] border-2 border-white flex items-center gap-3 animate-pulse active:scale-95 transition-transform cursor-pointer"
                >
                  <Wind className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  <span>Ippo Nalla Oothunga! 💨</span>
                  <span className="text-xl">🌬️</span>
                </button>

                {/* Live breath meter bar */}
                <div className="w-64 sm:w-72 flex flex-col items-center gap-1.5 mt-1">
                  <div className="w-full h-3.5 bg-black/10 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-inner p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#F59E0B] via-[#E11D48] to-[#9333EA] rounded-full transition-all duration-75"
                      style={{ width: `${Math.max(10, Math.min(100, Math.round(breathLevel * 100)))}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-serif text-[#785918] italic font-medium">
                    {hasMic
                      ? breathLevel > 0.35
                        ? '💨 Wind detected! Keep blowing...'
                        : '🎙️ Blow into your phone mic now!'
                      : `🌬️ Blowing... (${countdown}s) or tap below when done!`}
                  </span>
                </div>

                <p className="text-xs font-serif italic text-neutral-500 text-center">
                  Make your 30th birthday wish and blow towards the screen/mic! ✨
                </p>

                {/* Instant finish button */}
                <button
                  type="button"
                  onClick={triggerBlow}
                  className="text-xs font-sans-body text-[#785918] hover:text-[#2B211E] underline underline-offset-4 decoration-dotted cursor-pointer mt-1 transition-colors font-medium"
                >
                  Oothiyachu! Tap to reveal letter 💌
                </button>
              </div>
            )}
          </div>
        )}

        {/* When blown: Sibling Banter Alert */}
        {isBlown && (
          <div className="space-y-4 mb-8 animate-in fade-in">
            <div className="bg-[#FAF3E8]/95 border border-[#C59B27]/40 text-[#2B211E] rounded-2xl p-4 text-center font-serif text-base sm:text-lg shadow-sm italic">
              “AYYOOO, Wish enna nu kekkave illaye?! 😂 Seri seri, wish'a ulla vachukonga... Universe will make it happen! ✨”
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleLight}
                className="py-2 px-4 rounded-full bg-white/95 border border-[#D4AF37]/35 text-[#2B211E] font-sans-body text-xs hover:bg-[#FAF3E8] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs font-medium"
              >
                <Flame className="w-3.5 h-3.5 text-[#C59B27]" /> Re-light Candle 🕯️
              </button>
              <button
                onClick={() => {
                  sfx.tada();
                  fireGrandFinaleConfetti();
                }}
                className="py-2 px-4 rounded-full bg-[#2B211E] text-[#FAF6F0] font-sans-body text-xs hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border border-[#D4AF37]/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Celebration Confetti! 🎉
              </button>
            </div>
          </div>
        )}

        {/* The Climax Birthday Letter in Authentic Ripped Paper Effect */}
        {showLetter && (
          <RippedPaperCard
            paperColor="#FFFDF9"
            tapeColor="vellum"
            tapePosition="top-left"
            bottomTapeColor="gold"
            bottomTapePosition="bottom-right"
            className="mb-10 animate-in slide-in-from-bottom-8 duration-700"
            innerClassName="p-7 sm:p-11"
          >
            <div className="text-center mb-7">
              <span className="text-2xl mb-1 inline-block">📜✨</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2B211E] font-medium tracking-tight mt-1">
                Happy 30th Birthday, Yasakkaaa! 🎂❤️
              </h2>
              <span className="font-serif italic text-sm text-[#6E615D]">
                An official birthday letter from your brother (vera yaaru naantha)
              </span>
            </div>

            <div className="space-y-4 font-serif text-[#2B211E] text-lg sm:text-xl leading-relaxed whitespace-pre-line text-left">
              <p className="font-serif text-2xl font-semibold text-[#2B211E]">
                Halloooo Yasakkaaa! 😂❤️
              </p>

              <p>
                A random reel scroll somehow reminded me of you and Rheanyra, and then it hit me — Adei, Yasakka is turning 30! its time for kids to give you the bus seat ka. Don't worry, Age it just a number until your back starts hurting for no reason :)
              </p>

              <p className="font-semibold text-[#2B211E]">
                But jokes apart, there's something I've always wanted to tell you.
              </p>

              <p>
                You know ? The way you receive my art ( art maathiri ). Whether it's a song, a podcast, some random lyrics, a story, or a painting — you don't just see it and move on. You actually enjoy it. You listen, you react, you appreciate it, and sometimes the way you respond makes me feel like you're my 1st audience. 🥹
              </p>

              <p>
                And honestly, akka, I'm a big fan of that. Not just because you appreciate what I make, but because I get to see someone genuinely enjoy something that came from my head and heart. You make me want to keep creating more things, keep exploring, and keep sharing those random bits of me with the world. So, thank you for being someone who keeps my little creative payanam alive. ❤️
              </p>

              <p>
                And there's another thing about you that I really admire. You're one of those people who can help someone feel a little more human when life has completely broken them down. Sometimes, when a person is hurting, they don't need a lecture or someone to fix their entire life. They just need someone who understands, listens, and helps them find a little hope again. And akka, when it comes to healing a broken person, you're almost GOD-level.
              </p>

              <p>
                I hope you know how special that quality is. The world has enough people who know how to point out what's broken. People who can help someone believe they're not beyond repair? Those people are rare.
              </p>

              <p className="font-serif text-2xl font-semibold text-[#A25B50]">
                And then there's Rheanyra. 🥹
              </p>

              <p>
                Akka, the way you raise her deserves to be a book. Seriously. Someone should document all those little moments, the patience, the love, the things you teach her, and all the ways you're helping her grow into her own little person. One day, when she's older, I hope she realises just how much love has been quietly shaping her world all along.
              </p>

              <p>
                You're not just raising a daughter, akka. You're building a little human's understanding of what love, safety, kindness, and home feel like. And I think that's one of the most beautiful things a person can do. Rheanyra is lucky to have you as her mom. ❤️
              </p>

              <p>
                Now, before you start blaming your thambi for making you light'a emotional on your birthday, let me stop here. i have told you many things about you.... but these things i think i didnt express it much before
              </p>

              <p>
                For your 30s, I wish you more reasons to laugh until your stomach hurts, more time for the things you love, more peaceful days, more adventures with Rheanyra, and more moments where you look at your life and think, "Yeah, this is nice."
              </p>

              <p>
                I hope you keep being the person who heals people, the mom who fills her little one's world with love, the akka who makes us feel warm and loved and the fan who makes a mokka creator feel like his art is worth sharing.
              </p>

              <p className="font-semibold text-[#A25B50]">
                And please, in between taking care of everyone else, remember to take care of Yaswanthi, too. She deserves that same love. ❤️
              </p>

              <p className="font-serif text-3xl font-medium text-[#2B211E] pt-2">
                Happy 30th birthday, Yasakkaaa! 🎂
              </p>

              <p>
                Have the loveliest year ahead. Give Rheanyra and hariesh anna lots of love and you both take my love and kisses from me, and tell her that her amma is pretty awesome. (She'll probably figure that out herself. 😂)
              </p>

              <div className="pt-4 text-right">
                <p className="font-serif italic text-base text-[#6E615D]">
                  Always smart, occasionally sensible, forever your brother,
                </p>
                <p className="font-serif text-3xl text-[#2B211E] font-medium mt-1">
                  Ugesh 🫂❤️
                </p>
              </div>
            </div>

            {/* Sibling Letter Action Bar */}
            <div className="mt-8 pt-5 border-t border-[#D4AF37]/20 flex items-center justify-center">
              <button
                onClick={handleCopyLetter}
                className="px-5 py-2.5 rounded-full bg-white/95 border border-[#D4AF37]/35 text-[#2B211E] font-sans-body text-xs sm:text-sm hover:bg-[#FAF3E8] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied with love!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Copy Letter</span>
                  </>
                )}
              </button>
            </div>
          </RippedPaperCard>
        )}

        {/* Replay Option */}
        <div className="text-center pt-2 pb-12">
          {onReplay && (
            <button
              onClick={() => {
                sfx.pop();
                onReplay();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 border border-[#D4AF37]/35 text-[#6E615D] hover:text-[#2B211E] hover:bg-[#FAF3E8] font-serif text-sm sm:text-base shadow-xs transition-all cursor-pointer mb-6"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Replay this Little Universe ↻</span>
            </button>
          )}

          <p className="font-serif italic text-lg sm:text-xl text-[#6E615D] flex items-center justify-center gap-1.5">
            <span>Made with love by Ugesh</span>
            <Heart className="w-4 h-4 text-[#C59B27] fill-[#C59B27] inline" />
          </p>
          <p className="font-sans-body text-xs text-[#6E615D]/70 mt-1 font-light">
            Dr. Yashwanthi · Chapter 30 · Rhaenyra's Supermom · Yassakka 3.0
          </p>
        </div>
      </div>
    </div>
  );
};
