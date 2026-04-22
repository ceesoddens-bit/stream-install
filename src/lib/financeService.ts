import { onSnapshot, query, orderBy, Timestamp, deleteDoc, addDoc, updateDoc, where } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';
import { Quote, Invoice } from '../types';

const QUOTES_COLLECTION = 'quotes';
const INVOICES_COLLECTION = 'invoices';

export const financeService = {
  // --- Quotes ---
  subscribeToQuotes: (callback: (quotes: Quote[]) => void, filters?: { contactId?: string, projectId?: string }) => {
    let q = query(tenantCol(QUOTES_COLLECTION), orderBy('sentDate', 'desc'));
    
    if (filters?.contactId) {
      q = query(tenantCol(QUOTES_COLLECTION), where('contactId', '==', filters.contactId), orderBy('sentDate', 'desc'));
    } else if (filters?.projectId) {
      q = query(tenantCol(QUOTES_COLLECTION), where('projectId', '==', filters.projectId), orderBy('sentDate', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const quotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quote[];
      callback(quotes);
    });
  },

  addQuote: async (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(QUOTES_COLLECTION), {
        ...quote,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding quote: ", error);
      throw error;
    }
  },

  updateQuote: async (id: string, data: Partial<Quote>) => {
    try {
      await updateDoc(tenantDoc(QUOTES_COLLECTION, id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating quote: ", error);
      throw error;
    }
  },

  deleteQuote: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(QUOTES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting quote: ", error);
      throw error;
    }
  },

  // --- Invoices ---
  subscribeToInvoices: (callback: (invoices: Invoice[]) => void, filters?: { contactId?: string, projectId?: string }) => {
    let q = query(tenantCol(INVOICES_COLLECTION), orderBy('id', 'desc'));
    
    if (filters?.contactId) {
      q = query(tenantCol(INVOICES_COLLECTION), where('contactId', '==', filters.contactId), orderBy('id', 'desc'));
    } else if (filters?.projectId) {
      q = query(tenantCol(INVOICES_COLLECTION), where('projectId', '==', filters.projectId), orderBy('id', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invoice[];
      callback(invoices);
    });
  },

  addInvoice: async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(INVOICES_COLLECTION), {
        ...invoice,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding invoice: ", error);
      throw error;
    }
  },

  updateInvoice: async (id: string, data: Partial<Invoice>) => {
    try {
      await updateDoc(tenantDoc(INVOICES_COLLECTION, id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating invoice: ", error);
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(INVOICES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting invoice: ", error);
      throw error;
    }
  }
};
