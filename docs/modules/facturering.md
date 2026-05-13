# Facturering

## Status
Volledig gebouwd. Facturen aanmaken, bewerken, verwijderen, PDF-generatie, statusbeheer (Concept/Verzonden/Betaald/Verlopen). Automatisch factuurnummer via `counters`-collectie.

## Firestore collecties
- `tenants/{tenantId}/invoices` — facturen: id (autonum), contactId, projectId, date, status (Concept/Verzonden/Betaald/Verlopen), regelitems, btw, totalen
- `tenants/{tenantId}/purchase_invoices` — inkomende facturen van leveranciers
- `tenants/{tenantId}/payments` — betalingsregistraties gekoppeld aan factuur
- `tenants/{tenantId}/counters` — automatisch oplopend factuurnummer

## Services
- [src/lib/financeService.ts](../../src/lib/financeService.ts) — CRUD voor invoices, quotes, purchase_invoices; filter op contactId/projectId

## Componenten
- [src/components/finance/FinanceLayout.tsx](../../src/components/finance/FinanceLayout.tsx) — finance module entry (tabs: Facturen, Offertes, Inkoopfacturen)
- [src/components/finance/FinanceEditDialogs.tsx](../../src/components/finance/FinanceEditDialogs.tsx) — create/edit dialogs
- [src/components/finance/InvoicesTable.tsx](../../src/components/finance/InvoicesTable.tsx) — facturentabel
- [src/components/administration/invoices/InvoicesTab.tsx](../../src/components/administration/invoices/InvoicesTab.tsx) — administratie-view voor facturen
- [src/components/administration/invoices/InvoicesTable.tsx](../../src/components/administration/invoices/InvoicesTable.tsx) — tabel in administratie-context
- [src/components/administration/invoices/utils.ts](../../src/components/administration/invoices/utils.ts) — totalen/btw berekeningen
- [src/components/pdf/InvoiceTemplate.tsx](../../src/components/pdf/InvoiceTemplate.tsx) — PDF template voor facturen
- [src/components/pdf/PaymentReminderTemplate.tsx](../../src/components/pdf/PaymentReminderTemplate.tsx) — betalingsherinnering PDF

## Koppelingen met andere modules
- **CRM**: facturen linken naar `contactId` (contact) en optioneel `companyId`
- **Projectmanagement**: facturen linken naar `projectId`
- **Offertes**: offerte kan worden omgezet naar factuur
- **Klantportaal**: klanten zien hun facturen en kunnen PDF downloaden via portaal
- **Dashboarding**: openstaande facturen / omzet widgets

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | `facturen.view` + optioneel `facturen.edit` |
| customer | alleen eigen facturen via portaal |

Permissie-keys: `facturen.view`, `facturen.edit`, `facturen.delete`, `facturen.verstuur`

## Module-toegang
Module-key: `facturering` — **betaald** (€15/gebruiker/maand)
Wrap views met `<ModuleGuard module="facturering">`.

## Nog te bouwen
- Stripe payment-link integratie voor online betalen (Fase 12)
- [TODO: verificatie nodig] Automatische betalingsherinnering via Trigger Email
- [TODO: verificatie nodig] Boekhoudkoppeling (e-boekhouden/Exact/Twinfield)
- [TODO: verificatie nodig] Terugkerende facturen
