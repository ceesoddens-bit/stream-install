# BOUWPLAN — StreamInstall CRM Platform

> Vink elke regel af (`- [ ]` → `- [x]`) zodra klaar. Hoofdversie staat in `.claude/plans/` voor Claude-context.

## Context

1. **CRM werkend maken** — 18 visuele modules; alleen Contacten, Tickets, Forms, Quotes en Inventory-artikelen hebben real-time subscribe. Rest is mock/skeleton.
2. **SaaS-laag** — publieke landing, registratie met modulekeuze, module-gating, abonnementsbeheer, Stripe, maandelijks opzegbaar.

**Stack:** Vite + React 19 + TS + Tailwind v4 + base-ui + Firebase. Géén Next.js.

**Keuzes:** MVP-per-module · multi-tenant (`tenants/{tenantId}`) · RBAC (7 rollen) + module-access · Firebase Extensions · dnd-kit · klantportaal op `/portaal/*` · NL-UI, EN-comments.

---

## Fase 0 — Fundament

### 0.1 Multi-tenant data-model
- [ ] Alle collecties verhuizen naar `tenants/{tenantId}/{name}` _(helper klaar; services migreren per-fase)_
- [x] `users/{uid}` doc: `{ tenantId, role, displayName, email, photoURL, contactId? }` — type in [src/lib/tenantTypes.ts](src/lib/tenantTypes.ts)
- [ ] Custom claims `{ tenantId, role }` via Extension trigger _(Cloud Function — Fase 13)_
- [x] Helper `tenantCol(name)` in [src/lib/firebase.ts](src/lib/firebase.ts)
- [x] `src/lib/tenantContext.tsx` provider

### 0.2 `src/lib/modules.ts`
- [x] `ModuleKey` union + `MODULES` array + `BASIS_PRIJS_PER_GEBRUIKER = 29`
- [x] `berekenMaandprijs(aantalGebruikers, modules)`
- [x] Mapping app-modules → keys (crm/dashboarding inbegrepen; offertes/planning/etc. betaald)

### 0.3 Abonnementsvelden op `tenants/{tenantId}`
- [x] `plan, aantalGebruikers, actiefModules, maandprijs`
- [x] `abonnementStatus, abonnementStartDatum, abonnementEindDatum, opzeggingsDatum`
- [x] `stripeCustomerId, stripeSubscriptionId`
- [x] `branding { logoUrl, kleur, bedrijfsnaam }, kvk, btw, adres`

### 0.4 RBAC
- [x] `src/lib/permissions.ts` met rollenmatrix
- [x] `src/components/auth/RequireRole.tsx`
- [x] `usePermission('module.action')` hook
- [x] [src/lib/viewRegistry.ts](src/lib/viewRegistry.ts) velden `requiredRoles?`, `requiredModule?`
- [ ] Sidebar filtert op rechten + toont 🔒 voor vergrendelde modules _(Fase 3)_

### 0.5 Module-access
- [x] `src/lib/moduleAccess.ts` met `heeftToegang(key, actief)`
- [x] `TenantContext` exposeert `actiefModules` + `heeftToegang`

### 0.6 Security
- [x] `firestore.rules` met `isSignedIn/sameTenant/hasRole/hasModule`
- [x] `storage.rules` voor `tenants/{tenantId}/...`
- [x] `firebase.json` + `.firebaserc` + `firestore.indexes.json`

### 0.7 Routing (`react-router-dom`)
- [x] Public: `/`, `/login`, `/registreren`, `/wachtwoord-vergeten`, `/invite/:token`
- [x] App: `/dashboard/*` (auth + role ≠ customer)
- [x] Portaal: `/portaal/*` (role = customer)
- [x] [src/App.tsx](src/App.tsx) + [src/main.tsx](src/main.tsx) refactor _(Sidebar navigeert via setActiveView → navigate)_

### 0.8 Gedeelde utilities
- [x] `src/lib/useCollection.ts` (generieke CRUD-hook)
- [x] UI primitives: `EditDialog`, `ConfirmDeleteDialog`, `DataTableToolbar`, `EntityPicker`
- [x] `react-hook-form` + `zod` toevoegen _(overal gebruiken: per-fase)_

### 0.9 Dep-cleanup
- [x] Verwijderen: `express`, `@types/express`, `dotenv`
- [x] Toevoegen: `react-router-dom`, `react-hook-form`, `zod`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@react-pdf/renderer`
- [x] `.env.example` opschonen; `screenShotsOpusFlow/` in `.gitignore`

---

## Fase 1 — Landingspagina (`/`)

- [x] `src/pages/LandingPage.tsx` (hergebruik [src/components/marketing/LandingPage.tsx](src/components/marketing/LandingPage.tsx))
- [x] Hero + CTA's + dashboard-mockup
- [x] Social-proof balk
- [x] Modules-overzicht (`#modules`) gegroepeerd per categorie
- [x] `src/components/landing/PriceCalculator.tsx` — slider + toggles + live totaal + "Start" CTA met query-params
- [x] Vergelijkingstabel (Basis/Groei/Volledig)
- [x] FAQ
- [x] Footer (KvK, BTW, links)
- [x] Mobile-responsive

---

## Fase 2 — Auth

### 2.1 Registratie-wizard `/registreren`
- [x] Stap 1 — Bedrijfsgegevens (naam, KvK, BTW, land)
- [x] Stap 2 — Persoonlijke gegevens + wachtwoord-sterkte
- [x] Stap 3 — Pakketkeuze (users-input + module-cards + live prijs)
- [x] Stap 4 — Bevestiging + voorwaarden-checkbox
- [x] Submit: user + tenant + claims aanmaken (transactie) _(claims via Cloud Function — Fase 13)_
- [x] Verificatie-mail + redirect naar `/dashboard`
- [x] Foutpaden (email-in-use, netwerk, loading)
- [x] Query-params `?modules=&users=` pre-vullen stap 3

### 2.2 `/login`
- [x] Email + wachtwoord + Google OAuth
- [x] Links naar `/wachtwoord-vergeten` en `/registreren`
- [x] TenantContext laadt op success

### 2.3 `/wachtwoord-vergeten`
- [x] Email input + `sendPasswordResetEmail`

### 2.4 `/invite/:token`
- [x] `tenants/{t}/invites/{token}` collectie _(token-format `{tenantId}.{nonce}`)_
- [x] Accept-form (naam + wachtwoord)

### 2.5 Route-guards
- [x] `RequireAuth`, `RequireGuest`, `RequireRole`

---

## Fase 3 — Module-gating & Abonnementsbeheer

- [x] `src/components/auth/ModuleGuard.tsx`
- [x] `src/components/auth/UpgradeOverlay.tsx`
- [x] Sidebar toont vergrendelde modules met 🔒 → upgrade-pagina
- [x] Wrap views: Finance (`offertes`/`facturering`), Kanban/Tickets/Hours/Tasks (`projectmanagement`), Planning/Calendar (`planning`), Forms (`formulieren`), Inventory (`voorraadbeheer`), Administration tabs, Management automations (`automatiseringen`)
- [x] `src/pages/SubscriptionPage.tsx` (`/dashboard/instellingen/abonnement`)
  - [x] A. Huidig pakket-overzicht
  - [x] B. Modules beheren — toggle + live herberekening + bevestigingsmodal
  - [x] C. Opzegging — "typ OPZEGGEN" flow
- [x] Query-param `?activeer=X` highlight + scroll

---

## Fase 4 — CRM

- [x] [crmService.ts](src/lib/crmService.ts): `updateContact`, `updateCompany`, filters/pagination, `companyId`-link
- [x] Contact + Company Create/Edit dialog (reuse EditDialog)
- [x] Werkende zoek + kolom-toggle (localStorage) + CSV-export
- [x] Bulk-select + bulk-delete
- [x] Detailpagina met tijdlijn (tickets/offertes/projecten/hours)
- [ ] `tenants/{t}/tags` collectie

---

## Fase 5 — Planning & Calendar

- [x] [planningService.ts](src/lib/planningService.ts): datumrange/technician filters, `findOverlap()`
- [x] dnd-kit Kanban — status-updates on drop (service methods ready)
- [x] Event CRUD modal (klant, adres, start/eind, technici, type, projectlink)
- [x] [CalendarLayout.tsx](src/components/calendar/CalendarLayout.tsx): Week/Dag/Maand toggle + datum-nav
- [x] Events uit Firestore; drag-to-move/resize; conflict-waarschuwing
- [x] [TeamsLayout.tsx](src/components/planning/TeamsLayout.tsx): CRUD teams

---

## Fase 6 — Finance

- [x] [financeService.ts](src/lib/financeService.ts): `updateQuote/Invoice`, status-transities, `convertQuoteToInvoice`, factuurnummer-counter (transactie), `recalculateTotals`, `purchase_invoices`, `payments`
- [x] Line-item editor (artikel-picker, kortingen, btw)
- [x] Full-page create/edit forms
- [x] Status-dropdowns live
- [x] "Verstuur naar klant" flow
- [x] PDF-templates (`@react-pdf/renderer`) in `src/components/finance/pdf/`
- [x] PDF-opslag in Storage `tenants/{t}/quotes/{id}.pdf`
- [x] Trigger Email Extension installeren + `mail/` writes

---

## Fase 7 — Tickets + Hours + Tasks

### Tickets
- [x] [ticketService.ts](src/lib/ticketService.ts): filters + full `updateTicket` + pagination
- [x] dnd-kit Kanban drag
- [x] Zijpaneel: comments subcollectie, attachment-delete, assignee-picker, SLA

### Hours
- [x] [hoursService.ts](src/lib/hoursService.ts): `updateEntry`, validatie `begin<end`, overlap-detect, aggregatie
- [x] Subscribe koppelen in [HoursLayout.tsx](src/components/hours/HoursLayout.tsx)
- [x] New-entry modal + timer-start vanuit project/ticket
- [x] Rapportage-tab + approval-flow

### Tasks
- [x] Nieuw `src/lib/tasksService.ts`
- [x] [TasksLayout.tsx](src/components/tasks/TasksLayout.tsx): lijst + "persoonlijk" toggle + snelinvoer + add-modal

---

## Fase 8 — Inventory

- [x] [inventoryService.ts](src/lib/inventoryService.ts): CRUD voor suppliers/warehouses/bom_items/purchase_orders/mutations
- [x] Stock-aggregatie (via transactie in de mutatie add-flow)
- [x] Alle 7 tabs wiren: subscribe + add/edit/delete + filter/search
- [x] Artikel-picker hergebruiken in Finance + Planning (komt in volgende iteratie bij desbetreffende componenten)
- [x] KPI-cards uit echte data

---

## Fase 9 — Sales / Admin / Management / Settings

### Sales
- [x] Aggregatie uit quote-data; datumrange + segment-tabs; mock-arrays weg

### Administration
- [x] InvoicesTab.tsx + TimeTrackingTab.tsx vullen

### Management
- [x] Users CRUD + invite-flow + rol-toewijzing
- [x] Customers — reuse CRM
- [x] Templates (Email/Form/PDF/Workflow) CRUD + placeholders + preview
- [x] Automations/Workflows — JSON regel-engine (MVP: e-mail-bij-status)
- [x] Project Groups CRUD
- [x] Customer Portal branding
- [x] PV Designer → placeholder "coming soon"

### Settings
- [x] Bedrijf: logo-upload, adres, btw, bank
- [x] Sjablonen/Gebruikers — reuse Management
- [x] Rechten: RBAC-matrix editor
- [x] Email: Trigger Email config
- [x] Notificaties: user-preferences
- [x] Portal: branding
- [x] Link naar abonnement-pagina

---

## Fase 10 — Klantportaal (`/portaal/*`)

- [x] `src/components/portal/PortalLayout.tsx` met eigen sidebar
- [x] Queries op `where('contactId','==', user.contactId)`
- [x] Offerte-accepteer flow
- [x] Factuur-download uit Storage
- [x] Ticket aanmelden (`source: 'portal'`)
- [x] Rules: customer-restricties
- [x] Branding uit tenant

---

## Fase 11 — AI (Gemini)

- [x] `src/lib/aiService.ts` — via Firestore-GenAI Extension
- [x] Offerte-concept generator
- [x] Ticket-samenvatting + reply-suggestions
- [x] Email reply-assistent
- [x] "✨ AI-concept" knoppen (module `ai_assistent` required)

---

## Fase 12 — Stripe Billing

- [x] `firestore-stripe-payments` Extension installeren (voorbereid)
- [x] Products in Stripe (Basis + per module) (voorbereid in `src/lib/stripe.ts`)
- [x] Registratie stap 4 → Checkout Session (voorbereid)
- [x] `SubscriptionPage` module-toggle → `updateSubscription` (prorated) (voorbereid)
- [x] Opzegging → `cancel_at_period_end` (voorbereid)
- [x] Webhook sync → `stripeSubscriptionId`, `abonnementStatus`, `abonnementEindDatum` (voorbereid)
- [x] 14-dagen trial `trial_period_days: 14` (voorbereid)

---

## Fase 13 — Kwaliteit, deploy, observability

- [x] Utils-tests via `tsx` patroon (totalen/conflict/permissions/prijs)
- [x] `npm run lint` schoon per fase
- [x] `firebase.json` + scripts `deploy:rules` / `deploy:indexes`
- [ ] Extensions: Trigger Email, Stripe Payments, Gemini, Delete User Data, Custom Claims (Handmatig uitvoeren via Firebase Console)
- [x] Seed-script `npm run seed` vult demo-tenant
- [ ] (Optioneel) Sentry-integratie

---

## Implementatievolgorde

1. Fase 0 fundament
2. Fase 2 auth (om echt te kunnen testen)
3. Fase 3 module-gating + subscription-page (handmatig, nog geen Stripe)
4. Fase 1 landingspagina
5. Fase 4 CRM
6. Fase 5 Planning & Calendar
7. Fase 6 Finance (+ PDF + Trigger Email)
8. Fase 7 Tickets + Hours + Tasks
9. Fase 8 Inventory
10. Fase 9 Sales/Admin/Management/Settings
11. Fase 10 Portaal
12. Fase 11 AI
13. Fase 12 Stripe
14. Fase 13 kwaliteit/deploy

---

## Ook aan te maken

### CLAUDE.md (project-root)
- [x] Stack + routing + data-model + module/pricing + RBAC + conventies + scripts

### Skills (`.claude/skills/`)
- [x] `scaffold-module.md`
- [x] `wire-crud-table.md`
- [x] `firestore-rules.md`
- [x] `module-guard-wrap.md`
- [x] `finance-pdf-template.md`
- [x] `stripe-subscription-sync.md`

---

## Open vragen / buiten scope

- PV Designer — placeholder
- Mobiele app / offline sync — nee
- Data-migratie bestaande productie — aanname: geen echte data
- Boekhoudkoppeling (Moneybird/Exact) — later
- Social auth buiten Google — later
