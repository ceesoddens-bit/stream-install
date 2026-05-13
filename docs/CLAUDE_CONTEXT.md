# StreamInstall — Claude Context (Volledig)

## Project
Modulair CRM/ERP SaaS platform voor installateurs/MKB. Multi-tenant via `tenants/{tenantId}`. Gebruikers kopen modules per gebruiker per maand bovenop een rolgebaseerde basisprijs.

## Tech-stack
- **Vite** + React 19 + TypeScript (géén Next.js)
- Tailwind CSS v4 + `@base-ui/react`
- **`react-router-dom` v6** (géén Next App Router)
- Firebase Auth + Firestore + Storage + Firebase Hosting
- Firebase Extensions: Trigger Email, Stripe Payments (`firestore-stripe-payments`), Gemini, Delete User Data, Custom Claims
- **`@dnd-kit/core`** + `@dnd-kit/sortable` — Kanban drag-drop
- **`react-hook-form` + `zod`** — alle forms
- **`@react-pdf/renderer`** — PDF-generatie (offertes/facturen)

## Firestore architectuur
- Root: `tenants/{tenantId}`, `users/{uid}`, `mail/{id}`, `customers/{uid}`
- Tenant-scoped (via `tenantCol(name)` helper): `companies`, `contacts`, `projects`, `project_groups`, `quotes`, `invoices`, `purchase_invoices`, `payments`, `tickets`, `tickets/{id}/comments`, `hours`, `tasks`, `planning`, `planning_cards`, `teams`, `technicians`, `inventory`, `suppliers`, `warehouses`, `bom_items`, `purchase_orders`, `mutations`, `stock_overview`, `form_templates`, `form_items`, `settings`, `tags`, `invites`, `counters`, `ai_requests`
- **Nooit rechtstreeks `collection(db, 'X')` — altijd `tenantCol('X')`**

## Cloud Functions (functions/)
- `onUserCreated` — maakt users/{uid} doc aan, stuurt uitnodigingsmail
- `onInviteCreated` — verwerkt invite-flow
- `setUserRole` — wijzigt role + custom claims op Auth-user
- [TODO: verificatie nodig — functions-map niet volledig geïnspecteerd]

## Prijsmodel
- **Owner**: €29/gebruiker/maand (basisprijs)
- **Admin**: €19/gebruiker/maand
- **Member**: €9/gebruiker/maand
- Modulekosten gelden per actieve module × aantal gebruikers (alle rollen)
- Gratis modules: `crm`, `dashboarding`
- Betaalde modules: `offertes` (€15), `projectmanagement` (€15), `planning` (€15), `facturering` (€15), `formulieren` (€10), `documenten` (€10), `voorraadbeheer` (€15), `automatiseringen` (€20), `klantportaal` (€15), `ai_assistent` (€20)
- Berekening via `berekenMaandprijs(owners, admins, members, modules)` in `src/lib/modules.ts`

## Abonnementsstatus
- `trialing` — 14 dagen gratis
- Daarna Stripe billing via `firestore-stripe-payments` extension
- Status veld op `tenants/{tenantId}.abonnementStatus`

## RBAC
Rollen: `owner`, `admin`, `member` (en `customer` voor portaal).
23 permissie-keys in `src/lib/permissions.ts`. Hook `usePermission()`. Firestore rules spiegelen de matrix.
Custom JWT claims: `{ tenantId, role }` — polling in TenantProvider tot claims propageren.

## Routing
| Route | Toegang |
|---|---|
| `/` | publiek — LandingPage |
| `/login` | gast — LoginPage |
| `/registreren` | gast — RegistrationWizard |
| `/wachtwoord-vergeten` | gast — ForgotPasswordPage |
| `/invite/:token` | gast — AcceptInvitePage |
| `/dashboard/*` | auth + role ≠ customer |
| `/portaal/*` | auth, role = customer |
| `/portal/:tenantId/:contactId` | publiek (gastklant) |

## Huidige openstaande bug
- Permission-denied op `RegistrationWizard.tsx:223` — [TODO: verificatie nodig, niet bevestigd in code]

## Wat werkend is
- Registratiewizard (5 stappen), tenant-isolatie
- Cloud Functions, Trigger Email, Firestore rules
- Modulaire toegangscontrole (ModuleGuard + UpgradeOverlay)
- CRM, Planning, Finance (offertes/facturen/PDF), Tickets, Hours, Tasks
- Inventarisbeheer (7 tabs), Kanban, Klantportaal, AI-assistent

## Wat nog gebouwd moet worden / in progress
- Stripe integratie (extension geïnstalleerd, koppeling nog afronden — Fase 12)
- IAM fix voor `setUserRole` Cloud Function
- Kwaliteitsronde, deploy-ready, observability (Fase 13)

## Git workflow
`main` → `develop` → `feature/[module]-[omschrijving]`

## Service-patroon
Elk service-bestand in `src/lib/*Service.ts` exporteert:
- `subscribeTo{X}(callback): () => void`
- `add{X}(data): Promise<string>`
- `update{X}(id, patch): Promise<void>`
- `delete{X}(id): Promise<void>`

## UI-primitives (hergebruiken)
`src/components/ui/`: `EditDialog`, `ConfirmDeleteDialog`, `DataTableToolbar`, `EntityPicker`
`src/components/auth/`: `ModuleGuard`, `UpgradeOverlay`, `RequireAuth`, `RequireGuest`, `RequireRole`
`src/lib/`: `useCollection(name, opts)`, `useResizableColumns`, `timeUtils`

## Conventies
- UI-teksten: **Nederlands** | Code-comments: **Engels**
- Geen `any`, geen inline prijzen, geen magic strings voor collecties
- Foutmeldingen altijd in NL
- Firestore rules wijzigen → test bijwerken in `firestore.rules.test.ts`
- UI-changes → dev-server starten en happy-path testen
