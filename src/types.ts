export type Role = 'Admin' | 'Installer';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: Role;
}

export type CompanyType = 'Residential' | 'Commercial';

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  type: CompanyType;
  referenceNumber: string;
  phone: string;
  kvkNumber: string;
  address: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  companyId?: string;
  tags: string[];
}

export type ProjectStatus = 'Lead' | 'Scheduled' | 'Quoted' | 'In_Progress' | 'Done';

export interface Project {
  id: string;
  title: string;
  companyId: string;
  status: ProjectStatus;
  value: number;
  tags: string[];
}

export interface UnassignedProject {
  id: string;
  location: string;
  contactName: string;
  tags: string[];
}

export interface Resource {
  id: string;
  name: string;
  efficiency: string;
}

export interface ScheduleItem {
  id: string;
  resourceId: string;
  projectId: string;
  title: string;
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "15:00"
  colorCode: string;
}

export interface Article {
  id: string;
  imagePlaceholderUrl: string;
  sku: string | null;
  name: string;
  category: string;
  salePrice: number;
  purchasePrice: number;
  stockCount: number;
  minStock: number;
}

export interface BOMItem {
  id: string;
  projectName: string;
  projectStatus: string;
  planningStatus: string;
  plannedDate: string;
  articleName: string;
  sku: string | null;
  requiredQuantity: number;
}

export interface Quote {
  id: string;
  title: string;
  status: 'Concept' | 'Verstuurd' | 'Geaccepteerd' | 'Rejected';
  projectStatus: string;
  projectName: string;
  contactName: string;
  totalAmount: number;
  sentDate: string;
  openedCount: number;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  status: 'Concept' | 'In Afwachting' | 'Goedgekeurd' | 'Afgerond' | 'Geweigerd';
  projectName: string;
  contactName: string;
  totalExcl: number;
  totalIncl: number;
  fullyPaid: boolean;
}

export interface FormTemplate {
  id: string;
  name: string;
  appliesToInstall: boolean;
  appliesToService: boolean;
  planningType: string;
}

export interface TenantSettings {
  primaryColor: string;
  companyName: string;
  referencePrefix: string;
}

export type PlanningStatus =
  | 'Offerte maken'
  | 'Offerte verstuurd'
  | 'Geen opdracht'
  | 'Parkeren'
  | 'Montage plannen'
  | 'Montage gepland'
  | 'Restpunt plannen'
  | 'Restpunt gepland'
  | 'Oplevering controleren & Factureren'
  | 'Project afgerond'
  | 'Service gepland'
  | 'Service in afwachting'
  | 'Service afgerond'
  | 'Contract actief'
  | 'Contract beëindigd'
  | 'Contract afgerond (facturatie)'
  | 'Offerte afgekeurd';

export type ProjectType = 'Installatie' | 'Service';
export type ClientType = 'Residentieel' | 'Commercieel';
export type ProductTag =
  | 'Zonnepanelen'
  | 'Warmtepomp'
  | 'CV-ketel'
  | 'Airco'
  | 'Energie opslag'
  | 'Isolatie'
  | 'Installatie E'
  | 'Installatie W'
  | 'Onbekend';

export interface PlanningCard {
  id: string;
  projectRef: string;
  clientName: string;
  address: string;
  amount: number;
  status: PlanningStatus;
  projectType: ProjectType;
  clientType: ClientType;
  accountManager: string;
  installGroup: string;
  productTags: ProductTag[];
  imageUrl?: string;
}

export type FormStatus = 'PUBLISHED' | 'DRAFT';

export interface FormItem {
  id: string;
  status: FormStatus;
  project: string;
  planningsregel: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

