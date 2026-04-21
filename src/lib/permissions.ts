import { Rol } from './tenantTypes';

// Permission format: 'module.action' (e.g. 'offertes.create').
export type Action = 'view' | 'create' | 'update' | 'delete' | 'manage';
export type PermissionKey = string;

const ALL: Action[] = ['view', 'create', 'update', 'delete', 'manage'];

// Rol -> module -> allowed actions
const MATRIX: Record<Rol, Record<string, Action[]>> = {
  owner: { '*': ALL },
  admin: { '*': ALL },
  manager: {
    crm: ALL,
    dashboarding: ['view'],
    projectmanagement: ALL,
    planning: ALL,
    offertes: ALL,
    facturering: ['view', 'create', 'update'],
    formulieren: ALL,
    documenten: ALL,
    voorraadbeheer: ALL,
    automatiseringen: ['view', 'update'],
    ai_assistent: ['view', 'create'],
    tickets: ALL,
    hours: ALL,
    tasks: ALL,
    users: ['view'],
    settings: ['view'],
  },
  technician: {
    crm: ['view'],
    dashboarding: ['view'],
    projectmanagement: ['view', 'update'],
    planning: ['view', 'update'],
    formulieren: ['view', 'create', 'update'],
    voorraadbeheer: ['view', 'update'],
    tickets: ['view', 'create', 'update'],
    hours: ['view', 'create', 'update'],
    tasks: ['view', 'create', 'update'],
    ai_assistent: ['view'],
  },
  sales: {
    crm: ALL,
    dashboarding: ['view'],
    offertes: ALL,
    facturering: ['view'],
    projectmanagement: ['view', 'create', 'update'],
    planning: ['view'],
    ai_assistent: ['view', 'create'],
    tickets: ['view', 'create', 'update'],
  },
  finance: {
    crm: ['view'],
    dashboarding: ['view'],
    offertes: ['view', 'update'],
    facturering: ALL,
    projectmanagement: ['view'],
  },
  customer: {
    klantportaal: ALL,
  },
};

export function hasPermission(role: Rol | null | undefined, permission: PermissionKey): boolean {
  if (!role) return false;
  const [module, action] = permission.split('.') as [string, Action];
  if (!module || !action) return false;
  const rolePerms = MATRIX[role];
  if (!rolePerms) return false;
  const wildcard = rolePerms['*'];
  if (wildcard && wildcard.includes(action)) return true;
  const perms = rolePerms[module];
  if (!perms) return false;
  return perms.includes(action);
}

export function isElevated(role: Rol | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
