import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface Ticket {
  id?: string;
  title: string;
  date: string;
  type: string;
  status: string;
  userId: string;
  userImage?: string;
  createdAt?: Timestamp;
}

const TICKETS_COLLECTION = 'tickets';

export const ticketService = {
  subscribeToTickets: (callback: (tickets: Ticket[]) => void, max: number = 10) => {
    const q = query(collection(db, TICKETS_COLLECTION), orderBy('createdAt', 'desc'), limit(max));
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      callback(tickets);
    });
  },

  addTicket: async (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, TICKETS_COLLECTION), {
        ...ticket,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding ticket: ", error);
    }
  }
};
