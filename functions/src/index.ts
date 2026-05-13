import * as admin from "firebase-admin";
import * as functionsV1 from "firebase-functions/v1";
import { auth as authV1 } from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

const db = admin.firestore();
const APP_URL = process.env.APP_URL || "http://localhost:3000";

type Rol = "owner" | "admin" | "member";

interface CreateTenantData {
  naam: string;
  plan: string;
  aantalGebruikers: number;
  aantalOwners: number;
  aantalAdmins: number;
  aantalMembers: number;
  actiefModules: string[];
  maandprijs: number;
  abonnementStatus: string;
  abonnementStartDatum: number;
  kvk: string | null;
  btw: string | null;
  adres: { land: string };
  branding: { bedrijfsnaam: string };
  displayName: string;
  email: string;
}


/**
 * Callable (v1): maakt tenant + user document aan en zet custom claims via Admin SDK.
 * Omzeilt Firestore security rules — lost het race condition na createUserWithEmailAndPassword op.
 * Gebruikt v1 om het IAM allUsers-invoker-beleid te omzeilen dat Gen 2 blokkeert.
 * 
 * Veranderd naar onRequest met expliciete CORS headers.
 */
export const initTenant = functionsV1.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Niet ingelogd." });
      return;
    }
    
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    const data = req.body.data;
    if (!data) {
      res.status(400).json({ error: "Geen data" });
      return;
    }

    const { displayName, email, ...tenantFields } = data as CreateTenantData;

    const tenantRef = db.collection("tenants").doc();
    const userRef = db.doc(`users/${uid}`);

    const batch = db.batch();
    batch.set(tenantRef, {
      ...tenantFields,
      ownerUid: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef, {
      tenantId: tenantRef.id,
      role: "owner" as Rol,
      displayName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await batch.commit();

    await admin.auth().setCustomUserClaims(uid, {
      tenantId: tenantRef.id,
      role: "owner",
    });

    await userRef.update({
      claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`initTenant: tenant=${tenantRef.id} aangemaakt voor uid=${uid}`);
    res.status(200).json({ data: { tenantId: tenantRef.id } });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

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

/**
 * Callable: herstel custom claims (tenantId + role) voor de ingelogde gebruiker.
 *
 * Wordt aangeroepen wanneer tenantContext detecteert dat het JWT-token geen
 * tenantId-claim bevat (bijv. accounts aangemaakt vóór de CF werd gedeployed).
 * Leest het users/{uid} document uit Firestore en zet de claims opnieuw.
 */
export const refreshClaims = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Niet ingelogd.");
  }

  const uid = request.auth.uid;
  const userSnap = await db.doc(`users/${uid}`).get();

  if (!userSnap.exists) {
    throw new HttpsError("not-found", `Geen gebruikersdocument gevonden voor uid=${uid}.`);
  }

  const userData = userSnap.data() as { tenantId?: string; role?: string };

  if (!userData.tenantId || !userData.role) {
    throw new HttpsError(
      "failed-precondition",
      `Gebruikersdocument mist tenantId of role voor uid=${uid}.`
    );
  }

  const claims = { tenantId: userData.tenantId, role: userData.role };
  await admin.auth().setCustomUserClaims(uid, claims);
  await db.doc(`users/${uid}`).update({
    claimsRefreshedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`refreshClaims: claims hersteld voor ${uid} — tenantId=${claims.tenantId}, role=${claims.role}`);
  return { success: true };
});

// TODO: Stripe webhook handler — wordt geïmplementeerd bij Stripe integratie
// export const onStripeSubscriptionUpdated = onDocumentWritten(
//   'customers/{uid}/subscriptions/{subId}',
//   async (event) => {
//     // Lees echte Stripe price IDs uit de subscription items
//     // Map price IDs naar ModuleKey via STRIPE_PRICES lookup
//     // Schrijf actiefModules + abonnementStatus naar tenants/{tenantId}
//     // Werkt alleen met echte Stripe price IDs (niet placeholders uit stripe.ts)
//   }
// );

/**
 * Firestore trigger: stuur uitnodigingsmail wanneer een invite-document wordt aangemaakt.
 * Schrijft naar de `mail` collectie via Admin SDK (omzeilt client-side Firestore rules).
 * De Trigger Email Extension verzendt de mail op basis van dit document.
 */
export const onInviteCreated = onDocumentCreated(
  "tenants/{tenantId}/invites/{token}",
  async (event) => {
    const invite = event.data?.data();
    if (!invite) return;

    const token = event.params.token as string;
    const email = invite.email as string;
    const tenantNaam = (invite.tenantNaam as string | undefined) ?? "StreamInstall";
    const role = invite.role as string;

    const rolLabel = role === "owner" ? "Hoofdgebruiker"
      : role === "admin" ? "Extra hoofdgebruiker"
      : "Medewerker";

    const inviteUrl = `${APP_URL}/invite/${token}`;

    try {
      await db.collection("mail").add({
        to: email,
        message: {
          subject: `Uitnodiging om deel te nemen aan ${tenantNaam} op StreamInstall`,
          html: `
            <p>Hallo,</p>
            <p>Je bent uitgenodigd om deel te nemen aan <strong>${tenantNaam}</strong> op StreamInstall als <strong>${rolLabel}</strong>.</p>
            <p><a href="${inviteUrl}" style="background:#059669;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0;">Uitnodiging accepteren</a></p>
            <p>Of kopieer deze link: ${inviteUrl}</p>
            <p>Deze uitnodiging is 7 dagen geldig.</p>
            <p>Met vriendelijke groet,<br>Het StreamInstall team</p>
          `,
        },
      });
      console.log(`onInviteCreated: uitnodigingsmail verstuurd naar ${email} (tenant: ${event.params.tenantId})`);
    } catch (err) {
      console.error(`onInviteCreated: mail versturen mislukt voor ${email}:`, err);
    }
  }
);
