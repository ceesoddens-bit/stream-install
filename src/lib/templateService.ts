import { onSnapshot, query, orderBy, addDoc, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  type: 'Offerte' | 'Factuur' | 'Ticket' | 'Algemeen';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FormTemplate {
  id?: string;
  name: string;
  type: 'Installatie' | 'Service' | 'Schouw' | 'Algemeen';
  fields: any[]; // JSON schema for form fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PdfTemplate {
  id?: string;
  name: string;
  type: 'Offerte' | 'Factuur' | 'Werkbon' | 'Oplevering';
  content: string; // HTML/Markdown or JSON for the PDF structure
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const templateService = {
  // --- Email Templates ---
  subscribeToEmailTemplates: (callback: (templates: EmailTemplate[]) => void) => {
    const q = query(tenantCol('email_templates'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const templates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmailTemplate[];
      callback(templates);
    });
  },

  addEmailTemplate: async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol('email_templates'), {
        ...template,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding email template: ", error);
      throw error;
    }
  },

  updateEmailTemplate: async (id: string, data: Partial<EmailTemplate>) => {
    try {
      await updateDoc(tenantDoc('email_templates', id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating email template: ", error);
      throw error;
    }
  },

  deleteEmailTemplate: async (id: string) => {
    try {
      await deleteDoc(tenantDoc('email_templates', id));
    } catch (error) {
      console.error("Error deleting email template: ", error);
      throw error;
    }
  },

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

  addFormTemplate: async (template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol('form_templates'), {
        ...template,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding form template: ", error);
      throw error;
    }
  },

  updateFormTemplate: async (id: string, data: Partial<FormTemplate>) => {
    try {
      await updateDoc(tenantDoc('form_templates', id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating form template: ", error);
      throw error;
    }
  },

  deleteFormTemplate: async (id: string) => {
    try {
      await deleteDoc(tenantDoc('form_templates', id));
    } catch (error) {
      console.error("Error deleting form template: ", error);
      throw error;
    }
  },

  // --- PDF Templates ---
  subscribeToPdfTemplates: (callback: (templates: PdfTemplate[]) => void) => {
    const q = query(tenantCol('pdf_templates'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const templates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PdfTemplate[];
      callback(templates);
    });
  },

  addPdfTemplate: async (template: Omit<PdfTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol('pdf_templates'), {
        ...template,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding pdf template: ", error);
      throw error;
    }
  },

  updatePdfTemplate: async (id: string, data: Partial<PdfTemplate>) => {
    try {
      await updateDoc(tenantDoc('pdf_templates', id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating pdf template: ", error);
      throw error;
    }
  },

  deletePdfTemplate: async (id: string) => {
    try {
      await deleteDoc(tenantDoc('pdf_templates', id));
    } catch (error) {
      console.error("Error deleting pdf template: ", error);
      throw error;
    }
  },
};
