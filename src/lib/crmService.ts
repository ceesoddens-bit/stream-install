import { onSnapshot, query, orderBy, Timestamp, deleteDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { tenantCol, tenantDoc } from './firebase';

export interface Company {
  id?: string;
  name: string;
  contactPerson?: string;
  type?: 'Residential' | 'Commercial' | 'Installateur' | 'Aannemer' | 'Leverancier';
  referenceNumber?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  kvkNumber?: string;
  vatNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  tags?: string[];
  status?: 'Actief' | 'Inactief' | 'Prospect';
  priority?: number;
  website?: string;
  projectsCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Contact {
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string; // Algemeen
  mobile?: string;
  telephone?: string; // Vast
  address?: string;
  companyId?: string;
  companyName?: string;
  role?: string;
  status?: 'Actief' | 'Inactief';
  priority?: number;
  tags?: string[];
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

const COMPANIES_COLLECTION = 'companies';
const CONTACTS_COLLECTION = 'contacts';

export const crmService = {
  // --- Companies ---
  subscribeToCompanies: (callback: (companies: Company[]) => void) => {
    const q = query(tenantCol(COMPANIES_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const companies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Company[];
      callback(companies);
    });
  },

  addCompany: async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(COMPANIES_COLLECTION), {
        ...company,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding company: ", error);
      throw error;
    }
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    try {
      await updateDoc(tenantDoc(COMPANIES_COLLECTION, id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating company: ", error);
      throw error;
    }
  },

  deleteCompany: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(COMPANIES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting company: ", error);
      throw error;
    }
  },

  // --- Contacts ---
  subscribeToContacts: (callback: (contacts: Contact[]) => void) => {
    const q = query(tenantCol(CONTACTS_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      callback(contacts);
    });
  },

  addContact: async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(tenantCol(CONTACTS_COLLECTION), {
        ...contact,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
      throw error;
    }
  },

  updateContact: async (id: string, data: Partial<Contact>) => {
    try {
      await updateDoc(tenantDoc(CONTACTS_COLLECTION, id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating contact: ", error);
      throw error;
    }
  },

  deleteContact: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(CONTACTS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting contact: ", error);
      throw error;
    }
  },

  exportToCSV: (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
