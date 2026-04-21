import { addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc, where, getDocs } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface HourEntry {
  id?: string;
  type: string;
  begin: string; // ISO string
  einde: string; // ISO string
  pauze: string; // in minutes
  duur: string; // HH:mm format
  durationMinutes: number; // For aggregation
  project?: string;
  ticketId?: string;
  date: string; // YYYY-MM-DD
  userId: string;
  userName: string;
  status: 'Concept' | 'Ingediend' | 'Goedgekeurd' | 'Afgewezen';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'hours';

const checkOverlap = async (userId: string, begin: string, einde: string, excludeId?: string): Promise<boolean> => {
  const q = query(tenantCol(COLLECTION_NAME), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as HourEntry));
  
  const beginTime = new Date(begin).getTime();
  const eindeTime = new Date(einde).getTime();
  
  return entries.some(entry => {
    if (excludeId && entry.id === excludeId) return false;
    const entryBegin = new Date(entry.begin).getTime();
    const entryEinde = new Date(entry.einde).getTime();
    
    return (beginTime < entryEinde && eindeTime > entryBegin);
  });
};

export const hoursService = {
  subscribeToHours: (callback: (entries: HourEntry[]) => void) => {
    const q = query(tenantCol(COLLECTION_NAME), orderBy('begin', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HourEntry[];
      callback(entries);
    });
  },

  addEntry: async (entry: Omit<HourEntry, 'id' | 'createdAt'>) => {
    if (new Date(entry.begin) >= new Date(entry.einde)) {
      throw new Error('Eindtijd moet na de begintijd liggen.');
    }
    
    const hasOverlap = await checkOverlap(entry.userId, entry.begin, entry.einde);
    if (hasOverlap) {
      throw new Error('Tijden overlappen met een bestaande invoer.');
    }

    try {
      await addDoc(tenantCol(COLLECTION_NAME), {
        ...entry,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding entry: ", error);
      throw error;
    }
  },

  updateEntry: async (id: string, updates: Partial<HourEntry>) => {
    // If updating times, check validation
    if (updates.begin && updates.einde) {
      if (new Date(updates.begin) >= new Date(updates.einde)) {
        throw new Error('Eindtijd moet na de begintijd liggen.');
      }
      if (updates.userId) {
        const hasOverlap = await checkOverlap(updates.userId, updates.begin, updates.einde, id);
        if (hasOverlap) {
          throw new Error('Tijden overlappen met een bestaande invoer.');
        }
      }
    }

    try {
      await updateDoc(tenantDoc(COLLECTION_NAME, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating entry: ", error);
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting entry: ", error);
      throw error;
    }
  }
};
