import * as admin from "firebase-admin";
import { auth as authV1 } from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();

type Rol =
  | "owner"
  | "admin"
  | "manager"
  | "technician"
  | "sales"
  | "finance"
  | "customer";

// Roles that setUserRole may assign (owner is immutable after registration)
const ASSIGNABLE_ROLES: Rol[] = [
  "admin",
  "manager",
  "technician",
  "sales",
  "finance",
  "customer",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits for users/{uid} to appear in Firestore after the client batch-commits
 * the user doc immediately after createUserWithEmailAndPassword.
 */
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
 * Auth trigger: sets tenantId + role custom claims on every new user.
 *
 * The client writes users/{uid} with {tenantId, role} in a batch right after
 * createUserWithEmailAndPassword. We poll until the doc appears (max ~12 s),
 * then mirror those values as custom claims so Firestore rules can use them.
 */
export const onUserCreated = authV1.user().onCreate(async (user) => {
  const userDoc = await waitForUserDoc(user.uid);

  if (!userDoc?.tenantId || !userDoc?.role) {
    console.error(
      `onUserCreated: geen users/${user.uid} doc gevonden na maximale wachttijd. Claims niet gezet.`
    );
    return;
  }

  const claims = {
    tenantId: userDoc.tenantId as string,
    role: userDoc.role as Rol,
  };

  await admin.auth().setCustomUserClaims(user.uid, claims);

  // Timestamp zodat de client weet wanneer hij een token-refresh moet forceren
  await db.doc(`users/${user.uid}`).update({
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `onUserCreated: claims gezet voor ${user.uid} — tenantId=${claims.tenantId}, role=${claims.role}`
  );
});

/**
 * Callable function: laat een owner de rol van een andere gebruiker binnen
 * dezelfde tenant wijzigen. Geeft een fout als de aanroeper geen owner is,
 * de doelgebruiker buiten de tenant valt, of de rol ongeldig is.
 *
 * Verwacht: { targetUid: string, newRole: Rol }
 * Retourneert: { success: true }
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
    throw new HttpsError(
      "permission-denied",
      "Alleen een owner kan gebruikersrollen wijzigen."
    );
  }

  const { targetUid, newRole } = request.data as {
    targetUid?: string;
    newRole?: string;
  };

  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid ontbreekt.");
  }

  if (!newRole || !ASSIGNABLE_ROLES.includes(newRole as Rol)) {
    throw new HttpsError(
      "invalid-argument",
      `Ongeldige rol. Kies uit: ${ASSIGNABLE_ROLES.join(", ")}.`
    );
  }

  // Zelf-downgrade blokkeren
  if (targetUid === request.auth.uid) {
    throw new HttpsError(
      "invalid-argument",
      "Je kunt je eigen rol niet wijzigen."
    );
  }

  // Verificeer dat de doelgebruiker in dezelfde tenant zit
  const targetRecord = await admin.auth().getUser(targetUid);
  const targetClaims = (targetRecord.customClaims ?? {}) as {
    tenantId?: string;
    role?: Rol;
  };

  if (targetClaims.tenantId !== callerClaims.tenantId) {
    throw new HttpsError(
      "permission-denied",
      "Deze gebruiker behoort niet tot jouw organisatie."
    );
  }

  // Owner-naar-owner promotie blokkeren (owner-rol is eenmalig bij registratie)
  if (targetClaims.role === "owner") {
    throw new HttpsError(
      "permission-denied",
      "De rol van een owner kan niet worden gewijzigd."
    );
  }

  const updatedClaims = {
    ...targetClaims,
    role: newRole as Rol,
  };

  await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

  await db.doc(`users/${targetUid}`).update({
    role: newRole,
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `setUserRole: ${request.auth.uid} heeft rol van ${targetUid} gewijzigd naar ${newRole}`
  );

  return { success: true };
});
