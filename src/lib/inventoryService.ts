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

  addSupplier: async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol(SUPPLIERS_COLLECTION), {
        ...supplier,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding supplier: ", error);
      throw error;
    }
  },

  updateSupplier: async (id: string, updates: Partial<Supplier>) => {
    try {
      await updateDoc(tenantDoc(SUPPLIERS_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating supplier: ", error);
      throw error;
    }
  },

  deleteSupplier: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(SUPPLIERS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting supplier: ", error);
      throw error;
    }
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

  addWarehouse: async (warehouse: Omit<Warehouse, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol(WAREHOUSES_COLLECTION), {
        ...warehouse,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding warehouse: ", error);
      throw error;
    }
  },

  updateWarehouse: async (id: string, updates: Partial<Warehouse>) => {
    try {
      await updateDoc(tenantDoc(WAREHOUSES_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating warehouse: ", error);
      throw error;
    }
  },

  deleteWarehouse: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(WAREHOUSES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting warehouse: ", error);
      throw error;
    }
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

  addBOMItem: async (item: Omit<BOMItem, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol(BOM_COLLECTION), {
        ...item,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding BOM item: ", error);
      throw error;
    }
  },

  updateBOMItem: async (id: string, updates: Partial<BOMItem>) => {
    try {
      await updateDoc(tenantDoc(BOM_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating BOM item: ", error);
      throw error;
    }
  },

  deleteBOMItem: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(BOM_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting BOM item: ", error);
      throw error;
    }
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

  addPurchaseOrder: async (order: Omit<PurchaseOrder, 'id' | 'createdAt'>) => {
    try {
      await addDoc(tenantCol(PURCHASE_ORDERS_COLLECTION), {
        ...order,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding purchase order: ", error);
      throw error;
    }
  },

  updatePurchaseOrder: async (id: string, updates: Partial<PurchaseOrder>) => {
    try {
      await updateDoc(tenantDoc(PURCHASE_ORDERS_COLLECTION, id), updates);
    } catch (error) {
      console.error("Error updating purchase order: ", error);
      throw error;
    }
  },

  deletePurchaseOrder: async (id: string) => {
    try {
      await deleteDoc(tenantDoc(PURCHASE_ORDERS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting purchase order: ", error);
      throw error;
    }
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
