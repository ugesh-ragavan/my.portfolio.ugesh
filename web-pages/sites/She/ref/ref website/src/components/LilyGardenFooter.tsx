import type { MoodId } from '../data/moods';

interface LilyGardenFooterProps {
  selectedMood: MoodId | null;
}

interface GardenTheme {
  label: string;
  skyBg: string;
  petalPrimary: string;
  petalSecondary: string;
  petalEdge: string;
  stamen: string;
  bloomOpenness: number; // 0.35 = bud, 1 = lush full bloom
  swayMode: 'gentle' | 'bouncy';
  ambientGlow: string;
  particles: 'none' | 'petals' | 'fireflies' | 'sparkles' | 'hearts';
}

function getGardenTheme(mood: MoodId | null): GardenTheme {
  switch (mood) {
    case 'comfort':
    case 'overwhelmed':
      return {
        label: 'Soft blush-pink & cream lilies blooming gently for peace',
        skyBg: 'from-[#FDF8F5] via-[#FCEEF4] to-[#F4E6DF]',
        petalPrimary: '#FBCFE8',
        petalSecondary: '#FFF7F0',
        petalEdge: '#F9A8D4',
        stamen: '#F59E0B',
        bloomOpenness: 0.92,
        swayMode: 'gentle',
        ambientGlow: 'rgba(253, 224, 171, 0.45)',
        particles: 'petals',
      };
    case 'sleepy':
      return {
        label: 'Dreamy lavender-white twilight lilies with fireflies',
        skyBg: 'from-[#FDF8F5] via-[#F2EEFC] to-[#E6E0F5]',
        petalPrimary: '#EDE9FE',
        petalSecondary: '#FFFFFF',
        petalEdge: '#C4B5FD',
        stamen: '#FDE68A',
        bloomOpenness: 0.84,
        swayMode: 'gentle',
        ambientGlow: 'rgba(196, 181, 253, 0.38)',
        particles: 'fireflies',
      };
    case 'annoyed':
      return {
        label: 'Bright peach-coral lilies bouncing playfully to lift your mood',
        skyBg: 'from-[#FDF8F5] via-[#FFF0E5] to-[#FDE4D2]',
        petalPrimary: '#FDBA74',
        petalSecondary: '#FFE4D6',
        petalEdge: '#FB7185',
        stamen: '#D97706',
        bloomOpenness: 0.96,
        swayMode: 'bouncy',
        ambientGlow: 'rgba(253, 186, 116, 0.4)',
        particles: 'sparkles',
      };
    case 'entertainment':
    case 'happy':
      return {
        label: 'Lush golden, pink & ivory bouquet blooming joyfully',
        skyBg: 'from-[#FDF8F5] via-[#FEF4DF] to-[#FCE7F3]',
        petalPrimary: '#F472B6',
        petalSecondary: '#FEF3C7',
        petalEdge: '#FDE68A',
        stamen: '#D97706',
        bloomOpenness: 1,
        swayMode: 'bouncy',
        ambientGlow: 'rgba(252, 211, 77, 0.42)',
        particles: 'sparkles',
      };
    case 'missing':
    case 'sweets':
      return {
        label: 'Deep rose-pink & ivory lilies rising with tiny hearts',
        skyBg: 'from-[#FDF8F5] via-[#FCE7F3] to-[#F8D5E6]',
        petalPrimary: '#FB7185',
        petalSecondary: '#FFF5F7',
        petalEdge: '#F43F5E',
        stamen: '#FBBF24',
        bloomOpenness: 0.98,
        swayMode: 'gentle',
        ambientGlow: 'rgba(244, 114, 182, 0.35)',
        particles: 'hearts',
      };
    default:
      return {
        label: 'Resting lily buds swaying in a soft breeze',
        skyBg: 'from-[#FDF8F5] via-[#F7F3EE] to-[#EDE7E1]',
        petalPrimary: '#F5E6DF',
        petalSecondary: '#FFFBF7',
        petalEdge: '#DEC6BA',
        stamen: '#EAB308',
        bloomOpenness: 0.42,
        swayMode: 'gentle',
        ambientGlow: 'rgba(226, 236, 233, 0.45)',
        particles: 'none',
      };
  }
}

const LILY_PLANTS = [
  { x: 90, height: 118, scale: 0.85, delay: '0s', alt: false },
  { x: 210, height: 146, scale: 1.0, delay: '0.7s', alt: true },
  { x: 345, height: 126, scale: 0.92, delay: '1.3s', alt: false },
  { x: 485, height: 158, scale: 1.08, delay: '0.4s', alt: true },
  { x: 630, height: 132, scale: 0.95, delay: '1.1s', alt: false },
  { x: 775, height: 154, scale: 1.04, delay: '0.2s', alt: true },
  { x: 915, height: 128, scale: 0.9, delay: '0.9s', alt: false },
  { x: 1055, height: 144, scale: 1.0, delay: '1.5s', alt: true },
  { x: 1175, height: 116, scale: 0.84, delay: '0.5s', alt: false },
];

export function LilyGardenFooter({ selectedMood }: LilyGardenFooterProps) {
  const theme = getGardenTheme(selectedMood);
  const swayClass = theme.swayMode === 'bouncy' ? 'animate-bouncy-sway' : 'animate-gentle-sway';

  return (
    <footer
      id="lily-garden"
      className={`relative mt-16 overflow-hidden bg-gradient-to-b ${theme.skyBg} border-t border-[#EADCD5] transition-colors duration-700`}
    >
      {/* Calming ambient glow behind the lilies */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-12 mx-auto h-48 w-full max-w-4xl rounded-full blur-3xl transition-colors duration-700"
        style={{ background: theme.ambientGlow }}
      />

      {/* Mood-reactive ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {theme.particles === 'petals' &&
          [12, 26, 44, 62, 78, 90].map((left, i) => (
            <span
              key={left}
              style={{ left: `${left}%`, top: '12%', animationDelay: `${i * 1.1}s` }}
              className="absolute w-3 h-4 rounded-full bg-[#FBCFE8]/80 animate-petal-drift"
            />
          ))}

        {theme.particles === 'fireflies' &&
          [
            { left: '14%', top: '34%', delay: '0s' },
            { left: '28%', top: '22%', delay: '1.2s' },
            { left: '46%', top: '38%', delay: '0.6s' },
            { left: '63%', top: '26%', delay: '1.8s' },
            { left: '79%', top: '35%', delay: '0.9s' },
            { left: '89%', top: '20%', delay: '2.2s' },
          ].map((f, idx) => (
            <span
              key={idx}
              style={{ left: f.left, top: f.top, animationDelay: f.delay }}
              className="absolute w-2.5 h-2.5 rounded-full bg-[#FEF08A] shadow-[0_0_12px_4px_rgba(254,240,138,0.75)] animate-firefly"
            />
          ))}

        {theme.particles === 'sparkles' &&
          [16, 33, 50, 68, 84].map((left, i) => (
            <span
              key={left}
              style={{ left: `${left}%`, bottom: '36%', animationDelay: `${i * 0.55}s` }}
              className="absolute text-base animate-heart-rise select-none"
            >
              ✨
            </span>
          ))}

        {theme.particles === 'hearts' &&
          [15, 32, 49, 66, 83].map((left, i) => (
            <span
              key={left}
              style={{ left: `${left}%`, bottom: '32%', animationDelay: `${i * 0.65}s` }}
              className="absolute text-sm text-[#E11D48]/80 animate-heart-rise select-none"
            >
              ♥
            </span>
          ))}
      </div>

      {/* Quiet caption above garden */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 text-center">
        <p className="text-xs font-medium tracking-wide text-[#7A6363]">
          Sree’s Lily Garden 🪷
        </p>
      </div>

      {/* Full-width illustrated SVG lily meadow */}
      <div className="relative z-10 w-full pt-2">
        <svg
          viewBox="0 0 1260 220"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-44 sm:h-56 md:h-64 block overflow-visible"
          role="img"
          aria-label={theme.label}
        >
          {/* Soft rolling sage meadow hills */}
          <path
            d="M 0 198 Q 315 166 630 192 T 1260 186 L 1260 225 L 0 225 Z"
            fill="#CFE0D7"
          />
          <path
            d="M 0 206 Q 420 182 840 202 T 1260 198 L 1260 225 L 0 225 Z"
            fill="#BBD2C6"
          />

          {/* Layered Lily Blooms */}
          {LILY_PLANTS.map((lily, idx) => {
            const topY = 205 - lily.height;
            const spread = 16 + theme.bloomOpenness * 28; // How wide the lily petals open
            const petalColor = lily.alt ? theme.petalSecondary : theme.petalPrimary;

            return (
              <g
                key={idx}
                style={{
                  transformOrigin: `${lily.x}px 206px`,
                  animationDelay: lily.delay,
                }}
                className={swayClass}
              >
                {/* Stem */}
                <path
                  d={`M ${lily.x} 206 Q ${lily.x + (idx % 2 === 0 ? -8 : 8)} ${
                    206 - lily.height * 0.5
                  } ${lily.x} ${topY}`}
                  fill="none"
                  stroke="#5E8F75"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />

                {/* Long graceful lily leaves */}
                <path
                  d={`M ${lily.x} 195 Q ${lily.x - 28} 165 ${lily.x - 16} 145 Q ${
                    lily.x - 6
                  } 165 ${lily.x} 195 Z`}
                  fill="#78AA8E"
                />
                <path
                  d={`M ${lily.x} 190 Q ${lily.x + 28} 162 ${lily.x + 18} 142 Q ${
                    lily.x + 8
                  } 162 ${lily.x} 190 Z`}
                  fill="#679B7E"
                />

                {/* Lily Blossom Head */}
                <g
                  transform={`translate(${lily.x}, ${topY}) scale(${lily.scale})`}
                  style={{ transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {/* Back outer petals */}
                  <g
                    style={{
                      transform: `rotate(${-spread}deg)`,
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path
                      d="M 0 0 C -11 -16, -9 -38, 0 -46 C 9 -38, 11 -16, 0 0 Z"
                      fill={petalColor}
                      stroke={theme.petalEdge}
                      strokeWidth="1.2"
                    />
                  </g>
                  <g
                    style={{
                      transform: `rotate(${spread}deg)`,
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path
                      d="M 0 0 C -11 -16, -9 -38, 0 -46 C 9 -38, 11 -16, 0 0 Z"
                      fill={petalColor}
                      stroke={theme.petalEdge}
                      strokeWidth="1.2"
                    />
                  </g>

                  {/* Lower side petals when blooming open */}
                  <g
                    style={{
                      transform: `rotate(${-spread * 1.55}deg) scale(${0.75 + theme.bloomOpenness * 0.25})`,
                      opacity: 0.4 + theme.bloomOpenness * 0.6,
                      transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path
                      d="M 0 0 C -9 -14, -7 -32, 0 -40 C 7 -32, 9 -14, 0 0 Z"
                      fill={theme.petalSecondary}
                      stroke={theme.petalEdge}
                      strokeWidth="1"
                    />
                  </g>
                  <g
                    style={{
                      transform: `rotate(${spread * 1.55}deg) scale(${0.75 + theme.bloomOpenness * 0.25})`,
                      opacity: 0.4 + theme.bloomOpenness * 0.6,
                      transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path
                      d="M 0 0 C -9 -14, -7 -32, 0 -40 C 7 -32, 9 -14, 0 0 Z"
                      fill={theme.petalSecondary}
                      stroke={theme.petalEdge}
                      strokeWidth="1"
                    />
                  </g>

                  {/* Stamens visible as flower opens */}
                  <g
                    style={{
                      opacity: theme.bloomOpenness > 0.55 ? 1 : 0.15,
                      transition: 'opacity 600ms ease',
                    }}
                  >
                    <line x1="0" y1="0" x2="-6" y2="-24" stroke="#85A67E" strokeWidth="1.2" />
                    <line x1="0" y1="0" x2="0" y2="-28" stroke="#85A67E" strokeWidth="1.2" />
                    <line x1="0" y1="0" x2="6" y2="-24" stroke="#85A67E" strokeWidth="1.2" />
                    <circle cx="-6" cy="-25" r="2.2" fill={theme.stamen} />
                    <circle cx="0" cy="-29" r="2.3" fill={theme.stamen} />
                    <circle cx="6" cy="-25" r="2.2" fill={theme.stamen} />
                  </g>

                  {/* Center front petal */}
                  <path
                    d="M 0 0 C -10 -15, -8 -36, 0 -44 C 8 -36, 10 -15, 0 0 Z"
                    fill={lily.alt ? theme.petalPrimary : theme.petalSecondary}
                    stroke={theme.petalEdge}
                    strokeWidth="1.2"
                  />
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Sign-off */}
      <div className="relative z-10 bg-[#BBD2C6]/65 py-6 px-4 text-center">
        <p className="font-display italic text-base sm:text-lg text-[#3F2E2E]">
          Made just for Sree · Always in your corner 🤍
        </p>
      </div>
    </footer>
  );
}
