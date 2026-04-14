import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import * as mock from '../data/mockData';

export const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  const collections = [
    { name: 'inventory', data: mock.articles },
    { name: 'invoices', data: mock.invoices },
    { name: 'quotes', data: mock.quotes },
    { name: 'companies', data: mock.companies },
    { name: 'contacts', data: mock.contacts },
    { name: 'planning_cards', data: mock.planningCards },
    { name: 'suppliers', data: mock.suppliers },
    { name: 'warehouses', data: mock.warehouses },
    { name: 'bom_items', data: mock.bomItems },
    { name: 'form_templates', data: mock.formTemplates },
    { name: 'form_items', data: mock.formItems },
    { name: 'tickets', data: mock.planningCards.slice(0, 5) }, // Reuse some cards as tickets if needed
  ];

  for (const col of collections) {
    try {
      const snapshot = await getDocs(collection(db, col.name));
      if (snapshot.empty) {
        console.log(`Seeding collection: ${col.name}`);
        const batch = writeBatch(db);
        
        col.data.forEach((item: any) => {
          // Remove ID if present to let Firestore generate one, or keep it if it's alphanumeric
          const { id, ...data } = item;
          const docRef = doc(collection(db, col.name));
          batch.set(docRef, {
            ...data,
            createdAt: Timestamp.now(),
          });
        });
        
        await batch.commit();
        console.log(`Successfully seeded ${col.name}`);
      } else {
        console.log(`Collection ${col.name} already has data, skipping...`);
      }
    } catch (error) {
      console.error(`Error seeding ${col.name}:`, error);
    }
  }
  
  console.log('Seeding complete!');
};
