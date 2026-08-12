import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Smile, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSession } from '../context/SessionContext';

const MOOD_OPTIONS = [
  {
    id: 'Feeling Good',
    label: 'Feeling Good',
    icon: '😊',
    subtext: 'Calm, positive & open to new wellness habits',
    theme: 'border-emerald-200 hover:border-brand-green bg-white'
  },
  {
    id: 'Feeling Great',
    label: 'Feeling Great',
    icon: '🌟',
    subtext: 'Vibrant, motivated & ready to boost vitality',
    theme: 'border-amber-200 hover:border-brand-gold bg-white'
  },
  {
    id: 'Feeling Unstoppable',
    label: 'Feeling Unstoppable',
    icon: '🚀',
    subtext: 'High energy, goal-driven & aiming for peak fitness',
    theme: 'border-green-300 hover:border-emerald-500 bg-white'
  }
];

export const LeadFormScreen = () => {
  const { submitLead } = useSession();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mood, setMood] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean numeric phone input (max 10 digits)
  const handlePhoneChange = (e) => {
    const numeric = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(numeric);
    if (errors.phone && numeric.length === 10) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name && e.target.value.trim().length >= 2) {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  const handleMoodSelect = (moodId) => {
    setMood(moodId);
    if (errors.mood) {
      setErrors(prev => ({ ...prev, mood: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters)';
    }
    if (!phone || phone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!mood) {
      errs.mood = 'Please select how you are feeling today';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({ name, phone, mood });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim().length >= 2 && phone.length === 10 && Boolean(mood);

  return (
    <div className="w-full max-w-xl mx-auto">
      
      {/* Screen Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-brand-green/20 px-3.5 py-1 rounded-full text-xs font-bold text-brand-deep mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-green" />
          <span>STEP 1 OF 2 — GUEST CHECK-IN</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-ink">
          Tell Us a Little About You ✨
        </h2>
        <p className="text-xs sm:text-sm text-brand-ink-muted mt-1 max-w-md mx-auto">
          We use your details to personalize your wellness profile and send your stall perks!
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-card border border-emerald-100 space-y-6">
        
        {/* Name Input */}
        <div>
          <label className="block font-heading font-bold text-sm text-brand-ink mb-2">
            Your Full Name <span className="text-brand-deep">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-ink-muted">
              <User className="w-5 h-5 text-brand-green" />
            </div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Alex Sharma"
              className={`w-full h-14 pl-11 pr-4 rounded-2xl border text-base font-medium transition-all outline-none bg-brand-bg-subtle/50 ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-emerald-100 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20'
              }`}
            />
          </div>
          {errors.name && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
            </p>
          )}
        </div>

        {/* Contact Number Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-heading font-bold text-sm text-brand-ink">
              Contact Number <span className="text-brand-deep">*</span>
            </label>
            <span className={`text-xs font-mono font-semibold ${phone.length === 10 ? 'text-brand-deep' : 'text-brand-ink-muted'}`}>
              {phone.length}/10 digits
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-ink-muted">
              <Phone className="w-5 h-5 text-brand-green" />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="10-digit mobile number"
              className={`w-full h-14 pl-11 pr-4 rounded-2xl border text-base font-mono font-medium tracking-wide transition-all outline-none bg-brand-bg-subtle/50 ${
                errors.phone
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : phone.length === 10 
                    ? 'border-brand-green ring-1 ring-brand-green/30 bg-emerald-50/20'
                    : 'border-emerald-100 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20'
              }`}
            />
            {phone.length === 10 && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-deep">
                <CheckCircle2 className="w-5 h-5 text-brand-deep" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          )}
        </div>

        {/* Mood Selector (3 Positive Options Only) */}
        <div>
          <label className="block font-heading font-bold text-sm text-brand-ink mb-2">
            How are you feeling today? <span className="text-brand-deep">*</span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const isSelected = mood === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleMoodSelect(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between touch-card ${
                    isSelected
                      ? 'border-brand-deep bg-emerald-50/80 shadow-soft-green ring-2 ring-brand-deep/20'
                      : `${opt.theme} hover:shadow-soft-card`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{opt.icon}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-brand-deep text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-ink leading-tight">
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-brand-ink-muted mt-0.5 leading-snug">
                      {opt.subtext}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.mood && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.mood}
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-15 bg-gradient-to-r from-brand-deep to-brand-green hover:from-brand-deep-dark hover:to-brand-deep text-white font-heading font-bold text-base sm:text-lg rounded-2xl shadow-soft-deep flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn ${
              !isFormValid ? 'opacity-90' : 'hover:shadow-glow-green'
            }`}
          >
            <span>{isSubmitting ? 'Personalizing...' : 'Continue to Wellness Hub'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>

    </div>
  );
};
