export type ManagementUser = {
  id: string;
  name: string;
  address: string;
  email: string;
  departments: string;
  role: string;
  hourlyRate1: string;
  hourlyRate2: string;
  archived: boolean;
};

export const managementUsers: ManagementUser[] = [
  {
    id: 'mu1',
    name: 'hans alberts',
    address: '-',
    email: 'hans@installatiegroepduurzaam.nl',
    departments: 'installatiegroepduurza…',
    role: 'Administrator',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu2',
    name: 'Sven | Installatiegroep Duurz…',
    address: '-',
    email: 'sven@installatiegroepduurzaam.nl',
    departments: 'installatiegroepduurza…',
    role: 'Administrator',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu3',
    name: 'Connor van Dreemen',
    address: '-',
    email: 'service@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu4',
    name: 'Sandra Brader',
    address: '-',
    email: 'admin@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Administrator',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu5',
    name: 'Elektra Team',
    address: '-',
    email: 'elektra@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu6',
    name: 'Daniel Leutscher',
    address: '-',
    email: 'daniel@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu7',
    name: 'Damian Tobolski',
    address: '-',
    email: 'damian@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu8',
    name: 'Patrick Van wingerden',
    address: '-',
    email: 'patrickvw1979@gmail.com',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
  {
    id: 'mu9',
    name: 'Team 1 ZP',
    address: '-',
    email: 'info@installatiegroepduurzaam.nl',
    departments: '-',
    role: 'Monteur',
    hourlyRate1: '-',
    hourlyRate2: '-',
    archived: false,
  },
];

export type ManagementCustomer = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const managementCustomers: ManagementCustomer[] = [
  { id: 'mc1', name: 'D. Abrahams', email: 'modena7@hotmail.com', role: 'Klantomgeving' },
  { id: 'mc2', name: 'Herman Paddenburg -', email: 'h_paddenburg@gmail.com', role: 'Klantomgeving' },
  { id: 'mc3', name: 'VL Dempster', email: 'vicdemp@hotmail.com', role: 'Klantomgeving' },
  { id: 'mc4', name: 'fam. Bragt', email: 'admin@installatiegroepduurzaam.nl', role: 'Klantomgeving' },
  { id: 'mc5', name: 'J. Heil', email: 'j.heil@outlook.com', role: 'Klantomgeving' },
  { id: 'mc6', name: 'Bianca Elderkamp', email: 'biancaelderkamp@gmail.com', role: 'Klantomgeving' },
  { id: 'mc7', name: 'Menno van Zaane', email: 'mennovz@gmail.com', role: 'Klantomgeving' },
  { id: 'mc8', name: 'T. Sikkema', email: 'tietsiekema@gmail.com', role: 'Klantomgeving' },
  { id: 'mc9', name: 'Mahesh Ferdinando', email: 'mahesh.ferdinando@ziggo.nl', role: 'Klantomgeving' },
  { id: 'mc10', name: 'Wido Nijens', email: 'wri-nijens@live.nl', role: 'Klantomgeving' },
  { id: 'mc11', name: 'Peter Sengers', email: 'petersengers@hotmail.com', role: 'Klantomgeving' },
  { id: 'mc12', name: 'Richard Edelenbos', email: 'r.j.edelenbos@gmail.com', role: 'Klantomgeving' },
  { id: 'mc13', name: 'AHP Groes', email: 'tgroes@chello.nl', role: 'Klantomgeving' },
  { id: 'mc14', name: 'N. Koppenhagen', email: 'nkoppenhagen@hotmail.com', role: 'Klantomgeving' },
  { id: 'mc15', name: 'Marcel de Graaf', email: 'info@degraafsvskeuken.nl', role: 'Klantomgeving' },
  { id: 'mc16', name: 'Chantal van Hatte,', email: 'chantal.van.hattum@xs4all.nl', role: 'Klantomgeving' },
  { id: 'mc17', name: 'dhr Boelhouver', email: 'rob.j.boelhouver@gmail.com', role: 'Klantomgeving' },
];

export type AutomationRow = {
  id: string;
  name: string;
  description: string;
  version: string;
  location: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export const automationRows: AutomationRow[] = [
  {
    id: 'a08dd63b-ce…',
    name: '001 - Ontvang',
    description: '001 - Ontvang',
    version: '1b_1',
    location: 'Paris',
    createdAt: '12-05-2025 12:48',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '69cbb7e5-18…',
    name: '002 - Advies',
    description: '002 - Advies',
    version: '1b_4',
    location: 'Paris',
    createdAt: '12-05-2025 13:08',
    createdBy: 'Lars Albrechts',
    updatedAt: '06-01-2026 09:09',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: 'edd495f6-ca3…',
    name: '003 - Offerte',
    description: '003 - Offerte',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 13:01',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '4ef7852a-9cc…',
    name: '004 - Offerte',
    description: '004 - Offerte',
    version: '1b_3',
    location: 'Paris',
    createdAt: '12-05-2025 13:01',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '6544a139-5db…',
    name: '005 - Order',
    description: '005 - Offerte',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 10:37',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '4750203d-20…',
    name: '006 - Geen Op',
    description: '006 - Geen Op',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 10:29',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 01:58',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: 'd37bed69-4cf…',
    name: '007 - Parkeer',
    description: '007 - Parkeer',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 10:39',
    createdBy: 'Lars Albrechts',
    updatedAt: '19-01-2026 15:58',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: '0f3c4e1f-49f…',
    name: '008 - Ontvang',
    description: '008 - Ontvang',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 13:01',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 11:43',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '20691bde-6b…',
    name: '009 - Geen op',
    description: '009 - Geen op',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 10:35',
    createdBy: 'Lars Albrechts',
    updatedAt: '16-12-2025 11:00',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: '9a9eebb5-12…',
    name: '010 - Montag',
    description: '010 - Montag',
    version: '1b_9',
    location: 'Paris',
    createdAt: '12-05-2025 11:08',
    createdBy: 'Lars Albrechts',
    updatedAt: '06-01-2026 11:26',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: 'f45b9c90-3d…',
    name: '011 - Restpun',
    description: '011 - Restpun',
    version: '1b_1',
    location: 'Paris',
    createdAt: '12-05-2025 10:31',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: 'f4971248-2b…',
    name: '012 - Oplever',
    description: '012 - Oplever',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 12:04',
    createdBy: 'Lars Albrechts',
    updatedAt: '06-01-2026 10:07',
    updatedBy: 'Patrick Boesveld',
  },
  {
    id: '8ade71fa-6a1…',
    name: '013 - Restpun',
    description: '013 - Restpun',
    version: '1b_3',
    location: 'Paris',
    createdAt: '12-05-2025 10:34',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
  {
    id: '2bc7812b-25…',
    name: '014 - Gefactu',
    description: '014 - Gefactu',
    version: '1b_2',
    location: 'Paris',
    createdAt: '12-05-2025 10:36',
    createdBy: 'Lars Albrechts',
    updatedAt: '27-06-2025 10:07',
    updatedBy: 'Dennis Spekreijse',
  },
];

export type AutomationEmailRow = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  children?: { id: string; name: string; active: boolean }[];
};

export const automationEmailRows: AutomationEmailRow[] = [
  {
    id: 'ae1',
    name: '020 – Service gepland',
    description: '020 – Service',
    active: true,
    children: [
      { id: 'ae1c1', name: 'Mail(ecab2814-94…)', active: true },
    ]
  },
  {
    id: 'ae2',
    name: '001 – Ontvangstbevestiging',
    description: '001 – Ontvan…',
    active: true,
    children: [
      { id: 'ae2c1', name: 'Mail(91a9204d-bb…)', active: true },
    ]
  },
  {
    id: 'ae3',
    name: '009 – Geen opdracht',
    description: '009 – Geen op…',
    active: false,
    children: [
      { id: 'ae3c1', name: 'Mail(1f0a7676-76…)', active: false },
    ]
  },
  {
    id: 'ae4',
    name: '010 – Montage gepland',
    description: '010 – Monta…',
    active: true,
    children: [
      { id: 'ae4c1', name: 'Mail(ecab2814-94…)', active: true },
      { id: 'ae4c2', name: 'Mail(3ca93575-44…)', active: true },
    ]
  },
  {
    id: 'ae5',
    name: '013 – Restpunt gepland',
    description: '013 – Restpur…',
    active: true,
    children: [
      { id: 'ae5c1', name: 'Mail(fccf9a13-94…)', active: true },
    ]
  },
  {
    id: 'ae6',
    name: 'Mail(ecab2814-94…)',
    description: '-',
    active: true,
  },
  {
    id: 'ae7',
    name: 'Mail(3ca93575-44…)',
    description: '-',
    active: true,
  },
];

export type EmailTemplateRow = {
  id: string;
  name: string;
  templateType: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
};

export const emailTemplateRows: EmailTemplateRow[] = [
  {
    id: 'et1',
    name: 'Offerte met klantportaal',
    templateType: 'Project',
    version: 1,
    updatedAt: '10-06-2025 13:47',
    updatedBy: 'Lars Albrechts',
  },
  {
    id: 'et2',
    name: 'Offerte',
    templateType: 'Project',
    version: 1,
    updatedAt: '10-06-2025 13:47',
    updatedBy: 'Lars Albrechts',
  },
  {
    id: 'et3',
    name: 'Factuur',
    templateType: 'Factuur',
    version: 2,
    updatedAt: '24-07-2025 14:30',
    updatedBy: 'Lars Albrechts',
  },
];

export type FormTemplateListRow = {
  id: string;
  name: string;
  types: string[];
  planningTypes: string[];
  standaard: string;
  bewerker: string;
  beheer: string;
  hulpverlening: string;
  updatedAt: string;
  updatedBy: string;
};

export const formTemplateListRows: FormTemplateListRow[] = [
  {
    id: 'ftl1',
    name: 'CV-Installatie',
    types: ['Install', 'Serv'],
    planningTypes: ['Instal', 'Servi'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '10-06-2025 16:13',
    updatedBy: 'Lars Albrechts',
  },
  {
    id: 'ftl2',
    name: 'EW-Warmtepomp',
    types: ['Install', 'Serv'],
    planningTypes: ['Instal', 'Install'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 10:40',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl3',
    name: 'Schouwing Zon',
    types: ['Install', 'Serv'],
    planningTypes: ['Adviesgespre…'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 10:45',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl4',
    name: 'Schouwing Vloerisolatie',
    types: ['Install', 'Serv'],
    planningTypes: ['-'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 10:51',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl5',
    name: 'Service - Algemeen',
    types: ['Install', 'Serv'],
    planningTypes: ['S', 'S', 'S', 'S'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 11:00',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl6',
    name: 'Werk - Algemeen',
    types: ['Install', 'Serv'],
    planningTypes: ['In', 'Ad', 'Ins'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 11:03',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl7',
    name: 'Werkregistratie koelinstallati…',
    types: ['Install', 'Serv'],
    planningTypes: ['-'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 11:59',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl8',
    name: 'Zonnepanelen',
    types: ['Install', 'Serv'],
    planningTypes: ['Installatie zon'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '12-06-2025 12:12',
    updatedBy: 'Anael Motta',
  },
  {
    id: 'ftl9',
    name: 'Uitvoering-Vloerisolatie',
    types: ['Install', 'Serv'],
    planningTypes: ['Adviesgespre…'],
    standaard: 'Alles',
    bewerker: '-',
    beheer: 'Alles',
    hulpverlening: 'Alles',
    updatedAt: '16-06-2025 16:13',
    updatedBy: 'Lars Albrechts',
  },
  {
    id: 'ftl10',
    name: 'Elektra Schouwing',
    types: ['Install', 'Serv'],
    planningTypes: ['-'],
    standaard: 'Schouwdouc…',
    bewerker: 'Alles',
    beheer: '-',
    hulpverlening: 'Alles',
    updatedAt: '29-07-2025 06:43',
    updatedBy: 'Sven | Installatiegroe…',
  },
  {
    id: 'ftl11',
    name: 'Inspectie / Schouw CV – War…',
    types: ['Install', 'Serv'],
    planningTypes: ['Ad', 'AG', 'Ad', 'C'],
    standaard: 'Schouwdome…',
    bewerker: 'Alles',
    beheer: '-',
    hulpverlening: 'Alles',
    updatedAt: '18-08-2025 12:49',
    updatedBy: 'Sven | Installatiegroe…',
  },
  {
    id: 'ftl12',
    name: 'Bijlage Monteurs',
    types: ['-'],
    planningTypes: ['-'],
    standaard: '-',
    bewerker: '-',
    beheer: '-',
    hulpverlening: '-',
    updatedAt: '19-08-2025 14:04',
    updatedBy: 'Mike Hager',
  },
];

export type PdfTemplateRow = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: string;
};

export const pdfTemplateRows: PdfTemplateRow[] = [
  { id: 'pdf1', name: 'Slofactuur (Zakelijk)', category: 'Factuur', createdAt: '24-07-2025 15:47', createdBy: 'Lars Albrechts' },
  { id: 'pdf2', name: 'Slofactuur', category: 'Factuur', createdAt: '10-06-2025 13:44', createdBy: 'Lars Albrechts' },
  { id: 'pdf3', name: 'Schouwdocument', category: 'Ingevuld formulier', createdAt: '24-07-2025 13:42', createdBy: 'Lars Albrechts' },
  { id: 'pdf4', name: 'Opleverdocument', category: 'Ingevuld formulier', createdAt: '24-07-2025 13:41', createdBy: 'Lars Albrechts' },
  { id: 'pdf5', name: 'Offerte incl. akkoord en BTW nr', category: 'Offerte', createdAt: '12-08-2025 21:42', createdBy: 'Sven | Installatiegroe…' },
  { id: 'pdf6', name: 'Offerte 28-07 (Met prijs)', category: 'Offerte', createdAt: '19-01-2026 09:25', createdBy: 'Patrick Boseveld' },
  { id: 'pdf7', name: 'Offerte 28-07', category: 'Offerte', createdAt: '28-07-2025 13:05', createdBy: 'Simon Bijlsma' },
  { id: 'pdf8', name: 'Offerte', category: 'Offerte', createdAt: '19-05-2025 12:29', createdBy: 'Lars Albrechts' },
  { id: 'pdf9', name: 'Factuur', category: 'Factuur', createdAt: '10-12-2025 14:38', createdBy: 'Sandra Brader' },
  { id: 'pdf10', name: 'Deelfactuur (Zakelijk)', category: 'Factuur', createdAt: '24-07-2025 15:54', createdBy: 'Lars Albrechts' },
  { id: 'pdf11', name: 'Deelfactuur', category: 'Factuur', createdAt: '10-06-2025 13:43', createdBy: 'Lars Albrechts' },
  { id: 'pdf12', name: 'BB', category: 'Offerte', createdAt: '27-06-2025 16:06', createdBy: 'Sven | Installatiegroe…' },
];
