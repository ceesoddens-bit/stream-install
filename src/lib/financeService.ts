import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Quote {
  id?: string;
  quoteNumber: string;
  client: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  date: string;
  createdAt?: Timestamp;
}

export interface Invoice {
  id?: string;
  invoiceCode: string;
  status: 'Concept' | 'In Afwachting' | 'Goedgekeurd' | 'Afgerond' | 'Geweigerd';
  projectName: string;
  contactName: string;
  totalExcl: number;
  totalIncl: number;
  fullyPaid: boolean;
  createdAt?: Timestamp;
}

const QUOTES_COLLECTION = 'quotes';
const INVOICES_COLLECTION = 'invoices';

export const financeService = {
  // --- Quotes ---
  subscribeToQuotes: (callback: (quotes: Quote[]) => void) => {
    const q = query(collection(db, QUOTES_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const quotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quote[];
      callback(quotes);
    });
  },

  addQuote: async (quote: Omit<Quote, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, QUOTES_COLLECTION), {
        ...quote,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding quote: ", error);
    }
  },

  deleteQuote: async (id: string) => {
    try {
      await deleteDoc(doc(db, QUOTES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting quote: ", error);
    }
  },

  // --- Invoices ---
  subscribeToInvoices: (callback: (invoices: Invoice[]) => void) => {
    const q = query(collection(db, INVOICES_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invoice[];
      callback(invoices);
    });
  },

  addInvoice: async (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, INVOICES_COLLECTION), {
        ...invoice,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding invoice: ", error);
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      await deleteDoc(doc(db, INVOICES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  }
};
