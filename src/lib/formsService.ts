import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

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

const FORM_TEMPLATES_COLLECTION = 'form_templates';
const FORM_ITEMS_COLLECTION = 'form_items';

export const formsService = {
  // --- Form Templates ---
  subscribeToFormTemplates: (callback: (templates: FormTemplate[]) => void) => {
    const q = query(collection(db, FORM_TEMPLATES_COLLECTION), orderBy('name', 'asc'));
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
      await addDoc(collection(db, FORM_TEMPLATES_COLLECTION), {
        ...template,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding form template: ", error);
    }
  },

  // --- Form Items ---
  subscribeToFormItems: (callback: (items: FormItem[]) => void) => {
    const q = query(collection(db, FORM_ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
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
      await addDoc(collection(db, FORM_ITEMS_COLLECTION), {
        ...item,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding form item: ", error);
    }
  }
};
