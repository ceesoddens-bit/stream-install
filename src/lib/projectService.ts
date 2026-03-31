import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Project {
  id?: string;
  name: string;
  client: string;
  status: 'In Planning' | 'Lopend' | 'Afgerond' | 'Wachtend';
  progress: number;
  dueDate: string;
  team: string[];
  priority: 'Low' | 'Medium' | 'High';
  createdAt?: Timestamp;
}

const PROJECTS_COLLECTION = 'projects';

export const projectService = {
  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      callback(projects);
    });
  },

  addProject: async (project: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, PROJECTS_COLLECTION), {
        ...project,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  },

  deleteProject: async (id: string) => {
    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  }
};
