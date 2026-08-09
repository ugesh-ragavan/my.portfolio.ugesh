import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Heart, CheckCircle2, Flame, Award, Droplets } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { SHAKE_GOALS, SHAKE_FLAVORS } from '../../data/shakeData';
import { sounds } from '../../services/soundEffects';

export const ShakeMatcherScreen = () => {
  const { completeActivity, navigateTo, completedActivities } = useSession();
  const [selectedGoal, setSelectedGoal] = useState(SHAKE_GOALS[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(SHAKE_FLAVORS[3]); // Mango default

  const handleSelectGoal = (goal) => {
    sounds.playTap();
    setSelectedGoal(goal);
  };

  const handleSelectFlavor = (flavor) => {
    sounds.playTap();
    setSelectedFlavor(flavor);
  };

  const handleClaimShakeVoucher = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reward = {
      title: `Free ${selectedFlavor.name} Tasting`,
      subtitle: `Crafted for ${selectedGoal.title}`,
      code: `HL-SHAKE-${randomDigits}`,
      icon: selectedFlavor.icon || '🥤',
      tag: 'Tasting Bar Token',
      description: `Show this voucher at the tasting bar to enjoy your freshly prepared ${selectedFlavor.name} Formula 1 shake sample!`
    };

    completeActivity('shakeMatcher', {
      goal: selectedGoal.title,
      flavor: selectedFlavor.name
    }, reward);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => navigateTo('hub')}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-ink-muted hover:text-brand-deep bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-sm touch-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-900 border border-pink-200 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TASTING BAR MATCHER</span>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-ink">
          Formula 1 Shake Matcher 🥤
        </h2>
        <p className="text-xs sm:text-sm text-brand-ink-muted mt-1">
          Pick your wellness target and favorite flavor to craft your perfect recipe!
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Step 1: Goal Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-soft-card border border-emerald-100">
          <label className="block font-heading font-bold text-sm text-brand-ink mb-3">
            1. Select Your Wellness Focus
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SHAKE_GOALS.map((goal) => {
              const isSelected = selectedGoal.id === goal.id;
              return (
                <button
                  type="button"
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 touch-card ${
                    isSelected
                      ? 'border-brand-deep bg-emerald-50/80 shadow-soft-green ring-1 ring-brand-deep/20'
                      : 'border-emerald-100 bg-brand-bg-subtle/50 hover:bg-emerald-50/30'
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-brand-ink leading-tight">
                      {goal.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Flavor Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-soft-card border border-emerald-100">
          <label className="block font-heading font-bold text-sm text-brand-ink mb-3">
            2. Choose Your Favorite Flavor
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SHAKE_FLAVORS.map((flv) => {
              const isSelected = selectedFlavor.id === flv.id;
              return (
                <button
                  type="button"
                  key={flv.id}
                  onClick={() => handleSelectFlavor(flv)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between touch-card ${
                    isSelected
                      ? 'border-brand-gold bg-amber-50 shadow-soft-gold ring-1 ring-brand-gold/30'
                      : 'border-emerald-100 bg-brand-bg-subtle/50 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{flv.icon}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-gold text-brand-ink text-[10px] font-bold flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="font-heading font-bold text-xs text-brand-ink leading-tight">
                    {flv.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Matched Recipe Card */}
        <motion.div
          layout
          className="rounded-3xl p-6 bg-gradient-to-br from-emerald-800 to-brand-deep text-white shadow-soft-deep space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-white/10 px-3 py-1 rounded-full">
              Your Custom Shake Recipe
            </span>
            <span className="text-xs text-emerald-200">
              {selectedFlavor.tag}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              {selectedFlavor.icon}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">
                {selectedFlavor.name} Power Blend
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {selectedFlavor.tasteNotes}
              </p>
            </div>
          </div>

          {/* Nutritional Highlights Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-center text-xs">
            <div>
              <span className="text-emerald-200 block text-[10px] font-bold uppercase">Protein</span>
              <strong className="font-heading font-extrabold text-base text-brand-gold">19g - 24g</strong>
            </div>
            <div>
              <span className="text-emerald-200 block text-[10px] font-bold uppercase">Calories</span>
              <strong className="font-heading font-extrabold text-base text-white">~220 kcal</strong>
            </div>
            <div>
              <span className="text-emerald-200 block text-[10px] font-bold uppercase">Vitamins</span>
              <strong className="font-heading font-extrabold text-base text-white">21 Essentials</strong>
            </div>
          </div>

          <div className="text-xs text-emerald-100 space-y-1">
            <p><strong>Base:</strong> Herbalife Formula 1 ({selectedFlavor.name})</p>
            <p><strong>Booster:</strong> {selectedGoal.recommendedProteinAddon}</p>
            <p><strong>Vitality Add-in:</strong> {selectedGoal.extraBoost}</p>
          </div>

          {/* Claim Action */}
          <div className="pt-2">
            {completedActivities.shakeMatcher ? (
              <div className="p-3.5 rounded-xl bg-white/20 text-center text-xs font-bold text-white">
                ✅ Shake Tasting Voucher Claimed!
              </div>
            ) : (
              <button
                onClick={handleClaimShakeVoucher}
                className="w-full h-14 bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 hover:from-amber-500 hover:to-amber-400 text-brand-ink font-heading font-extrabold text-base rounded-2xl shadow-soft-gold flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
              >
                <Award className="w-5 h-5 text-amber-900" />
                <span>Claim Stall Tasting Voucher 🎉</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>

    </div>
  );
};
