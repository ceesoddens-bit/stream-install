import { onSnapshot, query, orderBy, addDoc, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface ProjectGroup {
  id?: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'In uitvoering' | 'Concept' | 'Afgerond';
  progress: number;
  members: number;
  budget: number;
  spent: number;
  createdAt: Timestamp;
}

export const projectGroupService = {
  subscribeToProjectGroups: (callback: (groups: ProjectGroup[]) => void) => {
    const q = query(tenantCol('project_groups'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProjectGroup[];
      callback(groups);
    });
  },

  addProjectGroup: async (group: Omit<ProjectGroup, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol('project_groups'), {
        ...group,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding project group: ", error);
      throw error;
    }
  },

  updateProjectGroup: async (id: string, data: Partial<ProjectGroup>) => {
    try {
      await updateDoc(tenantDoc('project_groups', id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating project group: ", error);
      throw error;
    }
  },

  deleteProjectGroup: async (id: string) => {
    try {
      await deleteDoc(tenantDoc('project_groups', id));
    } catch (error) {
      console.error("Error deleting project group: ", error);
      throw error;
    }
  },
};
