import { onSnapshot, query, where, collection, addDoc, Timestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, tenantCol } from './firebase';
import { UserDoc, Rol } from './tenantTypes';

export interface InviteDoc {
  id?: string;
  email: string;
  role: Rol;
  token: string;
  tenantId: string;
  createdAt: Timestamp;
  status: 'pending' | 'accepted';
}

export const userService = {
  // Subscribe to all users within the current tenant
  subscribeToUsers: (tenantId: string, callback: (users: UserDoc[]) => void) => {
    const q = query(collection(db, 'users'), where('tenantId', '==', tenantId));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserDoc[];
      callback(users);
    });
  },

  // Subscribe to all pending invites for the current tenant
  subscribeToInvites: (callback: (invites: InviteDoc[]) => void) => {
    const q = query(tenantCol('invites'), where('status', '==', 'pending'));
    return onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InviteDoc[];
      callback(invites);
    });
  },

  // Create a new invite
  createInvite: async (tenantId: string, email: string, role: Rol) => {
    // Generate a secure random token
    const token = crypto.randomUUID().replace(/-/g, '');
    const inviteDoc: Omit<InviteDoc, 'id'> = {
      email,
      role,
      token,
      tenantId,
      status: 'pending',
      createdAt: Timestamp.now(),
    };
    try {
      await addDoc(tenantCol('invites'), inviteDoc);
      // Here you would typically also trigger an email sending process (e.g. Firebase Extension Trigger Email)
      return token;
    } catch (error) {
      console.error("Error creating invite: ", error);
      throw error;
    }
  },

  // Cancel/delete an invite
  deleteInvite: async (inviteId: string) => {
    try {
      await deleteDoc(doc(tenantCol('invites'), inviteId));
    } catch (error) {
      console.error("Error deleting invite: ", error);
      throw error;
    }
  },

  // Get user profile data (useful for looking up specific user details)
  getUser: async (uid: string): Promise<UserDoc | null> => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { uid: snapshot.docs[0].id, ...snapshot.docs[0].data() } as UserDoc;
    }
    return null;
  }
};
