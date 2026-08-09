import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from Vite environment variables with graceful fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForKioskMode",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "herbalife-wellness-stall.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "herbalife-wellness-stall",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "herbalife-wellness-stall.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app = null;
let db = null;
let isFirebaseConfigured = false;

try {
  // Check if real config is provided
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    isFirebaseConfigured = true;
    console.log("🌿 Firebase Firestore successfully connected!");
  } else {
    // Initialized in offline/demo kiosk mode
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.info("ℹ️ Running in Kiosk Offline-Resilient mode (Local queue active until live Firebase credentials provided).");
  }
} catch (error) {
  console.warn("Firebase initialization warning (Using local kiosk buffer):", error);
}

export { app, db, isFirebaseConfigured };
