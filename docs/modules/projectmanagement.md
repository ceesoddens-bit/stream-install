# Projectmanagement

## Status
Volledig gebouwd. Kanban-bord met drag-drop, project detail view, project groups, statusbeheer en voortgang.

## Firestore collecties
- `tenants/{tenantId}/projects` — projecten met naam, klant, status, progress, deadline, team, prioriteit
- `tenants/{tenantId}/project_groups` — project-groepen voor categorisering
- `tenants/{tenantId}/planning_cards` — Kanban-kaarten gekoppeld aan projecten (projectRef, clientName, amount, status, productTags)

## Services
- [src/lib/projectService.ts](../../src/lib/projectService.ts) — CRUD voor projects
- [src/lib/projectGroupService.ts](../../src/lib/projectGroupService.ts) — CRUD voor project groups

## Componenten
- [src/components/kanban/KanbanBoard.tsx](../../src/components/kanban/KanbanBoard.tsx) — drag-drop Kanban bord (dnd-kit)
- [src/components/kanban/ProjectCard.tsx](../../src/components/kanban/ProjectCard.tsx) — Kanban kaartcomponent
- [src/components/kanban/ProjectAddDialog.tsx](../../src/components/kanban/ProjectAddDialog.tsx) — project aanmaken dialog
- [src/components/crm/ProjectDetail.tsx](../../src/components/crm/ProjectDetail.tsx) — project detail view
- [src/components/management/ManagementProjectGroupsView.tsx](../../src/components/management/ManagementProjectGroupsView.tsx) — project group beheer

## Koppelingen met andere modules
- **CRM**: projecten hangen aan `contactId` (contact) en optioneel `companyId`
- **Planning**: planning-entries refereren naar `projectId` + `projectName`
- **Offertes/Facturering**: quotes en invoices linken naar `projectId`
- **Hours**: hour-entries bevatten `project` veld (naam)
- **Tasks**: tasks bevatten `projectId`
- **Tickets**: tickets bevatten optioneel `projectId`
- **Voorraadbeheer**: BOM-items bevatten `projectName` en `projectStatus`

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | `projecten.view` (standaard) + `projecten.edit` indien toegewezen |
| customer | geen directe toegang (ziet projectstatus via portaal) |

Permissie-keys: `projecten.view`, `projecten.edit`, `projecten.delete`

## Module-toegang
Module-key: `projectmanagement` — **betaald** (€15/gebruiker/maand)
Wrap views met `<ModuleGuard module="projectmanagement">`.

## Nog te bouwen
- [TODO: verificatie nodig] Gantt-chart view
- [TODO: verificatie nodig] Team-toewijzing vanuit project detail
- [TODO: verificatie nodig] Projectbudget tracking vs gefactureerd bedrag
