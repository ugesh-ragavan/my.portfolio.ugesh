import React, { useState } from 'react';
import { QuizState, FlowerType } from '../../types';
import { sfx } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { WashiTape } from '../WashiTape';
import { Sparkles, ArrowRight, ArrowLeft, Check, MessageSquareHeart } from 'lucide-react';

interface Screen2QuizProps {
  initialAnswers: QuizState;
  onComplete: (answers: QuizState) => void;
}

export const Screen2Quiz: React.FC<Screen2QuizProps> = ({ initialAnswers, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizState>(initialAnswers);

  const flowerOptions: { id: FlowerType; label: string; icon: string; reaction: string }[] = [
    { 
      id: 'sunflower', 
      label: 'Sunflower (Warm, bright, and golden)', 
      icon: '🌻',
      reaction: "Ugi's note: Sunflowers just like your radiant energy! Page 3 is going to bloom with golden warmth 🌻✨"
    },
    { 
      id: 'rose', 
      label: 'Rose (Classic, deep, and elegant)', 
      icon: '🌹',
      reaction: "Ugi's note: Elegant & timeless, just like Yasakka. Velvety crimson blooms coming up next 🌹"
    },
    { 
      id: 'tulip', 
      label: 'Tulip (Soft, aesthetic, and cozy)', 
      icon: '🌷',
      reaction: "Ugi's note: Lilac and blush tulips. Gentle, calm, and effortlessly aesthetic 🌷🤍"
    },
    { 
      id: 'jasmine', 
      label: 'Jasmine / Mallipoo (Pure, peaceful, and fragrant)', 
      icon: '🤍',
      reaction: "Ugi's note: Pure South Indian nostalgia! Can already smell the peaceful temple garden fragrance 🌸"
    },
    { 
      id: 'all', 
      label: "All flowers! Don't make me choose da!", 
      icon: '💐',
      reaction: "Ugi's note: Haha greediness pro max! You get the grand royal botanical garden on Page 3 then 💐👑"
    },
  ];

  const escapeWishes = [
    { 
      text: 'Sleeping 10 hours straight with zero alarms and zero phone calls', 
      icon: '😴',
      reaction: "Ugi's promise: I'll personally guard the door with a 'Do Not Disturb the Doctor' notice 🤫🛌"
    },
    { 
      text: 'A peaceful trip where nobody asks for medical advice or toddler snacks', 
      icon: '🏝️',
      reaction: "Ugi's note: Dr. Yasakka is OFFICIALLY OFF DUTY! Strictly tropical breezes and mocktails only 🍹🌴"
    },
    { 
      text: 'Uninterrupted good food and an empty schedule', 
      icon: '🍕',
      reaction: "Ugi's note: Hot food eaten at normal speed with zero pending clinical tasks. Total luxury! 🍲😋"
    },
    { 
      text: 'Cuddling with Rhaenyra without worrying about chores or work', 
      icon: '🧸',
      reaction: "Ugi's note: The sweetest, softest therapy in the universe. Rhaenyra cuddle session unlocked 🧸❤️"
    },
    { 
      text: 'All of the above in one giant package, please', 
      icon: '👑',
      reaction: "Ugi's note: That's the Yasakka standard! You deserve every single bit of this package today 👑✈️"
    },
  ];

  const soulPrescriptions = [
    { 
      text: 'You are doing 1000x better than you think you are.', 
      tag: 'Strict Truth 💊',
      reaction: "Geesh: Take this pill twice a day. You are our absolute anchor and champion ❤️"
    },
    { 
      text: "You're allowed to turn off your doctor brain and just rest.", 
      tag: 'Doctor Order 🛑',
      reaction: "Geesh: Counter-prescription from your brother: Rest is non-negotiable! 🛌✨"
    },
    { 
      text: "You don't have to be perfect to be the best human.", 
      tag: 'Grace & Heart ❤️',
      reaction: "Geesh: Your heart and care are already way more than enough. Be kind to yourself today 🌸"
    },
    { 
      text: 'You are deeply loved, appreciated, and cherished beyond measure.', 
      tag: 'From Geesh & Family 🩺',
      reaction: "Geesh: Forever and always. The greatest sister in the whole world 🫂💖"
    },
  ];

  const birthdayVibes = [
    { 
      text: 'Cosy & quiet (blanket, tea, good film, no noise)', 
      icon: '🛋️',
      reaction: "Ugi's note: Dim lights, warm blanket, warm cup in hand. Peak comforting introverted bliss ☕✨"
    },
    { 
      text: 'Full-on celebration & cake smash! Level 30 unlocked', 
      icon: '🎂',
      reaction: "Ugi's note: LEVEL 30 UNLOCKED! Bring on the candles and party poppers 🎉🥳"
    },
    { 
      text: 'Peaceful, grateful, and taking life one day at a time', 
      icon: '🌿',
      reaction: "Ugi's note: Grounded wisdom. Chapter 30 is going to be your most centered year yet 🌿🤍"
    },
    { 
      text: 'Surprise me, Ugesh! (I trust your creativity)', 
      icon: '✨',
      reaction: "Ugi's note: Challenge accepted! Just wait till you blow the candle and read Page 7 😉🚀"
    },
  ];

  const happinessOptions = [
    { 
      level: 1, 
      label: '1 — life romba busy & exhausting', 
      icon: '😭',
      reaction: "Ugi: Don't worry, this universe was built specifically to recharge your batteries to 100%! 🔋❤️"
    },
    { 
      level: 2, 
      label: '2 — Running on pure willpower', 
      icon: '☕',
      reaction: "Ugi: Here's a virtual giant hug and warm chamomile tea. Put your feet up, ka! 🫂"
    },
    { 
      level: 3, 
      label: '3 — Steady, peaceful, doing okay', 
      icon: '🤍',
      reaction: "Ugi: Steady and solid. Let's lift it higher with flowers and birthday cake ahead! 🌸"
    },
    { 
      level: 4, 
      label: '4 — Truly happy and feeling the love', 
      icon: '🌸',
      reaction: "Ugi: That makes my day! Keep that smile glowing as we open the floral garden ✨"
    },
    { 
      level: 5, 
      label: '5 — LEVEL 30 BIRTHDAY QUEEN MODE ON', 
      icon: '👑',
      reaction: "Ugi: YAAAS! Full birthday royalty mode activated! 👑🎂 Let's assemble the universe!"
    },
  ];

  const handleSelectOption = (update: Partial<QuizState>) => {
    sfx.pop();
    setAnswers((prev) => ({ ...prev, ...update }));
  };

  const handleNext = () => {
    sfx.pop();
    if (currentQuestion < 4) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      sfx.chime();
      fireCelebrationConfetti();
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    sfx.tap();
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Get active sibling reaction note based on the active question's selected answer
  const getActiveReaction = () => {
    if (currentQuestion === 0) {
      const match = flowerOptions.find(f => f.id === answers.flower);
      return match?.reaction;
    }
    if (currentQuestion === 1) {
      const match = escapeWishes.find(w => w.text === answers.escapeWish);
      return match?.reaction;
    }
    if (currentQuestion === 2) {
      const match = soulPrescriptions.find(p => p.text === answers.soulPrescription);
      return match?.reaction;
    }
    if (currentQuestion === 3) {
      const match = birthdayVibes.find(v => v.text === answers.birthdayVibe);
      return match?.reaction;
    }
    if (currentQuestion === 4) {
      const match = happinessOptions.find(h => h.level === answers.happinessLevel);
      return match?.reaction;
    }
    return null;
  };

  const currentReaction = getActiveReaction();

  return (
    <div className="max-w-xl mx-auto px-4 py-8 relative">
      {/* Frosted Glass Card with Violet Border & Top Washi Tape */}
      <div
        className="relative rounded-3xl p-6 sm:p-9 border shadow-xl transition-all duration-300 backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          border: '1.5px solid rgba(168, 85, 247, 0.32)',
          boxShadow: '0 20px 45px -10px rgba(124, 58, 237, 0.12)',
        }}
      >
        <WashiTape color="lavender" position="top-right" />
        <WashiTape color="yellow" position="top-left" />

        {/* Top Header Badge */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#F3E8FF] text-[#7C3AED] border border-[#A855F7]/30 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span>STEP 2 OF 7 · YASAKKA 3.0 MOOD CHECK 🌷</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#200D30] font-semibold tracking-tight leading-tight">
            Quick Check-in, Yasakka! ✨
          </h1>

          <p className="font-sans-body text-xs sm:text-sm text-[#581C87]/80 mt-2 leading-relaxed max-w-md mx-auto">
            No wrong answers here. Choose whatever feels like you right now. Ugesh will still support you even if you pick something totally chaotic 😂
          </p>
        </div>

        {/* Progress Tracker Pill & Violet Bar */}
        <div className="mb-6 pb-4 border-b border-purple-200/60">
          <div className="flex items-center justify-between text-xs font-medium text-[#7C3AED] mb-2 font-mono">
            <span className="font-sans-body text-[#581C87] font-semibold">Question Progress</span>
            <span className="bg-[#FAF5FF] border border-[#A855F7]/30 px-2.5 py-0.5 rounded-full shadow-2xs font-bold text-[#7C3AED]">
              {currentQuestion + 1} / 5
            </span>
          </div>

          <div className="w-full bg-[#E9D5FF]/70 h-2.5 rounded-full overflow-hidden p-0.5 border border-[#A855F7]/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#A855F7] transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question View with Smooth Key Transition */}
        <div key={currentQuestion} className="animate-in fade-in zoom-in-98 duration-300">
          
          {/* Question 1: The Flower */}
          {currentQuestion === 0 && (
            <div>
              <div className="text-center mb-5">
                <span className="inline-block text-xs uppercase tracking-wider text-[#7C3AED] font-semibold bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-purple-200 mb-1.5">
                  Visual Theme Input 🌸
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#200D30] font-medium leading-snug">
                  What flower would instantly make your day brighter? 🌸
                </h2>
              </div>

              <div className="space-y-2.5">
                {flowerOptions.map((f) => {
                  const isSelected = answers.flower === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectOption({ flower: f.id })}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F3E8FF] shadow-sm'
                          : 'border-purple-100 bg-white/85 hover:border-purple-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-115 transition-transform shrink-0">
                          {f.icon}
                        </span>
                        <span className="font-serif text-base sm:text-lg text-[#200D30] font-medium leading-snug">
                          {f.label}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-amber-300 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 2: The Ultimate Escape Plan */}
          {currentQuestion === 1 && (
            <div>
              <div className="text-center mb-5">
                <span className="inline-block text-xs uppercase tracking-wider text-[#7C3AED] font-semibold bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-purple-200 mb-1.5">
                  Fantasy Break ☁️
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#200D30] font-medium leading-snug">
                  Right now, what would feel like absolute heaven? ☁️
                </h2>
              </div>

              <div className="space-y-2.5">
                {escapeWishes.map((w, idx) => {
                  const isSelected = answers.escapeWish === w.text;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption({ escapeWish: w.text })}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F3E8FF] shadow-sm'
                          : 'border-purple-100 bg-white/85 hover:border-purple-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-115 transition-transform shrink-0">
                          {w.icon}
                        </span>
                        <span className="font-serif text-base sm:text-lg text-[#200D30] font-medium leading-snug">
                          {w.text}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-amber-300 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 3: The Reminder You Need Today */}
          {currentQuestion === 2 && (
            <div>
              <div className="text-center mb-5">
                <span className="inline-block text-xs uppercase tracking-wider text-[#7C3AED] font-semibold bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-purple-200 mb-1.5">
                  Soul Prescription 🩺
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#200D30] font-medium leading-snug">
                  Which prescription does Yasakka’s soul need to hear? 🩺🤍
                </h2>
              </div>

              <div className="space-y-2.5">
                {soulPrescriptions.map((p, idx) => {
                  const isSelected = answers.soulPrescription === p.text;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption({ soulPrescription: p.text })}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F3E8FF] shadow-sm'
                          : 'border-purple-100 bg-white/85 hover:border-purple-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <span className="inline-block text-[11px] font-sans-body uppercase tracking-wider text-[#7C3AED] font-bold mb-1">
                          {p.tag}
                        </span>
                        <p className="font-serif text-lg sm:text-xl text-[#200D30] font-medium leading-snug">
                          "{p.text}"
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-amber-300 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 4: Chapter 30 Vibe */}
          {currentQuestion === 3 && (
            <div>
              <div className="text-center mb-5">
                <span className="inline-block text-xs uppercase tracking-wider text-[#7C3AED] font-semibold bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-purple-200 mb-1.5">
                  Milestone Energy 🎀
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#200D30] font-medium leading-snug">
                  What is your official mood entering your 30s? 🎀
                </h2>
              </div>

              <div className="space-y-2.5">
                {birthdayVibes.map((v, idx) => {
                  const isSelected = answers.birthdayVibe === v.text;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption({ birthdayVibe: v.text })}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F3E8FF] shadow-sm'
                          : 'border-purple-100 bg-white/85 hover:border-purple-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-115 transition-transform shrink-0">
                          {v.icon}
                        </span>
                        <span className="font-serif text-base sm:text-lg text-[#200D30] font-medium leading-snug">
                          {v.text}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-amber-300 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 5: Happiness Meter */}
          {currentQuestion === 4 && (
            <div>
              <div className="text-center mb-5">
                <span className="inline-block text-xs uppercase tracking-wider text-[#7C3AED] font-semibold bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-purple-200 mb-1.5">
                  Soul Diagnostics 😌
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#200D30] font-medium leading-snug">
                  On a scale of 1 to 5, how full is your heart today? 😌
                </h2>
              </div>

              <div className="space-y-2.5">
                {happinessOptions.map((h) => {
                  const isSelected = answers.happinessLevel === h.level;
                  return (
                    <button
                      key={h.level}
                      type="button"
                      onClick={() => handleSelectOption({ happinessLevel: h.level })}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F3E8FF] shadow-sm'
                          : 'border-purple-100 bg-white/85 hover:border-purple-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-115 transition-transform shrink-0">
                          {h.icon}
                        </span>
                        <span className="font-serif text-base sm:text-lg text-[#200D30] font-medium leading-snug">
                          {h.label}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-amber-300 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Sibling Banter Reaction Note */}
        {currentReaction && (
          <div className="mt-5 p-3 sm:p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#A855F7]/25 flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-2xs">
            <MessageSquareHeart className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <p className="font-hand text-sm sm:text-base text-[#581C87] font-medium leading-snug">
              {currentReaction}
            </p>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-purple-200/60">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-4 py-2.5 rounded-xl text-[#6B21A8] font-sans-body text-xs sm:text-sm font-medium hover:text-[#200D30] hover:bg-purple-100/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentQuestion < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="violet-glow-btn py-2.5 px-6 text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="py-3 px-7 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#A855F7] text-white font-serif font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Assemble My Birthday Universe ✨</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
