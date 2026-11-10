import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// The user profiles are stored in this named Firestore database, not (default).
const FIRESTORE_DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);

const firebaseApp = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

// Null until all VITE_FIREBASE_* environment variables are available at build time.
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp
  ? getFirestore(firebaseApp, FIRESTORE_DATABASE_ID)
  : null;

export function requireFirebase() {
  if (!auth || !db) {
    throw new Error('Firebase is not configured. Check the VITE_FIREBASE_* environment variables and redeploy.');
  }
  return { auth, db };
}
