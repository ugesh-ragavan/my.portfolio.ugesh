import React from 'react';
import { FlowerType } from '../types';

interface RealisticBouquetProps {
  flowerType: FlowerType;
  className?: string;
}

export const RealisticBouquet: React.FC<RealisticBouquetProps> = ({ flowerType, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div className="relative animate-[bouquetSway_5s_ease-in-out_infinite] origin-bottom">
        <svg
          viewBox="0 0 360 480"
          className="w-72 sm:w-84 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Common Kraft Wrap & Ribbon Gradients */}
            <linearGradient id="kraftPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EAD8BE" />
              <stop offset="40%" stopColor="#D5BA98" />
              <stop offset="100%" stopColor="#BC9B73" />
            </linearGradient>

            <linearGradient id="kraftPaperFold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F6EBD8" />
              <stop offset="100%" stopColor="#CDAF8B" />
            </linearGradient>

            <linearGradient id="sageRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8C7A1" />
              <stop offset="50%" stopColor="#87A97E" />
              <stop offset="100%" stopColor="#67885D" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            {/* Sunflower Gradients */}
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

            {/* Jasmine (Mallipoo) Gradients */}
            <radialGradient id="jasminePetalGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
            <radialGradient id="jasmineBudGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
            <radialGradient id="jasmineCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="80%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </radialGradient>

            {/* Rose Gradients */}
            <radialGradient id="roseRedGrad1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="45%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="roseRedGrad2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#4C0519" />
            </radialGradient>

            {/* Tulip Gradients */}
            <linearGradient id="tulipPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Stems */}
          <path d="M180 200 Q180 340 180 435" stroke="url(#stemGrad)" strokeWidth="9" strokeLinecap="round" />
          <path d="M135 180 Q155 305 175 430" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round" />
          <path d="M225 185 Q205 305 185 430" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round" />

          {/* Leaves */}
          <path
            d="M125 240 C85 220 75 270 115 290 C140 300 155 270 135 250 Z"
            fill="#16A34A"
            opacity="0.9"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          <path
            d="M235 240 C275 220 285 270 245 290 C220 300 205 270 225 250 Z"
            fill="#15803D"
            opacity="0.9"
            stroke="#166534"
            strokeWidth="1.5"
          />

          {/* Kraft Paper Wrap (Folded Cone) */}
          <g filter="url(#shadowFilter)">
            <polygon points="120,285 240,285 205,445 155,445" fill="url(#kraftPaperGrad)" />
            <polygon
              points="108,295 195,295 170,445 145,445"
              fill="url(#kraftPaperFold)"
              opacity="0.95"
              stroke="#B38E65"
              strokeWidth="1"
            />
            <polygon
              points="160,290 252,295 185,445 160,445"
              fill="url(#kraftPaperGrad)"
              opacity="0.9"
              stroke="#A88258"
              strokeWidth="1"
            />
            <line x1="150" y1="315" x2="165" y2="420" stroke="#A67C52" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
            <line x1="205" y1="325" x2="180" y2="430" stroke="#A67C52" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
          </g>

          {/* Sage Ribbon & Bow */}
          <g id="ribbonGroup">
            <rect x="145" y="375" width="70" height="15" rx="3" fill="url(#sageRibbonGrad)" />
            <path d="M180 382 C160 365 145 375 160 395 C175 400 180 385 180 382 Z" fill="url(#sageRibbonGrad)" />
            <path d="M180 382 C200 365 215 375 200 395 C185 400 180 385 180 382 Z" fill="url(#sageRibbonGrad)" />
            <circle cx="180" cy="383" r="5" fill="#5F7D57" />
            <path d="M178 386 Q165 410 160 425" stroke="url(#sageRibbonGrad)" strokeWidth="4" strokeLinecap="round" />
            <path d="M182 386 Q195 410 200 428" stroke="url(#sageRibbonGrad)" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* CONDITIONAL FLOWER BLOOMS */}

          {/* ============================================================
              1. JASMINE / MALLIPOO (🤍) BOUQUET
             ============================================================ */}
          {flowerType === 'jasmine' && (
            <g id="mallipooBouquet">
              {/* Mallipoo Garland & Branch stems */}
              <path d="M140 180 Q170 140 180 90" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
              <path d="M180 180 Q210 150 240 120" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M180 180 Q140 150 110 130" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />

              {/* Mallipoo Green Calyxes & Deep Leaves */}
              <circle cx="180" cy="110" r="14" fill="#166534" opacity="0.8" />
              <circle cx="130" cy="140" r="12" fill="#166534" opacity="0.8" />
              <circle cx="230" cy="135" r="12" fill="#166534" opacity="0.8" />
              <circle cx="160" cy="180" r="14" fill="#166534" opacity="0.8" />
              <circle cx="205" cy="175" r="14" fill="#166534" opacity="0.8" />

              {/* Individual Mallipoo Star Blossoms Helper */}
              {/* Center Large Open Jasmine Blossom */}
              <g transform="translate(180, 105)" filter="url(#shadowFilter)">
                {[...Array(8)].map((_, i) => (
                  <path
                    key={`j-center-p-${i}`}
                    d="M0 0 C-6 -18 -12 -36 0 -48 C12 -36 6 -18 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 45})`}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <path
                    key={`j-center-p2-${i}`}
                    d="M0 0 C-4 -12 -8 -25 0 -34 C8 -25 4 -12 0 0 Z"
                    fill="#FFFFFF"
                    transform={`rotate(${i * 45 + 22.5})`}
                  />
                ))}
                <circle cx="0" cy="0" r="7" fill="url(#jasmineCenter)" />
                <circle cx="0" cy="0" r="3" fill="#A16207" />
              </g>

              {/* Top Left Jasmine Blossom */}
              <g transform="translate(125, 125) rotate(-18)" filter="url(#shadowFilter)">
                {[...Array(7)].map((_, i) => (
                  <path
                    key={`j-tl-p-${i}`}
                    d="M0 0 C-5 -15 -10 -28 0 -38 C10 -28 5 -15 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 51.4})`}
                  />
                ))}
                <circle cx="0" cy="0" r="5" fill="url(#jasmineCenter)" />
              </g>

              {/* Top Right Jasmine Blossom */}
              <g transform="translate(235, 120) rotate(22)" filter="url(#shadowFilter)">
                {[...Array(7)].map((_, i) => (
                  <path
                    key={`j-tr-p-${i}`}
                    d="M0 0 C-5 -15 -10 -28 0 -38 C10 -28 5 -15 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 51.4})`}
                  />
                ))}
                <circle cx="0" cy="0" r="5" fill="url(#jasmineCenter)" />
              </g>

              {/* Bottom Left Jasmine Blossom */}
              <g transform="translate(145, 185) rotate(-10)" filter="url(#shadowFilter)">
                {[...Array(7)].map((_, i) => (
                  <path
                    key={`j-bl-p-${i}`}
                    d="M0 0 C-5 -14 -9 -26 0 -34 C9 -26 5 -14 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 51.4})`}
                  />
                ))}
                <circle cx="0" cy="0" r="5" fill="url(#jasmineCenter)" />
              </g>

              {/* Bottom Right Jasmine Blossom */}
              <g transform="translate(215, 180) rotate(15)" filter="url(#shadowFilter)">
                {[...Array(7)].map((_, i) => (
                  <path
                    key={`j-br-p-${i}`}
                    d="M0 0 C-5 -14 -9 -26 0 -34 C9 -26 5 -14 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 51.4})`}
                  />
                ))}
                <circle cx="0" cy="0" r="5" fill="url(#jasmineCenter)" />
              </g>

              {/* Center Foreground Jasmine Blossom */}
              <g transform="translate(180, 205)" filter="url(#shadowFilter)">
                {[...Array(8)].map((_, i) => (
                  <path
                    key={`j-fc-p-${i}`}
                    d="M0 0 C-5 -16 -10 -30 0 -40 C10 -30 5 -16 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 45})`}
                  />
                ))}
                <circle cx="0" cy="0" r="6" fill="url(#jasmineCenter)" />
              </g>

              {/* Unopened fragrant mallipoo buds sprinkling the crown */}
              <ellipse cx="165" cy="55" rx="5" ry="12" fill="url(#jasmineBudGrad)" stroke="#166534" strokeWidth="1" transform="rotate(-15 165 55)" />
              <ellipse cx="195" cy="55" rx="5" ry="12" fill="url(#jasmineBudGrad)" stroke="#166534" strokeWidth="1" transform="rotate(15 195 55)" />
              <ellipse cx="95" cy="115" rx="5" ry="10" fill="url(#jasmineBudGrad)" stroke="#166534" strokeWidth="1" transform="rotate(-30 95 115)" />
              <ellipse cx="265" cy="110" rx="5" ry="10" fill="url(#jasmineBudGrad)" stroke="#166534" strokeWidth="1" transform="rotate(30 265 110)" />
              <ellipse cx="180" cy="45" rx="5" ry="12" fill="url(#jasmineBudGrad)" stroke="#166534" strokeWidth="1" />
            </g>
          )}

          {/* ============================================================
              2. SUNFLOWER (🌻) BOUQUET
             ============================================================ */}
          {flowerType === 'sunflower' && (
            <g id="sunflowerBouquet">
              {/* LEFT SUNFLOWER */}
              <g transform="translate(115, 145) rotate(-15)">
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`left-p1-${i}`}
                    d="M0 0 C-6 -22 -14 -42 0 -58 C14 -42 6 -22 0 0 Z"
                    fill="url(#sunflowerPetalGrad2)"
                    transform={`rotate(${i * 20})`}
                    opacity="0.95"
                  />
                ))}
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`left-p2-${i}`}
                    d="M0 0 C-5 -18 -10 -35 0 -48 C10 -35 5 -18 0 0 Z"
                    fill="url(#sunflowerPetalGrad1)"
                    transform={`rotate(${i * 20 + 10})`}
                  />
                ))}
                <circle cx="0" cy="0" r="23" fill="url(#sunflowerCenterDark)" />
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
              </g>

              {/* RIGHT SUNFLOWER */}
              <g transform="translate(245, 150) rotate(18)">
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`right-p1-${i}`}
                    d="M0 0 C-6 -22 -14 -42 0 -58 C14 -42 6 -22 0 0 Z"
                    fill="url(#sunflowerPetalGrad2)"
                    transform={`rotate(${i * 20})`}
                    opacity="0.95"
                  />
                ))}
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`right-p2-${i}`}
                    d="M0 0 C-5 -18 -10 -35 0 -48 C10 -35 5 -18 0 0 Z"
                    fill="url(#sunflowerPetalGrad1)"
                    transform={`rotate(${i * 20 + 10})`}
                  />
                ))}
                <circle cx="0" cy="0" r="23" fill="url(#sunflowerCenterDark)" />
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
              </g>

              {/* CENTER SUNFLOWER */}
              <g transform="translate(180, 105)" filter="url(#shadowFilter)">
                {[...Array(24)].map((_, i) => (
                  <path
                    key={`center-p1-${i}`}
                    d="M0 0 C-7 -26 -16 -52 0 -72 C16 -52 7 -26 0 0 Z"
                    fill="url(#sunflowerPetalGrad2)"
                    transform={`rotate(${i * 15})`}
                    opacity="0.95"
                  />
                ))}
                {[...Array(24)].map((_, i) => (
                  <path
                    key={`center-p2-${i}`}
                    d="M0 0 C-6 -22 -13 -44 0 -62 C13 -44 6 -22 0 0 Z"
                    fill="url(#sunflowerPetalGrad1)"
                    transform={`rotate(${i * 15 + 7.5})`}
                  />
                ))}
                <circle cx="0" cy="0" r="30" fill="url(#sunflowerCenterDark)" stroke="#452309" strokeWidth="2" />
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
            </g>
          )}

          {/* ============================================================
              3. ROSE (🌹) BOUQUET
             ============================================================ */}
          {flowerType === 'rose' && (
            <g id="roseBouquet">
              {/* Left Rose */}
              <g transform="translate(120, 145) scale(0.9) rotate(-15)" filter="url(#shadowFilter)">
                <circle cx="0" cy="0" r="45" fill="url(#roseRedGrad2)" />
                <path d="M-30 0 C-30 -35 30 -35 30 0 C30 35 -30 35 -30 0 Z" fill="url(#roseRedGrad1)" />
                <path d="M-20 -10 C-20 -28 20 -28 20 -10 C20 15 -20 15 -20 -10 Z" fill="#9F1239" />
                <path d="M-12 -5 C-12 -18 12 -18 12 -5 C12 10 -12 10 -12 -5 Z" fill="#E11D48" />
                <circle cx="0" cy="-3" r="6" fill="#881337" />
              </g>

              {/* Right Rose */}
              <g transform="translate(240, 150) scale(0.9) rotate(15)" filter="url(#shadowFilter)">
                <circle cx="0" cy="0" r="45" fill="url(#roseRedGrad2)" />
                <path d="M-30 0 C-30 -35 30 -35 30 0 C30 35 -30 35 -30 0 Z" fill="url(#roseRedGrad1)" />
                <path d="M-20 -10 C-20 -28 20 -28 20 -10 C20 15 -20 15 -20 -10 Z" fill="#9F1239" />
                <path d="M-12 -5 C-12 -18 12 -18 12 -5 C12 10 -12 10 -12 -5 Z" fill="#E11D48" />
                <circle cx="0" cy="-3" r="6" fill="#881337" />
              </g>

              {/* Center Grand Rose */}
              <g transform="translate(180, 110)" filter="url(#shadowFilter)">
                <circle cx="0" cy="0" r="55" fill="url(#roseRedGrad2)" />
                {/* Spiral Petal Layers */}
                <path d="M-42 0 C-42 -45 42 -45 42 0 C42 45 -42 45 -42 0 Z" fill="url(#roseRedGrad1)" />
                <path d="M-30 -12 C-30 -38 30 -38 30 -12 C30 25 -30 25 -30 -12 Z" fill="#9F1239" />
                <path d="M-20 -8 C-20 -26 20 -26 20 -8 C20 18 -20 18 -20 -8 Z" fill="#FB7185" />
                <path d="M-12 -4 C-12 -16 12 -16 12 -4 C12 10 -12 10 -12 -4 Z" fill="#BE123C" />
                <circle cx="0" cy="-2" r="8" fill="#4C0519" />
              </g>
            </g>
          )}

          {/* ============================================================
              4. TULIP (🌷) BOUQUET
             ============================================================ */}
          {flowerType === 'tulip' && (
            <g id="tulipBouquet">
              {/* Left Tulip */}
              <g transform="translate(125, 140) rotate(-18)" filter="url(#shadowFilter)">
                <path d="M-22 25 C-35 -15 -20 -50 0 -60 C20 -50 35 -15 22 25 Z" fill="url(#tulipPetalGrad)" />
                <path d="M-16 20 C-25 -10 -10 -40 0 -48 C10 -40 25 -10 16 20 Z" fill="#FB7185" />
                <path d="M-8 15 C-12 -5 0 -30 0 -30 C0 -30 12 -5 8 15 Z" fill="#FDA4AF" />
              </g>

              {/* Right Tulip */}
              <g transform="translate(235, 140) rotate(18)" filter="url(#shadowFilter)">
                <path d="M-22 25 C-35 -15 -20 -50 0 -60 C20 -50 35 -15 22 25 Z" fill="url(#tulipPetalGrad)" />
                <path d="M-16 20 C-25 -10 -10 -40 0 -48 C10 -40 25 -10 16 20 Z" fill="#FB7185" />
                <path d="M-8 15 C-12 -5 0 -30 0 -30 C0 -30 12 -5 8 15 Z" fill="#FDA4AF" />
              </g>

              {/* Center Tulip */}
              <g transform="translate(180, 100)" filter="url(#shadowFilter)">
                <path d="M-28 32 C-45 -20 -25 -65 0 -78 C25 -65 45 -20 28 32 Z" fill="url(#tulipPetalGrad)" />
                <path d="M-20 25 C-32 -15 -15 -52 0 -62 C15 -52 32 -15 20 25 Z" fill="#FB7185" />
                <path d="M-10 20 C-15 -8 0 -40 0 -40 C0 -40 15 -8 10 20 Z" fill="#FECDD3" />
              </g>
            </g>
          )}

          {/* ============================================================
              5. ALL FLOWERS (💐) BOTANICAL EXTRAVAGANZA
             ============================================================ */}
          {flowerType === 'all' && (
            <g id="mixedBouquet">
              {/* Back Rose Left */}
              <g transform="translate(105, 125) scale(0.7) rotate(-20)">
                <circle cx="0" cy="0" r="45" fill="url(#roseRedGrad2)" />
                <path d="M-30 0 C-30 -35 30 -35 30 0 C30 35 -30 35 -30 0 Z" fill="url(#roseRedGrad1)" />
              </g>

              {/* Back Tulip Right */}
              <g transform="translate(255, 120) scale(0.75) rotate(20)">
                <path d="M-22 25 C-35 -15 -20 -50 0 -60 C20 -50 35 -15 22 25 Z" fill="url(#tulipPetalGrad)" />
              </g>

              {/* Center Radiant Sunflower */}
              <g transform="translate(180, 110) scale(0.85)" filter="url(#shadowFilter)">
                {[...Array(20)].map((_, i) => (
                  <path
                    key={`all-sun-${i}`}
                    d="M0 0 C-6 -22 -14 -44 0 -62 C14 -44 6 -22 0 0 Z"
                    fill="url(#sunflowerPetalGrad2)"
                    transform={`rotate(${i * 18})`}
                  />
                ))}
                <circle cx="0" cy="0" r="24" fill="url(#sunflowerCenterDark)" />
                {[...Array(12)].map((_, i) => (
                  <circle
                    key={`all-sc-${i}`}
                    cx={Math.cos((i * 30 * Math.PI) / 180) * 13}
                    cy={Math.sin((i * 30 * Math.PI) / 180) * 13}
                    r="1.2"
                    fill="#FBBF24"
                  />
                ))}
              </g>

              {/* Front Jasmine clusters framing the bouquet */}
              <g transform="translate(135, 195) scale(0.7)">
                {[...Array(6)].map((_, i) => (
                  <path
                    key={`all-j1-${i}`}
                    d="M0 0 C-4 -12 -8 -22 0 -30 C8 -22 4 -12 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    transform={`rotate(${i * 60})`}
                  />
                ))}
                <circle cx="0" cy="0" r="4" fill="url(#jasmineCenter)" />
              </g>

              <g transform="translate(225, 190) scale(0.7)">
                {[...Array(6)].map((_, i) => (
                  <path
                    key={`all-j2-${i}`}
                    d="M0 0 C-4 -12 -8 -22 0 -30 C8 -22 4 -12 0 0 Z"
                    fill="url(#jasminePetalGrad)"
                    transform={`rotate(${i * 60})`}
                  />
                ))}
                <circle cx="0" cy="0" r="4" fill="url(#jasmineCenter)" />
              </g>
            </g>
          )}
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
