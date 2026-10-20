import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Award, Zap, HeartHandshake, CheckCircle, ShieldCheck } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const WelcomeScreen = () => {
  const { startJourney } = useSession();

  const highlights = [
    {
      icon: '🎡',
      title: 'Spin & Win Wheel',
      desc: 'Free shake samples & exclusive stall perks'
    },
    {
      icon: '🧠',
      title: 'Wellness Quiz',
      desc: '3 quick questions for personalized vitality tips'
    },
    {
      icon: '🥤',
      title: 'Shake Matcher',
      desc: 'Discover your perfect Formula 1 flavor blend'
    },
    {
      icon: '💧',
      title: 'Hydration & Energy',
      desc: 'Instant water & daily protein requirement check'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center text-center">
      
      {/* Stall Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100/90 to-amber-100/90 border border-brand-green/30 px-4 py-1.5 rounded-full text-xs font-bold text-brand-deep shadow-sm mb-4"
      >
        <Sparkles className="w-4 h-4 text-brand-gold-dark animate-spin-slow" />
        <span>LIVE WELLNESS STALL EXPERIENCE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
      </motion.div>

      {/* Main Punchy Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-ink tracking-tight max-w-2xl leading-[1.15]"
      >
        Discover Your <span className="text-gradient-green">Best Self</span> Today! 🌿
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base text-brand-ink-muted max-w-lg mt-3 leading-relaxed"
      >
        Step up to our interactive wellness kiosk! Explore tailor-made nutrition, spin for free stall samples, and start your vitality journey in under 2 minutes.
      </motion.p>

      {/* 4 Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full my-8 text-left"
      >
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-soft-card flex flex-col justify-between transition-all hover:shadow-soft-card-hover hover:border-brand-green/40 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-brand-ink leading-snug">
                {item.title}
              </h2>
              <p className="text-[11px] text-brand-ink-muted mt-1 leading-tight">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Glowing Call To Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md"
      >
        <button
          onClick={startJourney}
          className="w-full h-16 bg-gradient-to-r from-brand-deep via-brand-green to-emerald-600 hover:from-brand-deep-dark hover:to-brand-deep text-white font-heading font-extrabold text-lg sm:text-xl rounded-2xl shadow-soft-deep hover:shadow-glow-green flex items-center justify-center gap-3 transition-all active:scale-95 touch-btn group relative overflow-hidden"
        >
          {/* Shimmer light effect */}
          <div className="absolute inset-0 shimmer-badge pointer-events-none" />
          
          <span className="relative z-10">Start Your Wellness Journey</span>
          <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="flex items-center justify-center gap-4 mt-4 text-[12px] text-brand-ink-muted">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-brand-green" /> 1-on-1 Personalized
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Instant Stall Perks
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-deep" /> No Login Required
          </span>
        </div>
      </motion.div>

    </div>
  );
};
