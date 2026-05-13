# Offertes

## Status
Volledig gebouwd. Offertes aanmaken, bewerken, verwijderen, PDF-generatie, statusbeheer. Automatisch offertenummer via `counters`. Klant kan offerte accepteren via portaal.

## Firestore collecties
- `tenants/{tenantId}/quotes` — offertes: contactId, projectId, sentDate, status, regelitems, btw, totalen
- `tenants/{tenantId}/counters` — automatisch oplopend offertenummer (gedeeld met facturering)

## Services
- [src/lib/financeService.ts](../../src/lib/financeService.ts) — CRUD voor quotes (gedeelde service met facturering); `subscribeToQuotes()`, `addQuote()`, `updateQuote()`, `deleteQuote()`

## Componenten
- [src/components/finance/FinanceLayout.tsx](../../src/components/finance/FinanceLayout.tsx) — finance tabs (inclusief Offertes tab)
- [src/components/finance/FinanceEditDialogs.tsx](../../src/components/finance/FinanceEditDialogs.tsx) — create/edit dialogs voor offertes
- [src/components/finance/QuotesLayout.tsx](../../src/components/finance/QuotesLayout.tsx) — offertelijst
- [src/components/finance/QuotesTable.tsx](../../src/components/finance/QuotesTable.tsx) — offerte tabel
- [src/components/pdf/QuoteTemplate.tsx](../../src/components/pdf/QuoteTemplate.tsx) — PDF template voor offertes
- [src/components/pdf/OrderConfirmationTemplate.tsx](../../src/components/pdf/OrderConfirmationTemplate.tsx) — orderbevestiging PDF
- [src/components/pdf/PDFBase.tsx](../../src/components/pdf/PDFBase.tsx) — basis PDF layout met tenant-branding

## Koppelingen met andere modules
- **CRM**: offertes linken naar `contactId` + optioneel `companyId`
- **Projectmanagement**: offertes linken naar `projectId`
- **Facturering**: geaccepteerde offerte kan worden omgezet naar factuur
- **Klantportaal**: klant ontvangt offerte-link, kan accepteren/weigeren via portaal
- **AI-assistent**: AI kan offerteteksten genereren (type: `quote`)
- **Voorraadbeheer**: offerteregels kunnen artikelen uit inventory bevatten

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | `offertes.view` + optioneel `offertes.edit` |
| customer | eigen offertes via portaal (lezen + accepteren) |

Permissie-keys: `offertes.view`, `offertes.edit`, `offertes.delete`, `offertes.verstuur`

## Module-toegang
Module-key: `offertes` — **betaald** (€15/gebruiker/maand)
Wrap views met `<ModuleGuard module="offertes">`.

## Nog te bouwen
- [TODO: verificatie nodig] E-mail verzenden via Trigger Email bij offerte versturen
- [TODO: verificatie nodig] Digitale handtekening bij accepteren
- [TODO: verificatie nodig] Offerte-versie beheer (revisies)
