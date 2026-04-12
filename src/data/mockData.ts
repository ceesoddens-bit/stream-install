import { User, Company, Contact, Project, UnassignedProject, Resource, ScheduleItem, Article, BOMItem, Quote, Invoice, FormTemplate, TenantSettings, PlanningCard, FormItem } from '../types';

export const planningCards: PlanningCard[] = [
  // Offerte maken
  {
    id: 'pc1', projectRef: '2500112-Fam. Jautze-Installatie', clientName: 'Fam. Jautze',
    address: 'Galjoen 10 16, 8243MH Lelystad', amount: 3355, status: 'Offerte maken',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
    imageUrl: 'https://picsum.photos/seed/jautze/80/60',
  },
  {
    id: 'pc2', projectRef: '2600038-Ruud Steelwinder-Installatie', clientName: 'Ruud Steelwinder',
    address: 'Saerdam 55, 8242JC Lelystad', amount: 0, status: 'Offerte maken',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Onbekend'],
  },
  {
    id: 'pc3', projectRef: '2500284-Aart Mouw-Installatie', clientName: 'Aart Mouw',
    address: 'Dwarsdijk 3, 8251KA Dronten', amount: 2100, status: 'Offerte maken',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Offerte verstuurd
  {
    id: 'pc4', projectRef: '2600196-Mark MCT-Installatie', clientName: 'Mark MCT',
    address: 'Weerribben 55, 8244EC Lelystad', amount: 3865, status: 'Offerte verstuurd',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
    imageUrl: 'https://picsum.photos/seed/mct/80/60',
  },
  {
    id: 'pc5', projectRef: '2600205-V & O Cars-Installatie', clientName: 'V & O Cars',
    address: 'Apolloweg 138, 8239DA Lelystad', amount: 21677.15, status: 'Offerte verstuurd',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Energie opslag'],
  },
  // Geen opdracht
  {
    id: 'pc6', projectRef: '2500090-Menno van Zaane-Installatie', clientName: 'Menno van Zaane',
    address: 'Kopenhagenlaan 105, 8232RB Lelystad', amount: 2537.37, status: 'Geen opdracht',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['CV-ketel'],
  },
  {
    id: 'pc7', projectRef: '2500057-Wido Nijens-Installatie', clientName: 'Wido Nijens',
    address: 'Rozengaard 11 64, 8212DB Lelystad', amount: 5425, status: 'Geen opdracht',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen', 'Isolatie'],
    imageUrl: 'https://picsum.photos/seed/wido/80/60',
  },
  // Parkeren
  {
    id: 'pc8', projectRef: '2500247-Fam. Jautze-Installatie', clientName: 'Fam. Jautze',
    address: 'Galjoen 10 16, 8243MH Lelystad', amount: 89694.92, status: 'Parkeren',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Airco'],
  },
  {
    id: 'pc9', projectRef: '2600056-Henk de Vries-Installatie', clientName: 'Henk de Vries',
    address: 'Hollandse Hout 224, 8244GK Lelystad', amount: 8411.50, status: 'Parkeren',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Energie opslag'],
  },
  // Montage plannen
  {
    id: 'pc10', projectRef: '2500301-Centrada-Installatie', clientName: 'Centrada',
    address: 'Plantage 86, 8212VE Lelystad', amount: 18983.03, status: 'Montage plannen',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
    imageUrl: 'https://picsum.photos/seed/centrada/80/60',
  },
  {
    id: 'pc11', projectRef: '2600025-Mark Wind-Installatie', clientName: 'Mark Wind',
    address: 'Vosseveld 12, 8017MP Zwolle', amount: 0, status: 'Montage plannen',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  {
    id: 'pc12', projectRef: '2600054-Bjorn de Nooij-Installatie', clientName: 'Bjorn de Nooij',
    address: 'Berkenlaan 4, 8251AB Dronten', amount: 4200, status: 'Montage plannen',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Montage gepland
  {
    id: 'pc13', projectRef: '2500154-Energy Bridge-Installatie', clientName: 'Energy Bridge',
    address: 'Bremenstraat 24, 8232RW Lelystad', amount: 13529.35, status: 'Montage gepland',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
    imageUrl: 'https://picsum.photos/seed/bridge/80/60',
  },
  {
    id: 'pc14', projectRef: '2600097-Energiewacht B.V.-Installatie', clientName: 'Energiewacht B.V.',
    address: 'Alexiahof 67, 8322GD Urk', amount: 0, status: 'Montage gepland',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Warmtepomp'],
  },
  {
    id: 'pc15', projectRef: '2600180-Energiewacht B.V.-Installatie', clientName: 'Energiewacht B.V.',
    address: 'Hofstede 103, 8312WH Lelystad', amount: 0, status: 'Montage gepland',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Restpunt plannen
  {
    id: 'pc16', projectRef: '2500153-Energiewacht BV-Installatie', clientName: 'Energiewacht BV',
    address: 'Jol 35 39, 8243HG Lelystad', amount: 2238.50, status: 'Restpunt plannen',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['CV-ketel'],
  },
  {
    id: 'pc17', projectRef: '2600092-Deborah Testa-Installatie', clientName: 'Deborah Testa',
    address: 'Schietlood 11, 8253LG Dronten', amount: 0, status: 'Restpunt plannen',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Installatie E', 'Installatie W'],
  },
  {
    id: 'pc18', projectRef: '2600093-Rob Tomson-Installatie', clientName: 'Rob Tomson',
    address: 'De Schans 19 28, 8231LM Lelystad', amount: 0, status: 'Restpunt plannen',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Restpunt gepland
  {
    id: 'pc19', projectRef: '2600313-Ricardo Zoon-Installatie', clientName: 'Ricardo Zoon',
    address: 'Ganzerik 29, 8255KD Swifterbant', amount: 7990, status: 'Restpunt gepland',
    projectType: 'Installatie', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Energie opslag'],
  },
  {
    id: 'pc20', projectRef: '2600133-AEON Plaza-Installatie', clientName: 'AEON Plaza',
    address: 'Nijverheidslaan 105, 1382LH Weesp', amount: 0, status: 'Restpunt gepland',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Installatie W'],
  },
  // Oplevering controleren & Factureren
  {
    id: 'pc21', projectRef: '2600210-Centrada-Installatie', clientName: 'Centrada',
    address: 'Kustrif 43, 8224BC Lelystad', amount: 3069.70, status: 'Oplevering controleren & Factureren',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Project afgerond
  {
    id: 'pc22', projectRef: '2500072-Centrada-Installatie', clientName: 'Centrada',
    address: 'Jol 41 23, 8243HN Lelystad', amount: 29071.70, status: 'Project afgerond',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
    imageUrl: 'https://picsum.photos/seed/centrada2/80/60',
  },
  {
    id: 'pc23', projectRef: '2500123-Centrada-Installatie', clientName: 'Centrada',
    address: 'Jol 4017, 8243HM Lelystad', amount: 5200, status: 'Project afgerond',
    projectType: 'Installatie', clientType: 'Commercieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Service gepland
  {
    id: 'pc24', projectRef: '2600188-J.M. Dam-Installatie', clientName: 'J.M. Dam',
    address: 'Damrif 111, 8224AL Lelystad', amount: 0, status: 'Service gepland',
    projectType: 'Service', clientType: 'Residentieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Installatie W'],
  },
  {
    id: 'pc25', projectRef: '2600159-Lenferink Zwolle Renovatie B.V.-Installatie', clientName: 'Lenferink Zwolle Renovatie B.V.',
    address: 'Damrif, 8224 Lelystad', amount: 0, status: 'Service gepland',
    projectType: 'Service', clientType: 'Commercieel', accountManager: 'Sandra Brader',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  {
    id: 'pc26', projectRef: '2600199-Hans Van Rath-Installatie', clientName: 'Hans Van Rath',
    address: 'Jol 30 7, 8243HA Lelystad', amount: 0, status: 'Service gepland',
    projectType: 'Service', clientType: 'Residentieel', accountManager: 'Cees Oddens',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Zonnepanelen'],
  },
  // Service in afwachting
  {
    id: 'pc27', projectRef: '2600311-Fam. Peters-Service', clientName: 'Fam. Peters',
    address: 'Merel 12, 8243CC Lelystad', amount: 0, status: 'Service in afwachting',
    projectType: 'Service', clientType: 'Residentieel', accountManager: 'Sven',
    installGroup: 'Installatiegroep Duurzaam', productTags: ['Warmtepomp'],
  },
];

// ... existing data ...

export const articles: Article[] = [
  {
    id: 'a1', imagePlaceholderUrl: 'https://picsum.photos/seed/quatt/100/100', sku: 'Q-HYB-V2',
    name: 'Quatt Hybrid Duo V2', category: 'Warmtepompen', salePrice: 4500, purchasePrice: 3200,
    stockCount: 12, minStock: 5,
  },
  {
    id: 'a2', imagePlaceholderUrl: 'https://picsum.photos/seed/alpha/100/100', sku: 'ESS-BAT-10',
    name: 'AlphaEss Thuisbatterij 10kWh', category: 'Batterij', salePrice: 6500, purchasePrice: 4800,
    stockCount: 3, minStock: 5,
  },
  {
    id: 'a3', imagePlaceholderUrl: 'https://picsum.photos/seed/daikin/100/100', sku: 'DK-AC-12',
    name: 'Daikin Emura Airco 3.5kW', category: 'Airco', salePrice: 1850, purchasePrice: 1200,
    stockCount: 8, minStock: 10,
  },
  {
    id: 'a4', imagePlaceholderUrl: 'https://picsum.photos/seed/nefit/100/100', sku: 'NF-CV-9000',
    name: 'Nefit TrendLine HRC30', category: 'CV Ketel', salePrice: 2100, purchasePrice: 1450,
    stockCount: 0, minStock: 2,
  },
  {
    id: 'a5', imagePlaceholderUrl: 'https://picsum.photos/seed/solar/100/100', sku: 'SE-INV-5K',
    name: 'SolarEdge SE5000H Omvormer', category: 'Omvormers', salePrice: 1250, purchasePrice: 850,
    stockCount: 45, minStock: 15,
  },
  {
    id: 'a6', imagePlaceholderUrl: 'https://picsum.photos/seed/paneel/100/100', sku: 'TRNS-430',
    name: 'Trina Solar Vertex S 430Wp', category: 'Zonnepanelen', salePrice: 135, purchasePrice: 85,
    stockCount: 420, minStock: 100,
  },
  {
    id: 'a7', imagePlaceholderUrl: 'https://picsum.photos/seed/click/100/100', sku: 'CLICK-RD',
    name: 'ClickFit EVO Dakhaak', category: 'Bevestigingsmateriaal', salePrice: 12.50, purchasePrice: 6.20,
    stockCount: 1800, minStock: 500,
  },
];

export const bomItems: BOMItem[] = [
  {
    id: 'b1',
    projectName: 'Jansen Family Solar',
    projectStatus: 'In_Progress',
    planningStatus: 'Planned',
    plannedDate: '2026-04-12',
    articleName: 'SolarEdge SE5000H Omvormer',
    sku: 'SE-INV-5K',
    requiredQuantity: 1,
  },
  {
    id: 'b2',
    projectName: 'Visser Residence Heatpump',
    projectStatus: 'Scheduled',
    planningStatus: 'Confirmed',
    plannedDate: '2026-04-15',
    articleName: 'Quatt Hybrid Duo V2',
    sku: 'Q-HYB-V2',
    requiredQuantity: 1,
  },
  {
    id: 'b3',
    projectName: 'TechCorp HQ Battery',
    projectStatus: 'Quoted',
    planningStatus: 'Draft',
    plannedDate: '2026-05-01',
    articleName: 'AlphaEss Thuisbatterij 10kWh',
    sku: 'ESS-BAT-10',
    requiredQuantity: 2,
  },
];

export const unassignedProjects: UnassignedProject[] = [
  { id: 'up1', location: 'Lelystad', contactName: 'De Boer', tags: ['Zonnepanelen'] },
  { id: 'up2', location: 'Almere', contactName: 'Visser', tags: ['Warmtepomp'] },
  { id: 'up3', location: 'Dronten', contactName: 'Bakker', tags: ['Zonnepanelen'] },
  { id: 'up4', location: 'Zeewolde', contactName: 'Smit', tags: ['Airco'] },
  { id: 'up5', location: 'Emmeloord', contactName: 'Jansen', tags: ['Warmtepomp'] },
];

export const resources: Resource[] = [
  { id: 'r1', name: 'Team Alpha (Solar)', efficiency: '85.5%' },
  { id: 'r2', name: 'Team Beta (Heatpump)', efficiency: '66.7%' },
  { id: 'r3', name: 'Team Gamma (General)', efficiency: '92.0%' },
  { id: 'r4', name: 'Installer John', efficiency: '78.2%' },
  { id: 'r5', name: 'Installer Sarah', efficiency: '88.4%' },
];

export const scheduleItems: ScheduleItem[] = [
  { id: 's1', resourceId: 'r1', projectId: 'p1', title: 'Solar Install - Lelystad', startTime: '08:00', endTime: '12:00', colorCode: 'bg-yellow-100 border-yellow-300' },
  { id: 's2', resourceId: 'r1', projectId: 'p3', title: 'Solar Maintenance', startTime: '13:00', endTime: '16:00', colorCode: 'bg-yellow-100 border-yellow-300' },
  { id: 's3', resourceId: 'r2', projectId: 'p2', title: 'Heatpump Service', startTime: '09:00', endTime: '15:00', colorCode: 'bg-red-100 border-red-300' },
  { id: 's4', resourceId: 'r3', projectId: 'p4', title: 'Airco Split Unit', startTime: '08:00', endTime: '11:00', colorCode: 'bg-blue-100 border-blue-300' },
  { id: 's5', resourceId: 'r3', projectId: 'p7', title: 'General Checkup', startTime: '12:00', endTime: '14:00', colorCode: 'bg-emerald-100 border-emerald-300' },
  { id: 's6', resourceId: 'r4', projectId: 'p5', title: 'Smart Home Setup', startTime: '10:00', endTime: '13:00', colorCode: 'bg-indigo-100 border-indigo-300' },
];

export const quotes: Quote[] = [
  { id: '1', title: 'Offerte Zonnepanelen - Jansen', status: 'Concept', projectStatus: 'Lead', projectName: 'Zonnepanelen Fam. Jansen', contactName: 'Jan Jansen', totalAmount: 5450.00, sentDate: '2024-03-20', openedCount: 0 },
  { id: '2', title: 'Warmtepomp Installatie - De Vries', status: 'Verstuurd', projectStatus: 'Offerte', projectName: 'Warmtepomp De Vries', contactName: 'Piet de Vries', totalAmount: 8900.00, sentDate: '2024-03-22', openedCount: 3 },
  { id: '3', title: 'Batterij Opslag - Pietersen', status: 'Geaccepteerd', projectStatus: 'Project', projectName: 'Batterij Opslag Pietersen', contactName: 'Henk Pietersen', totalAmount: 4200.00, sentDate: '2024-03-15', openedCount: 5 },
  { id: '4', title: 'Service Beurt - Bakker', status: 'Rejected', projectStatus: 'Lead', projectName: 'Service Bakker', contactName: 'Kees Bakker', totalAmount: 150.00, sentDate: '2024-03-10', openedCount: 1 },
  { id: '5', title: 'Zonnepanelen - Klaassen', status: 'Geaccepteerd', projectStatus: 'Project', projectName: 'Zonnepanelen Klaassen', contactName: 'Anja Klaassen', totalAmount: 6200.00, sentDate: '2024-03-12', openedCount: 2 },
];

export const invoices: Invoice[] = [
  { id: '1', invoiceCode: '2024-001', status: 'Afgerond', projectName: 'Zonnepanelen Klaassen', contactName: 'Anja Klaassen', totalExcl: 5123.97, totalIncl: 6200.00, fullyPaid: true },
  { id: '2', invoiceCode: '2024-002', status: 'Goedgekeurd', projectName: 'Batterij Opslag Pietersen', contactName: 'Henk Pietersen', totalExcl: 3471.07, totalIncl: 4200.00, fullyPaid: false },
  { id: '3', invoiceCode: '2024-003', status: 'In Afwachting', projectName: 'Warmtepomp De Vries', contactName: 'Piet de Vries', totalExcl: 7355.37, totalIncl: 8900.00, fullyPaid: false },
  { id: '4', invoiceCode: '2024-004', status: 'Concept', projectName: 'Zonnepanelen Fam. Jansen', contactName: 'Jan Jansen', totalExcl: 4504.13, totalIncl: 5450.00, fullyPaid: false },
];

export const formTemplates: FormTemplate[] = [
  { id: '1', name: 'Opnameformulier Zonnepanelen', appliesToInstall: true, appliesToService: false, planningType: 'Adviesgesprek' },
  { id: '2', name: 'Opleverformulier Warmtepomp', appliesToInstall: true, appliesToService: false, planningType: 'Installatie' },
  { id: '3', name: 'Onderhoudsrapport CV-ketel', appliesToInstall: false, appliesToService: true, planningType: 'Service' },
  { id: '4', name: 'Schouwingsformulier Batterij', appliesToInstall: true, appliesToService: false, planningType: 'Schouwing' },
];

export const tenantSettings: TenantSettings = {
  primaryColor: '#076735',
  companyName: 'Opus Flow Solar & Heat',
  referencePrefix: 'OF-',
};

export const currentUser: User = {
  id: 'u1',
  name: 'Cees Oddens',
  avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  role: 'Admin',
};

export const contacts: Contact[] = [
  { id: 'ct1', firstName: 'Jan', lastName: 'Jansen', email: 'jan@jansen.nl', phone: '06 12345678', mobile: '06 12345678', companyId: 'c1', tags: ['Beslisser'] },
  { id: 'ct2', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@techcorp.com', phone: '06 87654321', mobile: '06 87654321', companyId: 'c2', tags: ['Technisch'] },
  { id: 'ct3', firstName: 'Pieter', lastName: 'De Vries', email: 'pieter@devries.nl', phone: '06 11223344', companyId: 'c3', tags: ['Beslisser'] },
  { id: 'ct4', firstName: 'Anna', lastName: 'Visser', email: 'anna@visser.nl', phone: '06 55667788', companyId: 'c4', tags: ['Contactpersoon'] },
  { id: 'ct5', firstName: 'Mark', lastName: 'Bakker', email: 'mark@bakker.nl', phone: '06 99887766', companyId: 'c3', tags: ['Technisch'] },
];

export const companies: Company[] = [
  { 
    id: 'c1', 
    name: 'Jansen Family', 
    contactPerson: 'Jan Jansen', 
    type: 'Residential',
    referenceNumber: 'REL-001',
    phone: '06 12345678',
    kvkNumber: '12345678',
    address: 'Hoofdstraat 1, 1234 AB Lelystad',
    tags: ['Lead'],
    projectsCount: 2,
    vatNumber: 'NL86132981B01'
  },
  { 
    id: 'c2', 
    name: 'TechCorp HQ', 
    contactPerson: 'Sarah Smith', 
    type: 'Commercial',
    referenceNumber: 'REL-002',
    phone: '06 87654321',
    kvkNumber: '87654321',
    address: 'Business Park 10, 5678 CD Almere',
    tags: ['Klant', 'Partner'],
    projectsCount: 2,
    parentCompany: 'OpusFlow'
  },
  { 
    id: 'c3', 
    name: 'Bakkerij De Vries', 
    contactPerson: 'Pieter De Vries', 
    type: 'Commercial',
    referenceNumber: 'REL-003',
    phone: '06 11223344',
    kvkNumber: '11223344',
    address: 'Bakkersteeg 5, 9012 EF Dronten',
    tags: [],
    projectsCount: 1
  },
  { 
    id: 'c4', 
    name: 'Visser Residence', 
    contactPerson: 'Anna Visser', 
    type: 'Residential',
    referenceNumber: 'REL-004',
    phone: '06 55667788',
    kvkNumber: '55667788',
    address: 'Waterkant 12, 3456 GH Zeewolde',
    tags: ['Service'],
    projectsCount: 2
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    title: '12x Solar Panels Roof Install',
    companyId: 'c1',
    status: 'Lead',
    value: 4500,
    tags: ['Solar', 'Residential'],
  },
  {
    id: 'p2',
    title: 'Hybrid Heat Pump Upgrade',
    companyId: 'c4',
    status: 'Quoted',
    value: 6200,
    tags: ['Heatpump', 'Residential'],
  },
  {
    id: 'p3',
    title: 'Commercial Solar Array 50kWp',
    companyId: 'c2',
    status: 'In_Progress',
    value: 45000,
    tags: ['Solar', 'Commercial'],
  },
  {
    id: 'p4',
    title: 'Airco Split Unit Install',
    companyId: 'c3',
    status: 'Scheduled',
    value: 2100,
    tags: ['Airco', 'Commercial'],
  },
  {
    id: 'p5',
    title: 'Smart Home Energy Management',
    companyId: 'c1',
    status: 'Lead',
    value: 1200,
    tags: ['Smart Home'],
  },
  {
    id: 'p6',
    title: 'Full Electric Heat Pump',
    companyId: 'c2',
    status: 'Done',
    value: 12500,
    tags: ['Heatpump', 'Commercial'],
  },
  {
    id: 'p7',
    title: '8x Solar Panels East-West',
    companyId: 'c4',
    status: 'In_Progress',
    value: 3200,
    tags: ['Solar', 'Residential'],
  },
];

export const formItems: FormItem[] = [
  {
    id: 'f1',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '25-03 11:00 - 25-03 15:00 - 260021',
    createdAt: '25-03-2026 08:59',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '25-03-2026 14:08',
    updatedBy: 'Damian Tobolski'
  },
  {
    id: 'f2',
    name: '2600201-Energiewacht B.V.-Installatie',
    status: 'PUBLISHED',
    project: '2600201-Energiewacht B.V.-Installatie',
    planningsregel: '-',
    createdAt: '23-03-2026 09:46',
    createdBy: 'Sandra Brader',
    updatedAt: '23-03-2026 09:46',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f3',
    name: '2600181-Energiewacht B.V.-Installatie',
    status: 'PUBLISHED',
    project: '2600181-Energiewacht B.V.-Installatie',
    planningsregel: '-',
    createdAt: '17-03-2026 09:31',
    createdBy: 'Sandra Brader',
    updatedAt: '17-03-2026 09:32',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f4',
    name: '2600180-Energiewacht B.V.-Installatie',
    status: 'PUBLISHED',
    project: '2600180-Energiewacht B.V.-Installatie',
    planningsregel: '-',
    createdAt: '17-03-2026 09:27',
    createdBy: 'Sandra Brader',
    updatedAt: '17-03-2026 09:27',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f5',
    name: '2600172-Energiewacht B.V.-Installatie',
    status: 'PUBLISHED',
    project: '2600172-Energiewacht B.V.-Installatie',
    planningsregel: '-',
    createdAt: '13-03-2026 07:32',
    createdBy: 'Sandra Brader',
    updatedAt: '13-03-2026 07:32',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f6',
    name: 'Restpunt algemeen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '12-03 09:00 - 12-03 12:00 - 260006',
    createdAt: '12-03-2026 10:39',
    createdBy: 'Sandra Brader',
    updatedAt: '12-03-2026 18:31',
    updatedBy: 'Damian Tobolski'
  },
  {
    id: 'f7',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '12-03 08:00 - 12-03 12:00 - 260016',
    createdAt: '11-03-2026 13:56',
    createdBy: 'Sandra Brader',
    updatedAt: '18-03-2026 08:32',
    updatedBy: 'Team 1 ZP'
  },
  {
    id: 'f8',
    name: '2600151-Binnema Vastgoedonderhoud',
    status: 'PUBLISHED',
    project: '2600151-Binnema Vastgoedonderhoud',
    planningsregel: '-',
    createdAt: '11-03-2026 08:26',
    createdBy: 'Sandra Brader',
    updatedAt: '11-03-2026 08:27',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f9',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '10-03 13:00 - 10-03 16:00 - 260016',
    createdAt: '10-03-2026 09:28',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '12-03-2026 06:37',
    updatedBy: 'Team 1 ZP'
  },
  {
    id: 'f10',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '06-03 12:00 - 06-03 15:00 - 260014',
    createdAt: '06-03-2026 09:07',
    createdBy: 'Sandra Brader',
    updatedAt: '12-03-2026 07:27',
    updatedBy: 'Team 1 ZP'
  },
  {
    id: 'f11',
    name: '2600091-Energiewacht B.V.-Installatie',
    status: 'PUBLISHED',
    project: '2600091-Energiewacht B.V.-Installatie',
    planningsregel: '-',
    createdAt: '05-03-2026 10:50',
    createdBy: 'Sandra Brader',
    updatedAt: '05-03-2026 10:50',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f12',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '05-03 13:00 - 05-03 16:00 - 260015',
    createdAt: '05-03-2026 06:28',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '09-03-2026 06:48',
    updatedBy: 'Team 1 ZP'
  },
  {
    id: 'f13',
    name: '2600148-Centrada-Installatie',
    status: 'PUBLISHED',
    project: '2600148-Centrada-Installatie',
    planningsregel: '-',
    createdAt: '04-03-2026 13:02',
    createdBy: 'Sandra Brader',
    updatedAt: '04-03-2026 13:03',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f14',
    name: '2600149-Centrada-Installatie',
    status: 'PUBLISHED',
    project: '2600149-Centrada-Installatie',
    planningsregel: '-',
    createdAt: '04-03-2026 13:01',
    createdBy: 'Sandra Brader',
    updatedAt: '04-03-2026 13:01',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f15',
    name: '2600149-Centrada-Installatie',
    status: 'PUBLISHED',
    project: '2600149-Centrada-Installatie',
    planningsregel: '-',
    createdAt: '04-03-2026 12:56',
    createdBy: 'Sandra Brader',
    updatedAt: '04-03-2026 12:57',
    updatedBy: 'Sandra Brader'
  },
  {
    id: 'f16',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '04-03 12:00 - 04-03 16:30 - 260014',
    createdAt: '04-03-2026 12:53',
    createdBy: 'Sandra Brader',
    updatedAt: '12-03-2026 08:02',
    updatedBy: 'Team 1 ZP'
  },
  {
    id: 'f17',
    name: 'Installatie CV-ketel',
    status: 'DRAFT',
    project: '-',
    planningsregel: '16-03 08:00 - 16-03 14:00 - 260011',
    createdAt: '03-03-2026 13:58',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '03-03-2026 13:58',
    updatedBy: 'Sven | Installatiegroep'
  },
  {
    id: 'f18',
    name: 'Service Algemeen',
    status: 'DRAFT',
    project: '-',
    planningsregel: '03-03 15:00 - 03-03 16:00 - 260013',
    createdAt: '03-03-2026 11:32',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '03-03-2026 11:32',
    updatedBy: 'Sven | Installatiegroep'
  },
  {
    id: 'f19',
    name: 'Installatie zonnepanelen',
    status: 'PUBLISHED',
    project: '-',
    planningsregel: '03-03 13:00 - 03-03 15:00 - 260014',
    createdAt: '03-03-2026 11:31',
    createdBy: 'Sven | Installatiegroep',
    updatedAt: '12-03-2026 07:39',
    updatedBy: 'Team 1 ZP'
  }
];
