# StreamInstall — Beknopte Claude Context

## Project
Modulair CRM/ERP SaaS voor installateurs/MKB. Multi-tenant via `tenants/{tenantId}`.

## Tech-stack
Vite + React 19 + TypeScript | Firebase (Auth, Firestore, Storage, Hosting) | react-router-dom v6
Tailwind CSS v4 | react-hook-form + zod | @dnd-kit | @react-pdf/renderer | Firebase Extensions

## Firestore
- Root: `tenants/{tenantId}`, `users/{uid}`, `mail/{id}`, `customers/{uid}`
- Tenant-scoped via `tenantCol(name)` — NOOIT rechtstreeks `collection(db, 'X')`
- Collecties: `companies`, `contacts`, `projects`, `quotes`, `invoices`, `tickets`, `hours`, `tasks`, `planning`, `inventory`, `suppliers`, `warehouses`, `form_templates`, `form_items`, `ai_requests`, `invites`, `settings`, en meer

## Prijsmodel
- Owner €29 | Admin €19 | Member €9 (per gebruiker/maand)
- Modules (per module × alle users): `offertes`/`projectmanagement`/`planning`/`facturering`/`klantportaal` = €15, `voorraadbeheer` = €15, `formulieren`/`documenten` = €10, `automatiseringen` = €20, `ai_assistent` = €20
- Gratis: `crm`, `dashboarding` | Berekening: `berekenMaandprijs()` in `src/lib/modules.ts`

## RBAC
Rollen: `owner` > `admin` > `member` > `customer` | 23 permissies in `src/lib/permissions.ts`
Custom JWT claims `{ tenantId, role }` | Hook: `usePermission()` | Guard: `<ModuleGuard>`

## Routing
`/` landing | `/login` `/registreren` `/wachtwoord-vergeten` `/invite/:token` (gast)
`/dashboard/*` (auth, niet-customer) | `/portaal/*` (customer)

## Service-patroon
`src/lib/*Service.ts` exporteert: `subscribeTo*()`, `add*()`, `update*()`, `delete*()`

## UI-primitives
`src/components/ui/`: `EditDialog`, `ConfirmDeleteDialog`, `DataTableToolbar`, `EntityPicker`
`src/components/auth/`: `ModuleGuard`, `UpgradeOverlay`, `RequireAuth`, `RequireRole`
`src/lib/`: `useCollection(name, opts)`, `useResizableColumns`

## Status (2026-05-04)
Werkend: Fases 0–11 (CRM, Planning, Finance, Tickets, Inventory, Portal, AI)
In progress: Fase 12 (Stripe), Fase 13 (Kwaliteit + Deploy)

## Conventies
UI: Nederlands | Comments: Engels | Geen `any` | Geen inline prijzen | Conventional commits
Zie `docs/CLAUDE_CONTEXT.md` voor volledig overzicht | Zie `CLAUDE.md` voor projectinstructies
