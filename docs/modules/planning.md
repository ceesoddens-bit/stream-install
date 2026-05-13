# Planning

## Status
Volledig gebouwd. Drag-drop planner, week/dag/maand kalender, planning-lijst, team/technician beheer, overlap-detectie.

## Firestore collecties
- `tenants/{tenantId}/planning` — planningsregels per technician/datum: projectId, projectName, technician, date, startTime, endTime, status (Ingepland/Onderweg/Bezig/Afgerond), type (Service/Installatie/Onderhoud)
- `tenants/{tenantId}/planning_cards` — Kanban-kaarten voor de planner: projectRef, clientName, address, amount, status, projectType, clientType, accountManager, installGroup, productTags, imageUrl
- `tenants/{tenantId}/teams` — team-definities
- `tenants/{tenantId}/technicians` — technici met naam, email, telefoon, kleurcode, status (Actief/Inactief)

## Services
- [src/lib/planningService.ts](../../src/lib/planningService.ts) — CRUD voor planning-entries en planning_cards, `findOverlap(technician, date, startTime, endTime)`
- [src/lib/teamService.ts](../../src/lib/teamService.ts) — CRUD voor technicians

## Componenten
- [src/components/planning/PlannerView.tsx](../../src/components/planning/PlannerView.tsx) — drag-drop planner (dnd-kit)
- [src/components/planning/PlanningListLayout.tsx](../../src/components/planning/PlanningListLayout.tsx) — planning als lijst
- [src/components/planning/PlanningDialogs.tsx](../../src/components/planning/PlanningDialogs.tsx) — create/edit dialogs voor planningsregels
- [src/components/planning/TeamsLayout.tsx](../../src/components/planning/TeamsLayout.tsx) — team/technician beheer
- [src/components/calendar/CalendarLayout.tsx](../../src/components/calendar/CalendarLayout.tsx) — week/dag/maand kalender view

## Koppelingen met andere modules
- **Projectmanagement**: planningsregels bevatten `projectId` + `projectName`
- **CRM**: `clientName`, `contactMobile` in planning-entries afgeleid van contact
- **Formulieren**: `planningsregel` veld in form_items koppelt formulier aan planningsregel
- **Hours**: technicians die ingepland zijn koppelen aan hun hour-entries via userId
- **Voorraadbeheer**: BOM-items bevatten `plannedDate` en `planningStatus`
- **Tickets**: [TODO: verificatie nodig] koppeling ticket → planningsregel

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | `planning.view` (standaard) + `planning.edit` indien toegewezen |
| customer | geen directe toegang |

Permissie-keys: `planning.view`, `planning.edit`

## Module-toegang
Module-key: `planning` — **betaald** (€15/gebruiker/maand)
Wrap views met `<ModuleGuard module="planning">`.

## Nog te bouwen
- [TODO: verificatie nodig] SMS/push notificatie bij nieuwe planning aan technician
- [TODO: verificatie nodig] Route-optimalisatie voor technici
- [TODO: verificatie nodig] Recurring planning-entries
