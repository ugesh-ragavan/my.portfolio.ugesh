import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { WHEEL_PRIZES } from '../../data/wheelPrizes';
import { sounds } from '../../services/soundEffects';

export const SpinWheelScreen = () => {
  const { completeActivity, navigateTo, completedActivities } = useSession();
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);

  const numSegments = WHEEL_PRIZES.length;
  const segmentAngle = (2 * Math.PI) / numSegments;

  // Draw the wheel on canvas
  const drawWheel = (currentAngle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;

    ctx.clearRect(0, 0, width, height);

    // Draw outer golden ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFC72C';
    ctx.shadowColor = 'rgba(255, 199, 44, 0.4)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw segment slices
    WHEEL_PRIZES.forEach((prize, i) => {
      const angle = currentAngle + i * segmentAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + segmentAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border between segments
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw text & icon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = prize.textColor || '#FFFFFF';
      ctx.font = 'bold 13px Poppins, Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 3;

      // Prize title and icon
      ctx.fillText(`${prize.icon} ${prize.title}`, radius - 20, 5);
      ctx.restore();
    });

    // Outer decorative dots
    for (let d = 0; d < 18; d++) {
      const dotAngle = (d * (2 * Math.PI)) / 18;
      const dotX = centerX + (radius + 4) * Math.cos(dotAngle);
      const dotY = centerY + (radius + 4) * Math.sin(dotAngle);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // Inner Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E8449';
    ctx.fill();

    // Leaf emoji in center
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌿', centerX, centerY + 1);
  };

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  const spin = () => {
    if (isSpinning || completedActivities.spinWheel) return;

    setIsSpinning(true);
    sounds.playTap();

    // Choose random winning index (weighted slightly towards tasty shake samples / aloe shots)
    const winningIndex = Math.floor(Math.random() * numSegments);
    const selectedPrize = WHEEL_PRIZES[winningIndex];

    // Calculate target rotation
    // Pointer is at the top (angle -Math.PI / 2)
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const sliceMiddleAngle = winningIndex * segmentAngle + segmentAngle / 2;
    // We want (finalAngle + sliceMiddleAngle) % 2PI = -PI/2 (or 3PI/2)
    const targetAngle = (3 * Math.PI) / 2 - sliceMiddleAngle;
    const totalRotation = rotation + (extraSpins * 2 * Math.PI) + targetAngle - (rotation % (2 * Math.PI));

    const startTime = performance.now();
    const duration = 4000; // 4 seconds spin
    const startAngle = rotation;
    let lastTickAngle = startAngle;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startAngle + (totalRotation - startAngle) * ease;

      // Tick sound every sector passed
      if (Math.abs(current - lastTickAngle) > segmentAngle) {
        sounds.playWheelTick();
        lastTickAngle = current;
      }

      setRotation(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWonPrize(selectedPrize);

        // Generate voucher reward
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const reward = {
          title: selectedPrize.title,
          subtitle: selectedPrize.subtitle,
          code: `${selectedPrize.codePrefix}-${randomDigits}`,
          icon: selectedPrize.icon,
          tag: selectedPrize.tag,
          description: selectedPrize.description
        };

        // Complete activity and trigger confetti + reward modal
        setTimeout(() => {
          completeActivity('spinWheel', { prizeId: selectedPrize.id, prizeTitle: selectedPrize.title }, reward);
        }, 600);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => navigateTo('hub')}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-ink-muted hover:text-brand-deep bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-sm touch-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 border border-brand-gold/40 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>1 SPIN PER GUEST</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-ink">
          Spin & Win Wellness Wheel 🎡
        </h2>
        <p className="text-xs sm:text-sm text-brand-ink-muted mt-1">
          Tap the big button below to spin for free samples & exclusive stall vouchers!
        </p>
      </div>

      {/* Wheel Canvas Container with Pointer */}
      <div className="relative my-4 flex items-center justify-center">
        
        {/* Pointer Triangle Needle at top */}
        <div className="absolute -top-3 z-20 flex flex-col items-center drop-shadow-md">
          <div className="w-6 h-8 bg-gradient-to-b from-brand-gold to-amber-600 rounded-t-sm clip-pointer" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
          <div className="w-3.5 h-3.5 rounded-full bg-brand-deep border-2 border-white -mt-7 shadow-sm" />
        </div>

        {/* Canvas Wheel */}
        <div className="p-2 rounded-full bg-gradient-to-b from-amber-200 via-emerald-100 to-amber-300 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="rounded-full max-w-[290px] max-h-[290px] sm:max-w-[340px] sm:max-h-[340px]"
          />
        </div>
      </div>

      {/* Spin Button */}
      <div className="w-full max-w-xs mt-4">
        {completedActivities.spinWheel ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="font-heading font-bold text-sm text-brand-deep">
              ✅ Wheel Completed!
            </p>
            <p className="text-xs text-brand-ink-muted mt-0.5">
              Check your unlocked rewards on the Hub.
            </p>
          </div>
        ) : (
          <button
            onClick={spin}
            disabled={isSpinning}
            className={`w-full h-15 bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 hover:from-amber-500 hover:to-amber-400 text-brand-ink font-heading font-extrabold text-lg rounded-2xl shadow-soft-gold flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn ${
              isSpinning ? 'opacity-70 animate-pulse' : 'hover:scale-[1.02]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-900" />
            <span>{isSpinning ? 'Spinning...' : 'SPIN THE WHEEL NOW!'}</span>
          </button>
        )}
      </div>

      {/* Prize Showcase Ticker */}
      <div className="mt-6 w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-emerald-100">
        <p className="text-[11px] font-bold text-brand-deep uppercase tracking-wider text-center mb-2">
          Prizes on the Wheel
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-ink-muted">
          {WHEEL_PRIZES.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-brand-bg-subtle">
              <span>{p.icon}</span>
              <span className="truncate font-medium">{p.title}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
