import { test } from 'node:test';
import assert from 'node:assert';
import { heeftPermissie, DEFAULT_MEMBER_PERMISSIONS } from '../src/lib/permissions';

test('heeftPermissie controleert rollen correct', () => {
  // Owner en admin hebben altijd toegang
  assert.strictEqual(heeftPermissie('owner', 'crm.contacten.bekijken'), true, 'Owner heeft altijd toegang');
  assert.strictEqual(heeftPermissie('admin', 'facturen.aanmaken'), true, 'Admin heeft altijd toegang');

  // Member zonder permissies heeft geen toegang
  assert.strictEqual(heeftPermissie('member', 'crm.contacten.aanmaken', []), false, 'Member zonder permissie: geen toegang');

  // Member mét de juiste permissie heeft toegang
  assert.strictEqual(
    heeftPermissie('member', 'crm.contacten.bekijken', ['crm.contacten.bekijken']),
    true,
    'Member met permissie: toegang'
  );

  // Member met default permissies
  assert.strictEqual(
    heeftPermissie('member', 'crm.contacten.bekijken', DEFAULT_MEMBER_PERMISSIONS),
    true,
    'Default member heeft crm.contacten.bekijken'
  );
  assert.strictEqual(
    heeftPermissie('member', 'facturen.aanmaken', DEFAULT_MEMBER_PERMISSIONS),
    false,
    'Default member heeft geen facturen.aanmaken'
  );

  // Geen rol → geen toegang
  assert.strictEqual(heeftPermissie(null, 'crm.contacten.bekijken'), false, 'Null rol = geen toegang');
  assert.strictEqual(heeftPermissie(undefined, 'crm.contacten.bekijken'), false, 'Undefined rol = geen toegang');
});
