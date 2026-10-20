import React, { useEffect } from 'react';
import { QuizState } from '../../types';
import { Polaroid } from '../Polaroid';
import { WashiTape } from '../WashiTape';
import { sfx } from '../../utils/audio';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera
} from 'lucide-react';

export const PHOTO_MEMORIES = [
  // 5 New Photos Added First
  {
    id: "16vwxeuDFfqjc57Iqj117f6VTzFqQ-Gae",
    rotation: "-1.8deg",
    tape: "peach" as const,
    sticker: "✨"
  },
  {
    id: "1fSyylp0XCPLzifwpKilZb8eNe9HwLHyq",
    rotation: "1.5deg",
    tape: "pink" as const,
    sticker: "🌸"
  },
  {
    id: "1Aw0Laau61Gz0HR1lxkDvQSEIYR7WLo35",
    rotation: "-1.2deg",
    tape: "lavender" as const,
    sticker: "🤍"
  },
  {
    id: "1rCZTYmkLqT2MQlIlfYdcg0vaWiMyhpON",
    rotation: "2deg",
    tape: "gold" as const,
    sticker: "🌟"
  },
  {
    id: "1HSou-OQId9-nxp2Wka6QSizyh1OdchVT",
    rotation: "-2.2deg",
    tape: "mint" as const,
    sticker: "🧸"
  },

  // Previous 8 Photos
  {
    id: "11ifD76fUPsgs4L4ymcJS0tt7QcCdlYED",
    rotation: "-2deg",
    tape: "yellow" as const,
    sticker: "✨"
  },
  {
    id: "1UGZb390cTfW48CUk_oECkqrbFm_eWR1N",
    rotation: "1.5deg",
    tape: "vellum" as const,
    sticker: "🧸"
  },
  {
    id: "1SJ0qi6YaOLV0B_xp2ehHZbUmUhZV-eqQ",
    rotation: "-1deg",
    tape: "peach" as const,
    sticker: "🩺"
  },
  {
    id: "1WYU5Gn1hWRnTTKIhDc8Wa181_Sesd3XE",
    rotation: "2.5deg",
    tape: "pink" as const,
    sticker: "💛"
  },
  {
    id: "1E6sWwZY841_CEshW-0G7eglna38tWRh_",
    rotation: "-1.8deg",
    tape: "mint" as const,
    sticker: "🤍"
  },
  {
    id: "1DDpl-7dC-gTgdGTRubPhKJACEJETcj9s",
    rotation: "1.2deg",
    tape: "vellum" as const,
    sticker: "🎀"
  },
  {
    id: "1RiCSx9TbWEGJSJwM48eki3nf3_WZkWbv",
    rotation: "-2.2deg",
    tape: "yellow" as const,
    sticker: "📸"
  },
  {
    id: "1eMOt41obuc7QXK4_jze6ji5nNXMIV5d-",
    rotation: "1.8deg",
    tape: "gold" as const,
    sticker: "👑"
  }
];

interface Screen5PinboardProps {
  quizAnswers: QuizState;
  onNext: () => void;
  onPrev?: () => void;
}

export const Screen5Pinboard: React.FC<Screen5PinboardProps> = ({
  quizAnswers,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    sfx.chime();
  }, []);

  const soulPrescription =
    quizAnswers?.soulPrescription && quizAnswers.soulPrescription.trim() !== ''
      ? quizAnswers.soulPrescription
      : 'You are deeply loved, appreciated, and cherished beyond measure.';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Floating Ambient Sparkles/Motes */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/12 w-2 h-2 rounded-full bg-[#F59E0B]/40 blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/10 w-2.5 h-2.5 rounded-full bg-[#A855F7]/35 blur-[1px] animate-pulse delay-700" />
        <div className="absolute top-2/3 left-1/8 w-1.5 h-1.5 rounded-full bg-[#F59E0B]/50 blur-[1px] animate-pulse delay-300" />
        <div className="absolute bottom-1/6 right-1/6 w-2 h-2 rounded-full bg-[#C084FC]/40 blur-[1px] animate-pulse delay-500" />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#F3E8FF] text-[#7C3AED] border border-[#A855F7]/30 mb-3 shadow-xs">
          <Camera className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>STEP 5 OF 7 · 30 YEARS OF MEMORIES 📸✨</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#200D30] font-semibold tracking-tight leading-tight">
          The Yasakka Memory Wall
        </h1>

        <p className="font-sans-body text-[#581C87]/80 text-sm sm:text-base mt-2.5 max-w-xl mx-auto leading-relaxed">
          Caught on camera: The doctor, the mom, the sister, and the legend entering Level 30.
        </p>
      </div>

      {/* Scrapbook Cork / Linen Board Canvas */}
      <div className="relative rounded-3xl p-4 sm:p-8 md:p-10 mb-10 bg-[#FAF7F2] border-2 border-[#D4AF37]/35 shadow-[0_12px_40px_rgba(32,13,48,0.12),inset_0_2px_8px_rgba(212,175,55,0.15)] overflow-hidden">
        {/* Board Texture & Corner Thumbtacks */}
        <div className="absolute -top-1 left-4 text-[#D97706] drop-shadow-xs z-20 text-lg sm:text-xl">📌</div>
        <div className="absolute -top-1 right-4 text-[#D97706] drop-shadow-xs z-20 text-lg sm:text-xl">📌</div>
        <div className="absolute -bottom-1 left-4 text-[#D97706] drop-shadow-xs z-20 text-lg sm:text-xl">📌</div>
        <div className="absolute -bottom-1 right-4 text-[#D97706] drop-shadow-xs z-20 text-lg sm:text-xl">📌</div>

        <WashiTape color="vellum" position="top-left" />
        <WashiTape color="gold" position="top-right" />

        {/* Section Intro Tag */}
        <div className="flex items-center justify-between mb-6 border-b border-[#D4AF37]/25 pb-3">
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-serif text-sm tracking-wide text-[#200D30] font-medium">
              Keepsake Photo Gallery · Click any photo to zoom in
            </span>
          </div>
          <span className="text-xs font-sans-body px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#7C3AED] border border-[#A855F7]/20 font-medium">
            {PHOTO_MEMORIES.length} Keepsakes 📷
          </span>
        </div>

        {/* Organic Scrapbook Polaroid Grid (13 Google Drive Photos with no title/caption) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7 mb-10">
          {PHOTO_MEMORIES.map((photo, index) => (
            <div
              key={photo.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-600 fill-mode-both"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Polaroid
                imageSrc={photo.id}
                tapeColor={photo.tape}
                rotation={photo.rotation}
                sticker={photo.sticker}
                fallbackBadge="Yasakka Keepsake ✨"
                aspectRatio="aspect-[3/4]"
                objectPosition="object-top"
              />
            </div>
          ))}
        </div>

        {/* Dynamic Glowing Sticky Note: Soul Prescription (Screen 2 Connection) */}
        <div className="relative mb-2 mx-auto max-w-2xl bg-[#FEF9C3] rounded-2xl p-6 sm:p-7 border border-[#FACC15]/60 shadow-[0_8px_24px_rgba(202,138,4,0.18)] -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow-xs z-10">
            📌
          </div>
          <WashiTape color="vellum" position="top-center" />

          <div className="flex items-center justify-center gap-2 mb-2.5 text-[#854D0E]">
            <Sparkles className="w-4 h-4 text-[#CA8A04]" />
            <span className="font-sans-body text-xs uppercase tracking-wider font-bold">
              Prescription Yasakka’s Soul Needed To Hear 🩺🤍
            </span>
          </div>

          <p className="font-serif text-xl sm:text-2xl text-[#422006] italic text-center font-medium leading-relaxed px-2">
            "{soulPrescription}"
          </p>

          <p className="font-handwriting text-sm sm:text-base text-[#713F12]/80 mt-3 text-center">
            — Pinned permanently on your digital keepsake so you never forget to breathe and choose peace.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onPrev && (
          <button
            onClick={() => {
              sfx.pop();
              onPrev();
            }}
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-white/90 text-[#581C87] border border-[#A855F7]/30 font-sans-body font-medium text-sm tracking-wide shadow-sm hover:bg-white hover:border-[#A855F7] transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-[#7C3AED]" />
            <span>← Back to Beyond All Titles</span>
          </button>
        )}

        <button
          onClick={() => {
            sfx.pop();
            onNext();
          }}
          className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#581C87] text-white font-sans-body font-medium text-sm tracking-wide shadow-md hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-[#F59E0B]/40"
        >
          <span>Continue to Birthday Archives 🎞️</span>
          <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
        </button>
      </div>
    </div>
  );
};
