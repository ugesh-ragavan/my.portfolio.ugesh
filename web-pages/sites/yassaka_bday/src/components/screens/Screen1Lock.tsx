import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Volume2, VolumeX, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { sfx } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { WashiTape } from '../WashiTape';

interface Screen1LockProps {
  onUnlock: () => void;
}

interface QuestionConfig {
  id: number;
  prompt: string;
  placeholder: string;
  accepted: string[];
  canonicalAnswer: string;
  hint: string;
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 1,
    prompt: "What is the short form of systematic investment plan? 📈",
    placeholder: "Enter 3-letter acronym...",
    accepted: ["sip"],
    canonicalAnswer: "SIP",
    hint: "Hint: 3-letter acronym."
  },
  {
    id: 2,
    prompt: "On which year did the whole world celebrate your birthday? 🌍🎂",
    placeholder: "Enter the 4-digit year...",
    accepted: ["2009"],
    canonicalAnswer: "2009",
    hint: "Hint: Age gap between you and Darshini - 1 👀"
  },
  {
    id: 3,
    prompt: "What's my name? 👀❤️",
    placeholder: "Type it here...",
    accepted: ["geesh"],
    canonicalAnswer: "Geesh",
    hint: "Hint: Starts with G."
  }
];

export const Screen1Lock: React.FC<Screen1LockProps> = ({ onUnlock }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showRoast, setShowRoast] = useState(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(sfx.getMuted());

  const currentQ = QUESTIONS[currentStep - 1];

  const toggleSound = () => {
    const nextMuted = sfx.toggleMute();
    setIsMuted(nextMuted);
  };

  const proceedToNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setAttempts(0);
      setInputValue('');
      setToastMessage('');
      setShowRoast(false);
      setIsCorrectFeedback(false);
      sfx.pop();
    } else {
      triggerFinalUnlock();
    }
  };

  const triggerFinalUnlock = () => {
    setIsUnlocked(true);
    sfx.unlock();
    fireCelebrationConfetti();

    setTimeout(() => {
      onUnlock();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showRoast || isUnlocked) return;

    const normalized = inputValue.trim().toLowerCase();

    if (currentQ.accepted.includes(normalized)) {
      setIsCorrectFeedback(true);
      sfx.chime();

      setTimeout(() => {
        if (currentStep < 3) {
          proceedToNext();
        } else {
          triggerFinalUnlock();
        }
      }, 700);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setIsShaking(true);
      sfx.buzz();

      setTimeout(() => setIsShaking(false), 450);

      if (currentStep === 3 && normalized === 'ugesh') {
        setToastMessage("Aiyoo, Ugesh illa ka! Hint-ah paatheengala? Starts with G... 😜");
      } else if (nextAttempts === 1) {
        setToastMessage("Wrong answer akka! Think properly... 🧐");
      } else if (nextAttempts === 2) {
        setToastMessage("Wrong answer akka! Think properly... 🧐");
      } else if (nextAttempts >= 3) {
        setShowRoast(true);
        setInputValue(currentQ.canonicalAnswer);
        setToastMessage('');
      }
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8 relative">
      {/* Floating Audio Pill */}
      <div className="absolute top-2 right-4 z-20">
        <button
          onClick={toggleSound}
          className="violet-audio-pill px-3.5 py-1.5 rounded-full text-xs font-sans-body font-medium flex items-center gap-1.5 cursor-pointer btn-squish"
          title="Toggle SFX"
        >
          {!isMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
              <span>🎵 SFX: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <span>🔇 SFX: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Birthday Card */}
      <div
        className={`relative w-full max-w-md birthday-card p-7 sm:p-9 transition-all ${
          isShaking ? 'animate-card-shake' : ''
        }`}
      >
        <WashiTape color="lavender" position="top-left" />
        <WashiTape color="yellow" position="top-right" />

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="violet-foil-badge px-3 py-1 rounded-full text-xs font-serif text-[#200D30] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
            <span className="font-semibold">Question {currentStep} of 3 🔐</span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s < currentStep || isUnlocked
                    ? 'bg-[#7C3AED] scale-110'
                    : s === currentStep
                    ? 'bg-[#200D30] ring-2 ring-[#A855F7]/40'
                    : 'bg-[#E9D5FF]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Central Glowing Padlock Icon */}
        <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
          <div
            className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-500 shadow-md border ${
              isUnlocked
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300 scale-105'
                : 'bg-[#F3E8FF] text-[#7C3AED] border-[#A855F7]/35 ring-6 ring-[#FAF5FF]'
            }`}
          >
            {isUnlocked ? (
              <Unlock className="w-8 h-8 animate-bounce text-emerald-600" />
            ) : (
              <Lock className="w-8 h-8 stroke-[1.85]" />
            )}
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#200D30] font-semibold tracking-tight leading-tight">
            Hlooooo Yassakka:)
          </h1>
          <p className="font-sans-body text-[#6B21A8]/80 text-sm mt-1.5 leading-relaxed font-normal">
            Prove you're the real Yasakka before unlocking Chapter 30.
          </p>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#FAF5FF]/90 border border-[#A855F7]/25 rounded-2xl p-4 text-left shadow-xs">
            <label
              htmlFor="question-input"
              className="block font-serif text-base sm:text-lg text-[#200D30] mb-2 leading-snug font-medium"
            >
              {currentQ.prompt}
            </label>

            <div className="relative">
              <input
                id="question-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (toastMessage) setToastMessage('');
                }}
                placeholder={currentQ.placeholder}
                disabled={showRoast || isUnlocked || isCorrectFeedback}
                className="w-full px-4 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white text-[#200D30] placeholder:text-[#6B21A8]/40 font-sans-body text-sm transition-all"
                autoComplete="off"
                autoFocus
              />

              {isCorrectFeedback && (
                <div className="absolute right-3 top-2.5 text-emerald-600">
                  <CheckCircle className="w-5 h-5 animate-in zoom-in" />
                </div>
              )}
            </div>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-purple-100/80 border border-purple-300 text-[#581C87] font-sans-body text-xs sm:text-sm text-center animate-in fade-in font-medium">
              {toastMessage}
            </div>
          )}

          {/* Sibling Handwritten Sticky Note */}
          {attempts >= 2 && !showRoast && (
            <div className="doodle-note flex items-center gap-2 animate-in zoom-in-95">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-base">{currentQ.hint}</span>
            </div>
          )}

          {/* Roast Banner & Proceed Button */}
          {showRoast && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-[#FEF9C3] border-2 border-amber-400 text-amber-950 font-handwriting text-xl text-center shadow-xs font-bold">
                Innum Payirchi thevai ka ungaluku 😂🤦‍♂️
              </div>

              <button
                type="button"
                onClick={proceedToNext}
                className="violet-glow-btn w-full py-3 px-6 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer btn-squish"
              >
                <span>Seri, next question-ku palam 👉</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Verify Button */}
          {!showRoast && (
            <button
              type="submit"
              disabled={!inputValue.trim() || isUnlocked || isCorrectFeedback}
              className="violet-glow-btn w-full py-3.5 px-6 text-sm tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer btn-squish"
            >
              {isCorrectFeedback ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" /> Verified ✨
                </>
              ) : (
                <>
                  <span>Verify Answer 🔓</span>
                </>
              )}
            </button>
          )}
        </form>

        {/* Final Unlock Banner */}
        {isUnlocked && (
          <div className="mt-5 p-4 rounded-2xl bg-purple-100 border-2 border-[#7C3AED] text-[#200D30] font-serif text-lg text-center font-semibold animate-in zoom-in-95 shadow-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span>All 3 Cleared! Seri, ulla vaanga birthday queen! 🥳❤️</span>
          </div>
        )}

        {/* Subtext Footer */}
        <div className="mt-6 pt-4 border-t border-purple-200/50 text-center">
          <p className="font-handwriting text-sm text-[#6B21A8]/80 font-bold">
            Official Notification from Ugesh 📜 · Crafted with 100% sisterly love ❤️
          </p>
        </div>
      </div>
    </div>
  );
};
