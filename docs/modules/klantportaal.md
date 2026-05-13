# Klantportaal

## Status
Volledig gebouwd. Klanten (role=customer) kunnen inloggen via `/portaal/*` of als gast via `/portal/:tenantId/:contactId`. Zien offertes, facturen en tickets. Offerte accepteren, factuur downloaden, ticket aanmaken/volgen.

## Firestore collecties
Portaal leest uit bestaande tenant-collecties — geen eigen portalcollecties:
- `tenants/{tenantId}/quotes` — offertes (klant ziet eigen; status-update bij accepteren)
- `tenants/{tenantId}/invoices` — facturen (klant ziet eigen; PDF downloaden)
- `tenants/{tenantId}/tickets` — tickets (klant ziet eigen; nieuw aanmaken)
- `tenants/{tenantId}/contacts` — contact-profiel voor portaal-instellingen
- `tenants/{tenantId}/settings` — [TODO: verificatie nodig] portal-layout/content instellingen

## Services
- Portaal hergebruikt `financeService.ts`, `ticketService.ts` — gefilterd op `contactId`
- [TODO: verificatie nodig] Dedicated portal-service voor gast-toegang zonder volledige auth

## Componenten
- [src/components/portal/PortalLayout.tsx](../../src/components/portal/PortalLayout.tsx) — portaal shell
- [src/components/portal/PortalHeader.tsx](../../src/components/portal/PortalHeader.tsx) — portaal header
- [src/components/portal/PortalSidebar.tsx](../../src/components/portal/PortalSidebar.tsx) — portaal navigatie
- [src/components/portal/PortalDashboard.tsx](../../src/components/portal/PortalDashboard.tsx) — portaal home
- [src/components/portal/PortalQuotes.tsx](../../src/components/portal/PortalQuotes.tsx) — offertes bekijken + accepteren
- [src/components/portal/PortalInvoices.tsx](../../src/components/portal/PortalInvoices.tsx) — facturen bekijken + PDF downloaden
- [src/components/portal/PortalTickets.tsx](../../src/components/portal/PortalTickets.tsx) — tickets aanmaken + volgen
- [src/components/portal/PortalSettings.tsx](../../src/components/portal/PortalSettings.tsx) — klantaccount instellingen
- [src/components/management/ManagementCustomerPortalView.tsx](../../src/components/management/ManagementCustomerPortalView.tsx) — portal layout + content beheer door tenant

## Koppelingen met andere modules
- **Offertes**: klant accepteert/weigert offerte → status-update in `quotes`
- **Facturering**: klant downloadt factuur PDF
- **Tickets**: klant maakt ticket aan → zichtbaar in Tickets-module voor medewerkers
- **CRM**: portaaltoegang is gekoppeld aan `contact` met `role=customer`

## Permissies
| Rol | Toegang |
|-----|---------|
| owner/admin/member | geen portaaltoegang (eigen dashboard) |
| customer | portaal via `/portaal/*` (alleen eigen data via contactId) |

Firestore rules: `isCustomer()` + `isOwnContact()` helper — klant ziet alleen eigen entiteiten.

## Module-toegang
Module-key: `klantportaal` — **betaald** (€15/gebruiker/maand)
De portaal-routes zelf zijn via Firestore rules beveiligd — klant heeft altijd `role=customer`.

## Nog te bouwen
- [TODO: verificatie nodig] Klant kan projectstatus volgen
- [TODO: verificatie nodig] Digitale handtekening op offertes
- [TODO: verificatie nodig] Stripe online betaling vanuit portaal-factuur
- [TODO: verificatie nodig] Notificaties bij nieuwe offerte/factuur (email via Trigger Email)
