import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

/**
 * ✅ Firebase Config — Connected to: online-backup-system-recovery
 */
const firebaseConfig = {
  apiKey: "AIzaSyD-mEOsTTuD55m75oLO2IZh8njDZbVcMW8",
  authDomain: "online-backup-system-recovery.firebaseapp.com",
  databaseURL: "https://online-backup-system-recovery-default-rtdb.firebaseio.com",
  projectId: "online-backup-system-recovery",
  storageBucket: "online-backup-system-recovery.firebasestorage.app",
  messagingSenderId: "620192830280",
  appId: "1:620192830280:web:1ad00da650ef29d9abd97d",
  measurementId: "G-FV5J46DEFB"
};

let database: any = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = getDatabase(app);

  // Initialize Analytics (only works in browser environment)
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }

  console.info("✅ Firebase Realtime Database connected — online-backup-system-recovery");
} catch (error) {
  console.warn("⚠️ Firebase init failed. Make sure Realtime Database is enabled in Firebase Console.", error);
}

export { database, ref, set };
export const isFirebaseEnabled = () => database !== null;
