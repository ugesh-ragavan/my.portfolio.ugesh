import React, { useState, useEffect } from 'react';
import { sfx } from '../../utils/audio';
import { WashiTape } from '../WashiTape';
import {
  Film,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const BIRTHDAY_VIDEOS = [
  { id: "1esu5pz1zWZdRs-qdKowK_gLgg_HrXi7m" },
  { id: "1dfmmeTMJjZjlyHfMVpazJnyOgwA9LCto" },
  { id: "1GK85sQWPizRwH_NxSISSdSaGdOE5XSQC" },
  { id: "1o4VdZS_Ijyo0-TwezRUqNmNBL6GMTZit" },
  { id: "1CvLi0wdPSFVriMNg66KMcmwVRWIgXuu8" },
  { id: "1POikDLDzLWFRxW3JNBmAkjEHfhW9eEEh" },
  { id: "1xH9ypS6FPrZZaOHUH4I5_VvLSWVfcKc3" },
  { id: "10-02_DcmBbChRL1ikvjlIZaP15M5jAZP" },
  { id: "1bJRv8ORcQ1jael9KUbC2s_Sc3CnQL8RT" },
  { id: "1xLT8hQhkpOfA6LY6sJ6cWsa9RaojG69E" },
  { id: "1VDF1HeQPEfSTw_51vtbs5kH33H3RfCQx" },
  { id: "1kL4Sy_sBfYcFIqKO5fXrsScjA5rewZAj" },
  { id: "1IMjKpCa1nv_4TjqrYnpMywoPNWPZXPBP" },
  { id: "1K977xN0GDR3CuInG0rU393WnF6G--Iyj" }
];

interface Screen6ArchivesProps {
  onNext: () => void;
  onPrev?: () => void;
}

export const Screen6Archives: React.FC<Screen6ArchivesProps> = ({ onNext, onPrev }) => {
  const [activeTheaterIndex, setActiveTheaterIndex] = useState<number | null>(null);

  useEffect(() => {
    sfx.chime();
  }, []);

  const openTheater = (index: number) => {
    sfx.pop();
    setActiveTheaterIndex(index);
  };

  const closeTheater = () => {
    sfx.tap();
    setActiveTheaterIndex(null);
  };

  const nextTheaterVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeTheaterIndex === null) return;
    sfx.pop();
    setActiveTheaterIndex((prev) => (prev! + 1) % BIRTHDAY_VIDEOS.length);
  };

  const prevTheaterVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeTheaterIndex === null) return;
    sfx.pop();
    setActiveTheaterIndex((prev) => (prev! - 1 + BIRTHDAY_VIDEOS.length) % BIRTHDAY_VIDEOS.length);
  };

  // Keyboard navigation inside Theater Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTheaterIndex === null) return;
      if (e.key === 'Escape') closeTheater();
      if (e.key === 'ArrowRight') nextTheaterVideo();
      if (e.key === 'ArrowLeft') prevTheaterVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTheaterIndex]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Drifting Golden Embers & Violet Light Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/10 left-1/12 w-2 h-2 rounded-full bg-[#F59E0B]/50 blur-[1px] animate-pulse" />
        <div className="absolute top-1/4 right-1/8 w-2.5 h-2.5 rounded-full bg-[#A855F7]/40 blur-[1px] animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 rounded-full bg-[#F59E0B]/60 blur-[1px] animate-pulse delay-1000" />
        <div className="absolute top-3/4 right-1/10 w-2 h-2 rounded-full bg-[#F59E0B]/40 blur-[1px] animate-pulse delay-700" />
        <div className="absolute bottom-1/8 left-1/8 w-2.5 h-2.5 rounded-full bg-[#C084FC]/40 blur-[1px] animate-pulse delay-300" />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#F3E8FF] text-[#7C3AED] border border-[#A855F7]/30 mb-3 shadow-xs">
          <Film className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>STEP 6 OF 7 · TIME CAPSULE 🎬✨</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#200D30] font-semibold tracking-tight leading-tight">
          The Yasakka Video Archives
        </h1>

        <p className="font-sans-body text-[#581C87]/80 text-sm sm:text-base mt-2.5 max-w-xl mx-auto leading-relaxed">
          Proof that birthdays keep coming and your thambi keeps showing up.
        </p>
      </div>

      {/* Cinema Vault Frame */}
      <div className="relative rounded-3xl p-4 sm:p-7 md:p-9 mb-10 bg-[#160924]/95 backdrop-blur-xl border-2 border-[#A855F7]/35 shadow-[0_20px_60px_rgba(32,13,48,0.35)] overflow-hidden">
        {/* Subtle decorative washi tape */}
        <WashiTape color="gold" position="top-left" />
        <WashiTape color="lavender" position="top-right" />

        {/* Cinema Film Reel Header Strip */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#A855F7]/25 text-[#E9D5FF]">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[#FAF5FF] font-medium tracking-wide">
              Tap any video to play directly, or expand into Cinema Theater
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-sans-body text-[#F59E0B] bg-[#2A1242] px-3 py-1 rounded-full border border-[#F59E0B]/30 font-medium">
            <span>14 Archives 🎬</span>
          </div>
        </div>

        {/* 14 Videos Grid — STRICTLY NO TITLES, LABELS, DATES, OR CAPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {BIRTHDAY_VIDEOS.map((video, idx) => (
            <div
              key={video.id}
              className="relative group rounded-2xl overflow-hidden bg-[#0D0417] border border-[#A855F7]/30 hover:border-[#F59E0B]/70 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_45px_rgba(168,85,247,0.3)] transition-all duration-300"
            >
              {/* Expand to Theater Overlay Button */}
              <button
                onClick={() => openTheater(idx)}
                className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-[#7C3AED] text-white/90 hover:text-white text-xs font-sans-body font-medium flex items-center gap-1.5 backdrop-blur-md border border-white/15 opacity-80 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                title="Watch in Cinema Theater"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Theater</span>
              </button>

              {/* Video Player Iframe (Strictly clean: zero titles, dates or labels) */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <iframe
                  src={`https://drive.google.com/file/d/${video.id}/preview`}
                  title={`Video ${idx + 1}`}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immersive Cinema Theater Modal */}
      {activeTheaterIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-300"
          onClick={closeTheater}
        >
          <div
            className="relative w-full max-w-4xl bg-[#140822] rounded-3xl p-3 sm:p-6 border border-[#A855F7]/40 shadow-[0_25px_80px_rgba(168,85,247,0.35)] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Controls Bar */}
            <div className="flex items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs sm:text-sm font-sans-body text-neutral-300 font-medium">
                  {activeTheaterIndex + 1} / {BIRTHDAY_VIDEOS.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://drive.google.com/file/d/${BIRTHDAY_VIDEOS[activeTheaterIndex].id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={closeTheater}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Close theater"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Video Screen */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
              <iframe
                src={`https://drive.google.com/file/d/${BIRTHDAY_VIDEOS[activeTheaterIndex].id}/preview`}
                title="Cinema Theater Reel"
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom Navigation Arrows */}
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                onClick={prevTheaterVideo}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans-body text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-white/10"
              >
                <ChevronLeft className="w-4 h-4 text-[#F59E0B]" />
                <span>Previous Reel</span>
              </button>

              <button
                onClick={nextTheaterVideo}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#581C87] text-white font-sans-body text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-[#F59E0B]/40 shadow-md"
              >
                <span>Next Reel</span>
                <ChevronRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </div>
        </div>
      )}

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
            <span>← Back to Memory Wall</span>
          </button>
        )}

        <button
          onClick={() => {
            sfx.pop();
            onNext();
          }}
          className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#581C87] text-white font-sans-body font-medium text-sm tracking-wide shadow-md hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-[#F59E0B]/40"
        >
          <span>Continue to the Grand Candle Finale 🎂</span>
          <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
        </button>
      </div>
    </div>
  );
};
