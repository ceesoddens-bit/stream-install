/**
 * Migratiescript: root-collecties → tenant-subcollecties
 *
 * Verplaatst documenten uit de root-collecties `projects`, `form_templates`
 * en `form_items` naar de juiste subcollectie onder `tenants/{tenantId}/`.
 *
 * Vereisten:
 *   - Een service-account JSON (download via Firebase Console → Project Settings → Service accounts)
 *   - Node.js 20+
 *
 * Uitvoeren (dry-run — schrijft niets):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/migrate-root-to-tenant.cjs --dry-run
 *
 * Uitvoeren (echte migratie):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/migrate-root-to-tenant.cjs
 *
 * Het script:
 *   1. Leest elk document uit de root-collectie
 *   2. Leest het tenantId-veld uit het document (of logt het als niet-migreerbaar)
 *   3. Kopieert het document naar tenants/{tenantId}/{collectie}/{docId}
 *   4. Verwijdert het originele root-document na succesvolle kopie (tenzij dry-run)
 */

'use strict';

let admin;
try {
  admin = require('firebase-admin');
} catch (_) {
  admin = require('../functions/node_modules/firebase-admin');
}

const isDryRun = process.argv.includes('--dry-run');

// Gebruik GOOGLE_APPLICATION_CREDENTIALS (service-account JSON) of Application Default Credentials (gcloud ADC).
// Zonder credentials geeft de Admin SDK zelf een duidelijke foutmelding.
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
} else {
  // Probeer ADC (werkt als `gcloud auth application-default login` is uitgevoerd)
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}
const db = admin.firestore();

const COLLECTIONS_TO_MIGRATE = ['projects', 'form_templates', 'form_items'];

async function migrateCollection(collectionName) {
  console.log('\n📂 Verwerken: ' + collectionName);

  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log('   ℹ️  Geen documenten gevonden in root/' + collectionName);
    return { migrated: 0, skipped: 0, errors: 0 };
  }

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const rootDoc of snapshot.docs) {
    const data = rootDoc.data();
    const tenantId = data.tenantId;

    if (!tenantId || typeof tenantId !== 'string') {
      console.warn('   ⚠️  Overgeslagen (geen tenantId): ' + collectionName + '/' + rootDoc.id);
      skipped++;
      continue;
    }

    const targetPath = 'tenants/' + tenantId + '/' + collectionName + '/' + rootDoc.id;

    try {
      if (isDryRun) {
        console.log('   [DRY-RUN] Zou kopiëren: ' + collectionName + '/' + rootDoc.id + ' → ' + targetPath);
      } else {
        await db.doc(targetPath).set(data);
        await db.collection(collectionName).doc(rootDoc.id).delete();
        console.log('   ✅ Gemigreerd: ' + collectionName + '/' + rootDoc.id + ' → ' + targetPath);
      }
      migrated++;
    } catch (err) {
      console.error('   ❌ Fout bij ' + collectionName + '/' + rootDoc.id + ': ' + err.message);
      errors++;
    }
  }

  return { migrated: migrated, skipped: skipped, errors: errors };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Tenant-isolatie migratie — root → subcollecties');
  console.log(isDryRun ? '  MODUS: DRY-RUN (geen wijzigingen)' : '  MODUS: LIVE (documenten worden verplaatst)');
  console.log('═══════════════════════════════════════════════════════');

  const totals = { migrated: 0, skipped: 0, errors: 0 };

  for (const col of COLLECTIONS_TO_MIGRATE) {
    const result = await migrateCollection(col);
    totals.migrated += result.migrated;
    totals.skipped += result.skipped;
    totals.errors += result.errors;
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Samenvatting');
  console.log('  ✅ Gemigreerd : ' + totals.migrated);
  console.log('  ⚠️  Overgeslagen: ' + totals.skipped + ' (geen tenantId — handmatige controle vereist)');
  console.log('  ❌ Fouten     : ' + totals.errors);
  if (isDryRun) {
    console.log('\n  Dit was een dry-run. Voer zonder --dry-run uit om te migreren.');
  }
  console.log('═══════════════════════════════════════════════════════');

  if (totals.errors > 0) {
    process.exit(1);
  }
}

main().catch(function(err) {
  console.error('Onverwachte fout:', err);
  process.exit(1);
});
