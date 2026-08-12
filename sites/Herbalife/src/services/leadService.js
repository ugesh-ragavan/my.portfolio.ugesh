import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const LOCAL_STORAGE_KEY = 'herbalife_stall_leads_backup';

// Helper to get local leads backup for stall staff
export const getOfflineLeads = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save to offline backup
const saveToLocalBackup = (leadDoc) => {
  try {
    const leads = getOfflineLeads();
    const index = leads.findIndex(l => l.sessionId === leadDoc.sessionId);
    if (index >= 0) {
      leads[index] = { ...leads[index], ...leadDoc, updatedAt: new Date().toISOString() };
    } else {
      leads.push({ ...leadDoc, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.warn("Could not save to local storage backup", e);
  }
};

/**
 * Creates the initial single lead document for the guest at leads/{sessionId}
 */
export const createLead = async (sessionId, guestData) => {
  const payload = {
    sessionId,
    name: guestData.name.trim(),
    phone: guestData.phone.trim(),
    mood: guestData.mood,
    createdAt: new Date().toISOString(),
    completedActivities: {
      spinWheel: false,
      wellnessQuiz: false,
      shakeMatcher: false,
      hydrationCheck: false
    },
    rewards: [],
    deviceInfo: {
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    }
  };

  // Always save to local backup
  saveToLocalBackup(payload);

  // If Firebase is configured and online, perform 1 single setDoc write
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'leads', sessionId);
      await setDoc(leadRef, {
        ...payload,
        firestoreCreatedAt: serverTimestamp()
      });
      console.log(`✅ Lead doc saved to Firestore for session: ${sessionId}`);
    } catch (err) {
      console.warn("Firestore setDoc notice (lead buffered locally):", err.message);
    }
  }

  return payload;
};

/**
 * Updates the guest's same single document in-place when an activity is completed.
 * Keeps writes minimal to preserve Firebase Free/Spark tier limits.
 */
export const updateLeadActivity = async (sessionId, activityKey, activityResult, reward) => {
  const updateData = {
    [`completedActivities.${activityKey}`]: true,
    [`activityResults.${activityKey}`]: activityResult || {},
    updatedAt: new Date().toISOString()
  };

  // Update local backup
  const leads = getOfflineLeads();
  const currentLead = leads.find(l => l.sessionId === sessionId) || { sessionId, completedActivities: {}, rewards: [] };
  
  if (!currentLead.completedActivities) currentLead.completedActivities = {};
  if (!currentLead.activityResults) currentLead.activityResults = {};
  if (!currentLead.rewards) currentLead.rewards = [];

  currentLead.completedActivities[activityKey] = true;
  currentLead.activityResults[activityKey] = activityResult || {};
  if (reward && !currentLead.rewards.some(r => r.code === reward.code)) {
    currentLead.rewards.push(reward);
  }
  saveToLocalBackup(currentLead);

  // Update in Firestore
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'leads', sessionId);
      const firestorePayload = {
        ...updateData,
        firestoreUpdatedAt: serverTimestamp()
      };
      if (reward) {
        firestorePayload.rewards = currentLead.rewards;
      }
      await updateDoc(leadRef, firestorePayload);
      console.log(`✅ Lead doc updated in Firestore for activity: ${activityKey}`);
    } catch (err) {
      console.warn("Firestore updateDoc notice (buffered locally):", err.message);
    }
  }

  return currentLead;
};

/**
 * Exports all leads collected on this kiosk to a clean CSV for stall staff
 */
export const exportLeadsToCSV = () => {
  const leads = getOfflineLeads();
  if (leads.length === 0) {
    return false;
  }

  const headers = [
    'Session ID',
    'Name',
    'Phone',
    'Mood',
    'Created At',
    'Spin Wheel Done',
    'Quiz Done',
    'Shake Match Done',
    'Hydration Done',
    'Rewards Count',
    'Rewards List'
  ];

  const rows = leads.map(lead => {
    const rewardsStr = (lead.rewards || []).map(r => `${r.title} (${r.code})`).join('; ');
    return [
      `"${lead.sessionId || ''}"`,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${lead.phone || ''}"`,
      `"${lead.mood || ''}"`,
      `"${lead.createdAt || ''}"`,
      lead.completedActivities?.spinWheel ? 'YES' : 'NO',
      lead.completedActivities?.wellnessQuiz ? 'YES' : 'NO',
      lead.completedActivities?.shakeMatcher ? 'YES' : 'NO',
      lead.completedActivities?.hydrationCheck ? 'YES' : 'NO',
      (lead.rewards || []).length,
      `"${rewardsStr.replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `herbalife_stall_leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
