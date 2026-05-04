import { addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { tenantCol } from './firebase';

export interface FormTemplate {
  id?: string;
  name: string;
  appliesToInstall: boolean;
  appliesToService: boolean;
  planningType: string;
  createdAt?: Timestamp;
}

export interface FormItem {
  id?: string;
  name: string;
  status: 'PUBLISHED' | 'DRAFT';
  project: string;
  planningsregel: string;
  createdAt?: string | Timestamp;
  createdBy: string;
  updatedAt?: string | Timestamp;
  updatedBy: string;
}

export const formsService = {
  // --- Form Templates ---
  subscribeToFormTemplates: (callback: (templates: FormTemplate[]) => void) => {
    const q = query(tenantCol('form_templates'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const templates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FormTemplate[];
      callback(templates);
    });
  },

  addFormTemplate: async (template: Omit<FormTemplate, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol('form_templates'), {
        ...template,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding form template: ", error);
    }
  },

  // --- Form Items ---
  subscribeToFormItems: (callback: (items: FormItem[]) => void) => {
    const q = query(tenantCol('form_items'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FormItem[];
      callback(items);
    });
  },

  addFormItem: async (item: Omit<FormItem, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol('form_items'), {
        ...item,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding form item: ", error);
    }
  }
};
