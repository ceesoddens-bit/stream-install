# Automatiseringen

## Status
Gedeeltelijk gebouwd. Management-views voor automation-designer, email-templates en workflows aanwezig als UI-scaffolding. Daadwerkelijke trigger/actie-uitvoering [TODO: verificatie nodig].

## Firestore collecties
- [TODO: verificatie nodig] Geen eigen collectie gevonden — automations mogelijk opgeslagen in `settings` of nog niet geïmplementeerd
- `mail/{id}` (root) — Trigger Email Extension queue — handmatig aanmaken volstaat voor eenvoudige automatiseringen

## Services
- [TODO: verificatie nodig] Geen dedicated `automationsService.ts` gevonden

## Componenten
- [src/components/management/ManagementAutomationView.tsx](../../src/components/management/ManagementAutomationView.tsx) — volledige automation designer UI
- [src/components/management/ManagementAutomationLiteView.tsx](../../src/components/management/ManagementAutomationLiteView.tsx) — vereenvoudigde automation UI
- [src/components/management/ManagementAutomationEmailView.tsx](../../src/components/management/ManagementAutomationEmailView.tsx) — email-automatisering templates
- [src/components/management/ManagementEmailTemplatesView.tsx](../../src/components/management/ManagementEmailTemplatesView.tsx) — e-mail template beheer
- [src/components/management/ManagementWorkflowsView.tsx](../../src/components/management/ManagementWorkflowsView.tsx) — workflow designer

## Koppelingen met andere modules
- **Facturering**: automatische betalingsherinnering bij verlopen factuur
- **Offertes**: automatisch e-mail bij nieuwe offerte
- **Tickets**: automatisch toewijzen bij aanmaken
- **Planning**: notificatie bij nieuwe planningsregel voor technician
- **CRM**: welkomsmail bij nieuwe contact/klant
- Alle integraties via `mail/{id}` (Trigger Email Extension)

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig (aanmaken + beheren automations) |
| admin | volledig |
| member | geen toegang tot automation-beheer |
| customer | geen toegang |

## Module-toegang
Module-key: `automatiseringen` — **betaald** (€20/gebruiker/maand)
Wrap views met `<ModuleGuard module="automatiseringen">`.

## Nog te bouwen
- Trigger/actie-engine implementeren (bijv. "bij status X → stuur e-mail Y")
- Koppeling tussen UI-designer en daadwerkelijke Firestore-writes naar `mail/{id}`
- [TODO: verificatie nodig] Cloud Functions voor complexe workflows
- Conditie-logica in workflow-steps
- Test-run functionaliteit voor automations
