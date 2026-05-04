import { ModuleKey } from './modules';
import { Rol } from './tenantTypes';

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
  settings_subscription: 'settings_subscription',
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

export type ViewId = (typeof VIEW_IDS)[keyof typeof VIEW_IDS];

export interface ViewMeta {
  id: string;
  label: string;
  requiredModule?: ModuleKey;
  requiredRoles?: Rol[];
}

// Registry used for route/sidebar gating. Only views with module/role constraints
// need an entry; missing views default to authenticated-only.
export const VIEW_REGISTRY: Record<string, ViewMeta> = {
  [VIEW_IDS.dashboard]: { id: VIEW_IDS.dashboard, label: 'Dashboard' },
  [VIEW_IDS.crm]: { id: VIEW_IDS.crm, label: 'Contacten', requiredModule: 'crm' },
  [VIEW_IDS.crm_companies]: { id: VIEW_IDS.crm_companies, label: 'Bedrijven', requiredModule: 'crm' },

  [VIEW_IDS.projects]: { id: VIEW_IDS.projects, label: 'Projecten', requiredModule: 'projectmanagement' },
  [VIEW_IDS.my_projects]: { id: VIEW_IDS.my_projects, label: 'Mijn projecten', requiredModule: 'projectmanagement' },
  [VIEW_IDS.project_detail]: { id: VIEW_IDS.project_detail, label: 'Project', requiredModule: 'projectmanagement' },
  [VIEW_IDS.tasks]: { id: VIEW_IDS.tasks, label: 'Taken', requiredModule: 'projectmanagement' },
  [VIEW_IDS.hours]: { id: VIEW_IDS.hours, label: 'Uren', requiredModule: 'projectmanagement' },
  [VIEW_IDS.tickets_all]: { id: VIEW_IDS.tickets_all, label: 'Alle tickets', requiredModule: 'projectmanagement' },
  [VIEW_IDS.tickets_my]: { id: VIEW_IDS.tickets_my, label: 'Mijn tickets', requiredModule: 'projectmanagement' },

  [VIEW_IDS.planning]: { id: VIEW_IDS.planning, label: 'Planning', requiredModule: 'planning' },
  [VIEW_IDS.planning_list]: { id: VIEW_IDS.planning_list, label: 'Planning lijst', requiredModule: 'planning' },
  [VIEW_IDS.calendar]: { id: VIEW_IDS.calendar, label: 'Kalender', requiredModule: 'planning' },
  [VIEW_IDS.teams]: { id: VIEW_IDS.teams, label: 'Teams', requiredModule: 'planning' },

  [VIEW_IDS.quotes]: { id: VIEW_IDS.quotes, label: 'Offertes', requiredModule: 'offertes' },
  [VIEW_IDS.finance]: { id: VIEW_IDS.finance, label: 'Finance', requiredModule: 'facturering' },
  [VIEW_IDS.forms]: { id: VIEW_IDS.forms, label: 'Formulieren', requiredModule: 'formulieren' },
  [VIEW_IDS.sales]: { id: VIEW_IDS.sales, label: 'Sales', requiredModule: 'offertes' },

  [VIEW_IDS.inventory]: { id: VIEW_IDS.inventory, label: 'Voorraad', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_overview]: { id: VIEW_IDS.inventory_overview, label: 'Voorraad overzicht', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_mutaties]: { id: VIEW_IDS.inventory_mutaties, label: 'Mutaties', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_magazijnen]: { id: VIEW_IDS.inventory_magazijnen, label: 'Magazijnen', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_inkooporders]: { id: VIEW_IDS.inventory_inkooporders, label: 'Inkooporders', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_leveranciers]: { id: VIEW_IDS.inventory_leveranciers, label: 'Leveranciers', requiredModule: 'voorraadbeheer' },
  [VIEW_IDS.inventory_boms]: { id: VIEW_IDS.inventory_boms, label: "BOM's", requiredModule: 'voorraadbeheer' },

  [VIEW_IDS.administratie_offertes]: { id: VIEW_IDS.administratie_offertes, label: 'Administratie offertes', requiredModule: 'offertes' },
  [VIEW_IDS.administratie_facturen]: { id: VIEW_IDS.administratie_facturen, label: 'Administratie facturen', requiredModule: 'facturering' },
  [VIEW_IDS.administratie_urenregistratie]: { id: VIEW_IDS.administratie_urenregistratie, label: 'Urenregistratie', requiredModule: 'projectmanagement' },

  ['management_automation']: { id: 'management_automation', label: 'Automation', requiredModule: 'automatiseringen' },
  ['management_automation_lite']: { id: 'management_automation_lite', label: 'Automation Lite', requiredModule: 'automatiseringen' },
  ['management_customer_portal_layout']: { id: 'management_customer_portal_layout', label: 'Klantportaal Layout', requiredModule: 'klantportaal' },
  ['management_customer_portal_content']: { id: 'management_customer_portal_content', label: 'Klantportaal Inhoud', requiredModule: 'klantportaal' },
  ['management_customer_portal']: { id: 'management_customer_portal', label: 'Customer Portal', requiredModule: 'klantportaal' },

  [VIEW_IDS.settings]: { id: VIEW_IDS.settings, label: 'Instellingen', requiredRoles: ['owner','admin'] },
  [VIEW_IDS.settings_subscription]: { id: VIEW_IDS.settings_subscription, label: 'Abonnement', requiredRoles: ['owner','admin'] },
  [VIEW_IDS.management_dashboard]: { id: VIEW_IDS.management_dashboard, label: 'Management', requiredRoles: ['owner','admin'] },
};

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
