import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


let app;
let db: any;
let auth: any;
let storage: any;


try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  
  if (typeof window !== 'undefined') {
    (window as any).auth = auth;
    (window as any).db = db;
  }
} catch (error) {

  console.error("Firebase initialization failed:", error);
}

export { db, auth, storage };
export let analytics: any = null;


const env: any = (import.meta as any).env || {};
if (typeof window !== 'undefined' && env.PROD && navigator.onLine && env.VITE_ENABLE_ANALYTICS === 'true') {
  import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }: any) => {
      try {
        const ok = await isSupported();
        if (ok) analytics = getAnalytics(app);
      } catch {}
    })
    .catch(() => {});
}

// Current tenant id — set by TenantContext after auth resolves.
let currentTenantId: string | null = null;

export function setCurrentTenantId(id: string | null): void {
  currentTenantId = id;
}

export function getCurrentTenantId(): string {
  if (!currentTenantId) {
    throw new Error('No active tenant. Ensure TenantContext is mounted and user is authenticated.');
  }
  return currentTenantId;
}

export function tenantCol(name: string): CollectionReference {
  return collection(db, 'tenants', getCurrentTenantId(), name);
}

export function tenantDoc(name: string, id: string): DocumentReference {
  return doc(db, 'tenants', getCurrentTenantId(), name, id);
}

export function tenantPath(name: string): string {
  return `tenants/${getCurrentTenantId()}/${name}`;
}

export default app;
