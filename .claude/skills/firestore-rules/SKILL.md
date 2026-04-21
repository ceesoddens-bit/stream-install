---
name: firestore-rules
description: Schrijf of wijzig Firestore security rules voor een tenant-scoped collectie met RBAC + module-access checks. Gebruiken bij elke nieuwe collectie, wijziging in rolmatrix, of als de gebruiker rules aanpast.
---

# Firestore-rules

Alle data-writes moeten tegelijk voldoen aan **(a)** same-tenant check, **(b)** role-check, **(c)** optioneel module-check. Customer-rol heeft beperkte leesrechten op eigen `contactId`-gekoppelde documenten.

## Basisstructuur `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // === Helpers ===
    function isSignedIn() {
      return request.auth != null;
    }

    function tenantId() {
      return request.auth.token.tenantId;
    }

    function sameTenant(t) {
      return isSignedIn() && tenantId() == t;
    }

    function role() {
      return request.auth.token.role;
    }

    function hasRole(roles) {
      return isSignedIn() && role() in roles;
    }

    function hasModule(moduleKey) {
      let tenant = get(/databases/$(database)/documents/tenants/$(tenantId())).data;
      let inbegrepen = moduleKey in ['crm', 'dashboarding'];
      return inbegrepen || moduleKey in tenant.actiefModules;
    }

    function isOwnContact(contactId) {
      let user = get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
      return user.contactId == contactId;
    }

    // === Tenant root ===
    match /tenants/{tId} {
      allow read: if sameTenant(tId);
      allow update: if sameTenant(tId) && hasRole(['owner', 'admin']);
      allow create, delete: if false; // alleen via Cloud Function / Extension

      // === Tenant-scoped collecties ===

      match /contacts/{docId} {
        allow read: if sameTenant(tId) && (hasRole(['owner','admin','manager','sales','finance','technician']) || (role() == 'customer' && isOwnContact(docId)));
        allow create, update, delete: if sameTenant(tId) && hasRole(['owner','admin','manager','sales']) && hasModule('crm');
      }

      match /quotes/{docId} {
        allow read: if sameTenant(tId) && (hasRole(['owner','admin','manager','sales','finance']) || (role() == 'customer' && resource.data.contactId != null && isOwnContact(resource.data.contactId)));
        allow create, update: if sameTenant(tId) && hasRole(['owner','admin','manager','sales']) && hasModule('offertes');
        allow update: if sameTenant(tId) && role() == 'customer' && resource.data.status == 'sent' && request.resource.data.status == 'accepted'; // alleen status naar accepted
        allow delete: if sameTenant(tId) && hasRole(['owner','admin']) && hasModule('offertes');
      }

      match /invoices/{docId} {
        allow read: if sameTenant(tId) && (hasRole(['owner','admin','manager','finance']) || (role() == 'customer' && isOwnContact(resource.data.contactId)));
        allow create, update, delete: if sameTenant(tId) && hasRole(['owner','admin','finance']) && hasModule('facturering');
      }

      match /tickets/{docId} {
        allow read: if sameTenant(tId) && (hasRole(['owner','admin','manager','technician']) || (role() == 'customer' && isOwnContact(resource.data.contactId)));
        allow create: if sameTenant(tId) && (hasRole(['owner','admin','manager','technician']) || role() == 'customer') && hasModule('projectmanagement');
        allow update, delete: if sameTenant(tId) && hasRole(['owner','admin','manager','technician']) && hasModule('projectmanagement');

        match /comments/{commentId} {
          allow read: if sameTenant(tId);
          allow create: if sameTenant(tId) && (hasRole(['owner','admin','manager','technician']) || role() == 'customer');
          allow update, delete: if sameTenant(tId) && request.auth.uid == resource.data.authorId;
        }
      }

      // ...idem voor planning, hours, tasks, inventory, forms, settings
    }

    // === Users ===
    match /users/{uid} {
      allow read: if isSignedIn() && (request.auth.uid == uid || sameTenant(resource.data.tenantId) && hasRole(['owner','admin']));
      allow update: if request.auth.uid == uid || (sameTenant(resource.data.tenantId) && hasRole(['owner','admin']));
      allow create, delete: if false; // via Cloud Function
    }

    // === Mail queue (Trigger Email) ===
    match /mail/{id} {
      allow read, write: if false; // alleen server-side via Extension
    }
  }
}
```

## Per-collectie actielijst

Voor elke nieuwe of bestaande tenant-collectie:
1. **Bepaal modules**: welke ModuleKey uit `src/lib/modules.ts` hoort erbij?
2. **Bepaal rollen** per actie (read/create/update/delete).
3. **Customer-toegang**: leest customer dit eigenaardig (alleen eigen records)?
4. **Speciale velden**: audit-velden (`createdBy`, `updatedBy`) valideren via `request.auth.uid == request.resource.data.createdBy`.
5. Schrijf `match /{collectie}/{docId}` blok onder `match /tenants/{tId}`.

## Storage rules (`storage.rules`)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { return request.auth != null; }
    function tenantId() { return request.auth.token.tenantId; }

    match /tenants/{tId}/{allPaths=**} {
      allow read: if isSignedIn() && tenantId() == tId;
      allow write: if isSignedIn() && tenantId() == tId
                    && request.resource.size < 25 * 1024 * 1024; // 25MB limit
    }
  }
}
```

## Deploy & test

- [ ] `firebase deploy --only firestore:rules,storage:rules`
- [ ] Test via Firebase Rules Playground in Console per collectie
- [ ] Schrijf rules-tests in `firestore.rules.test.ts` met `@firebase/rules-unit-testing`:
  - Positief pad (juiste role + module) — allowed
  - Negatief pad (andere tenant) — denied
  - Negatief pad (juiste role, ontbrekende module) — denied
  - Customer-pad (eigen contact) — allowed read

## Valkuilen

- **`get()` in rules is traag** — gebruik alleen als custom claims onvoldoende info bevatten
- **Custom claims moeten versheid garanderen** — gebruiker moet opnieuw inloggen na rol-wijziging, of forceer token-refresh in client
- **`hasModule()` via `get()`** — overweeg om actiefModules in custom claims te duwen voor snelheid (vereist Extension-update bij module-toggle)
- **Customer-rol default te ruim** — altijd expliciet scope op `contactId`
- **Geen write zonder read** — de client moet read-access hebben op eigen schrijf-doel, anders mislukt optimistic UI
