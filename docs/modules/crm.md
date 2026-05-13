# CRM

## Status
Volledig gebouwd en werkend. Contacts en companies CRUD, detail-views met timeline, CSV-export, search/filter/tags.

## Firestore collecties
- `tenants/{tenantId}/companies` — bedrijven met type, status, kvk, vat, adres, tags
- `tenants/{tenantId}/contacts` — contactpersonen met companyId-koppeling, rol, status, tags, notities

## Services
- [src/lib/crmService.ts](../../src/lib/crmService.ts) — CRUD voor companies en contacts, `exportToCSV()`

## Componenten
- [src/components/crm/CRMModule.tsx](../../src/components/crm/CRMModule.tsx) — module entry point
- [src/components/crm/CRMDetailView.tsx](../../src/components/crm/CRMDetailView.tsx) — detail met timeline en gerelateerde entiteiten
- [src/components/crm/CRMEditDialogs.tsx](../../src/components/crm/CRMEditDialogs.tsx) — create/edit dialogs (contacts + companies)
- [src/components/crm/CompaniesLayout.tsx](../../src/components/crm/CompaniesLayout.tsx) — bedrijvenlijst
- [src/components/crm/CompaniesTable.tsx](../../src/components/crm/CompaniesTable.tsx) — tabel met CRUD
- [src/components/crm/ContactsLayout.tsx](../../src/components/crm/ContactsLayout.tsx) — contactenlijst
- [src/components/crm/ContactsTable.tsx](../../src/components/crm/ContactsTable.tsx) — tabel met CRUD
- [src/components/crm/ProjectDetail.tsx](../../src/components/crm/ProjectDetail.tsx) — project detail vanuit CRM-context

## Koppelingen met andere modules
- **Projectmanagement**: projecten refereren naar `contactId` en `companyId`
- **Offertes/Facturering**: quotes en invoices bevatten `contactId` + `companyId`
- **Planning**: planning_cards bevatten `clientName` (afgeleid van contact)
- **Tickets**: tickets bevatten optioneel `contactId`
- **Klantportaal**: contacts met `role=customer` krijgen toegang tot portaal
- **Hours**: hour-entries refereren naar projecten (die aan contacts hangen)

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig (lezen + schrijven + verwijderen) |
| admin | volledig |
| member | afhankelijk van `crm.view` permissie (standaard inbegrepen) |
| customer | geen toegang tot CRM-beheer |

Permissie-keys: `crm.view`, `crm.edit` (zie `src/lib/permissions.ts`)

## Module-toegang
`crm` is een **gratis** module — altijd inbegrepen, geen ModuleGuard nodig.

## Nog te bouwen
- [TODO: verificatie nodig] Bulk-import via CSV
- [TODO: verificatie nodig] E-mail integratie vanuit contact-detail
- [TODO: verificatie nodig] Activiteiten-log / timeline volledig uitgewerkt
