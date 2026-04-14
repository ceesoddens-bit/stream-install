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

export interface PlanningCard {
  id?: string;
  projectRef: string;
  clientName: string;
  address: string;
  amount: number;
  status: string;
  projectType: 'Installatie' | 'Service';
  clientType: 'Residentieel' | 'Commercieel';
  accountManager: string;
  installGroup: string;
  productTags: string[];
  imageUrl?: string;
  createdAt?: Timestamp;
}

const PLANNING_COLLECTION = 'planning';
const PLANNING_CARDS_COLLECTION = 'planning_cards';

export const planningService = {
  // --- Planning Entries (for calendar/list) ---
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
  },

  // --- Planning Cards (for Kanban) ---
  subscribeToPlanningCards: (callback: (cards: PlanningCard[]) => void) => {
    const q = query(collection(db, PLANNING_CARDS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlanningCard[];
      callback(cards);
    });
  },

  addPlanningCard: async (card: Omit<PlanningCard, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, PLANNING_CARDS_COLLECTION), {
        ...card,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding planning card: ", error);
    }
  },

  updatePlanningCard: async (id: string, updates: Partial<PlanningCard>) => {
    try {
      await updateDoc(doc(db, PLANNING_CARDS_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating planning card: ", error);
    }
  },

  deletePlanningCard: async (id: string) => {
    try {
      await deleteDoc(doc(db, PLANNING_CARDS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting planning card: ", error);
    }
  }
};
