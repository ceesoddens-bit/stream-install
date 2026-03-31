import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_Bq5GRfrBrtIkdZuXsdCEwkGemUREoVQ",
  authDomain: "streaminstall.firebaseapp.com",
  projectId: "streaminstall",
  storageBucket: "streaminstall.firebasestorage.app",
  messagingSenderId: "592848945164",
  appId: "1:592848945164:web:79bd28f668fc03325a2e29",
  measurementId: "G-CZVX6HXZ58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
