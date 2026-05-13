# Dashboarding

## Status
Volledig gebouwd. Dashboard met widgets: kalender, urenregistratie + timer, projecten-overzicht, tickets-overzicht. Interactieve timer gesynchroniseerd via Firestore (realtime, multi-device).

## Firestore collecties
- `tenants/{tenantId}/settings/global_timer` — timer-state: isRunning, startTime, baseSeconds (realtime sync voor sidebar-timer)
- Widgets lezen uit: `projects`, `tickets`, `hours`, `planning` — bestaande collecties, geen dashboarding-eigen data

## Services
- [src/lib/stateService.ts](../../src/lib/stateService.ts) — timer-state: `subscribeToTimer()`, `updateTimer()`, `toggleTimer()`, `resetTimer()`
- Widgets gebruiken `useCollection()` hook direct of via eigen service-subscriptions

## Componenten
- [src/components/dashboard/Dashboard.tsx](../../src/components/dashboard/Dashboard.tsx) — hoofd-dashboard grid met widgets
- [src/components/dashboard/CalendarWidget.tsx](../../src/components/dashboard/CalendarWidget.tsx) — mini kalender widget
- [src/components/dashboard/HoursWidget.tsx](../../src/components/dashboard/HoursWidget.tsx) — tijdregistratie widget met timer controls
- [src/components/dashboard/ProjectsWidget.tsx](../../src/components/dashboard/ProjectsWidget.tsx) — projecten-overzicht widget
- [src/components/dashboard/TicketsWidget.tsx](../../src/components/dashboard/TicketsWidget.tsx) — tickets-overzicht widget
- [src/components/layout/Sidebar.tsx](../../src/components/layout/Sidebar.tsx) — sidebar met globale timer + AI-chat toggle
- [src/components/sales/SalesLayout.tsx](../../src/components/sales/SalesLayout.tsx) — sales dashboard (geaggregeerde offertes/facturen)
- [src/components/management/ManagementDashboardView.tsx](../../src/components/management/ManagementDashboardView.tsx) — management rapportage dashboard

## Koppelingen met andere modules
- **Alle modules**: dashboard is een aggregator — leest uit `projects`, `tickets`, `hours`, `planning`, `quotes`, `invoices`
- **Hours**: timer in sidebar schrijft naar `settings/global_timer`; HoursWidget toont dagelijkse uren
- **Tickets**: TicketsWidget toont openstaande tickets
- **Projectmanagement**: ProjectsWidget toont actieve projecten
- **Facturering/Offertes**: SalesLayout toont omzet, openstaand, gefactureerd

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig dashboard + management-dashboard + sales-dashboard |
| admin | volledig dashboard + management-dashboard |
| member | eigen dashboard (gefilterd op eigen data waar van toepassing) |
| customer | portaal-dashboard (PortalDashboard — apart van dit dashboard) |

## Module-toegang
Module-key: `dashboarding` — **gratis**, altijd inbegrepen.
Geen ModuleGuard nodig voor basis-dashboard.

## Nog te bouwen
- [TODO: verificatie nodig] Configureerbaar dashboard (widgets verslepen/verbergen)
- [TODO: verificatie nodig] Omzet-grafiek per maand/kwartaal
- [TODO: verificatie nodig] KPI-doelen instellen en voortgang tonen
- Rapportage-export (PDF/CSV) vanuit management-dashboard
