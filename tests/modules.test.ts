import { test } from 'node:test';
import assert from 'node:assert';
import { berekenMaandprijs, PRIJS_OWNER, PRIJS_ADMIN, PRIJS_MEMBER, MODULE_MAP } from '../src/lib/modules';

test('berekenMaandprijs berekent correcte prijzen', () => {
  // 1 owner, geen modules = enkel owner basisprijs
  let prijs = berekenMaandprijs(1, 0, 0, []);
  assert.strictEqual(prijs, PRIJS_OWNER, '1 owner zonder modules');

  // 0 owners telt als 1 (minimum)
  prijs = berekenMaandprijs(0, 0, 0, []);
  assert.strictEqual(prijs, PRIJS_OWNER, '0 owners telt als 1');

  // 1 owner + 1 admin + 1 member
  prijs = berekenMaandprijs(1, 1, 1, []);
  assert.strictEqual(prijs, PRIJS_OWNER + PRIJS_ADMIN + PRIJS_MEMBER, '1+1+1 zonder modules');

  // Modules worden doorberekend aan owners + admins (betaalde gebruikers)
  prijs = berekenMaandprijs(1, 0, 0, ['offertes']); // offertes = €15
  assert.strictEqual(prijs, PRIJS_OWNER + 15, '1 owner + offertes module');

  // Members betalen niet mee voor modules
  prijs = berekenMaandprijs(1, 0, 3, ['offertes']);
  assert.strictEqual(prijs, PRIJS_OWNER + 15 + PRIJS_MEMBER * 3, 'modules niet voor members');

  // 2 betaalde gebruikers → module × 2
  prijs = berekenMaandprijs(1, 1, 0, ['offertes']);
  assert.strictEqual(prijs, PRIJS_OWNER + PRIJS_ADMIN + 15 * 2, '2 betaalde gebr + offertes');

  // Inbegrepen modules kosten niets extra
  prijs = berekenMaandprijs(2, 0, 0, ['crm', 'dashboarding']);
  assert.strictEqual(prijs, PRIJS_OWNER * 2, 'inbegrepen modules kosten niets extra');
});
