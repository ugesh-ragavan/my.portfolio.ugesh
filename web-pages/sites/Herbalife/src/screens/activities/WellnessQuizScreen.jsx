import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Sparkles, ArrowRight, Lightbulb, Award } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { sounds } from '../../services/soundEffects';

export const WellnessQuizScreen = () => {
  const { completeActivity, navigateTo, completedActivities } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUIZ_QUESTIONS.length - 1;

  const handleSelectOption = (option) => {
    sounds.playTap();
    setAnswers(prev => ({
      ...prev,
      [question.id]: option
    }));
  };

  const handleNext = () => {
    if (!answers[question.id]) return;

    if (isLastQuestion) {
      setIsFinished(true);
      sounds.playSuccess();
    } else {
      sounds.playTap();
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleClaimReward = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reward = {
      title: 'VIP Wellness Consultation & Tea Tasting',
      subtitle: 'Free Afresh Energy Drink tasting + body wellness profile',
      code: `HL-QUIZ-${randomDigits}`,
      icon: '🧠',
      tag: 'Quiz Perk',
      description: 'Present this voucher at our stall for a free personalized consultation and refreshing herbal tea!'
    };

    completeActivity('wellnessQuiz', { answers }, reward);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col">
      
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => navigateTo('hub')}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-ink-muted hover:text-brand-deep bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-sm touch-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="text-xs font-bold text-brand-deep bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-card border border-emerald-100 space-y-6">
          
          {/* Progress Bar */}
          <div>
            <div className="w-full bg-emerald-100/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-deep to-brand-green h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-brand-deep mt-2 block uppercase tracking-wider">
              {question.category}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-brand-ink leading-snug">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = answers[question.id]?.text === opt.text;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between touch-card ${
                    isSelected
                      ? 'border-brand-deep bg-emerald-50/80 shadow-soft-green ring-2 ring-brand-deep/20'
                      : 'border-emerald-100 bg-brand-bg-subtle/50 hover:bg-emerald-50/40 hover:border-brand-green/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-heading font-bold text-sm text-brand-ink">
                      {opt.text}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-brand-deep bg-brand-deep text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <span className="text-xs">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next CTA */}
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className={`w-full h-14 bg-gradient-to-r from-brand-deep to-brand-green hover:from-brand-deep-dark hover:to-brand-deep text-white font-heading font-bold text-base rounded-2xl shadow-soft-green flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn ${
              !answers[question.id] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{isLastQuestion ? 'See My Nutrition Profile 🌟' : 'Next Question'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Completed Summary View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-card border border-emerald-100 space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-deep to-brand-green text-white flex items-center justify-center mx-auto shadow-soft-green text-3xl">
            🌿
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CUSTOM WELLNESS PROFILE READY</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-brand-ink">
              Your Personalized Stall Insights
            </h2>
            <p className="text-xs text-brand-ink-muted mt-1">
              Based on your answers, here is your customized vitality breakdown:
            </p>
          </div>

          {/* Key Tailored Tips */}
          <div className="space-y-3 text-left">
            {Object.values(answers).map((ans, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-brand-bg-subtle border border-emerald-100 flex items-start gap-3">
                <span className="text-2xl">{ans.icon}</span>
                <div className="text-xs">
                  <strong className="text-brand-deep font-bold block mb-0.5">{ans.focus}</strong>
                  <p className="text-brand-ink-muted">{ans.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Claim Reward Button */}
          <div className="pt-2">
            {completedActivities.wellnessQuiz ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-brand-deep font-bold text-sm">
                ✅ Quiz Perk Claimed! Return to Hub.
              </div>
            ) : (
              <button
                onClick={handleClaimReward}
                className="w-full h-14 bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 hover:from-amber-500 hover:to-amber-400 text-brand-ink font-heading font-extrabold text-base rounded-2xl shadow-soft-gold flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
              >
                <Award className="w-5 h-5 text-amber-900" />
                <span>Claim Wellness Champion Voucher 🎉</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
};
