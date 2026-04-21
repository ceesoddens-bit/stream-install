export const BASIS_PRIJS_PER_GEBRUIKER = 29;

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
  { key: 'dashboarding', naam: 'Dashboarding', beschrijving: 'Overzichten en KPI\u2019s', prijsPerGebruiker: 0, inbegrepen: true, categorie: 'basis' },
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

export function berekenMaandprijs(aantalGebruikers: number, modules: ModuleKey[]): number {
  const users = Math.max(1, aantalGebruikers);
  const basis = BASIS_PRIJS_PER_GEBRUIKER * users;
  const modulesSom = modules
    .filter(k => !INBEGREPEN_MODULES.includes(k))
    .reduce((sum, k) => sum + (MODULE_MAP[k]?.prijsPerGebruiker ?? 0), 0);
  return basis + modulesSom * users;
}

export function isInbegrepenModule(key: ModuleKey): boolean {
  return INBEGREPEN_MODULES.includes(key);
}
