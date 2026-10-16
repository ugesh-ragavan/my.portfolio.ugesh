import React, { useEffect, useRef, useState } from 'react';
import { FlowerType } from '../types';

interface PetalBackgroundProps {
  flowerType: FlowerType;
  density?: number;
}

export const PetalBackground: React.FC<PetalBackgroundProps> = ({ flowerType, density = 26 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic petal colors with rich violet & flower accents
    const getPetalColors = (type: FlowerType) => {
      switch (type) {
        case 'rose':
          return [
            'rgba(168, 85, 247, 0.28)',
            'rgba(225, 29, 72, 0.24)',
            'rgba(192, 132, 252, 0.32)',
            'rgba(244, 63, 94, 0.22)',
          ];
        case 'sunflower':
          return [
            'rgba(168, 85, 247, 0.25)',
            'rgba(245, 158, 11, 0.28)',
            'rgba(251, 191, 36, 0.25)',
            'rgba(192, 132, 252, 0.3)',
          ];
        case 'tulip':
          return [
            'rgba(192, 132, 252, 0.32)',
            'rgba(244, 63, 94, 0.22)',
            'rgba(147, 51, 234, 0.26)',
          ];
        case 'jasmine':
          return [
            'rgba(255, 255, 255, 0.55)',
            'rgba(233, 213, 255, 0.45)',
            'rgba(192, 132, 252, 0.3)',
            'rgba(245, 158, 11, 0.2)',
          ];
        case 'all':
        default:
          return [
            'rgba(168, 85, 247, 0.3)',
            'rgba(192, 132, 252, 0.32)',
            'rgba(245, 158, 11, 0.22)',
            'rgba(255, 255, 255, 0.45)',
          ];
      }
    };

    const petalColors = getPetalColors(flowerType);

    // 1. Fluttering Violet & Botanical Petals (with 3D tumble)
    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      tumble: number;
      tumbleSpeed: number;
      color: string;
      swayOffset: number;
    }

    const petals: Petal[] = [];
    for (let i = 0; i < density; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.2,
        size: 9 + Math.random() * 12,
        speedY: 0.6 + Math.random() * 0.75,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        tumble: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.02 + Math.random() * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        swayOffset: Math.random() * 100,
      });
    }

    // 2. Glowing Violet & Gold Fairy Embers drifting upward
    interface FairyEmber {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      alpha: number;
      alphaSpeed: number;
      baseAlpha: number;
      color: string;
    }

    const embers: FairyEmber[] = [];
    const emberCount = 30;
    const emberColorPalette = [
      'rgba(168, 85, 247, ', // Electric violet
      'rgba(216, 180, 254, ', // Soft lavender
      'rgba(251, 191, 36, ',  // Warm champagne gold
      'rgba(254, 240, 138, ', // Soft gold star glow
    ];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2,
        speedY: 0.3 + Math.random() * 0.5,
        alpha: Math.random(),
        alphaSpeed: 0.015 + Math.random() * 0.025,
        baseAlpha: 0.3 + Math.random() * 0.45,
        color: emberColorPalette[Math.floor(Math.random() * emberColorPalette.length)],
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render Upward Drifting Violet & Gold Embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.speedY;
        e.alpha += e.alphaSpeed;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }

        const currentAlpha = e.baseAlpha * (0.5 + 0.5 * Math.sin(e.alpha));
        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${e.color}${currentAlpha})`;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.45)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Render Fluttering Petals (with organic 3D tumble)
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin((frame + p.swayOffset) * 0.015) * 0.75 + p.speedX;
        p.rotation += p.rotationSpeed;
        p.tumble += p.tumbleSpeed;

        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.sin(p.tumble));

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.6, p.size * 0.9, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.5, -p.size * 0.75, -p.size * 0.6, 0, -p.size);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [flowerType, density]);

  return (
    <>
      {/* Candlelit Violet & Gold Ambient Glow following cursor */}
      {mousePos.x > -500 && (
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-700 z-0"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.18) 0%, rgba(254, 240, 138, 0.08) 35%, transparent 75%)`,
          }}
        />
      )}

      {/* HTML5 Canvas Particle Field */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.92 }}
      />
    </>
  );
};
