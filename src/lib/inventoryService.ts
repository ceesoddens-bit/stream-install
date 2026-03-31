import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface InventoryItem {
  id?: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  unit: string;
  location: string;
  status: 'Op voorraad' | 'Bijna op' | 'Niet op voorraad';
  createdAt?: Timestamp;
}

const INVENTORY_COLLECTION = 'inventory';

export const inventoryService = {
  subscribeToInventory: (callback: (items: InventoryItem[]) => void) => {
    const q = query(collection(db, INVENTORY_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      callback(items);
    });
  },

  addItem: async (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, INVENTORY_COLLECTION), {
        ...item,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding inventory item: ", error);
    }
  },

  updateItem: async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, INVENTORY_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating inventory: ", error);
    }
  },

  deleteItem: async (id: string) => {
    try {
      await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting inventory item: ", error);
    }
  }
};
