// Firebase Configuration & Firestore Zero-Data-Loss Engine for Herbalife Wellness Stall
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// User's exact Firebase Project Credentials (d-sun-herbalife)
const firebaseConfig = {
  apiKey: "AIzaSyB87Oxc9opZqrNR7_z32WwWWgfZZ8DvKmc",
  authDomain: "d-sun-herbalife.firebaseapp.com",
  projectId: "d-sun-herbalife",
  storageBucket: "d-sun-herbalife.firebasestorage.app",
  messagingSenderId: "620347086295",
  appId: "1:620347086295:web:d18943b78e6aa665baa792",
  measurementId: "G-VVQ7ST67C6"
};

// Initialize Firebase App, Firestore & Analytics
let app = null;
let db = null;
let analytics = null;
let isFirebaseOnline = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseOnline = true;
  console.log("🌿 Firebase Firestore Connected: stall_leads on project d-sun-herbalife");

  // Initialize Analytics if supported in environment
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("📈 Firebase Analytics Connected: G-VVQ7ST67C6");
    }
  }).catch(() => {});

} catch (e) {
  console.warn("⚠️ Firebase init warning (offline local store active):", e);
}

// -------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE (Zero Data Loss Local Store)
// -------------------------------------------------------------
const STORAGE_KEY = "herbalife_all_leads_backup";
const CURRENT_LEAD_KEY = "current_stall_lead";

export function getLocalLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading local leads:", e);
    return [];
  }
}

export function saveLeadToLocalStorage(lead) {
  try {
    const all = getLocalLeads();
    const index = all.findIndex(l => (
      (l.firestoreDocId && lead.firestoreDocId && l.firestoreDocId === lead.firestoreDocId) ||
      (l.phone === lead.phone && l.timestamp === lead.timestamp)
    ));

    if (index >= 0) {
      all[index] = { ...all[index], ...lead };
    } else {
      all.push(lead);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Error saving lead to localStorage:", e);
  }
}

// -------------------------------------------------------------
// SAVE NEW LEAD (Dual Storage: Cloud Firestore + LocalStorage)
// -------------------------------------------------------------
export async function saveLeadToFirestore(leadData) {
  const payload = {
    id: `HL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    name: (leadData.name || '').trim(),
    phone: (leadData.phone || '').trim(),
    mood: leadData.mood || 'Feeling Fantastic',
    timestamp: new Date().toISOString(),
    activities: {
      wheel: null,
      riddles: null,
      quiz: null,
      bmi: null
    },
    rewards: [],
    syncedToCloud: false
  };

  // 1. Immediately write to LocalStorage (Guarantees zero data loss even if network disconnects)
  localStorage.setItem(CURRENT_LEAD_KEY, JSON.stringify(payload));
  saveLeadToLocalStorage(payload);

  // 2. Attempt write to Firebase Firestore
  if (isFirebaseOnline && db) {
    try {
      const docRef = await addDoc(collection(db, "stall_leads"), {
        ...payload,
        firestoreCreatedAt: serverTimestamp()
      });
      payload.firestoreDocId = docRef.id;
      payload.syncedToCloud = true;
      localStorage.setItem(CURRENT_LEAD_KEY, JSON.stringify(payload));
      saveLeadToLocalStorage(payload);
      console.log("✅ Lead registered in Firestore stall_leads:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.warn("⚠️ Firestore write buffered locally (offline):", err.message);
    }
  }

  return payload.id;
}

// -------------------------------------------------------------
// UPDATE LEAD ACTIVITY & REWARDS
// -------------------------------------------------------------
export async function updateLeadActivity(activityKey, result, reward) {
  try {
    const raw = localStorage.getItem(CURRENT_LEAD_KEY);
    if (!raw) return;
    const current = JSON.parse(raw);

    if (!current.activities) current.activities = {};
    if (!current.rewards) current.rewards = [];

    current.activities[activityKey] = result;
    if (reward && !current.rewards.some(r => r.code === reward.code)) {
      current.rewards.push({
        ...reward,
        unlockedAt: new Date().toISOString()
      });
    }

    // Update local store
    localStorage.setItem(CURRENT_LEAD_KEY, JSON.stringify(current));
    saveLeadToLocalStorage(current);

    // Sync update to Firestore
    if (isFirebaseOnline && db && current.firestoreDocId) {
      const leadRef = doc(db, "stall_leads", current.firestoreDocId);
      await updateDoc(leadRef, {
        [`activities.${activityKey}`]: result,
        rewards: current.rewards,
        firestoreUpdatedAt: serverTimestamp()
      });
      console.log(`✅ Activity '${activityKey}' synced to Firestore:`, current.firestoreDocId);
    }
  } catch (e) {
    console.warn("⚠️ Could not update lead activity in Firestore:", e);
  }
}

// -------------------------------------------------------------
// GET ALL LEADS (Merged Firestore + Local Storage)
// -------------------------------------------------------------
export async function getAllLeads() {
  const localLeads = getLocalLeads();
  const leadsMap = new Map();

  // Populate from local storage first
  localLeads.forEach(lead => {
    const key = lead.firestoreDocId || `${lead.phone}_${lead.timestamp}`;
    leadsMap.set(key, lead);
  });

  // Attempt fetch from Firestore
  if (isFirebaseOnline && db) {
    try {
      const snapshot = await getDocs(collection(db, "stall_leads"));
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const firestoreLead = {
          ...data,
          firestoreDocId: docSnap.id,
          syncedToCloud: true
        };
        leadsMap.set(docSnap.id, firestoreLead);
      });
      console.log(`🌿 Fetched ${snapshot.size} live leads from Firestore stall_leads`);
    } catch (e) {
      console.warn("⚠️ Firestore query error (displaying local cached leads):", e.message);
    }
  }

  const all = Array.from(leadsMap.values());
  // Sort newest first
  all.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  
  // Cache to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {}

  return all;
}

// -------------------------------------------------------------
// SYNC LOCAL LEADS TO FIRESTORE (Push any unsynced records)
// -------------------------------------------------------------
export async function syncOfflineLeadsToFirestore() {
  if (!isFirebaseOnline || !db) {
    return { success: false, message: "Firebase is currently offline." };
  }

  const localLeads = getLocalLeads();
  let syncedCount = 0;

  for (let i = 0; i < localLeads.length; i++) {
    const lead = localLeads[i];
    if (!lead.firestoreDocId) {
      try {
        const docRef = await addDoc(collection(db, "stall_leads"), {
          ...lead,
          firestoreCreatedAt: serverTimestamp()
        });
        localLeads[i].firestoreDocId = docRef.id;
        localLeads[i].syncedToCloud = true;
        syncedCount++;
      } catch (err) {
        console.warn("Error syncing lead:", err);
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(localLeads));
  return { success: true, count: syncedCount };
}

// -------------------------------------------------------------
// EXPORT ALL LEADS TO CSV (Formatted for Excel/Google Sheets)
// -------------------------------------------------------------
export function exportLeadsToCSV(leads) {
  if (!leads || leads.length === 0) {
    alert("No attendee leads found to export.");
    return false;
  }

  const headers = [
    "Lead ID",
    "Full Name",
    "Contact Number",
    "Mood",
    "Registration Date & Time",
    "Wheel Prize Won",
    "BMI Score",
    "BMI Category",
    "Tamil Cinema Riddles Score",
    "Health Quiz Score",
    "Total Perks Won",
    "Claimable Voucher Codes & Details",
    "Cloud Sync Status"
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map(l => {
    const activities = l.activities || {};
    const rewards = l.rewards || [];
    
    const wheelPrize = activities.wheel?.label || "Not Played";
    const bmiScore = activities.bmi?.bmi ? `${activities.bmi.bmi} (${activities.bmi.category})` : "Not Checked";
    const bmiCategory = activities.bmi?.category || "—";
    const riddlesScore = activities.riddles?.score !== undefined ? `${activities.riddles.score}/3` : "Not Played";
    const quizScore = activities.quiz?.score !== undefined ? `${activities.quiz.score}/3` : "Not Played";
    
    const rewardDetails = rewards.map(r => `${r.title} [Code: ${r.code}]`).join(" | ") || "None";
    const syncStatus = l.firestoreDocId || l.syncedToCloud ? "Synced (Firestore)" : "Local Storage";

    return [
      escapeCSV(l.firestoreDocId || l.id || "—"),
      escapeCSV(l.name || "Guest"),
      escapeCSV(l.phone || "—"),
      escapeCSV(l.mood || "—"),
      escapeCSV(l.timestamp ? new Date(l.timestamp).toLocaleString() : "—"),
      escapeCSV(wheelPrize),
      escapeCSV(bmiScore),
      escapeCSV(bmiCategory),
      escapeCSV(riddlesScore),
      escapeCSV(quizScore),
      rewards.length,
      escapeCSV(rewardDetails),
      escapeCSV(syncStatus)
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const timestampStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const fileName = `herbalife_stall_leads_${timestampStr}.csv`;

  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", url);
  downloadLink.setAttribute("download", fileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, 150);
  return true;
}

export { db, isFirebaseOnline };
