import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db, setCurrentTenantId } from './firebase';
import { Tenant, UserDoc, Rol } from './tenantTypes';
import { heeftToegang } from './moduleAccess';
import { ModuleKey } from './modules';
import { PermissionKey, heeftPermissie as checkPermissie } from './permissions';

interface TenantContextValue {
  authUser: User | null;
  userDoc: UserDoc | null;
  tenant: Tenant | null;
  tenantId: string | null;
  role: Rol | null;
  actiefModules: ModuleKey[];
  heeftToegang: (key: ModuleKey) => boolean;
  permissions: PermissionKey[];
  heeftPermissie: (permission: PermissionKey) => boolean;
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
  // Gate that prevents the tenant listener from starting before the JWT
  // token contains the custom claims (tenantId / role). Without this guard
  // Firestore uses a stale cached token and returns permission-denied.
  const [claimsVerified, setClaimsVerified] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.error('Auth is not initialized');
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
        setClaimsVerified(false);
        setUserReady(true);
        setTenantReady(true);
      } else {
        setClaimsVerified(false);
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

        // Wait for the onUserCreated CF to set custom claims (tenantId, role) before
        // triggering the tenant listener — without claims the Firestore rules deny access.
        // For newly registered accounts this may take a few seconds while the CF runs.
        let claimsOk = false;
        for (let i = 0; i < 5; i++) {
          try {
            const result = await authUser.getIdTokenResult(true);
            if (result.claims['tenantId']) {
              claimsOk = true;
              break;
            }
          } catch (err: any) {
            // Token refresh failed (network error, revoked token, etc.)
            console.error('Token refresh mislukt, sessie beëindigd:', err?.code, err?.message);
            await signOut(auth);
            return;
          }
          if (i < 4) await new Promise(r => setTimeout(r, 2000));
        }

        if (!claimsOk) {
          // Custom claims missing even after polling. This happens for accounts that were
          // created before onUserCreated was deployed. Use scripts/set-claims.cjs to fix.
          console.error(
            'Custom claims ontbreken voor uid=' + authUser.uid + '. ' +
            'Voer scripts/set-claims.cjs uit om het account te herstellen. Sessie beëindigd.'
          );
          await signOut(auth);
          return;
        }

        // Mark claims as verified so the tenant listener is allowed to start.
        // The token was already force-refreshed above, so Firestore will use the up-to-date JWT.
        setClaimsVerified(true);
        setUserDoc({ uid: authUser.uid, ...(data as Omit<UserDoc, 'uid'>) });
      } else {
        setUserDoc(null);
        setTenantReady(true);
      }
      setUserReady(true);
    }, (error) => {
      console.error('onSnapshot users error:', error);
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
    // Wait until the JWT token has been refreshed with the correct custom
    // claims before opening the tenant listener. Firestore evaluates rules
    // against the token that was active when the listener was registered;
    // starting too early causes a permission-denied error.
    if (!userDoc?.tenantId || !claimsVerified) return;

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
      console.error('onSnapshot tenants error:', error);
      setTenantReady(true);
    });
  }, [userDoc?.tenantId, userReady, claimsVerified]);

  const updateTenantModules = async (modules: string[]) => {
    if (!userDoc?.tenantId) return;
    const { updateDoc } = await import('firebase/firestore');
    const ref = doc(db, 'tenants', userDoc.tenantId);
    await updateDoc(ref, { actiefModules: modules, updatedAt: new Date() });
  };

  const value = useMemo<TenantContextValue>(() => {
    const actief = tenant?.actiefModules ?? [];
    const userPermissions = (userDoc?.permissions ?? []) as PermissionKey[];
    const rol = userDoc?.role ?? null;

    return {
      authUser,
      userDoc,
      tenant,
      tenantId: userDoc?.tenantId ?? null,
      role: rol,
      actiefModules: actief,
      heeftToegang: (key: ModuleKey) => heeftToegang(key, actief),
      permissions: userPermissions,
      heeftPermissie: (permission: PermissionKey) => checkPermissie(rol, permission, userPermissions),
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
