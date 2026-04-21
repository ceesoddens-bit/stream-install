import { addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface TaskItem {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Done';
  assigneeId?: string;
  assigneeName?: string;
  projectId?: string;
  ticketId?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'tasks';

export const tasksService = {
  subscribeToTasks: (callback: (tasks: TaskItem[]) => void, filters?: { assigneeId?: string }) => {
    let q = query(tenantCol(COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    if (filters?.assigneeId) {
      q = query(tenantCol(COLLECTION_NAME), where('assigneeId', '==', filters.assigneeId), orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TaskItem[];
      callback(tasks);
    });
  },

  addTask: async (task: Omit<TaskItem, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(tenantCol(COLLECTION_NAME), {
        ...task,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef;
    } catch (error) {
      console.error("Error adding task: ", error);
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<TaskItem>) => {
    try {
      await updateDoc(tenantDoc(COLLECTION_NAME, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating task: ", error);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting task: ", error);
      throw error;
    }
  }
};
