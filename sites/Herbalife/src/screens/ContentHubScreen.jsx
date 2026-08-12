import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, CheckCircle2, ChevronRight, Gift, Trophy, ArrowRight, Zap } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const ContentHubScreen = () => {
  const { guest, completedActivities, rewards, navigateTo, activeReward } = useSession();

  const activities = [
    {
      id: 'spinWheel',
      screen: 'spinWheel',
      title: 'Spin & Win Wellness Wheel',
      subtitle: 'Spin the prize wheel for free shake tastings & VIP perks',
      icon: '🎡',
      badge: 'Stall Favorite',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      gradient: 'from-emerald-500/10 via-amber-500/10 to-transparent'
    },
    {
      id: 'wellnessQuiz',
      screen: 'wellnessQuiz',
      title: 'Wellness & Nutrition Quiz',
      subtitle: '3 quick questions to discover your personalized vitality stack',
      icon: '🧠',
      badge: 'Quick & Fun',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      gradient: 'from-blue-500/10 via-emerald-500/10 to-transparent'
    },
    {
      id: 'shakeMatcher',
      screen: 'shakeMatcher',
      title: 'Formula 1 Shake Matcher',
      subtitle: 'Match your health goals with delicious Herbalife shake recipes',
      icon: '🥤',
      badge: 'Taste Bar',
      badgeColor: 'bg-pink-100 text-pink-900 border-pink-200',
      gradient: 'from-pink-500/10 via-amber-500/10 to-transparent'
    },
    {
      id: 'hydrationCheck',
      screen: 'hydrationCheck',
      title: 'Hydration & Energy Calculator',
      subtitle: 'Instant daily water & protein target check with Aloe perks',
      icon: '💧',
      badge: 'Health Check',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      gradient: 'from-emerald-500/10 via-teal-500/10 to-transparent'
    }
  ];

  const completedCount = Object.values(completedActivities).filter(Boolean).length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Personalized Greeting Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-deep via-brand-green to-emerald-600 text-white shadow-soft-deep relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span>{guest.mood.includes('Good') ? '😊' : guest.mood.includes('Great') ? '🌟' : '🚀'}</span>
              <span>{guest.mood || 'Feeling Great'}</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              Welcome, {guest.name || 'Friend'}! 🌿
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              Choose an activity below to explore healthy solutions and unlock stall perks!
            </p>
          </div>

          {/* Progress Pill */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-center min-w-[130px] self-stretch sm:self-auto flex sm:flex-col justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Activities Completed
            </span>
            <div className="flex items-center gap-1 mt-1 font-heading font-extrabold text-xl text-brand-gold">
              <Trophy className="w-5 h-5 text-brand-gold" />
              <span>{completedCount} / 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Cards 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((act) => {
          const isDone = completedActivities[act.id];
          return (
            <motion.div
              key={act.id}
              whileHover={{ y: isDone ? 0 : -3 }}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isDone 
                  ? 'bg-emerald-50/50 border-emerald-200/80 shadow-sm opacity-90'
                  : 'bg-white border-emerald-100 shadow-soft-card hover:shadow-soft-card-hover hover:border-brand-green/40'
              }`}
            >
              {/* Background Tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${act.gradient} pointer-events-none opacity-50`} />

              <div className="relative z-10">
                
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white shadow-sm border border-emerald-100/60 inline-block">
                    {act.icon}
                  </span>
                  
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-brand-deep text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-ink leading-snug">
                  {act.title}
                </h3>
                <p className="text-xs text-brand-ink-muted mt-1 leading-relaxed">
                  {act.subtitle}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 relative z-10">
                {isDone ? (
                  <div className="w-full h-11 rounded-xl bg-emerald-100/80 text-brand-deep font-semibold text-xs flex items-center justify-center gap-1.5 cursor-default">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Perk Claimed! ✨</span>
                  </div>
                ) : (
                  <button
                    onClick={() => navigateTo(act.screen)}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-deep to-brand-green hover:from-brand-deep-dark hover:to-brand-deep text-white font-heading font-bold text-xs sm:text-sm shadow-soft-green flex items-center justify-center gap-1.5 transition-all active:scale-95 touch-btn"
                  >
                    <span>Play Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rewards Collected Drawer */}
      {rewards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-amber-50/70 border border-brand-gold/40 shadow-soft-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-700" />
              <h3 className="font-heading font-bold text-sm sm:text-base text-brand-ink">
                Your Unlocked Stall Rewards ({rewards.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              Show to Stall Staff
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {rewards.map((reward, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{reward.icon || '🎁'}</span>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-brand-ink leading-tight">
                      {reward.title}
                    </h4>
                    <p className="text-[10px] font-mono text-brand-deep font-semibold">
                      {reward.code}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};
