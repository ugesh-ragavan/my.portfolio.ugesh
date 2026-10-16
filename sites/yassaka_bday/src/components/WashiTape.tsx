import React from 'react';

interface WashiTapeProps {
  color?: 'peach' | 'pink' | 'mint' | 'lavender' | 'yellow' | 'vellum' | 'gold';
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-center' | 'bottom-right';
  className?: string;
  rotation?: number;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = 'vellum',
  position = 'top-left',
  className = '',
  rotation,
}) => {
  // Elevated vellum palette with subtle hairline borders
  const colorMap = {
    vellum: 'bg-[#F2ECE1]/70 border-amber-900/15',
    peach: 'bg-[#F8EFE6]/75 border-[#C59B27]/25',
    pink: 'bg-[#F7EBEB]/70 border-[#D48C92]/25',
    mint: 'bg-[#EBF2EB]/70 border-[#7D8F7A]/25',
    lavender: 'bg-[#F1ECF5]/70 border-purple-900/15',
    yellow: 'bg-[#FBF6E5]/75 border-[#C59B27]/30',
    gold: 'bg-[#F6EED8]/80 border-[#C59B27]/40',
  };

  const positionMap = {
    'top-left': '-top-2.5 -left-2.5 -rotate-2',
    'top-right': '-top-2.5 -right-2.5 rotate-2',
    'top-center': '-top-3 left-1/2 -translate-x-1/2 -rotate-1',
    'bottom-center': '-bottom-3 left-1/2 -translate-x-1/2 rotate-1',
    'bottom-right': '-bottom-2.5 -right-2.5 -rotate-1.5',
  };

  const defaultRot = rotation !== undefined ? `rotate-[${rotation}deg]` : positionMap[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute z-20 h-5 w-20 pointer-events-none backdrop-blur-xs border-t border-b transition-transform ${colorMap[color]} ${defaultRot} ${className}`}
      style={{
        clipPath: 'polygon(0% 5%, 98% 0%, 100% 95%, 2% 100%)',
        boxShadow: '0 2px 5px rgba(120, 90, 70, 0.04)',
      }}
    />
  );
};
