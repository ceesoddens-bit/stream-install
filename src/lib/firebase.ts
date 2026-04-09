import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_Bq5GRfrBrtIkdZuXsdCEwkGemUREoVQ",
  authDomain: "streaminstall.firebaseapp.com",
  projectId: "streaminstall",
  storageBucket: "streaminstall.firebasestorage.app",
  messagingSenderId: "592848945164",
  appId: "1:592848945164:web:79bd28f668fc03325a2e29",
  measurementId: "G-CZVX6HXZ58"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export let analytics: any = null;

const env: any = (import.meta as any).env || {};
if (typeof window !== 'undefined' && env.PROD && navigator.onLine && env.VITE_ENABLE_ANALYTICS === 'true') {
  import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }: any) => {
      try {
        const ok = await isSupported();
        if (ok) {
          analytics = getAnalytics(app);
        }
      } catch {}
    })
    .catch(() => {});
}

export default app;
