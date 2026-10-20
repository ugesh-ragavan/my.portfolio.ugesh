import React, { useState, useEffect } from 'react';
import { AppState, INITIAL_STATE, QuizState } from './types';
import { PetalBackground } from './components/PetalBackground';
import { Navbar } from './components/Navbar';
import { Screen1Lock } from './components/screens/Screen1Lock';
import { Screen2Quiz } from './components/screens/Screen2Quiz';
import { Screen3Garden } from './components/screens/Screen3Garden';
import { Screen4Tribute } from './components/screens/Screen4Tribute';
import { Screen5Pinboard } from './components/screens/Screen5Pinboard';
import { Screen6Archives } from './components/screens/Screen6Archives';
import { Screen7Finale } from './components/screens/Screen7Finale';

const STORAGE_KEY = 'yasakka_30th_birthday_state';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
        };
      }
    } catch {
      // Ignore parse failure
    }
    return INITIAL_STATE;
  });

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const handleUnlockChamber = () => {
    setState((prev) => {
      const highest = Math.max(prev.highestUnlockedStep, 2);
      return {
        ...prev,
        unlockedChamber: true,
        currentStep: 2,
        highestUnlockedStep: highest,
      };
    });
  };

  const handleQuizComplete = (answers: QuizState) => {
    setState((prev) => {
      const highest = Math.max(prev.highestUnlockedStep, 3);
      return {
        ...prev,
        quizCompleted: true,
        quizAnswers: answers,
        currentStep: 3,
        highestUnlockedStep: highest,
      };
    });
  };

  const handleNextStep = (nextStep: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: nextStep,
      highestUnlockedStep: Math.max(prev.highestUnlockedStep, nextStep),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCandle = (lit: boolean, blown: boolean) => {
    setState((prev) => ({
      ...prev,
      candleLit: lit,
      candleBlown: blown,
    }));
  };

  return (
    <div className="min-h-screen text-[#2B211E] relative overflow-x-hidden font-sans-body">
      {/* Luxury Ambient Particle Field & Candlelit Cursor Spotlight */}
      <PetalBackground
        flowerType={state.quizAnswers.flower}
        density={state.currentStep >= 3 ? 24 : 14}
      />

      {/* Persistent HUD & Audio Toggle */}
      <Navbar
        currentStep={state.currentStep}
        highestUnlockedStep={state.highestUnlockedStep}
        onSelectStep={handleSelectStep}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="relative z-10 transition-all duration-300">
        {state.currentStep === 1 && (
          <Screen1Lock onUnlock={handleUnlockChamber} />
        )}

        {state.currentStep === 2 && (
          <Screen2Quiz
            initialAnswers={state.quizAnswers}
            onComplete={handleQuizComplete}
          />
        )}

        {state.currentStep === 3 && (
          <Screen3Garden
            flowerType={state.quizAnswers.flower}
            onNext={() => handleNextStep(4)}
          />
        )}

        {state.currentStep === 4 && (
          <Screen4Tribute
            onNext={() => handleNextStep(5)}
            onPrev={() => handleSelectStep(3)}
          />
        )}

        {state.currentStep === 5 && (
          <Screen5Pinboard
            quizAnswers={state.quizAnswers}
            onNext={() => handleNextStep(6)}
            onPrev={() => handleSelectStep(4)}
          />
        )}

        {state.currentStep === 6 && (
          <Screen6Archives
            onNext={() => handleNextStep(7)}
            onPrev={() => handleSelectStep(5)}
          />
        )}

        {state.currentStep === 7 && (
          <Screen7Finale
            candleLit={state.candleLit}
            candleBlown={state.candleBlown}
            onUpdateCandle={handleUpdateCandle}
            onReplay={handleReset}
          />
        )}
      </main>
    </div>
  );
}
