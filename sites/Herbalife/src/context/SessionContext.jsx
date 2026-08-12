import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createLead, updateLeadActivity } from '../services/leadService';
import { sounds } from '../services/soundEffects';

const SessionContext = createContext(null);

// Generate a random UUID v4 string for the guest session
export const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const SessionProvider = ({ children }) => {
  // Ephemeral in-memory session (NOT in localStorage, strictly per-guest)
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [currentScreen, setCurrentScreen] = useState('welcome');
  
  // Guest details from Lead Form
  const [guest, setGuest] = useState({
    name: '',
    phone: '',
    mood: '',
    joinedAt: null
  });

  // 1-per-guest completion flags for the 4 activities
  const [completedActivities, setCompletedActivities] = useState({
    spinWheel: false,
    wellnessQuiz: false,
    shakeMatcher: false,
    hydrationCheck: false
  });

  // Rewards won in this session
  const [rewards, setRewards] = useState([]);
  
  // Active reward modal overlay state
  const [activeReward, setActiveReward] = useState(null);

  // Confirmation modal state for resetting kiosk to new guest
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Stall staff dashboard modal state
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);

  // Sound mute toggle
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    sounds.muted = isMuted;
  }, [isMuted]);

  // Navigate to screen with tactile sound
  const navigateTo = useCallback((screenName) => {
    sounds.playTap();
    setCurrentScreen(screenName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Start new guest journey from Welcome screen
  const startJourney = useCallback(() => {
    sounds.playTap();
    // Fresh session ID for this guest
    const newId = generateSessionId();
    setSessionId(newId);
    setGuest({ name: '', phone: '', mood: '', joinedAt: null });
    setCompletedActivities({
      spinWheel: false,
      wellnessQuiz: false,
      shakeMatcher: false,
      hydrationCheck: false
    });
    setRewards([]);
    setActiveReward(null);
    setCurrentScreen('leadForm');
  }, []);

  // Submit Lead Form and write initial Firestore doc at leads/{sessionId}
  const submitLead = useCallback(async (details) => {
    sounds.playSuccess();
    const guestData = {
      name: details.name.trim(),
      phone: details.phone.trim(),
      mood: details.mood,
      joinedAt: new Date().toISOString()
    };
    setGuest(guestData);

    // Write single doc to Firestore/offline queue
    await createLead(sessionId, guestData);

    // Go to Content Hub
    setCurrentScreen('hub');
  }, [sessionId]);

  // Complete an activity, update Firestore doc in-place, and optionally show reward modal
  const completeActivity = useCallback(async (activityKey, activityResult, reward) => {
    // Mark completed locally
    setCompletedActivities(prev => ({
      ...prev,
      [activityKey]: true
    }));

    if (reward) {
      setRewards(prev => {
        if (prev.some(r => r.code === reward.code)) return prev;
        return [...prev, reward];
      });
      setActiveReward(reward);
      sounds.playWinFanfare();
    } else {
      sounds.playSuccess();
    }

    // Single in-place update write to Firestore doc
    await updateLeadActivity(sessionId, activityKey, activityResult, reward);
  }, [sessionId]);

  // Dismiss reward modal and return to hub
  const closeRewardModal = useCallback(() => {
    sounds.playTap();
    setActiveReward(null);
    setCurrentScreen('hub');
  }, []);

  // Clean reset for next stall attendee
  const resetToNewGuest = useCallback(() => {
    sounds.playTap();
    const freshId = generateSessionId();
    setSessionId(freshId);
    setGuest({ name: '', phone: '', mood: '', joinedAt: null });
    setCompletedActivities({
      spinWheel: false,
      wellnessQuiz: false,
      shakeMatcher: false,
      hydrationCheck: false
    });
    setRewards([]);
    setActiveReward(null);
    setIsResetConfirmOpen(false);
    setCurrentScreen('welcome');
  }, []);

  const toggleSound = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const value = {
    sessionId,
    currentScreen,
    guest,
    completedActivities,
    rewards,
    activeReward,
    isResetConfirmOpen,
    isStaffPortalOpen,
    isMuted,
    navigateTo,
    startJourney,
    submitLead,
    completeActivity,
    closeRewardModal,
    resetToNewGuest,
    setIsResetConfirmOpen,
    setIsStaffPortalOpen,
    toggleSound
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
