# Page Design – Voorraad / Leveranciers-tab (desktop-first)

## Pagina: Voorraad – Leveranciers

### Layout
- **Primary layout**: gestapelde secties (vertical stack) met vaste page container breedte zoals in screenshot.
- **Alignment & spacing**: header (titel links, acties rechts) op één rij; toolbar direct onder header; tabel neemt volledige beschikbare breedte; paginering onder de tabel.
- **Responsive gedrag (secundair)**: desktop-first; op kleinere breedtes toolbar-items onder elkaar stapelen, tabel horizontaal scrollbaar i.p.v. kolommen verbergen (tenzij al bestaand patroon in app).

### Meta Information
- **Title**: “Voorraad – Leveranciers”
- **Description**: “Beheer en bekijk leveranciers in je voorraad.”
- **Open Graph**: og:title = “Leveranciers”, og:description = bovenstaande, og:type = “website”

### Global Styles (tokens, conform screenshot)
- **Background**: lichte neutrale achtergrond; content op witte kaart/oppervlak voor tabel.
- **Typography**: 
  - Pagina-titel: semibold, groter dan body (H1-stijl)
  - Tabeltekst: regular body
  - Kolomheaders: smaller/semibold, subtiel contrasterend
- **Buttons**:
  - Primary: gevulde knop (actie “toevoegen” zoals screenshot)
  - Secondary: outlined/ghost (eventuele extra actie zoals screenshot)
  - Hover: lichte tintverandering; focus: duidelijke outline
- **Inputs**:
  - Zoekveld met afgeronde hoeken en subtiele border; icoon/placeholder zoals screenshot.
- **Tables**:
  - Header-rij met lichte achtergrond of duidelijke scheidingslijn
  - Rij-hover met subtiele highlight
  - Verticale spacing en gridlines conform screenshot

### Page Structure
1. **Tab-content container** (Leveranciers-tab binnen Voorraad)
2. **Header bar** (titel + acties)
3. **Toolbar** (zoeken)
4. **Data table** (kolommen + rijen + rij-acties)
5. **Footer row** (paginering)

### Sections & Components

#### 1) Header (titel + acties)
- **Links**: 
  - H1 “Leveranciers”.
- **Rechts**:
  - Primary actieknop (label conform screenshot, bv. “Leverancier toevoegen”).
  - Secundaire knop(pen) indien zichtbaar in screenshot (zelfde hoogte als primary).
- **States**:
  - Disabled state indien actie niet beschikbaar (zelfde layout, grijs).

#### 2) Toolbar
- **Zoekveld**:
  - Plaatsing: links uitgelijnd boven de tabel, zoals screenshot.
  - Gedrag: typen filtert de tabelresultaten; clear (x) optioneel als het al app-breed gebruikt wordt.
  - Placeholder: in lijn met screenshot (bv. “Zoeken…”).

#### 3) Tabel
- **Tabelcontainer**:
  - Witte achtergrond (card/oppervlak) met border en/of subtiele schaduw zoals in screenshot.
- **Kolomheaders**:
  - Exacte volgorde, labels, uitlijning en breedtes afstemmen op screenshot.
  - Sort-indicatoren alleen als al zichtbaar in screenshot; anders niet tonen.
- **Rijen**:
  - Klikgedrag: geen extra navigatie toevoegen; alleen hover-highlight zoals screenshot.
  - Tekst truncation: lange waarden afkappen met ellipsis; tooltip op hover alleen als dit bestaand patroon is.
- **Rij-acties**:
  - Meest rechts: “meer” icoon (⋯) / actie-menu knop.
  - Menu opent als popover met acties (labels conform bestaand systeem; inhoud niet uitbreiden in deze notitie).
- **Lege staat**:
  - Wanneer geen data: toon lege tabel/empty state binnen dezelfde card, met korte melding en behoud van header/toolbar.

#### 4) Paginering
- **Plaatsing**: onder de tabel, rechts of zoals in screenshot.
- **Elementen**:
  - Vorige/volgende knoppen.
  - Huidige pagina-indicator (en/of pagina-nummers) volgens screenshot.
- **States**:
  - Vorige disabled op pagina 1; volgende disabled op laatste pagina.

### Interactie & feedback (kort)
- **Loading**: skeleton rijen of tabel-loader in dezelfde card zonder layout shift.
- **Errors**: compacte inline melding boven de tabel (geen modal), zodat header/toolbar intact blijft.
