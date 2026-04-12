# Page Design — Administratie (Offertes / Facturen / Urenregistratie)

## Globale ontwerpafspraken (voor alle pagina’s)
### Layout
- Desktop-first (min. 1280px) met centrale contentcontainer (max-width ~1200–1360px) en consistente horizontale padding.
- Gebruik Flexbox voor header/toolbar-uitlijning en CSS Grid voor tabellen/kaartjes waar nodig.

### Meta informatie (basis)
- Title format: `Administratie — {Tabnaam}` (bijv. `Administratie — Facturen`).
- Description: `Beheer offertes, facturen en urenregistraties op één plek.`
- Open Graph: title = page title, description = meta description.

### Global styles / design tokens
- Background: licht neutraal (bijv. #F7F8FA), content surfaces wit (#FFFFFF) met subtiele border (#E5E7EB).
- Typography: 16px base; H1 24–28px semibold; H2 18–20px semibold; table text 14–16px.
- Primary button: solide accentkleur, hover donkerder; disabled met 60% opacity.
- Secondary button: outline; hover met lichte background tint.
- Status-badges: pill-shape, small (12–14px), kleur per status.
- Links: accentkleur, underline op hover.

---

## Pagina: Administratie

### Layout
- Bovenaan een paginakop (titel links) en optioneel ruimte rechts voor globale acties.
- Daaronder een tabstrip met 3 tabbladen: **Offertes**, **Facturen**, **Urenregistratie**.
- Tabcontent is een “card surface” met:
  1) toolbar (links: zoeken/filters, rechts: primaire CTA)
  2) tabel met resultaten
  3) paginering

### Page structure
1. **Page header**
2. **Tab navigation**
3. **Tab content container** (toolbar + tabel + paginering)

### Secties & componenten
#### 1) Page header
- Titel: `Administratie`.
- (Optioneel) korte helpertekst onder de titel: `Beheer offertes, facturen en uren.`

#### 2) Tab navigation
- Horizontale tabs met duidelijke active state (accent underline + semibold).
- Tabs:
  - Offertes
  - Facturen
  - Urenregistratie
- Interactie:
  - Klik wisselt tab zonder volledige page reload.
  - Onthoud laatst gekozen tab (local storage) zodat je terugkomt waar je was.

---

## Tab: Facturen (UI/functionaliteit conform screenshot)

### Layout
- Toolbar in één rij (Flexbox): links zoeken + filter(s), rechts primaire actie.
- Tabel in volledige breedte met vaste header (sticky) bij scroll.

### Meta informatie
- Title: `Administratie — Facturen`
- Description: `Bekijk, filter en beheer je facturen.`

### Toolbar (boven de tabel)
- **Tabtitel / sectietitel**: `Facturen` (visueel H2 binnen tabcontent).
- **Zoekveld** (links):
  - Placeholder: `Zoek...` (zoeken in minimaal factuurnummer, klantnaam en omschrijving).
  - Clear (x) knop wanneer gevuld.
- **Statusfilter** (naast zoekveld):
  - Dropdown met minimaal: `Alle`, `Concept`, `Verzonden`, `Betaald`, `Vervallen`.
- **Primaire CTA** (rechts): knop `Nieuwe factuur`.

### Facturen-tabel
- Tabelstijl: zebra rows subtiel of hover highlight; randen licht; consistente cell padding.
- Kolommen (zoals in de screenshot-UI bedoeld):
  1. **Datum** (dd-mm-jjjj)
  2. **Factuurnummer**
  3. **Klant**
  4. **Omschrijving** (ellipsize na 1 regel; volledige tekst via tooltip of detailview)
  5. **Bedrag** (rechts uitlijnen, valuta EUR)
  6. **Status** (badge)
  7. **Acties** (rechts): icon/kebab menu of compacte knoppen

#### Sorteren
- Klik op kolomheaders (minimaal Datum en Factuurnummer) toggelt asc/desc.

#### Rij-acties
- `Bekijken/Openen` (navigeert naar factuur details)
- `Bewerken` (alleen wanneer status = concept)
- `Downloaden/Printen` (bijv. PDF)
- `Verwijderen` (bevestigingsdialoog)

### Empty / loading / error states
- Loading: skeleton rows (5–8 rijen) of spinner in tabel.
- Empty (geen resultaten): tekst `Geen facturen gevonden` + suggestie om filters te wissen + knop `Nieuwe factuur`.
- Error: inline alert met `Probeer opnieuw`.

### Paginering
- Onderaan rechts of gecentreerd:
  - Vorige/Volgende
  - Paginanummers of `1–20 van 214`
  - Page size optioneel (bijv. 20/50)

---

## Tab: Offertes (globale specificatie)
- Zelfde structuur als Facturen: toolbar + tabel + paginering.
- Toolbar: zoekveld + statusfilter (concept/verzonden/geaccepteerd/afgewezen) + CTA `Nieuwe offerte`.
- Tabel: datum, offertenummer, klant, omschrijving, bedrag, status, acties (bekijken, bewerken indien concept, verwijderen).

## Tab: Urenregistratie (globale specificatie)
- Toolbar: datumrange filter (bijv. deze maand), zoekveld (omschrijving/klant), CTA `Nieuwe registratie`.
- Tabel: datum, medewerker/naam (indien van toepassing), klant/project, omschrijving, uren (hh:mm), acties (bekijken, bewerken, verwijderen).
