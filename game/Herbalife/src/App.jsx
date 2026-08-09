import React from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { Header } from './components/Header';
import { ScreenContainer } from './components/ScreenContainer';
import { RewardModal } from './components/RewardModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { StaffPortalModal } from './components/StaffPortalModal';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LeadFormScreen } from './screens/LeadFormScreen';
import { ContentHubScreen } from './screens/ContentHubScreen';
import { SpinWheelScreen } from './screens/activities/SpinWheelScreen';
import { WellnessQuizScreen } from './screens/activities/WellnessQuizScreen';
import { ShakeMatcherScreen } from './screens/activities/ShakeMatcherScreen';
import { HydrationCheckScreen } from './screens/activities/HydrationCheckScreen';

const MainKioskRouter = () => {
  const { currentScreen } = useSession();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'leadForm':
        return <LeadFormScreen />;
      case 'hub':
        return <ContentHubScreen />;
      case 'spinWheel':
        return <SpinWheelScreen />;
      case 'wellnessQuiz':
        return <WellnessQuizScreen />;
      case 'shakeMatcher':
        return <ShakeMatcherScreen />;
      case 'hydrationCheck':
        return <HydrationCheckScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-ink relative overflow-x-hidden selection:bg-brand-green/20">
      
      {/* Ambient background botanical glowing orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="fixed bottom-0 right-1/4 w-[28rem] h-[28rem] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="fixed top-1/2 -left-20 w-80 h-80 bg-brand-deep/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <Header />

      {/* Main Screen Content with Smooth 350ms Transitions */}
      <main className="flex-1 flex flex-col justify-center py-4">
        <ScreenContainer screenKey={currentScreen}>
          {renderScreen()}
        </ScreenContainer>
      </main>

      {/* Global Modals */}
      <RewardModal />
      <ConfirmationModal />
      <StaffPortalModal />

      {/* Stall Footer Bar */}
      <footer className="w-full py-3 px-4 border-t border-brand-green/10 bg-white/60 backdrop-blur-sm text-center text-[11px] text-brand-ink-muted flex items-center justify-center gap-2">
        <span>🌿 Live Event Experience</span>
        <span>•</span>
        <span>Herbalife Nutrition Wellness Kiosk</span>
        <span>•</span>
        <span className="text-emerald-700 font-semibold">Touchscreen Ready</span>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <SessionProvider>
      <MainKioskRouter />
    </SessionProvider>
  );
}
