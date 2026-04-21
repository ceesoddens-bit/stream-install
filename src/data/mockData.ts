import { User, Company, Contact, Project, UnassignedProject, Resource, ScheduleItem, Article, BOMItem, Quote, Invoice, FormTemplate, TenantSettings, PlanningCard, FormItem, Supplier, Warehouse, StockOverviewRow, InventoryMutation } from '../types';

export const planningCards: PlanningCard[] = [];
export const articles: Article[] = [];
export const bomItems: BOMItem[] = [];
export const unassignedProjects: UnassignedProject[] = [];
export const resources: Resource[] = [];
export const scheduleItems: ScheduleItem[] = [];
export const quotes: Quote[] = [];
export const invoices: Invoice[] = [];
export const formTemplates: FormTemplate[] = [];

export const tenantSettings: TenantSettings = {
  primaryColor: '#076735',
  companyName: 'Mijn Bedrijf',
  referencePrefix: 'PROJ-',
};

export const suppliers: Supplier[] = [];
export const warehouses: Warehouse[] = [];
export const stockOverviewRows: StockOverviewRow[] = [];
export const inventoryMutations: InventoryMutation[] = [];

export const currentUser: User = {
  id: 'u1',
  name: 'Beheerder',
  avatarUrl: 'https://ui-avatars.com/api/?name=Beheerder&background=random',
  role: 'Admin',
};

export const contacts: Contact[] = [];
export const companies: Company[] = [];
export const projects: Project[] = [];
export const formItems: FormItem[] = [];
