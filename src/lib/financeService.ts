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

const FINANCE_COLLECTION = 'quotes';

export const financeService = {
  subscribeToQuotes: (callback: (quotes: Quote[]) => void) => {
    const q = query(collection(db, FINANCE_COLLECTION), orderBy('createdAt', 'desc'));
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
      await addDoc(collection(db, FINANCE_COLLECTION), {
        ...quote,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding quote: ", error);
    }
  },

  deleteQuote: async (id: string) => {
    try {
      await deleteDoc(doc(db, FINANCE_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting quote: ", error);
    }
  }
};
