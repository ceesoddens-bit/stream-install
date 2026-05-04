// Per-gebruiker permissies — alleen relevant voor members.
// Owners en admins hebben altijd volledige toegang.

export type PermissionKey =
  // CRM
  | 'crm.contacten.bekijken'
  | 'crm.contacten.aanmaken'
  | 'crm.contacten.bewerken'
  | 'crm.contacten.verwijderen'
  // Projecten
  | 'projecten.bekijken'
  | 'projecten.aanmaken'
  | 'projecten.bewerken'
  | 'projecten.verwijderen'
  // Offertes
  | 'offertes.bekijken'
  | 'offertes.aanmaken'
  | 'offertes.versturen'
  // Facturering
  | 'facturen.bekijken'
  | 'facturen.aanmaken'
  // Planning
  | 'planning.bekijken'
  | 'planning.bewerken'
  // Documenten
  | 'documenten.bekijken'
  | 'documenten.uploaden'
  | 'documenten.verwijderen'
  // Formulieren
  | 'formulieren.invullen'
  | 'formulieren.aanmaken'
  // Voorraad
  | 'voorraad.bekijken'
  | 'voorraad.bewerken'
  // Rapportages
  | 'rapportages.bekijken';

export interface PermissionDefinitie {
  key: PermissionKey;
  label: string;
  categorie: string;
}

export const PERMISSIONS: PermissionDefinitie[] = [
  { key: 'crm.contacten.bekijken', label: 'Contacten bekijken', categorie: 'CRM' },
  { key: 'crm.contacten.aanmaken', label: 'Contacten aanmaken', categorie: 'CRM' },
  { key: 'crm.contacten.bewerken', label: 'Contacten bewerken', categorie: 'CRM' },
  { key: 'crm.contacten.verwijderen', label: 'Contacten verwijderen', categorie: 'CRM' },
  { key: 'projecten.bekijken', label: 'Projecten bekijken', categorie: 'Projecten' },
  { key: 'projecten.aanmaken', label: 'Projecten aanmaken', categorie: 'Projecten' },
  { key: 'projecten.bewerken', label: 'Projecten bewerken', categorie: 'Projecten' },
  { key: 'projecten.verwijderen', label: 'Projecten verwijderen', categorie: 'Projecten' },
  { key: 'offertes.bekijken', label: 'Offertes bekijken', categorie: 'Offertes' },
  { key: 'offertes.aanmaken', label: 'Offertes aanmaken', categorie: 'Offertes' },
  { key: 'offertes.versturen', label: 'Offertes versturen', categorie: 'Offertes' },
  { key: 'facturen.bekijken', label: 'Facturen bekijken', categorie: 'Facturering' },
  { key: 'facturen.aanmaken', label: 'Facturen aanmaken', categorie: 'Facturering' },
  { key: 'planning.bekijken', label: 'Planning bekijken', categorie: 'Planning' },
  { key: 'planning.bewerken', label: 'Planning bewerken', categorie: 'Planning' },
  { key: 'documenten.bekijken', label: 'Documenten bekijken', categorie: 'Documenten' },
  { key: 'documenten.uploaden', label: 'Documenten uploaden', categorie: 'Documenten' },
  { key: 'documenten.verwijderen', label: 'Documenten verwijderen', categorie: 'Documenten' },
  { key: 'formulieren.invullen', label: 'Formulieren invullen', categorie: 'Formulieren' },
  { key: 'formulieren.aanmaken', label: 'Formulieren aanmaken', categorie: 'Formulieren' },
  { key: 'voorraad.bekijken', label: 'Voorraad bekijken', categorie: 'Voorraad' },
  { key: 'voorraad.bewerken', label: 'Voorraad bewerken', categorie: 'Voorraad' },
  { key: 'rapportages.bekijken', label: 'Rapportages bekijken', categorie: 'Rapportages' },
];

export const PERMISSION_CATEGORIEEN = Array.from(
  new Set(PERMISSIONS.map((p) => p.categorie))
);

export const DEFAULT_MEMBER_PERMISSIONS: PermissionKey[] = [
  'crm.contacten.bekijken',
  'projecten.bekijken',
  'planning.bekijken',
  'documenten.bekijken',
  'formulieren.invullen',
];

export function heeftPermissie(
  role: string | null | undefined,
  permission: PermissionKey,
  userPermissions: PermissionKey[] = []
): boolean {
  if (!role) return false;
  if (role === 'owner' || role === 'admin') return true;
  return userPermissions.includes(permission);
}
