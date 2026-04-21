import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment, 
  assertFails, 
  assertSucceeds 
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let testEnv: RulesTestEnvironment;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'streaminstall-test',
    firestore: {
      rules: readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

test('Tenant isolation: cannot read another tenant doc', async (t) => {
  const alice = testEnv.authenticatedContext('alice', { 
    tenantId: 'tenant_a',
    role: 'owner' 
  });
  
  // Create a doc for tenant B as admin (bypass rules)
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('tenants/tenant_b/companies/comp1').set({ name: 'Tenant B Company' });
  });

  const db = alice.firestore();
  await assertFails(db.doc('tenants/tenant_b/companies/comp1').get());
});

test('Tenant isolation: can read own tenant doc', async (t) => {
  const alice = testEnv.authenticatedContext('alice', { 
    tenantId: 'tenant_a',
    role: 'owner' 
  });
  
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('tenants/tenant_a/companies/comp1').set({ name: 'Tenant A Company' });
  });

  const db = alice.firestore();
  await assertSucceeds(db.doc('tenants/tenant_a/companies/comp1').get());
});

test('RBAC: technician cannot delete company', async (t) => {
  const bob = testEnv.authenticatedContext('bob', { 
    tenantId: 'tenant_a',
    role: 'technician' 
  });
  
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('tenants/tenant_a/companies/comp1').set({ name: 'Some Company' });
  });

  const db = bob.firestore();
  await assertFails(db.doc('tenants/tenant_a/companies/comp1').delete());
});

test('Module gating: cannot create quote if module is not active', async (t) => {
  const alice = testEnv.authenticatedContext('alice', { 
    tenantId: 'tenant_a',
    role: 'owner' 
  });
  
  // Set tenant active modules (bypass rules)
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('tenants/tenant_a').set({ 
      actiefModules: [] // No 'offertes' module
    });
  });

  const db = alice.firestore();
  await assertFails(db.collection('tenants/tenant_a/quotes').add({ title: 'New Quote' }));
});

test('Module gating: can create quote if module is active', async (t) => {
  const alice = testEnv.authenticatedContext('alice', { 
    tenantId: 'tenant_a',
    role: 'owner' 
  });
  
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('tenants/tenant_a').set({ 
      actiefModules: ['offertes']
    });
  });

  const db = alice.firestore();
  await assertSucceeds(db.collection('tenants/tenant_a/quotes').add({ 
    title: 'New Quote',
    status: 'Concept'
  }));
});

test('Customer access: can read own contact doc', async (t) => {
  const charlie = testEnv.authenticatedContext('charlie', { 
    tenantId: 'tenant_a',
    role: 'customer' 
  });
  
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    // Setup user doc to link charlie to contact1
    await db.doc('users/charlie').set({ contactId: 'contact1', tenantId: 'tenant_a', role: 'customer' });
    await db.doc('tenants/tenant_a/contacts/contact1').set({ name: 'Charlie Contact' });
    await db.doc('tenants/tenant_a/contacts/contact2').set({ name: 'Other Contact' });
  });

  const db = charlie.firestore();
  await assertSucceeds(db.doc('tenants/tenant_a/contacts/contact1').get());
  await assertFails(db.doc('tenants/tenant_a/contacts/contact2').get());
});
