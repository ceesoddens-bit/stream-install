import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, setCurrentTenantId } from './firebase';
import { Tenant, UserDoc, Rol } from './tenantTypes';
import { heeftToegang } from './moduleAccess';
import { ModuleKey } from './modules';

interface TenantContextValue {
  authUser: User | null;
  userDoc: UserDoc | null;
  tenant: Tenant | null;
  tenantId: string | null;
  role: Rol | null;
  actiefModules: ModuleKey[];
  heeftToegang: (key: ModuleKey) => boolean;
  updateTenantModules: (modules: string[]) => Promise<void>;
  loading: boolean;
  authReady: boolean;
  isBetaald: boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [tenantReady, setTenantReady] = useState(false);


  useEffect(() => {
    if (!auth) {
      console.error("Auth is not initialized");
      setAuthReady(true);
      setUserReady(true);
      setTenantReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      setAuthReady(true);
      if (!u) {
        setUserDoc(null);
        setTenant(null);
        setCurrentTenantId(null);
        setUserReady(true);
        setTenantReady(true);
      } else {
        setUserReady(false);
        setTenantReady(false);
      }
    });
  }, []);


  useEffect(() => {
    if (!authUser) return;
    const ref = doc(db, 'users', authUser.uid);


    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        const data = snap.data() as DocumentData;
        setUserDoc({ uid: authUser.uid, ...(data as Omit<UserDoc, 'uid'>) });
        
        // Force refresh token om nieuwe custom claims (tenantId, role) op te halen
        try {
          await authUser.getIdToken(true);
        } catch (err) {
          console.error("Fout bij verversen ID token:", err);
        }
      } else {
        setUserDoc(null);
        setTenantReady(true); // No user doc means no tenant doc to wait for
      }
      setUserReady(true);
    }, (error) => {
      console.error("onSnapshot users error:", error);
      setUserDoc(null);
      setUserReady(true);
      setTenantReady(true);
    });
  }, [authUser]);

  useEffect(() => {
    if (userReady && !userDoc?.tenantId) {
      setTenant(null);
      setCurrentTenantId(null);
      setTenantReady(true);
      return;
    }
    if (!userDoc?.tenantId) return;

    setCurrentTenantId(userDoc.tenantId);
    const ref = doc(db, 'tenants', userDoc.tenantId);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setTenant({ id: snap.id, ...(snap.data() as Omit<Tenant, 'id'>) });
      } else {
        setTenant(null);
      }
      setTenantReady(true);
    }, (error) => {
      console.error("onSnapshot tenants error:", error);
      setTenantReady(true);
    });
  }, [userDoc?.tenantId, userReady]);



  // Fase 2 - Stripe Integratie (Webhook Sync)
  // Hier luisteren we naar de `customers/{uid}/subscriptions` collectie die door de firestore-stripe-payments 
  // extension wordt geüpdatet. Als er een wijziging is, kopieer je de status naar het tenant document.
  useEffect(() => {
    if (!authUser?.uid || !userDoc?.tenantId) return;

    const setupSync = async () => {
      const { collection, query, onSnapshot, limit, orderBy } = await import('firebase/firestore');
      const { getModuleKeyFromPrice } = await import('./stripe');
      const { INBEGREPEN_MODULES } = await import('./modules');
      
      const subsRef = collection(db, `customers/${authUser.uid}/subscriptions`);
      // Haal het meest recente actieve of trialing abonnement op
      const q = query(subsRef, orderBy('created', 'desc'), limit(1));
      
      return onSnapshot(q, async (snap) => {
        if (!snap.empty) {
          const subDoc = snap.docs[0];
          const subData = subDoc.data();
          
          // Afleiden van actieve modules en aantal gebruikers uit de subscription items
          const items = subData.items || [];
          const modulesFromStripe: any[] = [];
          let userCount = 1;

          items.forEach((item: any) => {
            const priceId = item.price.id;
            const key = getModuleKeyFromPrice(priceId);
            if (key === 'basis') {
              userCount = item.quantity || 1;
            } else if (key && key !== 'basis') {
              modulesFromStripe.push(key);
            }
          });

          const { updateDoc, doc } = await import('firebase/firestore');
          const tenantRef = doc(db, 'tenants', userDoc.tenantId);
          
          // We behouden de inbegrepen modules en voegen de betaalde modules uit Stripe toe
          const finalModules = Array.from(new Set([...INBEGREPEN_MODULES, ...modulesFromStripe]));

          await updateDoc(tenantRef, {
            stripeSubscriptionId: subDoc.id,
            abonnementStatus: subData.status, // bijv. 'active', 'trialing', 'canceled', 'past_due'
            abonnementEindDatum: subData.current_period_end ? subData.current_period_end.toMillis() : null,
            cancel_at_period_end: subData.cancel_at_period_end || false,
            actiefModules: finalModules,
            aantalGebruikers: userCount,
            updatedAt: new Date()
          });
        }
      });
    };

    let unsubscribe: () => void;
    setupSync().then(unsub => { unsubscribe = unsub; });
    
    return () => { if (unsubscribe) unsubscribe(); };
  }, [authUser?.uid, userDoc?.tenantId]);

  const updateTenantModules = async (modules: string[]) => {
    if (!userDoc?.tenantId) return;
    const { updateDoc } = await import('firebase/firestore');
    const ref = doc(db, 'tenants', userDoc.tenantId);
    await updateDoc(ref, { 
      actiefModules: modules,
      updatedAt: new Date()
    });
  };


  const value = useMemo<TenantContextValue>(() => {
    const actief = tenant?.actiefModules ?? [];
    return {

      authUser,
      userDoc,
      tenant,
      tenantId: userDoc?.tenantId ?? null,
      role: userDoc?.role ?? null,
      actiefModules: actief,
      heeftToegang: (key: ModuleKey) => heeftToegang(key, actief),
      updateTenantModules,
      loading: !authReady || (!!authUser && (!userReady || !tenantReady)),
      authReady,
      isBetaald: tenant?.abonnementStatus === 'active' || tenant?.abonnementStatus === 'trialing',
    };
  }, [authUser, userDoc, tenant, authReady, userReady, tenantReady]);


  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}
