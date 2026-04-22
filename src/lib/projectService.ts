import { addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface Project {
  id?: string;
  name: string;
  client: string;
  customerType?: 'Commercieel' | 'Residentieel';
  reference?: string;
  source?: string;
  projectNumber?: string;
  status: 'In Planning' | 'Lopend' | 'Afgerond' | 'Wachtend';
  progress: number;
  dueDate: string;
  team: string[];
  priority: 'Low' | 'Medium' | 'High';
  createdAt?: Timestamp;
}

export const projectService = {
  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const q = query(tenantCol('projects'), orderBy('createdAt', 'desc'));
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
      await addDoc(tenantCol('projects'), {
        ...project,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      await updateDoc(tenantDoc('projects', id), updates);
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  },

  deleteProject: async (id: string) => {
    try {
      await deleteDoc(tenantDoc('projects', id));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  }
};
