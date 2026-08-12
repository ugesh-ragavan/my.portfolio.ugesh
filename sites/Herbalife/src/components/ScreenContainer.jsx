import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const screenVariants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: [0.7, 0, 0.84, 0]
    }
  }
};

export const ScreenContainer = ({ screenKey, children, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={screenVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
