import { test } from 'node:test';
import assert from 'node:assert';
import { hasPermission } from '../src/lib/permissions';

test('hasPermission controleert rollen correct', (t) => {
  // Test: admin mag bijna alles
  assert.strictEqual(hasPermission('admin', 'crm.view'), true, 'Admin kan CRM bekijken');
  assert.strictEqual(hasPermission('admin', 'facturering.create'), true, 'Admin kan finance items aanmaken');

  // Test: customer is gelimiteerd
  assert.strictEqual(hasPermission('customer', 'crm.view'), false, 'Customer mag geen intern CRM bekijken');
  assert.strictEqual(hasPermission('customer', 'facturering.view'), false, 'Customer mag geen intern finance paneel bekijken');
  
  // Test: manager role
  assert.strictEqual(hasPermission('manager', 'crm.view'), true, 'Manager kan CRM bekijken');
  assert.strictEqual(hasPermission('manager', 'users.delete'), false, 'Manager kan geen users verwijderen');

  // Test: onbekende rol
  assert.strictEqual(hasPermission('unknown_role' as any, 'crm.view'), false, 'Onbekende rol krijgt false');

  // Test: admin mag admin functies, manager niet
  assert.strictEqual(hasPermission('admin', 'users.manage'), true, 'Admin kan users beheren');
  assert.strictEqual(hasPermission('manager', 'users.manage'), false, 'Manager kan geen users beheren');
});