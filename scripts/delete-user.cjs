/**
 * Verwijder een Firebase Auth-gebruiker + bijbehorende Firestore-documenten.
 *
 * Wat het verwijdert:
 *   - users/{uid}
 *   - tenants/{tenantId}  (als ownerUid overeenkomt)
 *   - customers/{uid}     (Stripe Extension subcollectie)
 *
 * Vereisten:
 *   - Service-account JSON (Firebase Console → Project Settings → Service accounts → Nieuwe sleutel genereren)
 *   - Sla op als serviceAccount.json in de project-root (staat in .gitignore)
 *
 * Uitvoeren:
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/delete-user.cjs revierebel@gmail.com
 */

'use strict';

const admin = require('firebase-admin');

const email = process.argv[2];
if (!email) {
  console.error('Gebruik: node scripts/delete-user.cjs <email>');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const auth = admin.auth();

async function deleteUserByEmail(targetEmail) {
  console.log(`\nZoeken naar gebruiker: ${targetEmail}`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(targetEmail);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log('Gebruiker niet gevonden in Firebase Auth — niets te verwijderen.');
      return;
    }
    throw err;
  }

  const uid = userRecord.uid;
  console.log(`Gevonden: uid=${uid}`);

  // Zoek het bijbehorende tenant-document via users/{uid}
  const userSnap = await db.doc(`users/${uid}`).get();
  const tenantId = userSnap.exists ? userSnap.data()?.tenantId : null;

  if (tenantId) {
    // Verwijder tenants/{tenantId} alleen als ownerUid overeenkomt
    const tenantSnap = await db.doc(`tenants/${tenantId}`).get();
    if (tenantSnap.exists && tenantSnap.data()?.ownerUid === uid) {
      await db.doc(`tenants/${tenantId}`).delete();
      console.log(`Verwijderd: tenants/${tenantId}`);
    } else {
      console.log(`Overgeslagen: tenants/${tenantId} (ownerUid komt niet overeen of doc bestaat niet)`);
    }
  }

  // Verwijder users/{uid}
  if (userSnap.exists) {
    await db.doc(`users/${uid}`).delete();
    console.log(`Verwijderd: users/${uid}`);
  }

  // Verwijder customers/{uid} subcollectie (Stripe Extension)
  const customersRef = db.collection(`customers/${uid}/checkout_sessions`);
  const checkoutSnaps = await customersRef.get();
  if (!checkoutSnaps.empty) {
    const batch = db.batch();
    checkoutSnaps.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`Verwijderd: ${checkoutSnaps.size} checkout_sessions onder customers/${uid}`);
  }

  // Verwijder Auth-account als laatste stap
  await auth.deleteUser(uid);
  console.log(`Verwijderd: Firebase Auth-account (uid=${uid})`);

  console.log('\nKlaar. Je kunt nu opnieuw registreren met dit e-mailadres.');
}

deleteUserByEmail(email).catch(err => {
  console.error('Script mislukt:', err);
  process.exit(1);
});
