import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export interface HourEntry {
  id?: string;
  type: string;
  begin: string;
  einde: string;
  pauze: string;
  duur: string;
  project: string;
  date: string;
  createdAt: Timestamp;
}

const COLLECTION_NAME = 'hours';

export const hoursService = {
  // Listen to real-time updates
  subscribeToHours: (callback: (entries: HourEntry[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HourEntry[];
      callback(entries);
    });
  },

  // Log a new session
  addEntry: async (entry: Omit<HourEntry, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...entry,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  },

  // Delete an entry
  deleteEntry: async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  }
};
