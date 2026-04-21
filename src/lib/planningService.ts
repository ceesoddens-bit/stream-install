import { onSnapshot, query, orderBy, Timestamp, deleteDoc, addDoc, updateDoc, where } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';
import { PlanningStatus, ProjectType, ClientType, ProductTag } from '../types';

export interface PlanningEntry {
  id?: string;
  projectId: string;
  projectName: string;
  accountManager?: string;
  client: string;
  contactMobile?: string;
  createdBy?: string;
  technician: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  date: string;      // YYYY-MM-DD
  status: 'Ingepland' | 'Onderweg' | 'Bezig' | 'Afgerond';
  type: 'Service' | 'Installatie' | 'Onderhoud';
  createdAt?: any;
  updatedAt?: any;
}

export interface PlanningCard {
  id?: string;
  projectRef: string;
  clientName: string;
  address: string;
  amount: number;
  status: PlanningStatus;
  projectType: ProjectType;
  clientType: ClientType;
  accountManager: string;
  installGroup: string;
  productTags: ProductTag[];
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const PLANNING_COLLECTION = 'planning';
const PLANNING_CARDS_COLLECTION = 'planning_cards';

export const planningService = {
  // --- Planning Entries (for calendar/list) ---
  subscribeToPlanning: (callback: (entries: PlanningEntry[]) => void, filters?: { date?: string, technician?: string }) => {
    let q = query(tenantCol(PLANNING_COLLECTION), orderBy('date', 'asc'));
    
    // Note: Firestore doesn't support multiple equality filters with orderBy on a different field easily without indexes
    // For simplicity, we filter in memory if needed, or we could add more query logic here if indexes exist.
    
    return onSnapshot(q, (snapshot) => {
      let entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlanningEntry[];
      
      if (filters?.date) {
        entries = entries.filter(e => e.date === filters.date);
      }
      if (filters?.technician) {
        entries = entries.filter(e => e.technician === filters.technician);
      }
      
      callback(entries);
    });
  },

  addPlanningEntry: async (entry: Omit<PlanningEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Check for overlap
      const overlap = await planningService.findOverlap(entry.technician, entry.date, entry.startTime, entry.endTime);
      if (overlap) {
        throw new Error(`Overlap gedetecteerd met afspraak: ${overlap.projectName}`);
      }

      await addDoc(tenantCol(PLANNING_COLLECTION), {
        ...entry,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding planning entry: ", error);
      throw error;
    }
  },

  updatePlanningEntry: async (id: string, updates: Partial<PlanningEntry>) => {
    try {
      await updateDoc(tenantDoc(PLANNING_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating planning: ", error);
      throw error;
    }
  },

  deletePlanningEntry: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(PLANNING_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting planning: ", error);
      throw error;
    }
  },

  findOverlap: async (technician: string, date: string, start: string, end: string, excludeId?: string) => {
    // This would ideally be a Firestore query, but for small datasets memory filtering is fine
    // and more flexible for time range overlaps.
    return new Promise<PlanningEntry | null>((resolve) => {
      const unsubscribe = planningService.subscribeToPlanning((entries) => {
        unsubscribe();
        const overlap = entries.find(e => {
          if (e.id === excludeId) return false;
          if (e.technician !== technician || e.date !== date) return false;
          
          // Simple time overlap logic: (StartA < EndB) and (EndA > StartB)
          return (start < e.endTime) && (end > e.startTime);
        });
        resolve(overlap || null);
      }, { date, technician });
    });
  },

  // --- Planning Cards (for Kanban) ---
  subscribeToPlanningCards: (callback: (cards: PlanningCard[]) => void) => {
    const q = query(tenantCol(PLANNING_CARDS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlanningCard[];
      callback(cards);
    });
  },

  addPlanningCard: async (card: Omit<PlanningCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(PLANNING_CARDS_COLLECTION), {
        ...card,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding planning card: ", error);
      throw error;
    }
  },

  updatePlanningCard: async (id: string, updates: Partial<PlanningCard>) => {
    try {
      await updateDoc(tenantDoc(PLANNING_CARDS_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating planning card: ", error);
      throw error;
    }
  },

  deletePlanningCard: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(PLANNING_CARDS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting planning card: ", error);
      throw error;
    }
  }
};
