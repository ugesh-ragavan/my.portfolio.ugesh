import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const ConfirmationModal = () => {
  const { isResetConfirmOpen, setIsResetConfirmOpen, resetToNewGuest } = useSession();

  if (!isResetConfirmOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-deep mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-brand-deep" />
          </div>

          <h3 className="font-heading font-bold text-xl text-brand-ink mb-2">
            Start New Guest Session?
          </h3>
          <p className="text-sm text-brand-ink-muted leading-relaxed mb-6">
            This will reset the kiosk touchscreen to the Welcome screen for the next stall visitor. Current guest progress is safely saved to the database.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="flex-1 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-ink font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Keep Exploring</span>
            </button>
            <button
              onClick={resetToNewGuest}
              className="flex-1 h-12 rounded-xl bg-brand-deep hover:bg-brand-deep-dark text-white font-semibold text-sm shadow-soft-green flex items-center justify-center gap-2 transition-all active:scale-95 touch-btn"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yes, Next Guest</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
