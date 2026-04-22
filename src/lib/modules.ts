export const PRIJS_OWNER = 29;
export const PRIJS_ADMIN = 19;
export const PRIJS_MEMBER = 9;

/** @deprecated Gebruik PRIJS_OWNER — blijft voor backward-compat met Stripe sync */
export const BASIS_PRIJS_PER_GEBRUIKER = PRIJS_OWNER;

export type ModuleKey =
  | 'crm'
  | 'dashboarding'
  | 'offertes'
  | 'projectmanagement'
  | 'planning'
  | 'facturering'
  | 'formulieren'
  | 'documenten'
  | 'voorraadbeheer'
  | 'automatiseringen'
  | 'klantportaal'
  | 'ai_assistent';

export type ModuleCategorie = 'basis' | 'verkoop' | 'operatie' | 'administratie' | 'extra';

export interface ModuleDefinitie {
  key: ModuleKey;
  naam: string;
  beschrijving: string;
  prijsPerGebruiker: number;
  inbegrepen: boolean;
  categorie: ModuleCategorie;
  icon?: string;
}

export const MODULES: ModuleDefinitie[] = [
  { key: 'crm', naam: 'CRM', beschrijving: 'Contacten & bedrijven', prijsPerGebruiker: 0, inbegrepen: true, categorie: 'basis' },
  { key: 'dashboarding', naam: 'Dashboarding', beschrijving: 'Overzichten en KPI\'s', prijsPerGebruiker: 0, inbegrepen: true, categorie: 'basis' },
  { key: 'offertes', naam: 'Offertes', beschrijving: 'Offertes maken & versturen', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'verkoop' },
  { key: 'facturering', naam: 'Facturering', beschrijving: 'Facturen + betalingen', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'administratie' },
  { key: 'projectmanagement', naam: 'Projectmanagement', beschrijving: 'Projecten, tickets, uren & taken', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'operatie' },
  { key: 'planning', naam: 'Planning', beschrijving: 'Agenda, teams & kalender', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'operatie' },
  { key: 'formulieren', naam: 'Formulieren', beschrijving: 'Digitale werkbonnen & forms', prijsPerGebruiker: 10, inbegrepen: false, categorie: 'operatie' },
  { key: 'documenten', naam: 'Documenten', beschrijving: 'Document-beheer per project', prijsPerGebruiker: 10, inbegrepen: false, categorie: 'operatie' },
  { key: 'voorraadbeheer', naam: 'Voorraadbeheer', beschrijving: 'Artikelen, magazijnen & inkoop', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'operatie' },
  { key: 'automatiseringen', naam: 'Automatiseringen', beschrijving: 'Workflows & triggers', prijsPerGebruiker: 20, inbegrepen: false, categorie: 'extra' },
  { key: 'klantportaal', naam: 'Klantportaal', beschrijving: 'Portaal voor klanten', prijsPerGebruiker: 15, inbegrepen: false, categorie: 'extra' },
  { key: 'ai_assistent', naam: 'AI-assistent', beschrijving: 'Gemini gegenereerde concepten', prijsPerGebruiker: 20, inbegrepen: false, categorie: 'extra' },
];

export const MODULE_MAP: Record<ModuleKey, ModuleDefinitie> = MODULES.reduce((acc, m) => {
  acc[m.key] = m;
  return acc;
}, {} as Record<ModuleKey, ModuleDefinitie>);

export const INBEGREPEN_MODULES: ModuleKey[] = MODULES.filter(m => m.inbegrepen).map(m => m.key);

/**
 * Berekent de totale maandprijs.
 * Modulekosten worden alleen doorberekend aan owners + admins (betaalde gebruikers).
 * Members betalen alleen hun basistoegang.
 */
export function berekenMaandprijs(
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number,
  modules: ModuleKey[]
): number {
  const owners = Math.max(1, aantalOwners);
  const admins = Math.max(0, aantalAdmins);
  const members = Math.max(0, aantalMembers);
  const betaaldeGebruikers = owners + admins;

  const gebruikersKosten = owners * PRIJS_OWNER + admins * PRIJS_ADMIN + members * PRIJS_MEMBER;
  const moduleKosten = modules
    .filter(k => !INBEGREPEN_MODULES.includes(k))
    .reduce((sum, k) => sum + (MODULE_MAP[k]?.prijsPerGebruiker ?? 0), 0);

  return gebruikersKosten + moduleKosten * betaaldeGebruikers;
}

export function isInbegrepenModule(key: ModuleKey): boolean {
  return INBEGREPEN_MODULES.includes(key);
}
