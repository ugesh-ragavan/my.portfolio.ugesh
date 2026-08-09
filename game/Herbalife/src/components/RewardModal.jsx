import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const RewardModal = () => {
  const { activeReward, closeRewardModal } = useSession();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (activeReward) {
      // Confetti burst on reveal
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const colors = ['#2ECC71', '#1E8449', '#FFC72C', '#F39C12', '#58D68D'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [activeReward]);

  if (!activeReward) return null;

  const handleCopyCode = () => {
    if (activeReward.code) {
      navigator.clipboard?.writeText(activeReward.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm">
        
        {/* Animated Pop Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-brand-gold overflow-hidden"
        >
          {/* Gold Decorative Header Wave */}
          <div className="bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 px-6 pt-6 pb-8 text-center text-brand-ink relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 bg-brand-ink/10 border border-brand-ink/15 text-brand-ink px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              Stall Reward Unlocked!
            </div>

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-ink tracking-tight">
              Congratulations! 🎉
            </h3>
            <p className="text-xs sm:text-sm font-medium text-brand-ink/80 mt-1 max-w-xs mx-auto">
              You earned an exclusive perk at our Herbalife Wellness Stall!
            </p>
          </div>

          {/* Reward Card Body */}
          <div className="p-6 sm:p-8 -mt-4 bg-white rounded-t-3xl relative">
            
            {/* Prize Badge & Title */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-brand-bg-subtle to-emerald-50 border border-brand-green/30 shadow-soft-card mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-deep to-brand-green flex items-center justify-center text-3xl shadow-soft-green shrink-0">
                {activeReward.icon || '🎁'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {activeReward.tag || 'Exclusive Perk'}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-ink mt-1 leading-snug">
                  {activeReward.title}
                </h4>
                <p className="text-xs text-brand-ink-muted mt-0.5">
                  {activeReward.description || activeReward.subtitle}
                </p>
              </div>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-brand-bg border-2 border-dashed border-brand-gold/60 rounded-2xl p-4 text-center mb-5 relative">
              <span className="text-[11px] font-semibold text-brand-ink-muted uppercase tracking-wider block mb-1">
                Your Exclusive Voucher Code
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-extrabold text-xl sm:text-2xl tracking-widest text-brand-deep">
                  {activeReward.code || 'HL-REWARD-2026'}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white border border-brand-gold/40 text-brand-ink hover:bg-amber-50 active:scale-95 transition-all"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
                </button>
              </div>
              <p className="text-[11px] text-amber-900/75 mt-1 font-medium">
                ⚡ Valid today at this stall
              </p>
            </div>

            {/* How to Claim instructions */}
            <div className="flex items-start gap-2.5 text-xs text-brand-ink-muted bg-amber-50/60 border border-amber-100 rounded-xl p-3 mb-6">
              <CheckCircle2 className="w-4 h-4 text-brand-deep shrink-0 mt-0.5" />
              <span>
                <strong>How to Claim:</strong> Show this screen to any wellness coach at the stall to taste your sample or claim your offer!
              </span>
            </div>

            {/* Back to Hub CTA */}
            <button
              onClick={closeRewardModal}
              className="w-full h-14 bg-gradient-to-r from-brand-deep to-brand-green hover:from-brand-deep-dark hover:to-brand-deep text-white font-heading font-bold text-base rounded-2xl shadow-soft-green flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
            >
              <span>Continue Wellness Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
