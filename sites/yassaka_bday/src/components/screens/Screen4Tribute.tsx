import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ArrowRight, ArrowLeft, Baby, Stethoscope, Home, User } from 'lucide-react';
import { sfx } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { RippedPaperCard } from '../RippedPaperCard';

interface Screen4TributeProps {
  onNext: () => void;
  onPrev?: () => void;
}

export const Screen4Tribute: React.FC<Screen4TributeProps> = ({ onNext, onPrev }) => {
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    daughter: 1,
    mom: 1,
    doctor: 1,
    human: 1,
  });

  // Soft warm chime when entering this chapter
  useEffect(() => {
    sfx.chime();
  }, []);

  const handleCardTap = (cardId: string) => {
    sfx.pop();
    setLikes((prev) => {
      const nextCount = (prev[cardId] || 0) + 1;
      if (nextCount % 4 === 0) {
        fireCelebrationConfetti();
      }
      return {
        ...prev,
        [cardId]: nextCount,
      };
    });
  };

  const pillars = [
    {
      id: 'daughter',
      numBadge: '01 · elder DAUGHTER',
      title: 'THE DAUGHTER 🤍',
      headline: 'The foundation of our family.',
      icon: Home,
      iconBg: 'bg-[#FAF5FF] text-[#7C3AED] border-[#A855F7]/30',
      tapeColor: 'lavender' as const,
      rotation: '-rotate-0.5',
      delay: '0ms',
      copy:
        'You carry our family with so much grace, patience, and quiet strength. You don’t have to have every single thing figured out to be an incredible daughter. Just you being in our lives and holding us together is more than enough.',
      footerTag: 'The Pillar of Our Home 🏡',
    },
    {
      id: 'mom',
      numBadge: '02 · THE MOM',
      title: 'THE MOM 🧸',
      headline: 'Seriously, someone needs to publish this as a book.',
      icon: Baby,
      iconBg: 'bg-[#FDF2F8] text-[#DB2777] border-[#F472B6]/30',
      tapeColor: 'pink' as const,
      rotation: 'rotate-0.5',
      delay: '150ms',
      copy:
        "The way you nurture, listen to, and raise Rhaenyra... it's pure magic. You aren’t just raising a child; you're building a whole beautiful universe for her. Watching you be her mom is hands down one of the most heartwarming things to witness.",
      footerTag: "Rhaenyra's Whole World 🧸✨",
    },
    {
      id: 'doctor',
      numBadge: '03 · THE DOCTOR',
      title: 'THE DOCTOR 🩺',
      headline: 'When it comes career you stick to your plan and youre extreamly focused',
      icon: Stethoscope,
      iconBg: 'bg-[#ECFDF5] text-[#059669] border-[#34D399]/30',
      tapeColor: 'mint' as const,
      rotation: '-rotate-0.5',
      delay: '300ms',
      copy:
        'You don\'t just treat illnesses. You pour your heart and soul into hospital shifts, caring for everyone who walks through the door. Just promise Ugesh that you’ll save a little bit of that gentle, restorative care for yourself, too.',
      footerTag: 'Dr. Yashwanthi M.B.B.S. 🩺',
    },
    {
      id: 'human',
      numBadge: '04 · THE AWESOME HUMAN',
      title: 'THE AWESOME HUMAN ✨',
      headline: 'Beyond every single title: Yaswanthi.',
      icon: User,
      iconBg: 'bg-[#FEF3C7] text-[#D97706] border-[#FBBF24]/30',
      tapeColor: 'yellow' as const,
      rotation: 'rotate-0.5',
      delay: '450ms',
      copy:
        'Long before the stethoscope, and behind all the responsibilities you carry for everyone else... you are Yaswanthi. The girl who laughs and make us laugh, the one with an amazing heart, the one who feels so deeply. At 10-20-30-any age, being YOU is what we celebrate the most.',
      footerTag: 'Yaswanthi — Pure Light 👑',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative">
      {/* Top Header */}
      <div className="text-center mb-9">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#F3E8FF] text-[#7C3AED] border border-[#A855F7]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>STEP 4 OF 7 · CHAPTER 30 PERSPECTIVE 🤍</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#200D30] font-semibold tracking-tight leading-tight">
          Beyond all the titles
        </h1>

        <p className="font-sans-body text-[#581C87]/80 text-sm sm:text-base mt-2.5 max-w-lg mx-auto leading-relaxed">
          Akka, idha kelunga. You wear so many hats every single day, but here is how Ugesh sees you.
        </p>
      </div>

      {/* The 4 Staggered Ripped Paper Cards */}
      <div className="space-y-8 mb-10">
        {pillars.map((p, idx) => {
          const IconComp = p.icon;
          return (
            <div
              key={p.id}
              className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
              style={{ animationDelay: p.delay }}
            >
              <div
                onClick={() => handleCardTap(p.id)}
                className="cursor-pointer active:scale-[0.98] transition-transform duration-200"
                title="Tap to shower love!"
              >
                <RippedPaperCard
                  paperColor="#FFFDF9"
                  tapeColor={p.tapeColor}
                  tapePosition={idx % 2 === 0 ? 'top-left' : 'top-right'}
                  rotation={p.rotation}
                  innerClassName="p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs transition-transform group-hover:scale-105 ${p.iconBg}`}
                    >
                      <IconComp className="w-6 h-6 stroke-[1.75]" />
                    </div>

                    <div className="flex-1">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#7C3AED] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full border border-[#A855F7]/25 shadow-2xs">
                          {p.numBadge}
                        </span>
                        <span className="font-serif italic text-xs text-[#6B21A8]/70">
                          {p.footerTag}
                        </span>
                      </div>

                      {/* Main Title & Headline */}
                      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#200D30] mb-1 tracking-tight">
                        {p.title}
                      </h2>

                      <h3 className="font-sans-body text-sm sm:text-base font-semibold text-[#7C3AED] mb-3 leading-snug">
                        "{p.headline}"
                      </h3>

                      {/* Heartfelt Copy */}
                      <p className="font-serif text-base sm:text-lg text-[#2B211E] leading-relaxed italic">
                        "{p.copy}"
                      </p>

                      {/* Interactive Heart Counter */}
                      <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between">
                        <span className="text-[11px] font-sans-body text-[#7C3AED]/70 italic">
                          Tap card to send warmth 💌
                        </span>

                        <div className="flex items-center gap-1.5 text-xs bg-white/95 hover:bg-[#F3E8FF] text-[#200D30] px-3.5 py-1.5 rounded-full border border-[#A855F7]/30 transition-all shadow-2xs">
                          <Heart className="w-3.5 h-3.5 text-[#7C3AED] fill-[#7C3AED] animate-pulse" />
                          <span className="font-sans-body font-semibold text-[#581C87]">
                            {likes[p.id]} Appreciations
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </RippedPaperCard>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Sibling Sticky Note */}
      <div className="mb-10 max-w-lg mx-auto">
        <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-300 p-5 sm:p-6 rounded-2xl bg-[#FEF9C3] border border-amber-200/90 shadow-lg shadow-amber-900/5 text-[#78350F]">
          {/* Pushpin at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center text-xl filter drop-shadow-sm select-none">
            📌
          </div>

          <div className="pt-2 text-center">
            <span className="inline-block text-[11px] font-mono font-bold tracking-wider uppercase text-amber-800/80 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/40 mb-2">
              Official Note from Ugesh 📜
            </span>
            <p className="font-hand text-xl sm:text-2xl text-[#78350F] leading-snug font-medium">
              "Reminder from Ugesh: Leave the superhero cape at the door today. Be yourself, no stressing - today is strictly for feeling loved. ❤️"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-200/60 max-w-2xl mx-auto">
        {onPrev ? (
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              onPrev();
            }}
            className="px-4 py-2.5 rounded-xl text-[#6B21A8] font-sans-body text-xs sm:text-sm font-medium hover:text-[#200D30] hover:bg-purple-100/50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Flowers</span>
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={() => {
            sfx.pop();
            onNext();
          }}
          className="violet-glow-btn py-3 px-7 text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-lg active:scale-98"
        >
          <span>Continue to Ugesh's Notes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
