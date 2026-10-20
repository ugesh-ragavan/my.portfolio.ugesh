import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Droplet, Flame, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { ACTIVITY_LEVELS, calculateHydrationProfile } from '../../data/hydrationData';
import { sounds } from '../../services/soundEffects';

export const HydrationCheckScreen = () => {
  const { completeActivity, navigateTo, completedActivities } = useSession();
  const [weightKg, setWeightKg] = useState(65);
  const [activityLevel, setActivityLevel] = useState('moderate');

  const profile = calculateHydrationProfile(weightKg, activityLevel);

  const handleWeightChange = (e) => {
    setWeightKg(Number(e.target.value));
  };

  const handleSelectActivity = (lvlId) => {
    sounds.playTap();
    setActivityLevel(lvlId);
  };

  const handleClaimHydrationVoucher = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reward = {
      title: 'Free Herbal Aloe Splash & Energy Booster',
      subtitle: `Calculated for your ${profile.waterLitres}L hydration target`,
      code: `HL-ALOE-${randomDigits}`,
      icon: '💧',
      tag: 'Hydration Perk',
      description: 'Present this token at our stall counter to receive a free refreshing Herbal Aloe concentrate tasting!'
    };

    completeActivity('hydrationCheck', {
      weightKg,
      activityLevel,
      waterLitres: profile.waterLitres,
      proteinGrams: profile.proteinGrams
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

        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTANT WELLNESS METRICS</span>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-ink">
          Hydration & Energy Calculator 💧
        </h2>
        <p className="text-xs sm:text-sm text-brand-ink-muted mt-1">
          Adjust the sliders to calculate your personalized water & protein intake targets.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Step 1: Weight Slider */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft-card border border-emerald-100">
          <div className="flex items-center justify-between mb-3">
            <label className="font-heading font-bold text-sm text-brand-ink">
              Your Approximate Body Weight
            </label>
            <span className="font-heading font-extrabold text-xl text-brand-deep bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {weightKg} kg
            </span>
          </div>

          <input
            type="range"
            min="40"
            max="120"
            step="1"
            value={weightKg}
            onChange={handleWeightChange}
            className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />

          <div className="flex justify-between text-[11px] font-semibold text-brand-ink-muted mt-2">
            <span>40 kg</span>
            <span>65 kg</span>
            <span>90 kg</span>
            <span>120 kg</span>
          </div>
        </div>

        {/* Step 2: Activity Level */}
        <div className="bg-white rounded-3xl p-5 shadow-soft-card border border-emerald-100">
          <label className="block font-heading font-bold text-sm text-brand-ink mb-3">
            Daily Physical Activity Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ACTIVITY_LEVELS.map((lvl) => {
              const isSelected = activityLevel === lvl.id;
              return (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => handleSelectActivity(lvl.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between touch-card ${
                    isSelected
                      ? 'border-brand-deep bg-emerald-50/80 shadow-soft-green ring-1 ring-brand-deep/20'
                      : 'border-emerald-100 bg-brand-bg-subtle/50 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{lvl.icon}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-deep text-white text-[10px] font-bold flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-brand-ink leading-tight">
                      {lvl.label}
                    </h4>
                    <p className="text-[10px] text-brand-ink-muted mt-0.5 leading-tight">
                      {lvl.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Card */}
        <motion.div
          layout
          className="rounded-3xl p-6 bg-gradient-to-br from-brand-deep to-emerald-700 text-white shadow-soft-deep space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-white/10 px-3 py-1 rounded-full">
              Your Daily Target Profile
            </span>
            <span className="text-xs text-emerald-200">
              Personalized for {weightKg}kg
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
              <span className="text-emerald-200 text-[11px] font-bold uppercase block mb-0.5">
                Target Water Intake
              </span>
              <strong className="font-heading font-extrabold text-2xl text-brand-gold">
                {profile.waterLitres} Litres
              </strong>
              <span className="text-[11px] text-emerald-100 block mt-0.5">
                ≈ {profile.glasses} glasses / day
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
              <span className="text-emerald-200 text-[11px] font-bold uppercase block mb-0.5">
                Target Daily Protein
              </span>
              <strong className="font-heading font-extrabold text-2xl text-white">
                {profile.proteinGrams} Grams
              </strong>
              <span className="text-[11px] text-emerald-100 block mt-0.5">
                for energy & lean muscle
              </span>
            </div>
          </div>

          {/* Recommended Stall Stack */}
          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm space-y-2 text-xs">
            <p className="font-bold text-brand-gold text-[11px] uppercase tracking-wider">
              Recommended Herbalife Hydration Stack:
            </p>
            {profile.stack.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-emerald-100">
                <span className="text-brand-gold font-bold">•</span>
                <span><strong>{item.name}:</strong> {item.role}</span>
              </div>
            ))}
          </div>

          {/* Claim Action */}
          <div className="pt-2">
            {completedActivities.hydrationCheck ? (
              <div className="p-3.5 rounded-xl bg-white/20 text-center text-xs font-bold text-white">
                ✅ Hydration Sample Perk Claimed!
              </div>
            ) : (
              <button
                onClick={handleClaimHydrationVoucher}
                className="w-full h-14 bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 hover:from-amber-500 hover:to-amber-400 text-brand-ink font-heading font-extrabold text-base rounded-2xl shadow-soft-gold flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
              >
                <Award className="w-5 h-5 text-amber-900" />
                <span>Claim Free Aloe & Hydration Perk 🎉</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>

    </div>
  );
};
