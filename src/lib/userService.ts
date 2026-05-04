import { onSnapshot, query, where, collection, addDoc, Timestamp, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, tenantCol } from './firebase';
import { UserDoc, Rol, Tenant } from './tenantTypes';
import { PermissionKey, DEFAULT_MEMBER_PERMISSIONS } from './permissions';
import { berekenMaandprijs, ModuleKey } from './modules';
import { PRIJS_OWNER, PRIJS_ADMIN, PRIJS_MEMBER } from './modules';

export interface InviteDoc {
  id?: string;
  email: string;
  role: Rol;
  permissions: PermissionKey[];
  token: string;
  tenantId: string;
  tenantNaam?: string;
  createdAt: Timestamp;
  expiresAt: number;
  status: 'pending' | 'accepted';
}

export interface KostenImpact {
  huidigeMaandprijs: number;
  nieuweMaandprijs: number;
  verschil: number;
  prijsPerMaand: number;
}

export function berekenKostenImpact(tenant: Tenant, nieuweRol: Rol): KostenImpact {
  const modules = (tenant.actiefModules ?? []) as ModuleKey[];
  const owners = tenant.aantalOwners ?? Math.max(1, tenant.aantalGebruikers ?? 1);
  const admins = tenant.aantalAdmins ?? 0;
  const members = tenant.aantalMembers ?? 0;

  const prijsNieuweGebruiker =
    nieuweRol === 'owner' ? PRIJS_OWNER :
    nieuweRol === 'admin' ? PRIJS_ADMIN :
    PRIJS_MEMBER;

  const huidig = berekenMaandprijs(owners, admins, members, modules);
  const nieuw =
    nieuweRol === 'owner' ? berekenMaandprijs(owners + 1, admins, members, modules) :
    nieuweRol === 'admin' ? berekenMaandprijs(owners, admins + 1, members, modules) :
    berekenMaandprijs(owners, admins, members + 1, modules);

  return {
    huidigeMaandprijs: huidig,
    nieuweMaandprijs: nieuw,
    verschil: nieuw - huidig,
    prijsPerMaand: prijsNieuweGebruiker,
  };
}

export const userService = {
  subscribeToUsers: (tenantId: string, callback: (users: UserDoc[]) => void) => {
    const q = query(collection(db, 'users'), where('tenantId', '==', tenantId));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      })) as UserDoc[];
      callback(users);
    });
  },

  subscribeToInvites: (callback: (invites: InviteDoc[]) => void) => {
    const q = query(tenantCol('invites'), where('status', '==', 'pending'));
    return onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as InviteDoc[];
      callback(invites);
    });
  },

  /**
   * Maakt een uitnodiging aan in Firestore en stuurt een mail via Trigger Email Extension.
   * Bijwerken van tenant-aantallen gebeurt server-side (Cloud Function) of moet handmatig
   * na acceptatie. De kostenimpact wordt getoond vóór het aanmaken.
   */
  createInvite: async (
    tenantId: string,
    tenantNaam: string,
    email: string,
    role: Rol,
    permissions: PermissionKey[] = DEFAULT_MEMBER_PERMISSIONS
  ) => {
    const token = `${tenantId}.${crypto.randomUUID().replace(/-/g, '')}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dagen

    const inviteData: Omit<InviteDoc, 'id'> = {
      email,
      role,
      permissions: role === 'member' ? permissions : [],
      token,
      tenantId,
      tenantNaam,
      status: 'pending',
      createdAt: Timestamp.now(),
      expiresAt,
    };

    // Mail wordt verzonden door de Cloud Function `onInviteCreated` via Admin SDK.
    const inviteRef = await addDoc(tenantCol('invites'), inviteData);
    return inviteRef.id;
  },

  deleteInvite: async (inviteId: string) => {
    await deleteDoc(doc(tenantCol('invites'), inviteId));
  },

  updateUserPermissions: async (uid: string, permissions: PermissionKey[]) => {
    await updateDoc(doc(db, 'users', uid), { permissions });
  },

  getUser: async (uid: string): Promise<UserDoc | null> => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { uid: snapshot.docs[0].id, ...snapshot.docs[0].data() } as UserDoc;
    }
    return null;
  },
};

function rolLabel(role: Rol): string {
  if (role === 'owner') return 'Hoofdgebruiker';
  if (role === 'admin') return 'Extra hoofdgebruiker';
  return 'Medewerker';
}
