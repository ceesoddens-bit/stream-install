import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { MODULES, type ModuleKey } from '../lib/modules';

// --- env loading ---
function loadDotEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  const raw = readFileSync(path, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (process.env[key]) continue;
    process.env[key] = rawVal.replace(/^['"]|['"]$/g, '');
  }
}
loadDotEnv();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("❌ VITE_FIREBASE_PROJECT_ID niet gevonden in .env");
  process.exit(1);
}

// --- firebase admin bootstrap ---
if (getApps().length === 0) {
  initializeApp({
    projectId: projectId,
  });
}

const db = getFirestore();
const auth = getAuth();

// --- QA constants ---
const QA_TENANT_ID = 'qa-tenant';
const QA_EMAIL = 'qa@streaminstall.test';
const QA_PASSWORD = 'QaTest2026!';

const ALL_PAID_MODULES: ModuleKey[] = MODULES.filter(m => !m.inbegrepen).map(m => m.key);

// --- helpers ---
function tenantCol(name: string) {
  return db.collection('tenants').doc(QA_TENANT_ID).collection(name);
}

async function resetQATenant() {
  const subCollections = [
    'companies', 'contacts', 'projects', 'quotes', 'invoices',
    'tickets', 'hours', 'tasks', 'planning', 'inventory', 'stock_mutations', 'form_templates', 'form_items'
  ];
  for (const name of subCollections) {
    const col = tenantCol(name);
    const snap = await col.get();
    if (!snap.empty) {
      const batch = db.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  }
}

async function main() {
  console.log(`\n🌱 Seeding QA-tenant '${QA_TENANT_ID}' via Admin SDK\n`);

  // 1. Create/Get User
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(QA_EMAIL);
    console.log(`✅ User found: ${userRecord.uid}`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      userRecord = await auth.createUser({
        email: QA_EMAIL,
        password: QA_PASSWORD,
        displayName: 'QA Tester',
      });
      console.log(`✅ User created: ${userRecord.uid}`);
    } else {
      throw err;
    }
  }

  const uid = userRecord.uid;

  // 2. Set Custom Claims (Crucial for rules during audit)
  await auth.setCustomUserClaims(uid, {
    tenantId: QA_TENANT_ID,
    role: 'owner'
  });
  console.log('🔑 Custom claims set (tenantId=qa-tenant, role=owner).');

  // 3. Reset data
  await resetQATenant();
  console.log('🧹 Existing data cleared.');

  // 4. User Doc
  await db.collection('users').doc(uid).set({
    uid,
    tenantId: QA_TENANT_ID,
    role: 'owner',
    email: QA_EMAIL,
    displayName: 'QA Tester',
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  // 5. Tenant Doc
  await db.collection('tenants').doc(QA_TENANT_ID).set({
    id: QA_TENANT_ID,
    bedrijfsnaam: 'QA Testbedrijf BV',
    naam: 'QA Testbedrijf BV',
    plan: 'volledig',
    actiefModules: ALL_PAID_MODULES,
    aantalGebruikers: 1,
    abonnementStatus: 'trialing',
    ownerId: uid,
    ownerUid: uid, // added because rules check for ownerUid
    createdAt: FieldValue.serverTimestamp(),
  });

  // 6. Test Data
  console.log('📦 Seeding test data...');

  // 2 companies
  const compRefs = [tenantCol('companies').doc(), tenantCol('companies').doc()];
  await compRefs[0].set({ name: 'QA Company 1', city: 'Test City', status: 'Actief', createdAt: FieldValue.serverTimestamp() });
  await compRefs[1].set({ name: 'QA Company 2', city: 'Test City', status: 'Actief', createdAt: FieldValue.serverTimestamp() });

  // 3 contacts
  const contactRefs = [tenantCol('contacts').doc(), tenantCol('contacts').doc(), tenantCol('contacts').doc()];
  await contactRefs[0].set({ name: 'Contact 1', email: 'c1@test.com', companyId: compRefs[0].id, role: 'owner', status: 'Actief', createdAt: FieldValue.serverTimestamp() });
  await contactRefs[1].set({ name: 'Contact 2', email: 'c2@test.com', companyId: compRefs[1].id, role: 'admin', status: 'Actief', createdAt: FieldValue.serverTimestamp() });
  await contactRefs[2].set({ name: 'Portal Customer', email: 'customer@test.com', role: 'customer', status: 'Actief', createdAt: FieldValue.serverTimestamp() });

  // 2 projects
  const projRefs = [tenantCol('projects').doc(), tenantCol('projects').doc()];
  await projRefs[0].set({ name: 'Project 1', client: 'QA Company 1', status: 'Lopend', progress: 50, dueDate: '2026-12-31', priority: 'High', createdAt: FieldValue.serverTimestamp() });
  await projRefs[1].set({ name: 'Project 2', client: 'QA Company 2', status: 'In Planning', progress: 10, dueDate: '2026-12-31', priority: 'Medium', createdAt: FieldValue.serverTimestamp() });

  // 1 quote (Concept)
  await tenantCol('quotes').doc().set({
    title: 'QA Quote',
    status: 'Concept',
    amount: 1000,
    projectId: projRefs[0].id,
    contactId: contactRefs[0].id,
    date: '2026-05-07',
    lineItems: [{ description: 'Test Item', quantity: 1, price: 1000, vatRate: 21 }],
    createdAt: FieldValue.serverTimestamp()
  });

  // 1 invoice (Concept)
  await tenantCol('invoices').doc().set({
    invoiceNumber: 'F-QA-001',
    status: 'Concept',
    amount: 1000,
    projectId: projRefs[0].id,
    contactId: contactRefs[0].id,
    date: '2026-05-07',
    lineItems: [{ description: 'Test Item', quantity: 1, price: 1000, vatRate: 21 }],
    createdAt: FieldValue.serverTimestamp()
  });

  // 2 tickets
  await tenantCol('tickets').doc().set({ title: 'Ticket 1', status: 'Nieuw', priority: 'High', userId: uid, createdAt: FieldValue.serverTimestamp() });
  await tenantCol('tickets').doc().set({ title: 'Ticket 2', status: 'Bezig', priority: 'Medium', userId: uid, createdAt: FieldValue.serverTimestamp() });

  // 3 planning entries
  await tenantCol('planning').doc().set({
    projectId: projRefs[0].id,
    projectName: 'Project 1',
    client: 'QA Company 1',
    technician: 'QA Tester',
    date: '2026-05-07',
    startTime: '09:00',
    endTime: '11:00',
    status: 'Ingepland',
    type: 'Installatie',
    createdAt: FieldValue.serverTimestamp()
  });
  await tenantCol('planning').doc().set({
    projectId: projRefs[0].id,
    projectName: 'Project 1',
    client: 'QA Company 1',
    technician: 'QA Tester',
    date: '2026-05-08',
    startTime: '09:00',
    endTime: '11:00',
    status: 'Ingepland',
    type: 'Installatie',
    createdAt: FieldValue.serverTimestamp()
  });
  await tenantCol('planning').doc().set({
    projectId: projRefs[1].id,
    projectName: 'Project 2',
    client: 'QA Company 2',
    technician: 'QA Tester',
    date: '2026-05-09',
    startTime: '13:00',
    endTime: '15:00',
    status: 'Ingepland',
    type: 'Service',
    createdAt: FieldValue.serverTimestamp()
  });

  // 5 urenregistraties
  for (let i = 0; i < 5; i++) {
    await tenantCol('hours').doc().set({
      userId: uid,
      userName: 'QA Tester',
      date: `2026-05-0${i + 1}`,
      begin: `2026-05-0${i + 1}T08:00:00Z`,
      einde: `2026-05-0${i + 1}T12:00:00Z`,
      duur: '04:00',
      durationMinutes: 240,
      status: 'Concept',
      createdAt: FieldValue.serverTimestamp()
    });
  }

  // 3 inventory items
  const invRefs = [tenantCol('inventory').doc(), tenantCol('inventory').doc(), tenantCol('inventory').doc()];
  await invRefs[0].set({ sku: 'QA-001', name: 'Item 1', stock: 10, minStock: 5, price: 10, status: 'Op voorraad', createdAt: FieldValue.serverTimestamp() });
  await invRefs[1].set({ sku: 'QA-002', name: 'Item 2', stock: 2, minStock: 5, price: 20, status: 'Bijna op', createdAt: FieldValue.serverTimestamp() });
  await invRefs[2].set({ sku: 'QA-003', name: 'Item 3', stock: 0, minStock: 5, price: 30, status: 'Niet op voorraad', createdAt: FieldValue.serverTimestamp() });

  // 1 form template
  const formTemplateRef = tenantCol('form_templates').doc();
  await formTemplateRef.set({
    name: 'QA Template',
    appliesToInstall: true,
    appliesToService: true,
    planningType: 'Installatie',
    createdAt: FieldValue.serverTimestamp()
  });

  // 1 form item
  await tenantCol('form_items').doc().set({
    name: 'Ingevulde Werkbon',
    status: 'PUBLISHED',
    project: projRefs[0].id,
    planningsregel: 'some-plan-id',
    createdBy: uid,
    updatedBy: uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  console.log('\n✅ QA Seed klaar.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌ QA Seed mislukt:', err);
  process.exit(1);
});
