import { test } from 'node:test';
import assert from 'node:assert';
import { berekenMaandprijs, BASIS_PRIJS_PER_GEBRUIKER, MODULE_MAP } from '../src/lib/modules';

test('berekenMaandprijs berekent correcte prijzen', (t) => {
  // Test 1: Basis (geen extra modules, 1 user)
  let prijs = berekenMaandprijs(1, []);
  assert.strictEqual(prijs, BASIS_PRIJS_PER_GEBRUIKER, '1 user zonder modules = basisprijs');

  // Test 2: Meerdere gebruikers, geen modules
  prijs = berekenMaandprijs(5, []);
  assert.strictEqual(prijs, BASIS_PRIJS_PER_GEBRUIKER * 5, '5 users zonder modules = 5 * basisprijs');

  // Test 3: Gebruikers kan niet minder dan 1 zijn
  prijs = berekenMaandprijs(0, []);
  assert.strictEqual(prijs, BASIS_PRIJS_PER_GEBRUIKER, '0 users telt als 1 user');

  // Test 4: Basis + 1 betaalde module ('offertes' is 15 euro)
  prijs = berekenMaandprijs(1, ['offertes']);
  assert.strictEqual(prijs, BASIS_PRIJS_PER_GEBRUIKER + 15, '1 user + offertes module');

  // Test 5: Meerdere gebruikers + 1 betaalde module
  prijs = berekenMaandprijs(3, ['offertes']);
  assert.strictEqual(prijs, (BASIS_PRIJS_PER_GEBRUIKER + 15) * 3, '3 users + offertes module');

  // Test 6: Inbegrepen modules tellen niet mee in prijs (bijv 'crm')
  prijs = berekenMaandprijs(2, ['crm', 'dashboarding']);
  assert.strictEqual(prijs, BASIS_PRIJS_PER_GEBRUIKER * 2, 'inbegrepen modules kosten niets extra');
});