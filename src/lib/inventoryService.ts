import { addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, updateDoc, where, getDocs, runTransaction } from 'firebase/firestore';
import { tenantCol, tenantDoc, db } from './firebase';

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
  updatedAt?: string | Timestamp;
  updatedByName?: string;
  updatedByInitials?: string;
}

export interface Warehouse {
  id?: string;
  shortCode: string;
  name: string;
  subCount: number;
  createdAt?: string | Timestamp;
  createdByName?: string;
  createdByInitials?: string;
  updatedAt?: string | Timestamp;
  updatedByName?: string;
  updatedByInitials?: string;
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
export interface PurchaseOrder {
  id?: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'Concept' | 'Verzonden' | 'Ontvangen' | 'Geannuleerd';
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate?: string;
  createdAt?: Timestamp;
}

export interface StockMutation {
  id?: string;
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  type: 'In' | 'Uit' | 'Correctie';
  quantity: number;
  date: string;
  reference?: string;
  note?: string;
  createdAt?: Timestamp;
}

const PURCHASE_ORDERS_COLLECTION = 'purchase_orders';
const MUTATIONS_COLLECTION = 'stock_mutations';

export const inventoryService = {
  // --- Inventory Items ---
  subscribeToInventory: (callback: (items: InventoryItem[]) => void) => {
    const q = query(tenantCol(INVENTORY_COLLECTION), orderBy('name', 'asc'));
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
      await addDoc(tenantCol(INVENTORY_COLLECTION), {
        ...item,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding inventory item: ", error);
    }
  },

  updateItem: async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await updateDoc(tenantDoc(INVENTORY_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating inventory: ", error);
    }
  },

  deleteItem: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(INVENTORY_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting inventory item: ", error);
    }
  },

  // --- Suppliers ---
  subscribeToSuppliers: (callback: (suppliers: Supplier[]) => void) => {
    const q = query(tenantCol(SUPPLIERS_COLLECTION), orderBy('name', 'asc'));
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
    const q = query(tenantCol(WAREHOUSES_COLLECTION), orderBy('name', 'asc'));
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
    const q = query(tenantCol(BOM_COLLECTION), orderBy('projectName', 'asc'));
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
    // Replaced real-time sub to STOCK_OVERVIEW_COLLECTION with an aggregation of items
    const q = query(tenantCol(INVENTORY_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((doc) => {
        const item = doc.data() as InventoryItem;
        return {
          id: doc.id,
          artikel: item.name,
          magazijn: item.location || 'Standaard',
          locatie: 'A1', // Mock
          statusLocatie: 'Vrij', // Mock
          status: item.status,
          hoeveelheid: item.stock,
          prijsPerStuk: item.price,
          wisselkoers: 1,
          totaal: item.stock * item.price,
        } as StockOverviewRow;
      });
      callback(rows);
    });
  },

  // --- Purchase Orders ---
  subscribeToPurchaseOrders: (callback: (orders: PurchaseOrder[]) => void) => {
    const q = query(tenantCol(PURCHASE_ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PurchaseOrder[];
      callback(orders);
    });
  },

  // --- Mutations ---
  subscribeToMutations: (callback: (mutations: StockMutation[]) => void) => {
    const q = query(tenantCol(MUTATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const mutations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StockMutation[];
      callback(mutations);
    });
  },

  addMutation: async (mutation: Omit<StockMutation, 'id' | 'createdAt'>) => {
    try {
      await runTransaction(db, async (transaction) => {
        const itemRef = tenantDoc(INVENTORY_COLLECTION, mutation.itemId);
        const itemDoc = await transaction.get(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error("Item does not exist!");
        }
        
        const currentStock = itemDoc.data().stock || 0;
        let newStock = currentStock;
        
        if (mutation.type === 'In') {
          newStock += mutation.quantity;
        } else if (mutation.type === 'Uit') {
          newStock -= mutation.quantity;
        } else if (mutation.type === 'Correctie') {
          newStock = mutation.quantity; // If correctie sets absolute
        }
        
        // Status updates based on stock
        const minStock = itemDoc.data().minStock || 0;
        let newStatus = 'Op voorraad';
        if (newStock <= 0) {
          newStatus = 'Niet op voorraad';
        } else if (newStock <= minStock) {
          newStatus = 'Bijna op';
        }
        
        transaction.update(itemRef, { 
          stock: newStock,
          status: newStatus
        });
        
        const mutationRef = tenantDoc(MUTATIONS_COLLECTION, crypto.randomUUID());
        transaction.set(mutationRef, {
          ...mutation,
          createdAt: Timestamp.now(),
        });
      });
    } catch (error) {
      console.error("Error adding mutation: ", error);
      throw error;
    }
  }
};
