# Gebruikersbeheer

## Status
Volledig gebouwd. Gebruikers uitnodigen via e-mail (Cloud Function), rollen toewijzen (owner/admin/member), per-member permissies instellen, kostenimpact preview bij rol-wijziging. Invite-flow met token-validatie.

## Firestore collecties
- `users/{uid}` (root) — gebruikersdocumenten: tenantId, role, displayName, email, photoURL, contactId?, permissions (array van PermissionKey)
- `tenants/{tenantId}/invites` — uitnodigingen: email, role, permissions, token, tenantId, tenantNaam, createdAt, expiresAt, status (pending/accepted)
- `tenants/{tenantId}` — tenant-document bevat: aantalGebruikers, aantalOwners, aantalAdmins, aantalMembers, maandprijs (bijgewerkt bij rol-wijzigingen)

## Services
- [src/lib/userService.ts](../../src/lib/userService.ts) — `subscribeToUsers()`, `subscribeToInvites()`, `berekenKostenImpact(tenant, nieuweRol)`, invite aanmaken via Cloud Function
- Cloud Function `onInviteCreated` — stuurt uitnodigingsmail via Trigger Email
- Cloud Function `setUserRole` — wijzigt role-veld + custom JWT claims op Auth-user
- Cloud Function `onUserCreated` — maakt `users/{uid}` aan bij eerste inlog

## Componenten
- [src/components/management/ManagementUsersView.tsx](../../src/components/management/ManagementUsersView.tsx) — gebruikerslijst + uitnodigingen + permissie-matrix
- [src/components/auth/LoginPage.tsx](../../src/components/auth/LoginPage.tsx) — inloggen
- [src/components/auth/RequireAuth.tsx](../../src/components/auth/RequireAuth.tsx) — auth-guard
- [src/components/auth/RequireRole.tsx](../../src/components/auth/RequireRole.tsx) — rol-guard
- `AcceptInvitePage` — uitnodiging accepteren via `/invite/:token`
- `RegistrationWizard` — 5-staps registratie (nieuw tenant aanmaken)
- `ForgotPasswordPage` — wachtwoord reset

## Koppelingen met andere modules
- **Alle modules**: `role` in JWT claims bepaalt toegang + Firestore rules-controles
- **Facturering**: `aantalOwners`, `aantalAdmins`, `aantalMembers` bepalen maandprijs via `berekenMaandprijs()`
- **Planning**: technici (apart van users — `technicians` collectie) worden los beheerd
- **CRM**: users kunnen gekoppeld worden aan een `contact` via `contactId` op users-doc

## Permissies
| Rol | Beheer-toegang |
|-----|----------------|
| owner | volledig gebruikersbeheer + rol-wijzigingen + uitnodigingen |
| admin | uitnodigingen versturen, member-permissies aanpassen |
| member | eigen profiel aanpassen |
| customer | geen toegang tot gebruikersbeheer |

## Module-toegang
Gebruikersbeheer is onderdeel van de basismodule — **gratis**, altijd beschikbaar.
Zit onder `/dashboard/management_users` (bereikbaar voor owner en admin).

## Nog te bouwen
- IAM-fix voor `setUserRole` Cloud Function (deployment-issue)
- [TODO: verificatie nodig] Bulk-uitnodigen via CSV
- [TODO: verificatie nodig] SSO / SAML integratie
- [TODO: verificatie nodig] 2FA-instelling per gebruiker
- Profielfoto upload naar Firebase Storage
