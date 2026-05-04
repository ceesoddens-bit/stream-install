/**
 * STAP 2.1 — Rol-definities
 * --------------------------
 * Definieert de drie rollen en hun standaard-permissies.
 * Owners en Admins hebben altijd volledige toegang (afgehandeld in heeftPermissie()).
 * Members beginnen met DEFAULT_MEMBER_PERMISSIONS en kunnen per organisatie worden uitgebreid.
 */

import { PermissionKey, DEFAULT_MEMBER_PERMISSIONS } from './permissions';

export type Rol = 'owner' | 'admin' | 'member';

export interface RolDefinitie {
  rol: Rol;
  label: string;
  beschrijving: string;
  /** Prijs per maand voor deze rol */
  prijsPerMaand: number;
  /** Heeft volledige toegang (alle permissies impliciet) */
  volledigeToegang: boolean;
  /** Standaard permissies voor deze rol (alleen relevant voor 'member') */
  standaardPermissies: PermissionKey[];
}

export const ROL_DEFINITIES: RolDefinitie[] = [
  {
    rol: 'owner',
    label: 'Hoofdgebruiker',
    beschrijving: 'Volledige toegang inclusief gebruikersbeheer, facturering en instellingen.',
    prijsPerMaand: 49,
    volledigeToegang: true,
    standaardPermissies: [],
  },
  {
    rol: 'admin',
    label: 'Extra Hoofdgebruiker',
    beschrijving: 'Volledige toegang tot alle modules. Geen toegang tot abonnement en betaling.',
    prijsPerMaand: 35,
    volledigeToegang: true,
    standaardPermissies: [],
  },
  {
    rol: 'member',
    label: 'Medewerker',
    beschrijving: 'Toegang op maat. De hoofdgebruiker bepaalt welke modules en acties beschikbaar zijn.',
    prijsPerMaand: 19,
    volledigeToegang: false,
    standaardPermissies: DEFAULT_MEMBER_PERMISSIONS,
  },
];

export function getRolDefinitie(rol: Rol): RolDefinitie | undefined {
  return ROL_DEFINITIES.find((r) => r.rol === rol);
}

export function getRolLabel(rol: Rol): string {
  return getRolDefinitie(rol)?.label ?? rol;
}
