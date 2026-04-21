
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();


const firebaseConfig = {
  apiKey: "AIzaSyD_Bq5GRfrBrtIkdZuXsdCEwkGemUREoVQ",
  authDomain: "streaminstall.firebaseapp.com",
  projectId: "streaminstall",
  storageBucket: "streaminstall.firebasestorage.app",
  messagingSenderId: "592848945164",
  appId: "1:592848945164:web:79bd28f668fc03325a2e29",
};


console.log('Testing Firebase connection with project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const timeout = setTimeout(() => {
  console.log('Firebase connection timed out after 10s');
  process.exit(1);
}, 10000);

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed! User:', user ? user.uid : 'null');
  clearTimeout(timeout);
  process.exit(0);
});
