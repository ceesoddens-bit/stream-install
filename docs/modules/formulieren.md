# Formulieren

## Status
Gedeeltelijk gebouwd. Service en basis-layout aanwezig. Form templates (PUBLISHED/DRAFT) en form items koppelbaar aan planning en project. Volledige builder [TODO: verificatie nodig].

## Firestore collecties
- `tenants/{tenantId}/form_templates` — formulier-sjablonen: name, appliesToInstall (bool), appliesToService (bool), planningType, timestamps
- `tenants/{tenantId}/form_items` — ingevulde formulier-instanties: name, status (PUBLISHED/DRAFT), project, planningsregel, createdBy/updatedBy, timestamps

## Services
- [src/lib/formsService.ts](../../src/lib/formsService.ts) — CRUD voor form_templates en form_items
- [src/lib/templateService.ts](../../src/lib/templateService.ts) — [TODO: verificatie nodig] aanvullende template-logica

## Componenten
- [src/components/forms/FormsLayout.tsx](../../src/components/forms/FormsLayout.tsx) — module entry
- [src/components/management/ManagementFormTemplatesListView.tsx](../../src/components/management/ManagementFormTemplatesListView.tsx) — template beheer (management-sectie)
- [src/components/settings/FormTemplatesTable.tsx](../../src/components/settings/FormTemplatesTable.tsx) — template lijst in instellingen

## Koppelingen met andere modules
- **Planning**: `planningsregel` veld in form_items koppelt formulier aan een planningsregel
- **Projectmanagement**: `project` veld in form_items koppelt formulier aan een project
- **Klantportaal**: [TODO: verificatie nodig] klant kan formulier invullen via portaal

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig (templates + items) |
| admin | volledig |
| member | `formulieren.view` (standaard) + `formulieren.edit` indien toegewezen |
| customer | [TODO: verificatie nodig] |

Permissie-keys: `formulieren.view`, `formulieren.edit`

## Module-toegang
Module-key: `formulieren` — **betaald** (€10/gebruiker/maand)
Wrap views met `<ModuleGuard module="formulieren">`.

## Nog te bouwen
- Drag-drop formulier-builder (velden aanmaken, herordenen)
- Online invullen door technici op mobiel
- Automatisch formulier koppelen aan planning-type (appliesToInstall/appliesToService)
- Formulier resultaten exporteren (PDF/CSV)
- [TODO: verificatie nodig] Klantportaal integratie
