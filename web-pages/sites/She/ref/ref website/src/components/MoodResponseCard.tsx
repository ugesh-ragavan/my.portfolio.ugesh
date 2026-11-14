import { motion } from 'motion/react';
import type { MoodDefinition } from '../data/moods';

interface MoodResponseCardProps {
  mood: MoodDefinition;
  onScrollToGames?: () => void;
}

export function MoodResponseCard({ mood }: MoodResponseCardProps) {
  return (
    <motion.div
      key={mood.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl border border-[#EADCD5] ${mood.cardBg} p-6 sm:p-8 shadow-[0_10px_35px_-18px_rgba(63,46,46,0.16)]`}
    >
      {/* Subtle floating celebratory sparkles for happy mood */}
      {mood.id === 'happy' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[12, 28, 52, 74, 88].map((left, idx) => (
            <span
              key={left}
              style={{ left: `${left}%`, animationDelay: `${idx * 0.45}s` }}
              className="absolute bottom-2 text-lg animate-heart-rise select-none"
            >
              ✨
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 text-xs font-medium text-[#7A6363]">
          <span className="text-lg" aria-hidden="true">
            {mood.emoji}
          </span>
          <span>For you</span>
          <span aria-hidden="true">·</span>
          <span>{mood.shortLabel}</span>
        </div>

        <h3 className="mt-3.5 font-display italic text-2xl sm:text-3xl font-medium text-[#3F2E2E] text-balance leading-snug">
          {mood.greeting}
        </h3>

        <p className="mt-3.5 text-base sm:text-[17px] leading-relaxed text-[#523F3F] max-w-2xl font-normal whitespace-pre-line">
          {mood.message}
        </p>

        {mood.closingNote ? (
          <p className="mt-6 pt-4 border-t border-[#EADCD5]/80 font-display italic text-base sm:text-[17px] text-[#7A5959]">
            — {mood.closingNote}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
