/**
 * set-claims.cjs
 *
 * Herstelt custom claims (tenantId + role) voor een bestaand gebruikersaccount.
 * Gebruik dit script voor accounts die aangemaakt zijn vóór de onUserCreated
 * Cloud Function correct was gedeployed.
 *
 * Vereisten:
 *   - Ingelogd via: gcloud auth application-default login
 *   - OF: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
 *
 * Uitvoeren (herstelt claims op basis van het users/{uid} Firestore-document):
 *   node scripts/set-claims.cjs
 *
 * Of voor een specifieke uid:
 *   node scripts/set-claims.cjs --uid=<uid>
 */

'use strict';

let admin;
try {
  admin = require('firebase-admin');
} catch (_) {
  admin = require('../functions/node_modules/firebase-admin');
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db  = admin.firestore();
const authAdmin = admin.auth();

// --- Haal uid op uit argument of lees alle users uit Firestore ---
const uidArg = process.argv.find(a => a.startsWith('--uid='));
const targetUid = uidArg ? uidArg.split('=')[1] : null;

async function restoreClaimsForUid(uid) {
  const snap = await db.doc(`users/${uid}`).get();
  if (!snap.exists) {
    console.error(`❌ Geen users/${uid} document gevonden.`);
    return false;
  }

  const data = snap.data();
  const tenantId = data.tenantId;
  const role     = data.role;

  if (!tenantId || !role) {
    console.error(`❌ users/${uid} mist tenantId (${tenantId}) of role (${role}).`);
    return false;
  }

  // Controleer huidige claims
  const userRecord = await authAdmin.getUser(uid);
  const current    = userRecord.customClaims || {};

  if (current.tenantId === tenantId && current.role === role) {
    console.log(`✅ Claims al correct voor ${uid}: tenantId=${tenantId}, role=${role}`);
    return true;
  }

  // Stel claims in
  await authAdmin.setCustomUserClaims(uid, { tenantId, role });
  await db.doc(`users/${uid}`).update({
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`✅ Claims hersteld voor ${uid}: tenantId=${tenantId}, role=${role}`);
  return true;
}

async function main() {
  console.log('══════════════════════════════════════════');
  console.log('  Custom Claims Herstellen');
  console.log('══════════════════════════════════════════');

  if (targetUid) {
    await restoreClaimsForUid(targetUid);
  } else {
    // Herstel claims voor ALLE gebruikers zonder correcte claims
    console.log('ℹ️  Geen --uid opgegeven, controleer alle gebruikers...\n');
    const usersSnap = await db.collection('users').get();

    if (usersSnap.empty) {
      console.log('ℹ️  Geen gebruikersdocumenten gevonden.');
      return;
    }

    let ok = 0, fail = 0;
    for (const doc of usersSnap.docs) {
      const success = await restoreClaimsForUid(doc.id);
      if (success) ok++; else fail++;
    }

    console.log('\n══════════════════════════════════════════');
    console.log(`  ✅ Hersteld: ${ok}   ❌ Mislukt: ${fail}`);
    console.log('══════════════════════════════════════════');
  }
}

main().catch(err => {
  console.error('Onverwachte fout:', err.message || err);
  process.exit(1);
});
