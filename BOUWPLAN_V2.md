# BOUWPLAN v2 — StreamInstall afmaken

## Context

Bouwplan v1 is doorlopen: routing, auth, TenantContext, RBAC-matrix, UI-primitives, Firestore rules, klantportaal en de meeste services staan. Bij analyse blijkt echter dat een flink deel **niet werkend gekoppeld** is: Stripe-checkout is een stub, custom claims worden nooit server-side gezet (rules verwachten ze wél), PDF-templates ontbreken volledig, ModuleGuard is maar op 3 plekken toegepast, en meerdere tabellen (Inventory, Tasks, Sales-quotes-flow, Management-subviews, Portal-edits) hebben UI zonder CRUD-koppeling.

Doel van v2: het systeem naar een **productie-klaar, betalend, demo-bare** staat brengen.

Prioriteit: **productie-kritisch eerst** — claims, betaling, module-gating, PDF, resterende CRUD. Custom claims via Firebase Extension. PDF MVP: offerte, factuur, herinnering, orderbevestiging. Incl. seed + rules-tests.

---

## Fase 1 — Security fundament (BLOCKER)

Zonder server-side claims werken Firestore rules niet betrouwbaar.

- [ ] Firebase Extension voor custom claims installeren & configureren (triggert bij `users/{uid}`, zet `tenantId` + `role` als token claims)
- [ ] `firebase.json` aangepast, extension-config gecommit
- [ ] `auth.currentUser.getIdToken(true)` in `tenantContext.tsx` na user-doc wijziging
- [ ] `firestore.rules.test.ts` — emulator-tests voor tenant-isolatie, role-matrix, module-gating, portal-access (`@firebase/rules-unit-testing`)
- [ ] `firestore.indexes.json` gecontroleerd voor composite queries (hours, planning, invoices status+date, etc.)
- [ ] Script `npm run test:rules` toegevoegd

Files: `firestore.rules`, `src/lib/tenantContext.tsx`, `src/lib/firebase.ts`

---

## Fase 2 — Stripe werkend maken

- [ ] Firebase Extension `firestore-stripe-payments` volledig geconfigureerd (products, prices, webhook secret)
- [ ] Echte Stripe Price IDs in `src/lib/stripe.ts` — per module + basisprijs, per user/maand
- [ ] `createCheckoutSession` via extension → `customers/{uid}/checkout_sessions` → listen → redirect
- [ ] `SubscriptionPage`: werkende module-toggles die subscription-items updaten
- [ ] Webhook-sync geactiveerd in `tenantContext.tsx` (schrijft `actiefModules` + `aantalGebruikers` naar `tenants/{tenantId}`)
- [ ] Opzeggen/pauzeren-flow + empty-state voor niet-betalers
- [ ] Trial-periode (14 dagen) bij registratie via `trial_period_days`

Files: `src/pages/SubscriptionPage.tsx`, `src/lib/stripe.ts`, `src/lib/tenantContext.tsx`
Skill: `stripe-subscription-sync`

---

## Fase 3 — ModuleGuard overal toepassen

- [ ] `offertes` → QuotesLayout, SalesLayout
- [ ] `facturering` → InvoicesTable, FinanceLayout
- [ ] `projectmanagement` → ProjectsLayout
- [ ] `planning` → PlannerView, PlanningListLayout, TeamsLayout
- [ ] `voorraadbeheer` → InventoryLayout + alle tabs
- [ ] `formulieren` → FormsLayout
- [ ] `documenten` → relevante views
- [ ] `automatiseringen` → ManagementAutomationView
- [ ] `klantportaal` → PortalLayout owner-kant
- [ ] `ai_assistent` → relevante views
- [ ] Sidebar toont 🔒 voor vergrendelde modules → click → `/dashboard/instellingen/abonnement?activeer={key}`

Files: `src/components/auth/ModuleGuard.tsx`, `src/components/auth/UpgradeOverlay.tsx`, `src/components/layout/Sidebar.tsx`
Skill: `module-guard-wrap`

---

## Fase 4 — PDF-templates (MVP)

- [ ] Shared layout: header met tenant-branding (logo, kleur, NAW), footer met btw/KvK, line-items tabel, totalen incl. btw-split
- [ ] **OfferteTemplate** — "Verzenden" → PDF → Firebase Storage → `mail/` queue
- [ ] **FactuurTemplate** — idem
- [ ] **BetalingsherinneringTemplate** — reminder met originele factuurref + vervaldag
- [ ] **OrderbevestigingTemplate** — na accept quote of manual trigger
- [ ] Storage-rules: tenant-isolatie + portal-read voor eigen docs
- [ ] Download-knop + preview-modal in UI

Files: nieuwe `src/lib/pdf/*Template.tsx`, `src/lib/financeService.ts`, `storage.rules`
Skill: `finance-pdf-template`

---

## Fase 5 — CRUD-gaps dichten

### Inventory
- [ ] BOMTable — add/edit/delete dialogs + EntityPicker artikelen
- [ ] PurchaseOrdersTable — dialogs + status-workflow (concept → besteld → ontvangen)
- [ ] SuppliersTable — CRUD dialogs
- [ ] WarehousesTable — CRUD dialogs
- [ ] MutationsTable — create-form (inkomend/uitgaand/correctie) + auto-update stock
- [ ] StockOverviewTable — recompute-trigger bij mutation
- [ ] ArticlesTable nieuw — lookup voor BOM/PO

### Tasks
- [ ] TasksLayout — dialogs + assign-to-user + link-to-project

### Sales
- [ ] QuotesLayout — complete edit-flow: line-items editor, korting, btw, status-transitions
- [ ] "Converteer naar factuur"-actie

### Projects
- [ ] Volledige CRUD UI
- [ ] Project-detail view met tabs (info, uren, tickets, taken, documenten)

### Forms
- [ ] FormsLayout — CRUD + form-renderer voor submissions
- [ ] Form-template builder (of JSON-editor als MVP)

### Management-subviews
- [ ] ProjectGroupsView — CRUD dialogs
- [ ] ManagementAutomationView — CRUD + rule-executor
- [ ] CustomerPortalView — configuratie welke modules portal toont
- [ ] Dedupliceer `ManagementCustomersView` vs CRM

### Portal
- [ ] Offerte-accept → schrijft status + triggert orderbevestiging-mail
- [ ] Factuur-download via storage-url
- [ ] Ticket-create form voor klant

Skill: `wire-crud-table`, `scaffold-module`

---

## Fase 6 — Email (Trigger Email extension)

- [ ] `src/lib/mailService.ts` — schrijft naar `mail/` collectie
- [ ] Email-templates in Firestore `settings/emailTemplates/*` via bestaande `ManagementEmailTemplatesView`
- [ ] Triggers: invite-send, quote-verzenden, factuur-verzenden, herinnering, ticket-reply, password-reset-custom
- [ ] Tenant-branding in email-header (logo + kleur)
- [ ] NL-kopij + verpakte errors

Files: nieuwe `src/lib/mailService.ts`, `src/components/management/ManagementEmailTemplatesView.tsx`

---

## Fase 7 — Seed + DX

- [ ] `src/scripts/firebaseSeeder.ts` — 1 demo-tenant: 2 companies, 5 contacts, 3 projects, 10 hours, 5 tickets, 2 quotes, 3 invoices, voorbeeld-users per rol
- [ ] `npm run seed` draaiend
- [ ] Optioneel: `npm run reset` — clear demo-tenant
- [ ] Demo-credentials in README

---

## Fase 8 — Polish & release

- [ ] Alle foutmeldingen NL, Firebase/Stripe errors verpakt
- [ ] Loading-skeletons ipv spinners in tabellen
- [ ] Empty-states per tabel met CTA
- [ ] `npm run lint` schoon (geen `any`)
- [ ] Smoke-test: login → module activeren → quote → PDF → invoice → betalen → ticket → portal-view
- [ ] Firebase hosting deploy + rules deploy via `npm run deploy`
- [ ] README updaten met Firebase Extensions setup-stappen

Skill: `simplify`, `security-review`

---

## Verificatie per fase

1. **Fase 1**: `npm run test:rules` groen. Login, check `idToken.claims.tenantId` in DevTools.
2. **Fase 2**: SubscriptionPage → activeer module → Stripe test-kaart → `tenants/{id}.actiefModules` bevat module → view toegankelijk.
3. **Fase 3**: Deactiveer module → view toont `UpgradeOverlay` → sidebar toont 🔒.
4. **Fase 4**: Quote verzenden → Storage-upload + `mail/` entry → PDF opent correct.
5. **Fase 5**: Per module: create → edit → delete werkt, search/filter/column-toggle actief, ConfirmDeleteDialog bevestigt.
6. **Fase 6**: Invite user → ontvang email → accept-link werkt.
7. **Fase 7**: `npm run seed` → demo-user login → alle modules tonen data.
8. **Fase 8**: Volledige smoke-test op staging.

---

## Setup Checklist (Handmatige acties)

### Firebase Console
- [ ] **Extension: Custom Claims** (`firebasehosting/custom-claims`)
  - Trigger: `users/{uid}`
  - Claims: `tenantId`, `role`
- [ ] **Extension: Stripe Payments** (`firestore-stripe-payments`)
  - Sync products/prices naar Firestore.
  - Webhook secret configureren.
- [ ] **Extension: Trigger Email** (`firebase/trigger-mail`)
  - Collection: `mail`
- [ ] **Firestore Indexes**: Deployen via `npm run deploy:rules`.
- [ ] **Storage Rules**: Deployen via `npm run deploy:rules`.

### Stripe Dashboard
- [ ] Product: **StreamInstall Basis** (€29/user/mnd).
- [ ] Producten voor elke module (€10-€20/user/mnd).
- [ ] Price IDs kopiëren naar `src/lib/stripe.ts`.
- [ ] Webhook endpoint toevoegen (wijst naar Firebase Extension URL).

### Lokaal / Dev
- [ ] **Java JRE/JDK**: Installeren om `npm run test:rules` (Firebase Emulator) te kunnen draaien.
- [ ] **Environment variables**: Controleer `.env` voor alle `VITE_FIREBASE_*` keys.
