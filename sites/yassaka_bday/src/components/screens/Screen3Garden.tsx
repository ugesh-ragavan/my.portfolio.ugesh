import React from 'react';
import { FlowerType } from '../../types';
import { RealisticBouquet } from '../RealisticBouquet';
import { WashiTape } from '../WashiTape';
import { Polaroid } from '../Polaroid';
import { CONFIG } from '../../config';
import { sfx } from '../../utils/audio';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

interface Screen3GardenProps {
  flowerType: FlowerType;
  onNext: () => void;
}

export const Screen3Garden: React.FC<Screen3GardenProps> = ({ flowerType, onNext }) => {
  const flowerNotes: Record<FlowerType, { title: string; note: string; tag: string; wrapLabel: string }> = {
    jasmine: {
      title: "Malli Poo (Pure Jasmine) for Yasakka 🤍",
      note: "Of course you picked Mallipoo. Soothing, pure, and deeply rooted in home. That unmistakable comforting scent that feels like family, warmth, and peaceful mornings.",
      tag: "Pure & Fragrant Mallipoo 🤍",
      wrapLabel: "Fresh fragrant Mallipoo tied with sage ribbon 🌿",
    },
    sunflower: {
      title: "Golden Sunflowers for Yasakka 🌻",
      note: "Warm, radiant, and impossible to overlook. Always turning toward the light, just like you do for all of us.",
      tag: "Bright & Golden Just Like Yasakka 🌻",
      wrapLabel: "Hand-tied golden sunflowers with sage ribbon 🌿",
    },
    rose: {
      title: "Classic Red Roses for Yasakka 🌹",
      note: "Deep, elegant, and timeless. Full of grace, fierce loyalty, and the warmth you bring into every room.",
      tag: "Classic & Elegant Roses 🌹",
      wrapLabel: "Velvety red roses tied with sage ribbon 🌿",
    },
    tulip: {
      title: "Soft Fresh Tulips for Yasakka 🌷",
      note: "Soft, modern, and beautiful. A gentle reminder that new seasons bring the loveliest beginnings.",
      tag: "Grace & New Beginnings 🌷",
      wrapLabel: "Pastel fresh tulips tied with sage ribbon 🌿",
    },
    all: {
      title: "The Ultimate Grand Bouquet for Yasakka 💐",
      note: "Because why settle for one when you deserve every single flower in the universe? Full of light, fragrance, and color.",
      tag: "",
      wrapLabel: "Grand botanical bouquet tied with sage ribbon 🌿",
    },
  };

  const current = flowerNotes[flowerType] || flowerNotes.jasmine;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {/* Header Banner */}
      <div className="text-center mb-7">
        <div className="gold-foil-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          <span className="font-serif text-sm tracking-wide text-[#2B211E]">
            Chapter 30 · Live Botanical Bloom
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#2B211E] font-medium leading-tight tracking-tight">
          {current.title}
        </h1>
        {current.tag && (
          <p className="font-sans-body text-[#6E615D] text-sm sm:text-base mt-1.5 max-w-xl mx-auto font-light">
            {current.tag}
          </p>
        )}
      </div>

      {/* Main Editorial Card */}
      <div className="editorial-card p-7 sm:p-11 relative mb-8">
        <WashiTape color="vellum" position="top-left" />
        <WashiTape color="gold" position="top-right" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Column: Realistic Multi-Layered SVG Bouquet strictly matching her selection */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#FAF6F0]/60 rounded-3xl border border-[#D4AF37]/20 relative overflow-hidden shadow-xs">
            <RealisticBouquet flowerType={flowerType} className="my-2" />
            <span className="font-serif italic text-xs sm:text-sm text-[#2B211E] bg-white/95 px-4 py-1.5 rounded-full border border-[#D4AF37]/25 shadow-xs mt-3">
              {current.wrapLabel}
            </span>
          </div>

          {/* Right Column: Sibling Note & Polaroid */}
          <div className="space-y-6">
            <div className="bg-white/80 border border-[#D4AF37]/25 rounded-3xl p-6 shadow-xs relative">
              <span className="font-serif text-xl sm:text-2xl text-[#2B211E] font-medium block mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C59B27] fill-[#C59B27]" />
                A note from your thambi Geesh:
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#2B211E] leading-relaxed italic">
                "{current.note}"
              </p>
            </div>

            {/* Polaroid Memory */}
            <div className="max-w-xs mx-auto">
              <Polaroid
                imageSrc={CONFIG.photos.heroPhoto}
                caption="Akka radiating joy ✨"
                subcaption="Official Chapter 30 portrait"
                tapeColor="vellum"
                rotation="-rotate-1"
                sticker={flowerType === 'jasmine' ? '🤍' : flowerType === 'sunflower' ? '🌻' : flowerType === 'rose' ? '🌹' : '🌷'}
                fallbackBadge="Akka smiling here"
                aspectRatio="aspect-[3/4]"
                objectPosition="object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={() => {
            sfx.pop();
            onNext();
          }}
          className="py-3 px-8 rounded-full bg-[#2B211E] text-[#FAF6F0] font-sans-body font-medium text-sm tracking-wider uppercase shadow-md hover:bg-black transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98 border border-[#D4AF37]/30"
        >
          <span>The Four Pillars of Yaswanthi 🤍🧸🩺✨</span>
          <ArrowRight className="w-4 h-4 text-[#C59B27]" />
        </button>
      </div>
    </div>
  );
};
