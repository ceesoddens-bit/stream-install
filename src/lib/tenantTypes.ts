import { ModuleKey } from './modules';

export type Rol = 'owner' | 'admin' | 'manager' | 'technician' | 'sales' | 'finance' | 'customer';

export type AbonnementStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused' | 'incomplete';

export interface TenantBranding {
  logoUrl?: string;
  kleur?: string;
  bedrijfsnaam?: string;
}

export interface TenantAdres {
  straat?: string;
  nummer?: string;
  postcode?: string;
  plaats?: string;
  land?: string;
}

export interface TenantBank {
  iban?: string;
  bic?: string;
  tenaamstelling?: string;
}

export interface Tenant {
  id: string;
  naam: string;
  plan: 'basis' | 'groei' | 'volledig' | 'custom';
  aantalGebruikers: number;
  actiefModules: ModuleKey[];
  maandprijs: number;
  abonnementStatus: AbonnementStatus;
  abonnementStartDatum?: number;
  abonnementEindDatum?: number;
  opzeggingsDatum?: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  branding?: TenantBranding;
  kvk?: string;
  btw?: string;
  adres?: TenantAdres;
  bank?: TenantBank;
  createdAt?: number;
}

export interface UserDoc {
  uid: string;
  tenantId: string;
  role: Rol;
  displayName?: string;
  email: string;
  photoURL?: string;
  contactId?: string;
  createdAt?: number;
}
