import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { sfx } from '../utils/sound';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Pellet {
  id: number;
  x: number;
  y: number;
  radius: number;
  bobOffset: number;
}

interface HeartBubble {
  x: number;
  y: number;
  vy: number;
  alpha: number;
  scale: number;
  color: string;
}

interface KoiFish {
  x: number;
  y: number;
  angle: number;
  speed: number;
  baseSpeed: number;
  bodyColor: string;
  spotColor: string;
  size: number;
  tailPhase: number;
  wiggleTimer: number;
}

interface LilyPad {
  xRatio: number;
  yRatio: number;
  radius: number;
  angle: number;
  hasFlower: boolean;
}

const KOI_PALETTE = [
  { body: '#F9A886', spot: '#FFF5EB', size: 17 }, // Peach calico
  { body: '#FFF8F0', spot: '#F472B6', size: 15 }, // Cream & rose
  { body: '#FCD34D', spot: '#FFFBEB', size: 16 }, // Warm honey gold
  { body: '#FBCFE8', spot: '#FFFFFF', size: 14 }, // Blush sakura
  { body: '#A5D8D3', spot: '#F0FDF9', size: 15 }, // Pastel sage pearl
  { body: '#FCA5A5', spot: '#FEF2F2', size: 16 }, // Soft coral
];

const LILY_PADS: LilyPad[] = [
  { xRatio: 0.16, yRatio: 0.24, radius: 26, angle: 0.6, hasFlower: true },
  { xRatio: 0.84, yRatio: 0.28, radius: 22, angle: 2.3, hasFlower: false },
  { xRatio: 0.22, yRatio: 0.78, radius: 20, angle: 4.1, hasFlower: false },
  { xRatio: 0.78, yRatio: 0.76, radius: 28, angle: 1.4, hasFlower: true },
];

export function KoiPondGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pelletsFed, setPelletsFed] = useState(0);

  const stateRef = useRef<{
    width: number;
    height: number;
    ripples: Ripple[];
    pellets: Pellet[];
    hearts: HeartBubble[];
    fish: KoiFish[];
    nextPelletId: number;
  }>({
    width: 680,
    height: 360,
    ripples: [],
    pellets: [],
    hearts: [],
    fish: [],
    nextPelletId: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initFish = (w: number, h: number) => {
      stateRef.current.fish = KOI_PALETTE.map((style, idx) => ({
        x: (w * (idx + 1)) / (KOI_PALETTE.length + 1),
        y: h * (0.25 + ((idx % 3) * 0.24)),
        angle: (idx * Math.PI) / 3,
        speed: 0.8 + (idx % 3) * 0.15,
        baseSpeed: 0.8 + (idx % 3) * 0.15,
        bodyColor: style.body,
        spotColor: style.spot,
        size: style.size,
        tailPhase: idx * 1.1,
        wiggleTimer: 0,
      }));
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(280, Math.floor(rect.width));
      const height = width < 520 ? 310 : 370;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stateRef.current.width = width;
      stateRef.current.height = height;

      if (stateRef.current.fish.length === 0) {
        initFish(width, height);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let frameId = 0;
    let time = 0;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const s = stateRef.current;
      time += 0.025;

      // 1. Tranquil pastel pond water background
      const waterGrad = ctx.createLinearGradient(0, 0, s.width, s.height);
      waterGrad.addColorStop(0, '#DCEFF2');
      waterGrad.addColorStop(0.5, '#D1E8ED');
      waterGrad.addColorStop(1, '#C5E1E7');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, s.width, s.height);

      // Gentle sunlight caustics
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 4; i++) {
        const cx = s.width * (0.2 + i * 0.22) + Math.sin(time * 0.6 + i) * 18;
        const cy = s.height * (0.35 + (i % 2) * 0.3) + Math.cos(time * 0.5 + i) * 14;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 48 + i * 6, 24 + i * 3, time * 0.12 + i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Expanding water ripples
      for (let i = s.ripples.length - 1; i >= 0; i--) {
        const r = s.ripples[i];
        r.radius += 1.05;
        r.alpha -= 0.014;
        if (r.alpha <= 0) {
          s.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Food pellets
      for (const p of s.pellets) {
        const bob = Math.sin(time * 2.5 + p.bobOffset) * 1.2;
        ctx.save();
        ctx.fillStyle = 'rgba(63, 46, 46, 0.12)';
        ctx.beginPath();
        ctx.arc(p.x + 1.5, p.y + 3 + bob, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(p.x, p.y + bob, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FEF3C7';
        ctx.beginPath();
        ctx.arc(p.x - 1, p.y - 1 + bob, p.radius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Update and draw koi fish
      for (const fish of s.fish) {
        // Find nearest food pellet
        let targetPellet: Pellet | null = null;
        let minDist = Infinity;
        for (const p of s.pellets) {
          const dx = p.x - fish.x;
          const dy = p.y - fish.y;
          const dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            targetPellet = p;
          }
        }

        if (targetPellet) {
          const desiredAngle = Math.atan2(targetPellet.y - fish.y, targetPellet.x - fish.x);
          let diff = desiredAngle - fish.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          fish.angle += diff * 0.085;
          fish.speed = Math.min(fish.baseSpeed * 2.25, fish.speed + 0.08);

          // Eat pellet!
          if (minDist < fish.size * 0.95) {
            const idx = s.pellets.findIndex((item) => item.id === targetPellet!.id);
            if (idx !== -1) {
              s.pellets.splice(idx, 1);
              fish.wiggleTimer = 24;
              setPelletsFed((c) => c + 1);
              sfx.pop();

              // Spawn 2 tiny heart bubbles
              s.hearts.push(
                {
                  x: fish.x,
                  y: fish.y - 8,
                  vy: -0.75,
                  alpha: 0.95,
                  scale: 0.9,
                  color: '#F472B6',
                },
                {
                  x: fish.x + 8,
                  y: fish.y - 14,
                  vy: -0.9,
                  alpha: 0.85,
                  scale: 0.72,
                  color: '#FB7185',
                }
              );
            }
          }
        } else {
          // Gentle lazy pond wandering
          fish.angle += Math.sin(time * 0.7 + fish.tailPhase) * 0.015;
          fish.speed += (fish.baseSpeed - fish.speed) * 0.04;
        }

        fish.x += Math.cos(fish.angle) * fish.speed;
        fish.y += Math.sin(fish.angle) * fish.speed;

        // Soft turn back inside pond borders
        const margin = 34;
        if (fish.x < margin) fish.angle = Math.atan2(Math.sin(fish.angle), Math.abs(Math.cos(fish.angle)));
        if (fish.x > s.width - margin)
          fish.angle = Math.atan2(Math.sin(fish.angle), -Math.abs(Math.cos(fish.angle)));
        if (fish.y < margin) fish.angle = Math.atan2(Math.abs(Math.sin(fish.angle)), Math.cos(fish.angle));
        if (fish.y > s.height - margin)
          fish.angle = Math.atan2(-Math.abs(Math.sin(fish.angle)), Math.cos(fish.angle));

        const wiggleBoost = fish.wiggleTimer > 0 ? 0.36 : 0.14;
        if (fish.wiggleTimer > 0) fish.wiggleTimer -= 1;
        fish.tailPhase += wiggleBoost + fish.speed * 0.06;

        // Draw Koi
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.rotate(fish.angle);

        const tailSwing = Math.sin(fish.tailPhase) * (fish.wiggleTimer > 0 ? 5.5 : 3.2);
        const len = fish.size;

        // Soft water shadow underneath fish
        ctx.fillStyle = 'rgba(56, 89, 96, 0.13)';
        ctx.beginPath();
        ctx.ellipse(2, 5, len * 0.85, len * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail fin
        ctx.fillStyle = fish.spotColor;
        ctx.beginPath();
        ctx.moveTo(-len * 0.72, 0);
        ctx.quadraticCurveTo(-len * 1.15, -len * 0.42 + tailSwing, -len * 1.32, tailSwing);
        ctx.quadraticCurveTo(-len * 1.15, len * 0.42 + tailSwing, -len * 0.72, 0);
        ctx.fill();

        // Side pectoral fins
        ctx.fillStyle = fish.spotColor;
        ctx.beginPath();
        ctx.ellipse(len * 0.08, -len * 0.4, len * 0.25, len * 0.13, -0.5, 0, Math.PI * 2);
        ctx.ellipse(len * 0.08, len * 0.4, len * 0.25, len * 0.13, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Koi body
        ctx.fillStyle = fish.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, len * 0.85, len * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Decorative spot
        ctx.fillStyle = fish.spotColor;
        ctx.beginPath();
        ctx.ellipse(-len * 0.16, -len * 0.04, len * 0.3, len * 0.2, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute eyes
        ctx.fillStyle = '#3F2E2E';
        ctx.beginPath();
        ctx.arc(len * 0.54, -len * 0.16, 1.7, 0, Math.PI * 2);
        ctx.arc(len * 0.54, len * 0.16, 1.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 5. Floating lily pads on top of water
      for (const pad of LILY_PADS) {
        const px = pad.xRatio * s.width + Math.sin(time * 0.4 + pad.angle) * 3;
        const py = pad.yRatio * s.height + Math.cos(time * 0.4 + pad.angle) * 2;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(pad.angle + Math.sin(time * 0.3) * 0.05);

        ctx.fillStyle = 'rgba(56, 89, 96, 0.1)';
        ctx.beginPath();
        ctx.arc(2, 3, pad.radius, 0.28, Math.PI * 2 - 0.28);
        ctx.lineTo(2, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#A7CEBE';
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius, 0.28, Math.PI * 2 - 0.28);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        if (pad.hasFlower) {
          for (let p = 0; p < 6; p++) {
            ctx.save();
            ctx.rotate((p * Math.PI) / 3);
            ctx.fillStyle = p % 2 === 0 ? '#FCE7F3' : '#FBCFE8';
            ctx.beginPath();
            ctx.ellipse(0, -6, 3.5, 6.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = '#FCD34D';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 6. Floating heart bubbles
      for (let i = s.hearts.length - 1; i >= 0; i--) {
        const h = s.hearts[i];
        h.y += h.vy;
        h.alpha -= 0.015;
        if (h.alpha <= 0) {
          s.hearts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.scale(h.scale, h.scale);
        ctx.globalAlpha = h.alpha;
        ctx.fillStyle = h.color;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-5, -2, -8, 4, 0, 10);
        ctx.bezierCurveTo(8, 4, 5, -2, 0, 3);
        ctx.fill();
        ctx.restore();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  const dropFoodAt = (x: number, y: number) => {
    const s = stateRef.current;
    sfx.droplet();

    s.ripples.push({ x, y, radius: 4, alpha: 0.85 });
    s.ripples.push({ x, y, radius: 12, alpha: 0.55 });

    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      s.pellets.push({
        id: s.nextPelletId++,
        x: Math.max(24, Math.min(s.width - 24, x + (Math.random() - 0.5) * 28)),
        y: Math.max(24, Math.min(s.height - 24, y + (Math.random() - 0.5) * 28)),
        radius: 3.4 + Math.random() * 1.2,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dropFoodAt(e.clientX - rect.left, e.clientY - rect.top);
  };

  const scatterExtraPellets = () => {
    const s = stateRef.current;
    sfx.droplet();
    for (let i = 0; i < 4; i++) {
      const rx = 50 + Math.random() * (s.width - 100);
      const ry = 50 + Math.random() * (s.height - 100);
      s.ripples.push({ x: rx, y: ry, radius: 5, alpha: 0.75 });
      s.pellets.push({
        id: s.nextPelletId++,
        x: rx,
        y: ry,
        radius: 3.6,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[#6D5454]">
          <span>Tap anywhere on the water to feed the koi</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <span className="font-semibold text-[#3F2E2E] tabular-nums">
            Treats shared: {pelletsFed}
          </span>
        </div>
        <button
          type="button"
          onClick={scatterExtraPellets}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-[#E2ECE9] hover:bg-[#D2E3DE] border border-[#C1D8D1] text-sm font-medium text-[#2F4B44] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Scatter Fish Treats</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-[#C6DCE0] bg-[#DCEFF2] shadow-inner cursor-pointer touch-manipulation"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          aria-label="Interactive Zen Koi Pond — tap to drop pellets and ripples"
          className="block w-full select-none"
        />
      </div>
    </div>
  );
}
