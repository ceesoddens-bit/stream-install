# Module koppelingen overzicht

## Welke module leest van welke module

| Module | Leest van |
|--------|-----------|
| **CRM** | — (basismodule; anderen lezen van CRM) |
| **Projectmanagement** | CRM (contactId, companyId) |
| **Planning** | Projectmanagement (projectId, projectName), CRM (clientName, contactMobile) |
| **Offertes** | CRM (contactId), Projectmanagement (projectId), Voorraadbeheer (SKU/artikelen) |
| **Facturering** | CRM (contactId), Projectmanagement (projectId), Offertes (conversie offerte→factuur) |
| **Voorraadbeheer** | Projectmanagement (projectName, projectStatus), Planning (plannedDate) |
| **Formulieren** | Planning (planningsregel), Projectmanagement (project) |
| **Klantportaal** | Offertes (eigen quotes), Facturering (eigen invoices), Tickets (eigen tickets), CRM (contact-profiel) |
| **AI-assistent** | Offertes (context), Tickets (context), CRM (context) |
| **Automatiseringen** | Facturering (trigger: verlopen factuur), Offertes (trigger: nieuwe offerte), Tickets (trigger: aanmaken), Planning (trigger: nieuwe regel), CRM (trigger: nieuw contact) |
| **Dashboarding** | Projectmanagement, Tickets, Hours (uren), Planning, Offertes, Facturering |
| **Gebruikersbeheer** | — (wordt gelezen door alle modules voor rechten-check) |

---

## Gedeelde Firestore collecties

| Collectie | Gebruikt door |
|-----------|---------------|
| `companies` | CRM, Offertes, Facturering, Klantportaal |
| `contacts` | CRM, Offertes, Facturering, Tickets, Planning, Klantportaal, Gebruikersbeheer |
| `projects` | Projectmanagement, Planning, Offertes, Facturering, Hours, Tasks, Tickets, Voorraadbeheer |
| `quotes` | Offertes, Facturering (conversie), Klantportaal, Dashboarding |
| `invoices` | Facturering, Klantportaal, Dashboarding |
| `planning` | Planning, Formulieren, Voorraadbeheer (BOM), Dashboard |
| `planning_cards` | Planning, Projectmanagement (Kanban) |
| `tickets` | Tickets, Klantportaal, AI-assistent, Dashboarding |
| `hours` | Hours, Dashboarding, Administratie |
| `tasks` | Tasks, Dashboarding |
| `settings/global_timer` | Dashboarding (HoursWidget), Sidebar (timer) |
| `form_templates` | Formulieren, Management (beheer), Instellingen |
| `form_items` | Formulieren, Planning |
| `inventory` | Voorraadbeheer, Offertes (artikelreferentie) |
| `suppliers` | Voorraadbeheer |
| `bom_items` | Voorraadbeheer, Projectmanagement, Planning |
| `ai_requests` | AI-assistent |
| `invites` | Gebruikersbeheer |
| `counters` | Offertes (offertenummer), Facturering (factuurnummer) |
| `technicians` | Planning |
| `tags` | CRM (contacts, companies), [TODO: verificatie nodig] andere modules |

---

## Kritieke afhankelijkheden

> Als module A kapot is of niet actief, werken deze andere modules ook niet correct:

### CRM kapot / uitgezet
- **Offertes** — kan geen contact meer koppelen
- **Facturering** — kan geen contact meer koppelen
- **Klantportaal** — klant heeft geen contact-profiel → geen portaal-toegang
- **Planning** — `clientName` / `contactMobile` ontbreken op planningsregels
- **Tickets** — geen contactkoppeling mogelijk

### Projectmanagement kapot / uitgezet
- **Planning** — geen `projectId` of `projectName` beschikbaar
- **Offertes** — geen project-koppeling
- **Facturering** — geen project-koppeling
- **Voorraadbeheer** — BOM-items missen projectreferentie

### Gebruikersbeheer (Cloud Functions) kapot
- **Alle modules** — nieuwe gebruikers kunnen niet inloggen (geen `users/{uid}` doc)
- **Alle modules** — rol-wijzigingen propageren niet naar JWT claims → Firestore rules blokkeren

### Facturering kapot
- **Klantportaal** — klant ziet geen facturen
- **Dashboarding** — omzetwidgets tonen geen data

### Planning kapot
- **Formulieren** — `planningsregel`-koppeling werkt niet
- **Voorraadbeheer** — `plannedDate` / `planningStatus` op BOM mist

### counters collectie corrupt/verwijderd
- **Offertes** — automatisch offertenummer werkt niet
- **Facturering** — automatisch factuurnummer werkt niet

---

## Notities bij koppelingen

- Alle koppelingen zijn **id-gebaseerd** (documentId), niet genest of gedenormaliseerd — dit betekent dat bij verwijdering van een contact de gekoppelde offertes/facturen het contactId behouden maar de naam niet meer ophalen.
- `planning_cards` zijn zowel voor Kanban (projectmanagement) als voor de planner (planning) — dit is een gedeelde collectie die door beide modules wordt geschreven en gelezen.
- De `mail/{id}` root-collectie is de brug voor alle e-mail notificaties via Trigger Email Extension — automatiseringen schrijven hiernaar, niet naar een eigen queue.
- Timer-state (`settings/global_timer`) is bewust globaal per tenant (niet per gebruiker) zodat meerdere devices dezelfde timerstand zien.
