import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SearchHome from './components/SearchHome';
import PortfolioView from './components/PortfolioView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio'>('home');

  return (
    <div className="bg-bg text-text-custom min-h-screen">
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <SearchHome onNavigateToPortfolio={() => setCurrentPage('portfolio')} />
          </motion.div>
        ) : (
          <motion.div
            key="portfolio-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <PortfolioView onNavigateHome={() => setCurrentPage('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
