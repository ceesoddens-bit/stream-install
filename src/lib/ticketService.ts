import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface TicketAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Ticket {
  id?: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  status: 'Nieuw' | 'Bezig' | 'Wachten' | 'Afgerond';
  priority: 'Low' | 'Medium' | 'High';
  userId: string;
  userImage?: string;
  attachments?: TicketAttachment[];
  createdAt?: Timestamp;
}

const TICKETS_COLLECTION = 'tickets';

export const ticketService = {
  subscribeToTickets: (callback: (tickets: Ticket[]) => void, max: number = 50) => {
    const q = query(collection(db, TICKETS_COLLECTION), orderBy('createdAt', 'desc'), limit(max));
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      callback(tickets);
    });
  },

  uploadFiles: async (ticketId: string, files: File[]): Promise<TicketAttachment[]> => {
    const attachments: TicketAttachment[] = [];
    
    for (const file of files) {
      const storageRef = ref(storage, `tickets/${ticketId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      attachments.push({
        name: file.name,
        url,
        type: file.type
      });
    }
    
    return attachments;
  },

  addTicket: async (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
        ...ticket,
        createdAt: Timestamp.now(),
      });
      return docRef;
    } catch (error) {
      console.error("Error adding ticket: ", error);
      throw error;
    }
  },

  updateTicket: async (id: string, updates: Partial<Ticket>) => {
    try {
      await updateDoc(doc(db, TICKETS_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating ticket: ", error);
    }
  },

  deleteTicket: async (id: string) => {
    try {
      await deleteDoc(doc(db, TICKETS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting ticket: ", error);
    }
  }
};
