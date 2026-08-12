import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Sparkles, UserPlus, Volume2, VolumeX, ShieldCheck, Heart } from 'lucide-react';

export const Header = () => {
  const { 
    currentScreen, 
    guest, 
    setIsResetConfirmOpen, 
    setIsStaffPortalOpen, 
    isMuted, 
    toggleSound 
  } = useSession();

  // Hidden stall admin triple-tap counter
  const [tapCount, setTapCount] = useState(0);

  const handleLogoTap = () => {
    const next = tapCount + 1;
    if (next >= 3) {
      setTapCount(0);
      setIsStaffPortalOpen(true);
    } else {
      setTapCount(next);
      setTimeout(() => setTapCount(0), 1500);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-brand-green/15 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Title with Secret 3-Tap for Stall Staff */}
        <div 
          onClick={handleLogoTap}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Herbalife Wellness Stall"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-deep to-brand-green flex items-center justify-center shadow-soft-green text-white font-bold text-lg transition-transform group-hover:scale-105 active:scale-95">
            <span className="tracking-tighter">🌿</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-brand-deep">
                HERBALIFE
              </span>
              <span className="bg-brand-gold/25 text-amber-900 border border-brand-gold/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Stall
              </span>
            </div>
            <p className="text-[11px] text-brand-ink-muted font-medium -mt-0.5">
              Wellness Touch Kiosk
            </p>
          </div>
        </div>

        {/* Right Actions: Guest Info & Kiosk Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Guest Pill (if on Hub or in an activity) */}
          {guest.name && currentScreen !== 'welcome' && currentScreen !== 'leadForm' && (
            <div className="hidden sm:flex items-center gap-1.5 bg-brand-bg-subtle border border-brand-green/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-semibold text-brand-ink">
                {guest.name}
              </span>
              {guest.mood && (
                <span className="text-[11px] bg-brand-gold/20 text-brand-ink px-1.5 py-0.2 rounded-md font-medium">
                  {guest.mood.includes('Good') ? '😊' : guest.mood.includes('Great') ? '🌟' : '🚀'}
                </span>
              )}
            </div>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-10 h-10 rounded-xl bg-brand-bg-subtle border border-emerald-100 flex items-center justify-center text-brand-ink-muted hover:text-brand-deep hover:bg-emerald-50 transition-colors touch-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-brand-deep" />}
          </button>

          {/* "New Guest" Reset Button (visible when not on Welcome screen) */}
          {currentScreen !== 'welcome' && (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 bg-brand-deep hover:bg-brand-deep-dark active:scale-95 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-soft-green transition-all touch-btn"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden xs:inline">New Guest</span>
            </button>
          )}

          {/* Stall Staff Quick Access Icon */}
          <button
            onClick={() => setIsStaffPortalOpen(true)}
            aria-label="Staff Portal"
            className="w-10 h-10 rounded-xl bg-amber-50/80 border border-brand-gold/30 flex items-center justify-center text-amber-700 hover:bg-amber-100/80 transition-colors touch-btn"
            title="Stall Staff Manager"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </button>

        </div>
      </div>
    </header>
  );
};
