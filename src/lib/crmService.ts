import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Company {
  id?: string;
  name: string;
  referenceNumber?: string;
  tags?: string[];
  projectsCount?: number;
  phone?: string;
  kvkNumber?: string;
  primaryContactPerson?: string;
  parentCompany?: string;
  address?: string;
  city?: string;
  vatNumber?: string;

  email?: string;
  status?: string;
  type?: string;
  createdAt?: Timestamp;
}

export interface Contact {
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  priority?: number;
  address?: string;
  mobile?: string;
  telephone?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  status?: string;
  createdByName?: string;
  updatedByName?: string;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

const COMPANIES_COLLECTION = 'companies';
const CONTACTS_COLLECTION = 'contacts';

export const crmService = {
  // --- Companies ---
  subscribeToCompanies: (callback: (companies: Company[]) => void) => {
    const q = query(collection(db, COMPANIES_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const companies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Company[];
      callback(companies);
    });
  },

  addCompany: async (company: Omit<Company, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, COMPANIES_COLLECTION), {
        ...company,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding company: ", error);
    }
  },

  deleteCompany: async (id: string) => {
    try {
      await deleteDoc(doc(db, COMPANIES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting company: ", error);
    }
  },

  // --- Contacts ---
  subscribeToContacts: (callback: (contacts: Contact[]) => void) => {
    const q = query(collection(db, CONTACTS_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      callback(contacts);
    });
  },

  addContact: async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, CONTACTS_COLLECTION), {
        ...contact,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  },

  deleteContact: async (id: string) => {
    try {
      await deleteDoc(doc(db, CONTACTS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  }
};
