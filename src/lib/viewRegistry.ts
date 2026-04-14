export const VIEW_IDS = {
  dashboard: 'dashboard',
  management_dashboard: 'management_dashboard',

  project_detail: 'project_detail',
  projects: 'projects',
  my_projects: 'my_projects',

  planning: 'planning',
  planning_list: 'planning_list',
  teams: 'teams',

  inventory: 'inventory',
  inventory_overview: 'inventory_overview',
  inventory_mutaties: 'inventory_mutaties',
  inventory_magazijnen: 'inventory_magazijnen',
  inventory_inkooporders: 'inventory_inkooporders',
  inventory_leveranciers: 'inventory_leveranciers',
  inventory_boms: 'inventory_boms',

  finance: 'finance',
  quotes: 'quotes',
  settings: 'settings',
  crm: 'crm',
  crm_companies: 'crm_companies',
  forms: 'forms',
  sales: 'sales',
  tasks: 'tasks',
  calendar: 'calendar',
  hours: 'hours',

  administratie_offertes: 'administratie_offertes',
  administratie_facturen: 'administratie_facturen',
  administratie_urenregistratie: 'administratie_urenregistratie',

  tickets_all: 'tickets_all',
  tickets_my: 'tickets_my',
} as const;

export const ADMINISTRATION_VIEW_IDS = [
  VIEW_IDS.administratie_offertes,
  VIEW_IDS.administratie_facturen,
  VIEW_IDS.administratie_urenregistratie,
] as const;

export const TICKETS_VIEW_IDS = [VIEW_IDS.tickets_all, VIEW_IDS.tickets_my] as const;

export const KNOWN_VIEW_IDS = [
  VIEW_IDS.dashboard,
  VIEW_IDS.management_dashboard,
  VIEW_IDS.project_detail,
  VIEW_IDS.projects,
  VIEW_IDS.my_projects,
  VIEW_IDS.planning,
  VIEW_IDS.planning_list,
  VIEW_IDS.teams,
  VIEW_IDS.inventory,
  VIEW_IDS.inventory_overview,
  VIEW_IDS.inventory_mutaties,
  VIEW_IDS.inventory_magazijnen,
  VIEW_IDS.inventory_inkooporders,
  VIEW_IDS.inventory_leveranciers,
  VIEW_IDS.inventory_boms,
  VIEW_IDS.finance,
  VIEW_IDS.quotes,
  VIEW_IDS.settings,
  VIEW_IDS.crm,
  VIEW_IDS.crm_companies,
  VIEW_IDS.forms,
  VIEW_IDS.sales,
  VIEW_IDS.tasks,
  VIEW_IDS.calendar,
  VIEW_IDS.hours,
] as const;

const administrationViewIdSet = new Set<string>(ADMINISTRATION_VIEW_IDS);
const ticketsViewIdSet = new Set<string>(TICKETS_VIEW_IDS);
const knownViewIdSet = new Set<string>(KNOWN_VIEW_IDS);

export function isAdministrationView(viewId: string): boolean {
  return administrationViewIdSet.has(viewId);
}

export function isTicketsView(viewId: string): boolean {
  return ticketsViewIdSet.has(viewId);
}

export function isManagementView(viewId: string): boolean {
  return viewId.startsWith('management_');
}

export function isKnownView(viewId: string): boolean {
  return (
    knownViewIdSet.has(viewId) ||
    isAdministrationView(viewId) ||
    isTicketsView(viewId) ||
    isManagementView(viewId)
  );
}

