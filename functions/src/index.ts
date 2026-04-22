import * as admin from "firebase-admin";
import { auth as authV1 } from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();

type Rol = "owner" | "admin" | "member";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForUserDoc(
  uid: string,
  maxAttempts = 6,
  delayMs = 2000
): Promise<admin.firestore.DocumentData | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) await sleep(delayMs);
    const snap = await db.doc(`users/${uid}`).get();
    if (snap.exists) return snap.data() ?? null;
  }
  return null;
}

/**
 * Auth trigger: zet tenantId + role custom claims na het aanmaken van een account.
 *
 * Werkt voor zowel directe registratie (owner) als uitnodigingsflow (admin/member).
 * Bij een uitnodiging: zoek het invite-document op basis van het e-mailadres
 * en kopieer orgId, role en permissions naar het users/{uid} document.
 */
export const onUserCreated = authV1.user().onCreate(async (user) => {
  // Controleer eerst of er een openstaande uitnodiging is
  const inviteSnap = await db
    .collectionGroup("invites")
    .where("email", "==", user.email)
    .where("status", "==", "pending")
    .limit(1)
    .get();

  if (!inviteSnap.empty) {
    const inviteDoc = inviteSnap.docs[0];
    const invite = inviteDoc.data();

    const tenantId = invite.tenantId as string;
    const role = invite.role as Rol;
    const permissions: string[] = invite.permissions ?? [];

    // Maak het users/{uid} document aan als het er nog niet is
    const userRef = db.doc(`users/${user.uid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        tenantId,
        role,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        permissions,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.update({ permissions });
    }

    await admin.auth().setCustomUserClaims(user.uid, { tenantId, role });
    await userRef.update({ claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp() });

    // Markeer de uitnodiging als geaccepteerd
    await inviteDoc.ref.update({
      status: "accepted",
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
      usedByUid: user.uid,
    });

    // Update tenant-aantallen
    const tenantRef = db.doc(`tenants/${tenantId}`);
    const tenantSnap = await tenantRef.get();
    if (tenantSnap.exists) {
      const field =
        role === "owner" ? "aantalOwners" :
        role === "admin" ? "aantalAdmins" :
        "aantalMembers";

      await tenantRef.update({
        [field]: admin.firestore.FieldValue.increment(1),
        aantalGebruikers: admin.firestore.FieldValue.increment(1),
      });
    }

    console.log(`onUserCreated (invite): ${user.uid} — tenantId=${tenantId}, role=${role}`);
    return;
  }

  // Geen uitnodiging gevonden → normale registratie (owner)
  const userDoc = await waitForUserDoc(user.uid);

  if (!userDoc?.tenantId || !userDoc?.role) {
    console.error(`onUserCreated: geen users/${user.uid} doc gevonden. Claims niet gezet.`);
    return;
  }

  const claims = {
    tenantId: userDoc.tenantId as string,
    role: userDoc.role as Rol,
  };

  await admin.auth().setCustomUserClaims(user.uid, claims);
  await db.doc(`users/${user.uid}`).update({
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`onUserCreated: claims gezet voor ${user.uid} — tenantId=${claims.tenantId}, role=${claims.role}`);
});

/**
 * Callable: wijzig de rol van een gebruiker binnen dezelfde tenant.
 * Alleen owners mogen rollen wijzigen. Owners kunnen niet worden gedowngraded.
 *
 * Verwacht: { targetUid: string, newRole: 'admin' | 'member' }
 */
export const setUserRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Niet ingelogd.");
  }

  const callerClaims = request.auth.token as admin.auth.DecodedIdToken & {
    tenantId?: string;
    role?: Rol;
  };

  if (callerClaims.role !== "owner") {
    throw new HttpsError("permission-denied", "Alleen een owner kan gebruikersrollen wijzigen.");
  }

  const { targetUid, newRole } = request.data as {
    targetUid?: string;
    newRole?: string;
  };

  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid ontbreekt.");
  }

  const assignable: Rol[] = ["admin", "member"];
  if (!newRole || !assignable.includes(newRole as Rol)) {
    throw new HttpsError("invalid-argument", `Ongeldige rol. Kies uit: ${assignable.join(", ")}.`);
  }

  if (targetUid === request.auth.uid) {
    throw new HttpsError("invalid-argument", "Je kunt je eigen rol niet wijzigen.");
  }

  const targetRecord = await admin.auth().getUser(targetUid);
  const targetClaims = (targetRecord.customClaims ?? {}) as { tenantId?: string; role?: Rol };

  if (targetClaims.tenantId !== callerClaims.tenantId) {
    throw new HttpsError("permission-denied", "Deze gebruiker behoort niet tot jouw organisatie.");
  }

  if (targetClaims.role === "owner") {
    throw new HttpsError("permission-denied", "De rol van een owner kan niet worden gewijzigd.");
  }

  const oudRol: "admin" | "member" = targetClaims.role === "admin" ? "admin" : "member";
  const nieuwRol = newRole as "admin" | "member";

  await admin.auth().setCustomUserClaims(targetUid, {
    ...targetClaims,
    role: nieuwRol,
  });

  await db.doc(`users/${targetUid}`).update({
    role: nieuwRol,
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Pas tenant-aantallen aan
  const tenantRef = db.doc(`tenants/${callerClaims.tenantId}`);
  const oudField = oudRol === "admin" ? "aantalAdmins" : "aantalMembers";
  const nieuwField = nieuwRol === "admin" ? "aantalAdmins" : "aantalMembers";

  if (oudField !== nieuwField) {
    await tenantRef.update({
      [oudField]: admin.firestore.FieldValue.increment(-1),
      [nieuwField]: admin.firestore.FieldValue.increment(1),
    });
  }

  console.log(`setUserRole: ${request.auth.uid} → ${targetUid}: ${oudRol} → ${nieuwRol}`);
  return { success: true };
});
