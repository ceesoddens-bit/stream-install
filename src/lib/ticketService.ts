import { collection, doc, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, updateDoc, limit, getDocs, startAfter, where, DocumentData, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, tenantCol, tenantDoc, getCurrentTenantId } from './firebase';

export interface TicketAttachment {
  name: string;
  url: string;
  type: string;
}

export interface TicketComment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userImage?: string;
  createdAt: Timestamp;
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
  assigneeId?: string; // Added assignee picker support
  slaDate?: string;    // Added SLA support
  attachments?: TicketAttachment[];
  comments?: TicketComment[]; // Embedded or subcollection? For simplicity let's use embedded first, or separate. The plan says "comments subcollectie". I will add functions for that.
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const TICKETS_COLLECTION = 'tickets';

export const ticketService = {
  subscribeToTickets: (callback: (tickets: Ticket[]) => void, max: number = 50, contactId?: string) => {
    let q;
    if (contactId) {
      q = query(tenantCol(TICKETS_COLLECTION), where('contactId', '==', contactId), orderBy('createdAt', 'desc'), limit(max));
    } else {
      q = query(tenantCol(TICKETS_COLLECTION), orderBy('createdAt', 'desc'), limit(max));
    }
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      callback(tickets);
    });
  },

  // Added pagination and filter support
  getTickets: async (filters?: { status?: string, type?: string, limit?: number, lastDoc?: DocumentSnapshot }): Promise<{ tickets: Ticket[], lastDoc: DocumentSnapshot | null }> => {
    let q = query(tenantCol(TICKETS_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (filters?.status) q = query(q, where('status', '==', filters.status));
    if (filters?.type) q = query(q, where('type', '==', filters.type));
    if (filters?.lastDoc) q = query(q, startAfter(filters.lastDoc));
    
    q = query(q, limit(filters?.limit || 50));
    
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ticket[];
    
    return {
      tickets,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  },

  uploadFiles: async (ticketId: string, files: File[]): Promise<TicketAttachment[]> => {
    const attachments: TicketAttachment[] = [];
    const tenantId = getCurrentTenantId();
    
    for (const file of files) {
      const storageRef = ref(storage, `tenants/${tenantId}/tickets/${ticketId}/${file.name}`);
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
      const docRef = await addDoc(tenantCol(TICKETS_COLLECTION), {
        ...ticket,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef;
    } catch (error) {
      console.error("Error adding ticket: ", error);
      throw error;
    }
  },

  updateTicket: async (id: string, updates: Partial<Ticket>) => {
    try {
      await updateDoc(tenantDoc(TICKETS_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating ticket: ", error);
    }
  },

  deleteTicket: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(TICKETS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting ticket: ", error);
    }
  },
  
  // Comments Subcollection
  subscribeToComments: (ticketId: string, callback: (comments: TicketComment[]) => void) => {
    const q = query(collection(tenantDoc(TICKETS_COLLECTION, ticketId), 'comments'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TicketComment[];
      callback(comments);
    });
  },

  addComment: async (ticketId: string, comment: Omit<TicketComment, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(tenantDoc(TICKETS_COLLECTION, ticketId), 'comments'), {
        ...comment,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  },
  
  deleteComment: async (ticketId: string, commentId: string) => {
    try {
      await deleteDoc(doc(tenantDoc(TICKETS_COLLECTION, ticketId), 'comments', commentId));
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  }
};
