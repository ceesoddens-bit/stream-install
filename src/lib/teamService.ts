import { onSnapshot, query, orderBy, Timestamp, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface Technician {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'Actief' | 'Inactief';
  color?: string;
  createdAt?: any;
  updatedAt?: any;
}

const TECHNICIANS_COLLECTION = 'technicians';

export const teamService = {
  subscribeToTechnicians: (callback: (techs: Technician[]) => void) => {
    const q = query(tenantCol(TECHNICIANS_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const techs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Technician[];
      callback(techs);
    });
  },

  addTechnician: async (tech: Omit<Technician, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(TECHNICIANS_COLLECTION), {
        ...tech,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding technician: ", error);
      throw error;
    }
  },

  updateTechnician: async (id: string, data: Partial<Technician>) => {
    try {
      await updateDoc(tenantDoc(TECHNICIANS_COLLECTION, id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating technician: ", error);
      throw error;
    }
  },

  deleteTechnician: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(TECHNICIANS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting technician: ", error);
      throw error;
    }
  }
};
