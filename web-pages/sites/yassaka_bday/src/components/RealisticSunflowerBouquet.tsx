import React from 'react';

export const RealisticSunflowerBouquet: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Organic swaying container */}
      <div className="relative animate-[bouquetSway_5s_ease-in-out_infinite] origin-bottom">
        <svg
          viewBox="0 0 360 480"
          className="w-72 sm:w-84 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Petal Gradients */}
            <radialGradient id="sunflowerPetalGrad1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>

            <radialGradient id="sunflowerPetalGrad2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>

            <radialGradient id="sunflowerCenterDark" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#5C3412" />
              <stop offset="60%" stopColor="#381E08" />
              <stop offset="100%" stopColor="#241203" />
            </radialGradient>

            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <linearGradient id="kraftPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5B8" />
              <stop offset="40%" stopColor="#D4B693" />
              <stop offset="100%" stopColor="#B8966E" />
            </linearGradient>

            <linearGradient id="kraftPaperFold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5E8D3" />
              <stop offset="100%" stopColor="#CBB08C" />
            </linearGradient>

            <linearGradient id="sageRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A7C4A0" />
              <stop offset="50%" stopColor="#86A87D" />
              <stop offset="100%" stopColor="#6C8D63" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Stems */}
          <path d="M180 200 Q180 340 180 430" stroke="url(#stemGrad)" strokeWidth="9" strokeLinecap="round" />
          <path d="M140 170 Q160 300 175 425" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round" />
          <path d="M220 175 Q200 300 185 425" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round" />

          {/* Leaves */}
          <path
            d="M130 250 C90 230 80 280 120 300 C145 310 160 280 140 260 Z"
            fill="#16A34A"
            opacity="0.9"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          <path
            d="M230 250 C270 230 280 280 240 300 C215 310 200 280 220 260 Z"
            fill="#15803D"
            opacity="0.9"
            stroke="#166534"
            strokeWidth="1.5"
          />

          {/* Kraft Paper Wrap (Folded Cone) */}
          <g filter="url(#shadowFilter)">
            {/* Back cone */}
            <polygon points="120,290 240,290 205,445 155,445" fill="url(#kraftPaperGrad)" />
            {/* Left flap */}
            <polygon
              points="110,300 195,300 170,445 145,445"
              fill="url(#kraftPaperFold)"
              opacity="0.95"
              stroke="#B38E65"
              strokeWidth="1"
            />
            {/* Right overlapping flap */}
            <polygon
              points="160,295 250,300 185,445 160,445"
              fill="url(#kraftPaperGrad)"
              opacity="0.9"
              stroke="#A88258"
              strokeWidth="1"
            />
            {/* Kraft paper creases */}
            <line x1="150" y1="320" x2="165" y2="420" stroke="#A67C52" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
            <line x1="205" y1="330" x2="180" y2="430" stroke="#A67C52" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
          </g>

          {/* Sage Ribbon & Bow */}
          <g id="ribbonGroup">
            {/* Ribbon Band */}
            <rect x="145" y="375" width="70" height="15" rx="3" fill="url(#sageRibbonGrad)" />
            {/* Bow Left Loop */}
            <path d="M180 382 C160 365 145 375 160 395 C175 400 180 385 180 382 Z" fill="url(#sageRibbonGrad)" />
            {/* Bow Right Loop */}
            <path d="M180 382 C200 365 215 375 200 395 C185 400 180 385 180 382 Z" fill="url(#sageRibbonGrad)" />
            {/* Center Knot */}
            <circle cx="180" cy="383" r="5" fill="#5F7D57" />
            {/* Hanging tails */}
            <path d="M178 386 Q165 410 160 425" stroke="url(#sageRibbonGrad)" strokeWidth="4" strokeLinecap="round" />
            <path d="M182 386 Q195 410 200 428" stroke="url(#sageRibbonGrad)" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* LEFT SUNFLOWER (Slightly tilted) */}
          <g transform="translate(115, 145) rotate(-15)">
            {/* Outer Petals */}
            {[...Array(18)].map((_, i) => (
              <path
                key={`left-p1-${i}`}
                d="M0 0 C-6 -22 -14 -42 0 -58 C14 -42 6 -22 0 0 Z"
                fill="url(#sunflowerPetalGrad2)"
                transform={`rotate(${i * 20})`}
                opacity="0.95"
              />
            ))}
            {/* Inner Petals */}
            {[...Array(18)].map((_, i) => (
              <path
                key={`left-p2-${i}`}
                d="M0 0 C-5 -18 -10 -35 0 -48 C10 -35 5 -18 0 0 Z"
                fill="url(#sunflowerPetalGrad1)"
                transform={`rotate(${i * 20 + 10})`}
              />
            ))}
            {/* Center Disk */}
            <circle cx="0" cy="0" r="23" fill="url(#sunflowerCenterDark)" />
            {/* Stipple Rings */}
            {[...Array(14)].map((_, i) => (
              <circle
                key={`left-c1-${i}`}
                cx={Math.cos((i * 25.7 * Math.PI) / 180) * 11}
                cy={Math.sin((i * 25.7 * Math.PI) / 180) * 11}
                r="1.2"
                fill="#F59E0B"
                opacity="0.8"
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <circle
                key={`left-c2-${i}`}
                cx={Math.cos((i * 18 * Math.PI) / 180) * 18}
                cy={Math.sin((i * 18 * Math.PI) / 180) * 18}
                r="1"
                fill="#D97706"
                opacity="0.9"
              />
            ))}
          </g>

          {/* RIGHT SUNFLOWER (Slightly tilted right) */}
          <g transform="translate(245, 150) rotate(18)">
            {/* Outer Petals */}
            {[...Array(18)].map((_, i) => (
              <path
                key={`right-p1-${i}`}
                d="M0 0 C-6 -22 -14 -42 0 -58 C14 -42 6 -22 0 0 Z"
                fill="url(#sunflowerPetalGrad2)"
                transform={`rotate(${i * 20})`}
                opacity="0.95"
              />
            ))}
            {/* Inner Petals */}
            {[...Array(18)].map((_, i) => (
              <path
                key={`right-p2-${i}`}
                d="M0 0 C-5 -18 -10 -35 0 -48 C10 -35 5 -18 0 0 Z"
                fill="url(#sunflowerPetalGrad1)"
                transform={`rotate(${i * 20 + 10})`}
              />
            ))}
            {/* Center Disk */}
            <circle cx="0" cy="0" r="23" fill="url(#sunflowerCenterDark)" />
            {/* Stipple Rings */}
            {[...Array(14)].map((_, i) => (
              <circle
                key={`right-c1-${i}`}
                cx={Math.cos((i * 25.7 * Math.PI) / 180) * 11}
                cy={Math.sin((i * 25.7 * Math.PI) / 180) * 11}
                r="1.2"
                fill="#F59E0B"
                opacity="0.8"
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <circle
                key={`right-c2-${i}`}
                cx={Math.cos((i * 18 * Math.PI) / 180) * 18}
                cy={Math.sin((i * 18 * Math.PI) / 180) * 18}
                r="1"
                fill="#D97706"
                opacity="0.9"
              />
            ))}
          </g>

          {/* MAIN CENTER SUNFLOWER (Glorious & Large in the foreground) */}
          <g transform="translate(180, 105)" filter="url(#shadowFilter)">
            {/* Layer 1: Deep Golden Outer Petals (24 petals) */}
            {[...Array(24)].map((_, i) => (
              <path
                key={`center-p1-${i}`}
                d="M0 0 C-7 -26 -16 -52 0 -72 C16 -52 7 -26 0 0 Z"
                fill="url(#sunflowerPetalGrad2)"
                transform={`rotate(${i * 15})`}
                opacity="0.95"
              />
            ))}

            {/* Layer 2: Bright Yellow Inner Petals (24 petals staggered) */}
            {[...Array(24)].map((_, i) => (
              <path
                key={`center-p2-${i}`}
                d="M0 0 C-6 -22 -13 -44 0 -62 C13 -44 6 -22 0 0 Z"
                fill="url(#sunflowerPetalGrad1)"
                transform={`rotate(${i * 15 + 7.5})`}
              />
            ))}

            {/* Layer 3: Extra Fluffy Golden Core Accent Petals */}
            {[...Array(16)].map((_, i) => (
              <path
                key={`center-p3-${i}`}
                d="M0 0 C-4 -14 -8 -28 0 -38 C8 -28 4 -14 0 0 Z"
                fill="#FCD34D"
                transform={`rotate(${i * 22.5})`}
                opacity="0.85"
              />
            ))}

            {/* Dark Seed Core */}
            <circle cx="0" cy="0" r="30" fill="url(#sunflowerCenterDark)" stroke="#452309" strokeWidth="2" />

            {/* Concentric Stipple Circles for realistic seed head */}
            {[...Array(8)].map((_, i) => (
              <circle
                key={`stipple-inner-${i}`}
                cx={Math.cos((i * 45 * Math.PI) / 180) * 8}
                cy={Math.sin((i * 45 * Math.PI) / 180) * 8}
                r="1.3"
                fill="#F59E0B"
                opacity="0.9"
              />
            ))}
            {[...Array(16)].map((_, i) => (
              <circle
                key={`stipple-mid-${i}`}
                cx={Math.cos((i * 22.5 * Math.PI) / 180) * 16}
                cy={Math.sin((i * 22.5 * Math.PI) / 180) * 16}
                r="1.4"
                fill="#D97706"
                opacity="0.95"
              />
            ))}
            {[...Array(24)].map((_, i) => (
              <circle
                key={`stipple-outer-${i}`}
                cx={Math.cos((i * 15 * Math.PI) / 180) * 24}
                cy={Math.sin((i * 15 * Math.PI) / 180) * 24}
                r="1.5"
                fill="#FBBF24"
                opacity="0.9"
              />
            ))}
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes bouquetSway {
          0%, 100% {
            transform: rotate(-1.5deg);
          }
          50% {
            transform: rotate(2deg) translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};
