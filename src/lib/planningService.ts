import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

export interface PlanningEntry {
  id?: string;
  projectId: string;
  projectName: string;
  accountManager?: string;
  client: string;
  contactMobile?: string;
  createdBy?: string;
  technician: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'Ingepland' | 'Onderweg' | 'Bezig' | 'Afgerond';
  type: 'Service' | 'Installatie' | 'Onderhoud';
  createdAt?: Timestamp;
}

const PLANNING_COLLECTION = 'planning';

export const planningService = {
  // Subscribe to all planning entries for a specific date range or all
  subscribeToPlanning: (callback: (entries: PlanningEntry[]) => void) => {
    const q = query(collection(db, PLANNING_COLLECTION), orderBy('date', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlanningEntry[];
      callback(entries);
    });
  },

  addPlanningEntry: async (entry: Omit<PlanningEntry, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, PLANNING_COLLECTION), {
        ...entry,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding planning entry: ", error);
    }
  },

  updatePlanningEntry: async (id: string, updates: Partial<PlanningEntry>) => {
    try {
      await updateDoc(doc(db, PLANNING_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating planning: ", error);
    }
  },

  deletePlanningEntry: async (id: string) => {
    try {
      await deleteDoc(doc(db, PLANNING_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting planning: ", error);
    }
  }
};
