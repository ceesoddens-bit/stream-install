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

export interface Supplier {
  id?: string;
  name: string;
  currency?: string | null;
  address?: string | null;
  kvk?: string | null;
  createdAt?: string | Timestamp;
  createdByName?: string;
  createdByInitials?: string;
}

export interface Warehouse {
  id?: string;
  shortCode: string;
  name: string;
  subCount: number;
  createdAt?: string | Timestamp;
  createdByName?: string;
}

export interface BOMItem {
  id?: string;
  projectName: string;
  projectStatus: string;
  planningStatus: string;
  plannedDate: string;
  articleName: string;
  sku: string | null;
  requiredQuantity: number;
  createdAt?: Timestamp;
}

export interface StockOverviewRow {
  id?: string;
  artikel: string;
  magazijn: string;
  locatie: string;
  statusLocatie: string;
  status: string;
  hoeveelheid: number;
  prijsPerStuk: number;
  wisselkoers: number;
  totaal: number;
}

const INVENTORY_COLLECTION = 'inventory';
const SUPPLIERS_COLLECTION = 'suppliers';
const WAREHOUSES_COLLECTION = 'warehouses';
const BOM_COLLECTION = 'bom_items';
const STOCK_OVERVIEW_COLLECTION = 'stock_overview';

export const inventoryService = {
  // --- Inventory Items ---
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
  },

  // --- Suppliers ---
  subscribeToSuppliers: (callback: (suppliers: Supplier[]) => void) => {
    const q = query(collection(db, SUPPLIERS_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const suppliers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Supplier[];
      callback(suppliers);
    });
  },

  // --- Warehouses ---
  subscribeToWarehouses: (callback: (warehouses: Warehouse[]) => void) => {
    const q = query(collection(db, WAREHOUSES_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const warehouses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Warehouse[];
      callback(warehouses);
    });
  },

  // --- BOM Items ---
  subscribeToBOMItems: (callback: (items: BOMItem[]) => void) => {
    const q = query(collection(db, BOM_COLLECTION), orderBy('projectName', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BOMItem[];
      callback(items);
    });
  },

  // --- Stock Overview ---
  subscribeToStockOverview: (callback: (rows: StockOverviewRow[]) => void) => {
    const q = query(collection(db, STOCK_OVERVIEW_COLLECTION), orderBy('artikel', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StockOverviewRow[];
      callback(rows);
    });
  }
};
