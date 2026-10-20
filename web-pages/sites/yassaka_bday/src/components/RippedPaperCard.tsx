import React from 'react';
import { WashiTape } from './WashiTape';

interface RippedPaperCardProps {
  children: React.ReactNode;
  className?: string;
  paperColor?: string;
  rotation?: string;
  tapeColor?: 'peach' | 'pink' | 'mint' | 'lavender' | 'yellow' | 'vellum' | 'gold';
  tapePosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  bottomTapeColor?: 'peach' | 'pink' | 'mint' | 'lavender' | 'yellow' | 'vellum' | 'gold';
  bottomTapePosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  showTornTop?: boolean;
  showTornBottom?: boolean;
  innerClassName?: string;
}

export const RippedPaperCard: React.FC<RippedPaperCardProps> = ({
  children,
  className = '',
  paperColor = '#FFFDF9',
  rotation = '',
  tapeColor,
  tapePosition = 'top-left',
  bottomTapeColor,
  bottomTapePosition = 'bottom-right',
  showTornTop = true,
  showTornBottom = true,
  innerClassName = 'p-6 sm:p-9',
}) => {
  return (
    <div className={`relative transition-transform duration-300 ${rotation} ${className}`}>
      {/* Decorative Washi Tapes */}
      {tapeColor && <WashiTape color={tapeColor} position={tapePosition} />}
      {bottomTapeColor && <WashiTape color={bottomTapeColor} position={bottomTapePosition} />}

      {/* Main Container with drop shadow */}
      <div className="relative filter drop-shadow-[0_12px_28px_rgba(76,29,149,0.09)]">
        
        {/* Top Torn Ripped Edge */}
        {showTornTop && (
          <div className="w-full overflow-hidden leading-none -mb-[1px]">
            <svg
              viewBox="0 0 1200 28"
              preserveAspectRatio="none"
              className="w-full h-5 sm:h-7 block"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fibrous under-tear deckle layer (darker paper fiber) */}
              <path
                d="M0,28 L0,12 Q25,7 50,14 T100,8 T150,15 T200,6 T250,13 T300,7 T350,14 T400,6 T450,13 T500,8 T550,15 T600,6 T650,12 T700,7 T750,14 T800,6 T850,13 T900,8 T950,14 T1000,7 T1050,13 T1100,8 T1150,14 T1200,10 L1200,28 Z"
                fill="#E8DFD3"
                opacity="0.85"
              />
              {/* Main crisp torn paper edge */}
              <path
                d="M0,28 L0,16 C30,9 60,18 90,11 C130,5 160,16 195,10 C230,17 265,8 300,15 C340,7 375,16 410,11 C450,5 480,17 515,10 C550,17 585,8 620,15 C660,7 690,16 730,10 C770,5 805,17 840,11 C875,16 910,8 945,15 C980,8 1020,16 1060,10 C1100,5 1140,16 1175,10 C1190,13 1200,11 1200,28 Z"
                fill={paperColor}
              />
            </svg>
          </div>
        )}

        {/* Paper Surface with subtle artisanal deckle borders & texture */}
        <div
          style={{ backgroundColor: paperColor }}
          className={`relative border-x border-[#EADFCF]/70 text-[#2B211E] ${
            !showTornTop ? 'rounded-t-2xl' : ''
          } ${!showTornBottom ? 'rounded-b-2xl' : ''} ${innerClassName}`}
        >
          {/* Subtle faint paper fiber grain / ruled lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
            style={{
              backgroundImage:
                'radial-gradient(#E8DFC8 0.75px, transparent 0.75px), radial-gradient(#E8DFC8 0.75px, #FFFDF9 0.75px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          {/* Sibling Notebook Ripped Hole Accents on Left Edge (optional subtle perforation) */}
          <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around pointer-events-none opacity-20">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#B39F82]" />
            ))}
          </div>

          {/* Children Content */}
          <div className="relative z-10">{children}</div>
        </div>

        {/* Bottom Torn Ripped Edge */}
        {showTornBottom && (
          <div className="w-full overflow-hidden leading-none -mt-[1px]">
            <svg
              viewBox="0 0 1200 28"
              preserveAspectRatio="none"
              className="w-full h-5 sm:h-7 block"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fibrous under-tear deckle layer */}
              <path
                d="M0,0 L0,16 Q25,21 50,14 T100,20 T150,13 T200,22 T250,15 T300,21 T350,14 T400,22 T450,15 T500,20 T550,13 T600,22 T650,16 T700,21 T750,14 T800,22 T850,15 T900,20 T950,14 T1000,21 T1050,15 T1100,20 T1150,14 T1200,18 L1200,0 Z"
                fill="#E8DFD3"
                opacity="0.85"
              />
              {/* Main crisp torn paper edge */}
              <path
                d="M0,0 L0,12 C30,19 60,10 90,17 C130,23 160,12 195,18 C230,11 265,20 300,13 C340,21 375,12 410,17 C450,23 480,11 515,18 C550,11 585,20 620,13 C660,21 690,12 730,18 C770,23 805,11 840,17 C875,12 910,20 945,13 C980,20 1020,12 1060,18 C1100,23 1140,12 1175,18 C1190,15 1200,17 1200,0 Z"
                fill={paperColor}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
