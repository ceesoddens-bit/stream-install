# BOUWPLAN: Gebruikersbeheer, Rollen & Permissiesysteem

## Context voor Claude Code

Dit plan bouwt voort op de bestaande Firebase/Next.js CRM codebase (StreamInstall).
De Cloud Functions voor Custom Claims zijn al gebouwd en gedeployed.
Dit plan voegt toe:
1. Gedifferentieerd prijsmodel per gebruikersrol
2. Multi-user registratie (e-mailadressen invullen bij onboarding)
3. Granulaire permissies per medewerker (instelbaar door owner/admin)
4. Firebase koppeling voor toegangscontrole per gebruiker

---

## STAP 1 — Analyseer bestaande codebase

Voordat je iets aanpast:
- Breng de huidige rolstructuur in kaart (`tenantTypes.ts` of vergelijkbaar)
- Identificeer waar de huidige `role` types zijn gedefinieerd
- Bekijk de bestaande registratiewizard/onboarding flow
- Bekijk de bestaande Firestore structuur voor `organizations` en `users`
- Bekijk de bestaande `setUserRole` Cloud Function
- Noteer welke routes al beveiligd zijn via middleware

---

## STAP 2 — Datamodel updaten

### 2.1 Roltype definitie — `lib/roles.ts`

```ts
export type UserRole = 'owner' | 'admin' | 'member';

export interface RolePricing {
  role: UserRole;
  label: string;
  beschrijving: string;
  prijs_per_maand: number;
}

export const ROL_PRIJZEN: RolePricing[] = [
  {
    role: 'owner',
    label: 'Hoofdgebruiker',
    beschrijving: 'Volledige toegang inclusief facturering en gebruikersbeheer.',
    prijs_per_maand: 29,
  },
  {
    role: 'admin',
    label: 'Extra Hoofdgebruiker',
    beschrijving: 'Volledige toegang, uitgezonderd facturering en abonnementsbeheer.',
    prijs_per_maand: 19,
  },
  {
    role: 'member',
    label: 'Medewerker',
    beschrijving: 'Toegang tot functies die de hoofdgebruiker heeft ingesteld.',
    prijs_per_maand: 9,
  },
];

export function berekenGebruikersPrijs(
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number
): number {
  return (
    aantalOwners * 29 +
    aantalAdmins * 19 +
    aantalMembers * 9
  );
}
```

### 2.2 Permissies definitie — `lib/permissions.ts`

Dit zijn alle acties die een owner kan in- of uitschakelen per medewerker:

```ts
export type PermissionKey =
  // CRM
  | 'crm.contacten.bekijken'
  | 'crm.contacten.aanmaken'
  | 'crm.contacten.bewerken'
  | 'crm.contacten.verwijderen'
  // Projecten
  | 'projecten.bekijken'
  | 'projecten.aanmaken'
  | 'projecten.bewerken'
  | 'projecten.verwijderen'
  // Offertes
  | 'offertes.bekijken'
  | 'offertes.aanmaken'
  | 'offertes.versturen'
  // Facturering
  | 'facturen.bekijken'
  | 'facturen.aanmaken'
  // Planning
  | 'planning.bekijken'
  | 'planning.bewerken'
  // Documenten
  | 'documenten.bekijken'
  | 'documenten.uploaden'
  | 'documenten.verwijderen'
  // Formulieren
  | 'formulieren.invullen'
  | 'formulieren.aanmaken'
  // Voorraad
  | 'voorraad.bekijken'
  | 'voorraad.bewerken'
  // Rapportages
  | 'rapportages.bekijken';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  categorie: string;
}

export const PERMISSIONS: PermissionDefinition[] = [
  // CRM
  { key: 'crm.contacten.bekijken', label: 'Contacten bekijken', categorie: 'CRM' },
  { key: 'crm.contacten.aanmaken', label: 'Contacten aanmaken', categorie: 'CRM' },
  { key: 'crm.contacten.bewerken', label: 'Contacten bewerken', categorie: 'CRM' },
  { key: 'crm.contacten.verwijderen', label: 'Contacten verwijderen', categorie: 'CRM' },
  // Projecten
  { key: 'projecten.bekijken', label: 'Projecten bekijken', categorie: 'Projecten' },
  { key: 'projecten.aanmaken', label: 'Projecten aanmaken', categorie: 'Projecten' },
  { key: 'projecten.bewerken', label: 'Projecten bewerken', categorie: 'Projecten' },
  { key: 'projecten.verwijderen', label: 'Projecten verwijderen', categorie: 'Projecten' },
  // Offertes
  { key: 'offertes.bekijken', label: 'Offertes bekijken', categorie: 'Offertes' },
  { key: 'offertes.aanmaken', label: 'Offertes aanmaken', categorie: 'Offertes' },
  { key: 'offertes.versturen', label: 'Offertes versturen', categorie: 'Offertes' },
  // Facturering
  { key: 'facturen.bekijken', label: 'Facturen bekijken', categorie: 'Facturering' },
  { key: 'facturen.aanmaken', label: 'Facturen aanmaken', categorie: 'Facturering' },
  // Planning
  { key: 'planning.bekijken', label: 'Planning bekijken', categorie: 'Planning' },
  { key: 'planning.bewerken', label: 'Planning bewerken', categorie: 'Planning' },
  // Documenten
  { key: 'documenten.bekijken', label: 'Documenten bekijken', categorie: 'Documenten' },
  { key: 'documenten.uploaden', label: 'Documenten uploaden', categorie: 'Documenten' },
  { key: 'documenten.verwijderen', label: 'Documenten verwijderen', categorie: 'Documenten' },
  // Formulieren
  { key: 'formulieren.invullen', label: 'Formulieren invullen', categorie: 'Formulieren' },
  { key: 'formulieren.aanmaken', label: 'Formulieren aanmaken', categorie: 'Formulieren' },
  // Voorraad
  { key: 'voorraad.bekijken', label: 'Voorraad bekijken', categorie: 'Voorraad' },
  { key: 'voorraad.bewerken', label: 'Voorraad bewerken', categorie: 'Voorraad' },
  // Rapportages
  { key: 'rapportages.bekijken', label: 'Rapportages bekijken', categorie: 'Rapportages' },
];

// Standaard permissies die een nieuwe member automatisch krijgt
export const DEFAULT_MEMBER_PERMISSIONS: PermissionKey[] = [
  'crm.contacten.bekijken',
  'projecten.bekijken',
  'planning.bekijken',
  'documenten.bekijken',
  'formulieren.invullen',
];

// Owners en admins hebben altijd alle permissies — geen check nodig
export const OWNER_ADMIN_HEEFT_ALLES = true;
```

### 2.3 Firestore structuur updaten

**`organizations/{orgId}`** — voeg toe:
```
{
  // Bestaande velden blijven
  aantalOwners: number,        // voor prijsberekening
  aantalAdmins: number,
  aantalMembers: number,
  maandprijs: number,          // herberekend bij elke gebruikerswijziging
}
```

**`organizations/{orgId}/users/{userId}`** — subcollectie per gebruiker:
```
{
  uid: string,
  email: string,
  displayName: string,
  role: 'owner' | 'admin' | 'member',
  permissions: PermissionKey[],   // alleen relevant voor members
  status: 'actief' | 'uitgenodigd' | 'gedeactiveerd',
  uitgenodigdOp: Timestamp,
  actiefSinds: Timestamp | null,
}
```

**`invitations/{invitationId}`** — voor uitnodigingen:
```
{
  orgId: string,
  email: string,
  role: 'admin' | 'member',
  permissions: PermissionKey[],
  token: string,              // unieke token in de uitnodigingslink
  aangemaakt: Timestamp,
  verlooptOp: Timestamp,      // 7 dagen geldig
  geaccepteerd: boolean,
}
```

---

## STAP 3 — Registratiewizard uitbreiden

### Stap 3 van de wizard: "Teamleden toevoegen"

Dit is een nieuwe stap die wordt ingevoegd NA de pakketkeuze.

**Layout:**

Bovenaan een rolkiezer met live prijsoverzicht:

```
Hoofdgebruikers (owners):    [1] × €29 = €29
Extra hoofdgebruikers:       [0] × €19 = €0  
Medewerkers:                 [0] × €9  = €0
─────────────────────────────────────────
Gebruikerskosten:            €29/maand
Modulekosten:                €XX/maand  (uit vorige stap)
Totaal:                      €XX/maand
```

Daaronder een dynamisch formulier:

**Voor elke owner (behalve de registrerende gebruiker zelf):**
- E-mailadres input
- Label: "Hoofdgebruiker" (vast)

**Voor elke admin:**
- E-mailadres input
- Label: "Extra hoofdgebruiker"

**Voor elke member:**
- E-mailadres input
- Label: "Medewerker"
- Klein linkje: "Permissies instellen ▾" → klapt open met checkboxes

**Knoppen:**
- "+ Hoofdgebruiker toevoegen" (voegt een leeg e-mailveld toe)
- "+ Extra hoofdgebruiker toevoegen"
- "+ Medewerker toevoegen"

**Validatie:**
- Alle e-mailadressen moeten uniek zijn
- Geen dubbele e-mailadressen
- Geldig e-mailformaat
- De registrerende gebruiker hoeft zijn eigen e-mail niet in te vullen (die is al bekend)
- Minimaal 0 extra gebruikers (team toevoegen is optioneel bij registratie)

**Permissies instellen per member (inline accordion):**

Bij elke member verschijnt een uitklapbaar permissie-paneel met checkboxes gegroepeerd per categorie. Standaard zijn `DEFAULT_MEMBER_PERMISSIONS` aangevinkt.

---

## STAP 4 — Uitnodigingssysteem via Firebase

### 4.1 Cloud Function: `sendInvitations`

Maak een nieuwe callable Cloud Function aan in `functions/src/index.ts`:

**Trigger:** Callable door owner of admin  
**Wat het doet:**
1. Valideer dat de caller een owner of admin is binnen de organisatie
2. Voor elke uitgenodigde gebruiker:
   - Maak een unieke `invitationToken` aan (crypto.randomUUID())
   - Sla op in `invitations/{token}` met alle gegevens
   - Stuur een uitnodigingsmail via Firebase Trigger Email extensie (of Resend als dat al gekoppeld is)
   - De uitnodigingslink: `https://[jouwdomein]/uitnodiging/[token]`
3. Sla de gebruiker op in `organizations/{orgId}/users/{userId}` met status `'uitgenodigd'`
4. Herbereken en update `maandprijs` in het organisatiedocument

**Beveiliging:**
- Alleen owners en admins mogen uitnodigingen versturen
- Admins mogen geen owners uitnodigen
- Maximaal 1 owner per organisatie (tenzij de huidige owner een tweede aanwijst)

### 4.2 Uitnodigingspagina — `/uitnodiging/[token]`

Publieke pagina (geen login vereist).

**Flow:**
1. Laad het `invitations/{token}` document
2. Als token niet bestaat of verlopen → toon foutmelding
3. Als al geaccepteerd → redirect naar `/login`
4. Toon: "Je bent uitgenodigd door [bedrijfsnaam] om deel te nemen als [rol]"
5. Formulier:
   - Voornaam
   - Achternaam
   - Wachtwoord instellen
   - Wachtwoord bevestigen
6. Knop: "Account aanmaken en accepteren"

**Bij acceptatie:**
1. Maak Firebase Auth account aan met het uitgenodigde e-mailadres
2. Update `invitations/{token}` → `geaccepteerd: true`
3. Update `organizations/{orgId}/users/{uid}` → `status: 'actief'`, `actiefSinds: now()`
4. De `onUserCreated` Cloud Function pikt dit op en zet de custom claims
5. Redirect naar `/dashboard` met welkomstmelding

---

## STAP 5 — Permissiesysteem in de app

### 5.1 AuthContext uitbreiden

Voeg toe aan de bestaande AuthContext:

```ts
interface AuthContextType {
  // Bestaande velden...
  permissions: PermissionKey[];
  heeftPermissie: (permission: PermissionKey) => boolean;
}
```

Bij inloggen: laad `permissions` uit `organizations/{orgId}/users/{uid}`.
Voor owners en admins: `heeftPermissie` geeft altijd `true` terug.
Voor members: checkt of de permissie in de `permissions` array zit.

### 5.2 PermissionGuard component — `components/PermissionGuard.tsx`

```tsx
interface PermissionGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

- Als `heeftPermissie(permission)` → render children
- Anders → render fallback (standaard: niets, of een "Geen toegang" melding)

### 5.3 Toepassen in de app

Wrap alle acties (niet alleen pagina's) in `<PermissionGuard>`:

```tsx
// Verberg "Aanmaken" knop als geen permissie
<PermissionGuard permission="crm.contacten.aanmaken">
  <Button>Nieuw contact</Button>
</PermissionGuard>

// Verberg verwijder-icoon
<PermissionGuard permission="crm.contacten.verwijderen">
  <DeleteButton />
</PermissionGuard>
```

---

## STAP 6 — Gebruikersbeheer pagina voor owners/admins

### Route: `/dashboard/instellingen/gebruikers`

Alleen toegankelijk voor owners en admins.

**Overzicht sectie:**
Tabel met alle gebruikers van de organisatie:
| Naam | E-mail | Rol | Status | Permissies | Acties |
|------|--------|-----|--------|------------|--------|
| Jan de Vries | jan@... | Medewerker | Actief | 5/23 | Bewerken / Deactiveren |
| Petra Smit | petra@... | Extra hoofdgebr. | Uitgenodigd | — | Herinnering sturen |

**Acties per gebruiker:**
- **Bewerken** → opent een modal/drawer met:
  - Rol wijzigen (alleen owner mag dit)
  - Permissies aanpassen (checkboxes per categorie)
  - Knop: "Opslaan" → update Firestore + roept `setUserRole` Cloud Function aan
- **Deactiveren** → zet status op `gedeactiveerd`, verwijdert custom claims
- **Herinnering sturen** → stuurt uitnodigingsmail opnieuw

**Nieuwe gebruiker uitnodigen sectie:**
- Knop: "+ Gebruiker uitnodigen"
- Modal met: e-mailadres, rol, permissies (als member)
- Roept `sendInvitations` Cloud Function aan

**Live prijsoverzicht:**
Rechts of onderaan altijd zichtbaar:
```
Hoofdgebruikers:    1 × €29 = €29
Extra hoofdgebr.:   1 × €19 = €19
Medewerkers:        8 × €9  = €72
Modulekosten:             = €XX
──────────────────────────────
Totaal deze maand:  €XX
```

---

## STAP 7 — Firestore Security Rules updaten

Voeg toe aan `firestore.rules`:

```
// Gebruikers subcollectie — alleen owners/admins van dezelfde org mogen schrijven
match /organizations/{orgId}/users/{userId} {
  allow read: if isOrgMember(orgId);
  allow write: if isOrgOwnerOrAdmin(orgId);
}

// Invitations — publiek leesbaar (voor uitnodigingspagina), alleen schrijfbaar via Cloud Functions
match /invitations/{token} {
  allow read: if true;
  allow write: if false; // alleen via Admin SDK in Cloud Functions
}

// Helper functions
function isOrgMember(orgId) {
  return request.auth.token.tenantId == orgId;
}

function isOrgOwnerOrAdmin(orgId) {
  return isOrgMember(orgId) && 
    (request.auth.token.role == 'owner' || request.auth.token.role == 'admin');
}
```

---

## STAP 8 — Cloud Function: `onUserCreated` updaten

De bestaande `onUserCreated` functie moet worden uitgebreid:

Bij een nieuwe gebruiker aanmaken via uitnodiging:
1. Zoek het `invitations` document op basis van het e-mailadres
2. Als gevonden: gebruik `orgId`, `role` en `permissions` uit de invitation
3. Zet custom claims: `{ tenantId: orgId, role: role }`
4. Sla `permissions` op in `organizations/{orgId}/users/{uid}`

Bij een nieuwe gebruiker aanmaken via directe registratie (geen invitation):
1. Gebruik de `tenantId` en `role: 'owner'` zoals al geïmplementeerd

---

## STAP 9 — Prijsberekening updaten in `lib/modules.ts`

Update de `berekenMaandprijs` functie:

```ts
export function berekenMaandprijs(
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number,
  gekozenModules: ModuleKey[]
): number {
  // Gebruikerskosten
  const gebruikersKosten = berekenGebruikersPrijs(aantalOwners, aantalAdmins, aantalMembers);
  
  // Modulekosten — alleen owners en admins tellen mee voor moduleprijs
  const betaleGebruikers = aantalOwners + aantalAdmins;
  const moduleKosten = gekozenModules.reduce((som, key) => {
    const module = MODULES.find((m) => m.key === key && !m.altijd_inbegrepen);
    return som + (module ? module.prijs_per_gebruiker * betaleGebruikers : 0);
  }, 0);
  
  return gebruikersKosten + moduleKosten;
}
```

---

## STAP 10 — Landingspagina prijsoverzicht updaten

Update de prijscalculator op de landingspagina:

Voeg drie aparte sliders/inputs toe:
- Aantal hoofdgebruikers (owners): min 1
- Aantal extra hoofdgebruikers (admins): min 0
- Aantal medewerkers (members): min 0

Toon de uitsplitsing live:
```
Hoofdgebruikers:     X × €29 = €XX
Extra hoofdgebr.:    X × €19 = €XX
Medewerkers:         X × €9  = €XX
Geselecteerde modules:        = €XX
─────────────────────────────────
Totaal per maand:             €XX
```

Voeg toe aan de FAQ:
- "Waarom betalen medewerkers minder?" → Medewerkers hebben beperkte toegang. De hoofdgebruiker bepaalt wat zij mogen doen.
- "Kan ik later medewerkers toevoegen?" → Ja, via Instellingen > Gebruikers op elk moment.

---

## STAP 11 — Volgorde van implementatie

Bouw in deze volgorde:

1. `lib/roles.ts` en `lib/permissions.ts` aanmaken
2. Firestore structuur uitbreiden (subcollectie `users`, `invitations`)
3. `berekenMaandprijs` updaten in `lib/modules.ts`
4. `onUserCreated` Cloud Function updaten voor uitnodigingsflow
5. Nieuwe `sendInvitations` Cloud Function bouwen
6. Registratiewizard stap "Teamleden toevoegen" bouwen
7. Uitnodigingspagina `/uitnodiging/[token]` bouwen
8. `AuthContext` uitbreiden met `permissions` en `heeftPermissie`
9. `PermissionGuard` component bouwen
10. `PermissionGuard` toepassen op bestaande CRM-componenten
11. Gebruikersbeheer pagina `/dashboard/instellingen/gebruikers` bouwen
12. Firestore security rules updaten en deployen
13. Landingspagina prijscalculator updaten
14. Testen: registreer als owner, nodig een admin en twee members uit, stel permissies in, log in als member en controleer toegang

---

## Notities voor Claude Code

- Analyseer EERST de bestaande codebase volledig voordat je begint
- De bestaande `setUserRole` Cloud Function blijft intact — bouw er op voort
- Breek niets af van de bestaande CRM-functionaliteit
- Alle teksten in het Nederlands
- Gebruik dezelfde styling/component library als de rest van het project
- Na elke grote stap: check op TypeScript errors
- Deploy Cloud Functions pas nadat alle TypeScript errors zijn opgelost
