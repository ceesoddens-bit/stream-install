export type InvoiceStatus =
  | 'Concept'
  | 'In Afwachting'
  | 'Geweigerd'
  | 'Goedgekeurd'
  | 'Afgerond'
  | 'Creditfactuur';

export type InvoiceActor = {
  name: string;
  initials: string;
  kind: 'Systeem' | 'Gebruiker';
};

export type InvoiceRow = {
  id: string;
  jaarcode?: string | null;
  code: number;
  status: InvoiceStatus;
  project: string;
  offerte: { label: string; href?: string } | null;
  volledigBetaald: boolean;
  totaalExcl: number;
  totaalIncl: number;
  totaalBetaald: number;
  totaalVoorschot: number;
  kredietOorspr: string;
  bedrijfsnaam: string;
  contactName: string;
  emailAddress: string;
  emailIndicators: number;
  sentIndicator: boolean;
  reference: string;
  paymentTermDays: number;
  createdAt: string;
  createdBy: InvoiceActor;
  updatedAt: string;
  updatedBy: InvoiceActor;
};

export type StatusFilter = 'Alles' | InvoiceStatus;

export const statusFilters: Array<{
  id: StatusFilter;
  label: string;
  tone: 'neutral' | 'orange' | 'amber' | 'red' | 'green' | 'blue' | 'purple';
}> = [
  { id: 'Alles', label: 'Alles', tone: 'neutral' },
  { id: 'Concept', label: 'Concept', tone: 'amber' },
  { id: 'In Afwachting', label: 'In Afwachting', tone: 'orange' },
  { id: 'Geweigerd', label: 'Geweigerd', tone: 'red' },
  { id: 'Goedgekeurd', label: 'Goedgekeurd', tone: 'green' },
  { id: 'Afgerond', label: 'Afgerond', tone: 'neutral' },
  { id: 'Creditfactuur', label: 'Creditfactuur', tone: 'blue' },
];
