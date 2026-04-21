/**
 * Demo-tenant seeder.
 *
 * Run: `npm run seed` or `npm run seed -- --reset` to wipe the demo tenant first.
 *
 * Loads env vars from `.env` (Node 20.6+ native), signs in as the owner demo
 * user (creating it if needed), then writes a tenant with representative data
 * across companies, contacts, projects, hours, tickets, quotes, invoices, and
 * user docs for each role.
 *
 * Keep in sync with data shapes in src/lib/*Service.ts and src/lib/tenantTypes.ts.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { INBEGREPEN_MODULES, MODULES, berekenMaandprijs, type ModuleKey } from './modules';
import type { Tenant, UserDoc, Rol } from './tenantTypes';

// --- env loading (no external dep) ---------------------------------------

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

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Ontbrekende env var: ${name}. Controleer .env.`);
  }
  return v;
}

// --- firebase bootstrap --------------------------------------------------

const app = initializeApp({
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

// --- demo constants ------------------------------------------------------

const DEMO_TENANT_ID = 'demo-tenant';
const DEMO_PASSWORD = 'Demo1234!';

interface DemoUser {
  key: string;
  email: string;
  displayName: string;
  role: Rol;
}

const DEMO_USERS: DemoUser[] = [
  { key: 'owner', email: 'owner@demo.streaminstall.app', displayName: 'Olivia Owner', role: 'owner' },
  { key: 'admin', email: 'admin@demo.streaminstall.app', displayName: 'Arend Admin', role: 'admin' },
  { key: 'manager', email: 'manager@demo.streaminstall.app', displayName: 'Marit Manager', role: 'manager' },
  { key: 'sales', email: 'sales@demo.streaminstall.app', displayName: 'Sander Sales', role: 'sales' },
  { key: 'finance', email: 'finance@demo.streaminstall.app', displayName: 'Fenna Finance', role: 'finance' },
  { key: 'technician', email: 'tech@demo.streaminstall.app', displayName: 'Theo Technician', role: 'technician' },
  { key: 'customer', email: 'klant@demo.streaminstall.app', displayName: 'Klaas Klant', role: 'customer' },
];

const ALL_MODULES: ModuleKey[] = MODULES.map(m => m.key);

// --- helpers -------------------------------------------------------------

function tenantCol(name: string) {
  return collection(db, 'tenants', DEMO_TENANT_ID, name);
}

function tenantDocRef(name: string, id: string) {
  return doc(db, 'tenants', DEMO_TENANT_ID, name, id);
}

async function ensureAuthUser(demoUser: DemoUser): Promise<string> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, demoUser.email, DEMO_PASSWORD);
    return cred.user.uid;
  } catch (err: any) {
    if (err?.code !== 'auth/email-already-in-use') throw err;
    const cred = await signInWithEmailAndPassword(auth, demoUser.email, DEMO_PASSWORD);
    return cred.user.uid;
  }
}

async function deleteCollection(col: ReturnType<typeof collection>) {
  const snap = await getDocs(col);
  if (snap.empty) return;
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

async function resetDemoTenant() {
  const subCollections = [
    'companies', 'contacts', 'projects', 'project_groups', 'quotes', 'invoices',
    'tickets', 'hours', 'tasks', 'planning', 'planning_cards', 'teams',
    'inventory', 'suppliers', 'warehouses', 'bom_items', 'purchase_orders',
    'mutations', 'stock_overview', 'form_templates', 'form_items', 'tags',
  ];
  for (const name of subCollections) {
    await deleteCollection(tenantCol(name));
  }
  await setDoc(doc(db, 'tenants', DEMO_TENANT_ID), { deletedAt: Timestamp.now() }, { merge: true });
}

// --- seed data -----------------------------------------------------------

async function seedUsers(): Promise<Record<string, { uid: string; email: string; displayName: string; role: Rol }>> {
  const out: Record<string, { uid: string; email: string; displayName: string; role: Rol }> = {};

  // Sign in as owner first so subsequent writes happen under a known session.
  // Each ensureAuthUser call that creates a user signs that user in; we
  // finalize with the owner session.
  for (const u of DEMO_USERS) {
    const uid = await ensureAuthUser(u);
    out[u.key] = { uid, email: u.email, displayName: u.displayName, role: u.role };
  }
  await signOut(auth);
  await signInWithEmailAndPassword(auth, DEMO_USERS[0].email, DEMO_PASSWORD);

  for (const u of DEMO_USERS) {
    const info = out[u.key];
    const userDoc: UserDoc = {
      uid: info.uid,
      tenantId: DEMO_TENANT_ID,
      role: info.role,
      email: info.email,
      displayName: info.displayName,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, 'users', info.uid), userDoc, { merge: true });
  }
  return out;
}

async function seedTenant(ownerUid: string) {
  const aantalGebruikers = DEMO_USERS.length;
  const tenant: Tenant = {
    id: DEMO_TENANT_ID,
    naam: 'Demo Installatiebedrijf',
    plan: 'volledig',
    aantalGebruikers,
    actiefModules: ALL_MODULES,
    maandprijs: berekenMaandprijs(aantalGebruikers, ALL_MODULES),
    abonnementStatus: 'active',
    abonnementStartDatum: Date.now(),
    branding: {
      bedrijfsnaam: 'Demo Installatiebedrijf',
      kleur: '#2563eb',
    },
    kvk: '12345678',
    btw: 'NL001234567B01',
    adres: { straat: 'Hoofdstraat', nummer: '1', postcode: '1000 AA', plaats: 'Amsterdam', land: 'NL' },
    bank: { iban: 'NL00DEMO0123456789', tenaamstelling: 'Demo Installatiebedrijf' },
    createdAt: Date.now(),
  };
  await setDoc(doc(db, 'tenants', DEMO_TENANT_ID), {
    ...tenant,
    ownerId: ownerUid,
    inbegrepen: INBEGREPEN_MODULES,
  });
}

async function seedCompanies(): Promise<string[]> {
  const companies = [
    {
      name: 'Van Dijk Installaties',
      contactPerson: 'Peter van Dijk',
      type: 'Installateur',
      email: 'info@vandijk-installaties.nl',
      phone: '020-1234567',
      kvkNumber: '87654321',
      city: 'Amsterdam',
      status: 'Actief',
    },
    {
      name: 'De Groot Vastgoed',
      contactPerson: 'Marieke de Groot',
      type: 'Commercial',
      email: 'contact@degroot-vastgoed.nl',
      phone: '030-9876543',
      kvkNumber: '12348765',
      city: 'Utrecht',
      status: 'Actief',
    },
  ];
  const ids: string[] = [];
  for (const c of companies) {
    const ref = doc(tenantCol('companies'));
    await setDoc(ref, { ...c, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    ids.push(ref.id);
  }
  return ids;
}

async function seedContacts(companyIds: string[], customerUid: string): Promise<string[]> {
  const contacts = [
    { firstName: 'Peter', lastName: 'van Dijk', email: 'peter@vandijk-installaties.nl', phone: '06-11111111', companyId: companyIds[0], status: 'Actief' },
    { firstName: 'Marieke', lastName: 'de Groot', email: 'marieke@degroot-vastgoed.nl', phone: '06-22222222', companyId: companyIds[1], status: 'Actief' },
    { firstName: 'Jan', lastName: 'Jansen', email: 'jan@example.com', phone: '06-33333333', status: 'Actief' },
    { firstName: 'Anna', lastName: 'Pietersen', email: 'anna@example.com', phone: '06-44444444', status: 'Actief' },
    { firstName: 'Klaas', lastName: 'Klant', email: 'klant@demo.streaminstall.app', phone: '06-55555555', status: 'Actief', portalUid: customerUid },
  ];
  const ids: string[] = [];
  for (const c of contacts) {
    const ref = doc(tenantCol('contacts'));
    await setDoc(ref, {
      ...c,
      name: `${c.firstName} ${c.lastName}`,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    ids.push(ref.id);
  }
  return ids;
}

async function seedProjects(companyIds: string[]): Promise<string[]> {
  const today = new Date();
  const plus = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const projects = [
    {
      name: 'Zonnepanelen Van Dijk HQ',
      client: 'Van Dijk Installaties',
      companyId: companyIds[0],
      customerType: 'Commercieel',
      projectNumber: 'PRJ-2026-001',
      status: 'Lopend',
      progress: 45,
      dueDate: plus(21),
      team: [],
      priority: 'High',
    },
    {
      name: 'Warmtepomp De Groot Kantoor',
      client: 'De Groot Vastgoed',
      companyId: companyIds[1],
      customerType: 'Commercieel',
      projectNumber: 'PRJ-2026-002',
      status: 'In Planning',
      progress: 10,
      dueDate: plus(45),
      team: [],
      priority: 'Medium',
    },
    {
      name: 'Service Jansen Residentieel',
      client: 'Jan Jansen',
      customerType: 'Residentieel',
      projectNumber: 'PRJ-2026-003',
      status: 'Afgerond',
      progress: 100,
      dueDate: plus(-10),
      team: [],
      priority: 'Low',
    },
  ];
  const ids: string[] = [];
  for (const p of projects) {
    const ref = doc(tenantCol('projects'));
    await setDoc(ref, { ...p, createdAt: Timestamp.now() });
    ids.push(ref.id);
  }
  return ids;
}

async function seedHours(users: Record<string, { uid: string; displayName: string }>, projectIds: string[]) {
  const techUid = users.technician.uid;
  const techName = users.technician.displayName;
  const base = new Date();
  for (let i = 0; i < 10; i++) {
    const day = new Date(base);
    day.setDate(day.getDate() - i);
    const dateStr = day.toISOString().slice(0, 10);
    const begin = new Date(`${dateStr}T08:00:00`).toISOString();
    const einde = new Date(`${dateStr}T16:00:00`).toISOString();
    const ref = doc(tenantCol('hours'));
    await setDoc(ref, {
      type: 'Werk',
      begin,
      einde,
      pauze: '30',
      duur: '07:30',
      durationMinutes: 450,
      project: projectIds[i % projectIds.length],
      date: dateStr,
      userId: techUid,
      userName: techName,
      status: i < 2 ? 'Concept' : 'Goedgekeurd',
      createdAt: Timestamp.now(),
    });
  }
}

async function seedTickets(users: Record<string, { uid: string; displayName: string }>) {
  const tickets = [
    { title: 'CV-ketel geeft foutcode E5', type: 'Storing', status: 'Nieuw', priority: 'High' },
    { title: 'Jaarlijks onderhoud warmtepomp', type: 'Onderhoud', status: 'Bezig', priority: 'Medium' },
    { title: 'Offerte voor uitbreiding zonnepanelen', type: 'Offerte', status: 'Wachten', priority: 'Medium' },
    { title: 'Airco installatie kantoor', type: 'Installatie', status: 'Bezig', priority: 'High' },
    { title: 'Thermostaat vervangen', type: 'Service', status: 'Afgerond', priority: 'Low' },
  ];
  const today = new Date().toISOString().slice(0, 10);
  for (const t of tickets) {
    const ref = doc(tenantCol('tickets'));
    await setDoc(ref, {
      ...t,
      description: `${t.title} — gemeld door klant.`,
      date: today,
      userId: users.manager.uid,
      assigneeId: users.technician.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

async function seedQuotes(contactIds: string[], projectIds: string[]) {
  const today = new Date().toISOString().slice(0, 10);
  const quotes = [
    {
      title: 'Offerte zonnepanelen 20 stuks',
      status: 'Verstuurd',
      projectStatus: 'Offerte verstuurd',
      projectName: 'Zonnepanelen Van Dijk HQ',
      contactName: 'Peter van Dijk',
      contactId: contactIds[0],
      clientName: 'Van Dijk Installaties',
      totalAmount: 12500,
      amount: 12500,
      sentDate: today,
      date: today,
      openedCount: 2,
      referenceNumber: 'REF-001',
      quoteNumber: 'OFF-2026-001',
      projectId: projectIds[0],
      lineItems: [
        { id: 'li1', description: 'Zonnepaneel 400Wp', quantity: 20, price: 250, vatRate: 21 },
        { id: 'li2', description: 'Montage & oplevering', quantity: 1, price: 2500, vatRate: 21 },
      ],
    },
    {
      title: 'Offerte warmtepomp installatie',
      status: 'Concept',
      projectStatus: 'Offerte maken',
      projectName: 'Warmtepomp De Groot Kantoor',
      contactName: 'Marieke de Groot',
      contactId: contactIds[1],
      clientName: 'De Groot Vastgoed',
      totalAmount: 8900,
      amount: 8900,
      sentDate: today,
      date: today,
      openedCount: 0,
      referenceNumber: 'REF-002',
      quoteNumber: 'OFF-2026-002',
      projectId: projectIds[1],
      lineItems: [
        { id: 'li1', description: 'Warmtepomp 8kW', quantity: 1, price: 6500, vatRate: 21 },
        { id: 'li2', description: 'Installatie', quantity: 1, price: 2400, vatRate: 21 },
      ],
    },
  ];
  for (const q of quotes) {
    const ref = doc(tenantCol('quotes'));
    await setDoc(ref, { ...q, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }
}

async function seedInvoices(contactIds: string[], projectIds: string[]) {
  const today = new Date().toISOString().slice(0, 10);
  const invoices = [
    {
      invoiceCode: 'F-2026-001',
      invoiceNumber: 'F-2026-001',
      status: 'Betaald',
      projectName: 'Service Jansen Residentieel',
      contactName: 'Jan Jansen',
      contactId: contactIds[2],
      clientName: 'Jan Jansen',
      totalExcl: 450,
      totalIncl: 544.5,
      amount: 544.5,
      fullyPaid: true,
      date: today,
      projectId: projectIds[2],
      lineItems: [{ id: 'li1', description: 'Service-bezoek', quantity: 1, price: 450, vatRate: 21 }],
    },
    {
      invoiceCode: 'F-2026-002',
      invoiceNumber: 'F-2026-002',
      status: 'Verstuurd',
      projectName: 'Zonnepanelen Van Dijk HQ',
      contactName: 'Peter van Dijk',
      contactId: contactIds[0],
      clientName: 'Van Dijk Installaties',
      totalExcl: 6250,
      totalIncl: 7562.5,
      amount: 7562.5,
      fullyPaid: false,
      date: today,
      projectId: projectIds[0],
      lineItems: [{ id: 'li1', description: 'Termijn 1 (50%)', quantity: 1, price: 6250, vatRate: 21 }],
    },
    {
      invoiceCode: 'F-2026-003',
      invoiceNumber: 'F-2026-003',
      status: 'Concept',
      projectName: 'Warmtepomp De Groot Kantoor',
      contactName: 'Marieke de Groot',
      contactId: contactIds[1],
      clientName: 'De Groot Vastgoed',
      totalExcl: 4450,
      totalIncl: 5384.5,
      amount: 5384.5,
      fullyPaid: false,
      date: today,
      projectId: projectIds[1],
      lineItems: [{ id: 'li1', description: 'Aanbetaling 50%', quantity: 1, price: 4450, vatRate: 21 }],
    },
  ];
  for (const i of invoices) {
    const ref = doc(tenantCol('invoices'));
    await setDoc(ref, { ...i, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }
}

// --- entrypoint ----------------------------------------------------------

async function main() {
  const reset = process.argv.includes('--reset');
  console.log(`\n🌱 Seeding demo-tenant '${DEMO_TENANT_ID}' ${reset ? '(met reset)' : ''}\n`);

  console.log('👤 Auth-users aanmaken / inloggen...');
  const users = await seedUsers();

  if (reset) {
    console.log('🧹 Bestaande demo-data wissen...');
    await resetDemoTenant();
  }

  console.log('🏢 Tenant-document schrijven...');
  await seedTenant(users.owner.uid);

  console.log('🏬 Companies...');
  const companyIds = await seedCompanies();

  console.log('👥 Contacts...');
  const contactIds = await seedContacts(companyIds, users.customer.uid);

  console.log('📁 Projects...');
  const projectIds = await seedProjects(companyIds);

  console.log('⏱  Hours...');
  await seedHours(users, projectIds);

  console.log('🎫 Tickets...');
  await seedTickets(users);

  console.log('📝 Quotes...');
  await seedQuotes(contactIds, projectIds);

  console.log('💶 Invoices...');
  await seedInvoices(contactIds, projectIds);

  console.log('\n✅ Seed klaar.\n');
  console.log('Demo-credentials (wachtwoord voor iedereen: ' + DEMO_PASSWORD + '):');
  for (const u of DEMO_USERS) {
    console.log(`  [${u.role.padEnd(10)}] ${u.email}`);
  }
  console.log('');
  await signOut(auth).catch(() => {});
}

main().catch((err) => {
  console.error('\n❌ Seed mislukt:', err);
  process.exit(1);
});
