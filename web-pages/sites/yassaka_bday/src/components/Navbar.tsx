import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { sfx } from '../utils/audio';

interface NavbarProps {
  currentStep: number;
  highestUnlockedStep: number;
  onSelectStep: (step: number) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  highestUnlockedStep,
  onSelectStep,
  onReset,
}) => {
  const [isMuted, setIsMuted] = useState(sfx.getMuted());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleSound = () => {
    const nextMuted = sfx.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleStepClick = (step: number) => {
    if (step <= highestUnlockedStep) {
      sfx.pop();
      onSelectStep(step);
    }
  };

  const stepLabels = [
    'Chamber',
    'Curations',
    'Botanical',
    'Pillars',
    'Keepsake',
    'Archives',
    'Finale',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5FF]/85 backdrop-blur-md border-b border-[#A855F7]/25 px-4 sm:px-8 py-3 transition-all shadow-[0_4px_24px_-8px_rgba(45,18,66,0.08)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Royal Violet Stamped Foil Badge */}
        <div className="flex items-center gap-3">
          <div className="violet-foil-badge px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="font-serif text-sm tracking-wide text-[#200D30] font-medium">
              Chapter 30 · <span className="italic text-[#7C3AED] font-semibold">Dr. Yaswanthi</span>
            </span>
          </div>

          <span className="text-xs font-sans-body text-[#6B21A8]/70 hidden md:inline">
            Step {currentStep} of 7
          </span>

          {/* Stepper Dots */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => {
              const isUnlocked = s <= highestUnlockedStep;
              const isCurrent = s === currentStep;
              return (
                <button
                  key={s}
                  onClick={() => handleStepClick(s)}
                  disabled={!isUnlocked}
                  title={`Step ${s}: ${stepLabels[s - 1]}`}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#7C3AED] text-white font-semibold scale-110 shadow-xs'
                      : isUnlocked
                      ? 'bg-[#F3E8FF] text-[#581C87] hover:bg-[#E9D5FF]'
                      : 'bg-[#FAF5FF] text-neutral-300 border border-neutral-200 cursor-not-allowed opacity-40'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Violet Frosted Audio Pill & Replay */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className="violet-audio-pill px-3.5 py-1.5 rounded-full text-xs font-sans-body font-medium flex items-center gap-1.5 cursor-pointer btn-squish"
            title="Toggle Web Audio SFX"
          >
            {!isMuted ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
                <span>🎵 SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <span>🔇 SFX: OFF</span>
              </>
            )}
          </button>

          {/* Replay Button */}
          {highestUnlockedStep > 1 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-full text-[#6B21A8]/70 hover:text-[#200D30] hover:bg-[#F3E8FF] border border-transparent hover:border-[#A855F7]/30 transition-all cursor-pointer btn-squish"
              title="Replay journey from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#200D30]/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="birthday-card p-6 max-w-sm w-full text-center">
            <span className="text-2xl mb-1 inline-block">✨</span>
            <h3 className="font-serif text-2xl text-[#200D30] mt-1 font-semibold">
              Replay this Little Universe?
            </h3>
            <p className="font-sans-body text-[#581C87] text-sm mt-2 leading-relaxed">
              Experience every chapter, re-bloom your bouquet, and blow out the candle again.
            </p>
            <div className="flex gap-2.5 justify-center mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-600 text-xs hover:bg-neutral-50 transition-colors btn-squish"
              >
                Keep Exploring
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onReset();
                }}
                className="violet-glow-btn px-5 py-2 text-xs font-semibold shadow-sm btn-squish cursor-pointer"
              >
                Replay Journey ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
