import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore';

/**
 * ============================================================================
 * 1. PASTE YOUR FIREBASE CREDENTIALS HERE (Optional — App Works Without Them!)
 * ============================================================================
 * Create a free project at https://console.firebase.google.com/ -> Add Web App
 * and copy your firebaseConfig object into FIREBASE_CONFIG below.
 * While these remain placeholder strings, the app runs in graceful local mode.
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBiyQP8lP5gIw9OrkmgreAChOfQi5vZ2t8',
  authDomain: 'my-fav-notification.firebaseapp.com',
  projectId: 'my-fav-notification',
  storageBucket: 'my-fav-notification.firebasestorage.app',
  messagingSenderId: '26772390545',
  appId: '1:26772390545:web:2c9d43b776c4f7d628f530',
  measurementId: 'G-Y4TW0CXNHN',
};

export type NotificationProvider = 'ntfy' | 'telegram' | 'discord' | 'custom';

export const NOTIFICATION_PROVIDER: NotificationProvider = 'telegram';
export const NOTIFICATION_WEBHOOK_URL = '';

// Telegram configuration (active)
export const TELEGRAM_BOT_TOKEN = '9208029539:AAEYN-wbme4JNLI_1c-S9uVn0QGhdVfEt5Q';
export const TELEGRAM_CHAT_ID = '833290117';

export interface MoodLogPayload {
  mood: string;
  label: string;
  note?: string;
}

export interface MoodDispatchResult {
  savedToFirestore: boolean;
  notificationSent: boolean;
  mode: 'live' | 'fallback';
}

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(FIREBASE_CONFIG.apiKey) &&
    !FIREBASE_CONFIG.apiKey.startsWith('YOUR_') &&
    Boolean(FIREBASE_CONFIG.projectId) &&
    !FIREBASE_CONFIG.projectId.startsWith('YOUR_') &&
    Boolean(FIREBASE_CONFIG.appId) &&
    !FIREBASE_CONFIG.appId.startsWith('YOUR_')
  );
}

export function isNotificationConfigured(): boolean {
  if (NOTIFICATION_PROVIDER === 'telegram') {
    return (
      Boolean(TELEGRAM_BOT_TOKEN) &&
      !TELEGRAM_BOT_TOKEN.startsWith('YOUR_') &&
      Boolean(TELEGRAM_CHAT_ID) &&
      !TELEGRAM_CHAT_ID.startsWith('YOUR_')
    );
  }
  return (
    Boolean(NOTIFICATION_WEBHOOK_URL) &&
    !NOTIFICATION_WEBHOOK_URL.startsWith('YOUR_') &&
    NOTIFICATION_WEBHOOK_URL.startsWith('http')
  );
}

function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  try {
    if (!cachedApp) {
      cachedApp = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    }
    if (!cachedDb) {
      cachedDb = getFirestore(cachedApp);
    }
    return cachedDb;
  } catch {
    return null;
  }
}

function getSafeDeviceInfo() {
  if (typeof navigator === 'undefined') {
    return { platform: 'unknown', viewport: 'unknown' };
  }
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    viewport:
      typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
  };
}

function saveFallbackHistory(payload: MoodLogPayload) {
  try {
    const key = 'sree_cozy_mood_logs';
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const next = [
      {
        ...payload,
        timestamp: new Date().toISOString(),
        deviceInfo: getSafeDeviceInfo(),
      },
      ...existing,
    ].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

/**
 * Sends a push notification to your phone via ntfy.sh, Telegram, Discord, or custom webhook.
 */
export async function sendMoodNotification(payload: MoodLogPayload): Promise<boolean> {
  if (!isNotificationConfigured()) {
    return false;
  }

  const timeString = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const messageTitle = `Sree checked in: ${payload.label}`;
  const messageBody = payload.note
    ? `Sree tapped "${payload.label}" at ${timeString} — ${payload.note}`
    : `Sree just tapped "${payload.label}" at ${timeString}. Go send her some love 💌`;

  try {
    if (NOTIFICATION_PROVIDER === 'ntfy') {
      const response = await fetch(NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          Title: messageTitle,
          Priority: 'high',
          Tags: 'heart,sparkles',
        },
        body: messageBody,
      });
      return response.ok;
    }

    if (NOTIFICATION_PROVIDER === 'telegram') {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `💌 *${messageTitle}*\n${messageBody}`,
          parse_mode: 'Markdown',
        }),
      });
      return response.ok;
    }

    if (NOTIFICATION_PROVIDER === 'discord') {
      const response = await fetch(NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `💌 **${messageTitle}**\n${messageBody}`,
        }),
      });
      return response.ok;
    }

    // Custom JSON webhook
    const response = await fetch(NOTIFICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: payload.mood,
        label: payload.label,
        message: messageBody,
        timestamp: new Date().toISOString(),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Saves Sree's selected mood to Firestore ("mood_logs") and fires your instant notification.
 * Falls back gracefully if keys haven't been pasted yet so the UI never errors.
 */
export async function logAndNotifyMood(payload: MoodLogPayload): Promise<MoodDispatchResult> {
  saveFallbackHistory(payload);

  const db = getFirestoreDb();
  let savedToFirestore = false;

  if (db) {
    try {
      await addDoc(collection(db, 'mood_logs'), {
        mood: payload.mood,
        label: payload.label,
        timestamp: serverTimestamp(),
        deviceInfo: getSafeDeviceInfo(),
      });
      savedToFirestore = true;
    } catch {
      savedToFirestore = false;
    }
  }

  const notificationSent = await sendMoodNotification(payload);

  return {
    savedToFirestore,
    notificationSent,
    mode: savedToFirestore || notificationSent ? 'live' : 'fallback',
  };
}
