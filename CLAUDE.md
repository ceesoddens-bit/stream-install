# StreamInstall — Claude context

## Project
Modulair CRM/ERP SaaS platform voor installateurs/MKB. Multi-tenant via `tenants/{tenantId}`. Gebruikers kopen modules per gebruiker per maand bovenop een basisprijs. Zie [BOUWPLAN.md](./BOUWPLAN.md) voor de volledige roadmap met afvinkbare checklist.

## Tech-stack (belangrijk: géén Next.js)
- **Vite** + React 19 + TypeScript
- Tailwind CSS v4 + `@base-ui/react` (geen shadcn install script, wel shadcn-stijl)
- **`react-router-dom` v6** voor routing (niet Next App Router)
- Firebase Auth + Firestore + Storage (géén eigen backend-server — `express` in package.json is dead weight, verwijderen)
- Firebase Extensions: Trigger Email, Stripe Payments (`firestore-stripe-payments`), Gemini, Delete User Data, Custom Claims
- **`@dnd-kit/core`** + `@dnd-kit/sortable` voor Kanban drag-drop
- **`react-hook-form` + `zod`** voor alle forms
- **`@react-pdf/renderer`** voor PDF-generatie (offertes/facturen)

## Taal
- **UI-teksten: Nederlands**
- **Code-comments: Engels**, alleen bij niet-triviaal WAAROM
- Commits: Nederlands OK, conventional-commits prefix (feat/fix/chore/refactor)

## Data-model

### Root collecties
- `tenants/{tenantId}` — organisatie-document + abonnementsvelden
- `users/{uid}` — `{ tenantId, role, displayName, email, photoURL, contactId? }`
- `mail/{id}` — Trigger Email Extension queue
- `customers/{uid}` + subcollecties — Stripe Payments Extension

### Tenant-scoped (onder `tenants/{tenantId}/...`)
`companies`, `contacts`, `projects`, `project_groups`, `quotes`, `invoices`, `purchase_invoices`, `payments`, `tickets`, `tickets/{id}/comments`, `hours`, `tasks`, `planning`, `planning_cards`, `teams`, `inventory`, `suppliers`, `warehouses`, `bom_items`, `purchase_orders`, `mutations`, `stock_overview`, `form_templates`, `form_items`, `settings`, `tags`, `invites`, `counters`.

**Alle writes gaan via `tenantCol(name)` helper in `src/lib/firebase.ts` — nooit rechtstreeks `collection(db, 'X')`.**

## Modules & pricing

Bron van waarheid: `src/lib/modules.ts`.
- Basisprijs: **€29/gebruiker/maand**
- Altijd inbegrepen: `crm`, `dashboarding`
- Betaalde modules: `offertes` (€15), `projectmanagement` (€15), `planning` (€15), `facturering` (€15), `formulieren` (€10), `documenten` (€10), `voorraadbeheer` (€15), `automatiseringen` (€20), `klantportaal` (€15), `ai_assistent` (€20)
- Totaal per maand: `BASIS_PRIJS * users + Σ(moduleprijs * users)`

**Geen inline prijzen in UI — altijd via `berekenMaandprijs()` of `MODULES` array.**

### Module-toegang
`heeftToegang(moduleKey, tenant.actiefModules)` in `src/lib/moduleAccess.ts`. `TenantContext` exposeert `{ actiefModules, heeftToegang }`. Wrap alle betaalde-module-views met `<ModuleGuard module="...">`.

## RBAC

Rollen: `owner`, `admin`, `manager`, `technician`, `sales`, `finance`, `customer`.
Matrix in `src/lib/permissions.ts`. Hook `usePermission('module.action')`. Firestore rules spiegelen de matrix via `hasRole()` en `hasModule()` helpers. Custom claims op de Auth-user bevatten `{ tenantId, role }`.

**RBAC en module-access zijn orthogonaal:** iemand kan role=manager hebben maar de `offertes` module is niet geactiveerd → geen toegang.

## Routing

| Route | Toegang | Component |
|---|---|---|
| `/` | publiek | `LandingPage` |
| `/login` | gast | `LoginPage` |
| `/registreren` | gast | `RegistrationWizard` |
| `/wachtwoord-vergeten` | gast | `ForgotPasswordPage` |
| `/invite/:token` | gast | `AcceptInvitePage` |
| `/dashboard/*` | auth + role ≠ customer | huidige app-shell |
| `/dashboard/instellingen/abonnement` | owner/admin | `SubscriptionPage` |
| `/portaal/*` | role = customer | `PortalLayout` |

`RequireAuth`, `RequireGuest`, `RequireRole` in `src/components/auth/`. Oude `activeView` conditional rendering in `App.tsx` vervangen door router.

## Service-patroon

Elke service in `src/lib/*Service.ts` exporteert:
- `subscribeTo{X}(callback): () => void` — real-time listener met unsubscribe
- `add{X}(data): Promise<string>` — returnt docId
- `update{X}(id, patch): Promise<void>`
- `delete{X}(id): Promise<void>`

Referentie-implementaties: [src/lib/ticketService.ts](src/lib/ticketService.ts), [src/lib/crmService.ts](src/lib/crmService.ts).

**Nooit `collection(db, 'X')` rechtstreeks — altijd `tenantCol('X')`.**

## UI-primitives (hergebruiken, niet opnieuw bouwen)

In `src/components/ui/`:
- `EditDialog` — generieke create/edit modal met `react-hook-form` + `zod`
- `ConfirmDeleteDialog` — "typ X om te bevestigen" pattern voor destructieve acties
- `DataTableToolbar` — werkende search + filter + column-toggle (localStorage-persisted)
- `EntityPicker` — contact/company/project/artikel picker met search

In `src/components/auth/`:
- `ModuleGuard`, `UpgradeOverlay`, `RequireAuth`, `RequireGuest`, `RequireRole`

In `src/lib/`:
- `useCollection(name, opts)` — generieke Firestore-subscribe hook
- `useResizableColumns` — al aanwezig, in elke tabel gebruiken
- `timeUtils` — voor Hours-aggregaties
- [src/components/administration/invoices/utils.ts](src/components/administration/invoices/utils.ts) — totalen/btw voor Finance

## Forms & validatie

Altijd **`react-hook-form` + `zod`**. Schemas naast de form-component in `{ComponentName}.schema.ts`. Toon inline field-errors, nooit raw Firebase/Stripe-errors aan de gebruiker.

## Scripts

```bash
npm run dev          # Vite dev-server op :3000
npm run build        # production build
npm run lint         # tsc --noEmit (moet schoon per fase)
npm test             # tsx-based utils-tests
npm run seed         # seed demo-tenant (na Fase 13)
npm run deploy:rules # firebase deploy rules + indexes
```

## Conventies & do-nots

- Geen nieuwe deps zonder reden — check of bestaande volstaat
- Geen `any`; `unknown` + narrowing waar nodig
- Geen inline prijzen, magic strings voor collectie-namen, of hardcoded tenant-IDs
- Prefer editing > creating new files
- Toon vergrendelde modules in sidebar mét 🔒; klik → `/dashboard/instellingen/abonnement?activeer={key}`
- Foutmeldingen altijd in NL, verpak Firebase/Stripe-errors
- Service-functies zijn altijd tenant-scoped via `tenantCol()`
- Firestore rules wijzigen? Schrijf bijpassende test in `firestore.rules.test.ts`
- UI-changes? Start dev-server en test happy-path + 1-2 edge cases voordat je "klaar" rapporteert

## Skills

Project-specifieke skills leven in `.claude/skills/`. Aanroepen via de Skill-tool. Beschikbaar:
- `scaffold-module` — nieuwe CRM-module scaffolden
- `wire-crud-table` — visuele tabel koppelen aan Firestore-service
- `firestore-rules` — tenant-scoped rules schrijven
- `module-guard-wrap` — view wrappen met ModuleGuard
- `finance-pdf-template` — nieuwe PDF-template maken
- `stripe-subscription-sync` — Stripe-subscription bijwerken
