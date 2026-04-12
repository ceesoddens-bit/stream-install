# Page Design & UI-specificatie (desktop-first)
Doel: styling/layout laten overeenkomen met de meegeleverde screenshot (sidebar, topbar, cards, kleuren, typografie).

## 1) Layout
- **Hoofdlayout (app shell)**: 2-koloms grid.
  - Kolom 1: **Sidebar** (fixed, full height).
  - Kolom 2: **Main** met **sticky Topbar** + scrollbare content.
- **Implementatie**: CSS Grid voor shell (`grid-template-columns: 256px 1fr`), binnen content Flex/Grid.
- **Spacing**: base spacing 4px schaal (8/12/16/24/32).
- **Breakpoints (desktop-first)**:
  - ≥1280px: 256px sidebar, content max-width optioneel (bijv. 1200–1360px) gecentreerd.
  - 1024–1279px: 240px sidebar, card grid 2–3 kolommen.
  - ≤1024px (optioneel): sidebar collapsible/drawer.

## 2) Meta information
- Title: “Dashboard”
- Description: “Overzichtspagina met navigatie en KPI-cards.”
- Open Graph:
  - og:title: “Dashboard”
  - og:description: “Overzichtspagina met KPI’s.”
  - og:type: “website”

## 3) Global styles (design tokens)
### 3.1 Kleuren (suggestie; fine-tune naar exacte screenshot)
- **Background app**: `--bg: #F6F7FB`
- **Card**: `--surface: #FFFFFF`
- **Border**: `--border: #E6E8EF`
- **Sidebar bg**: `--sidebar: #0B1220`
- **Sidebar hover**: `--sidebar-hover: rgba(255,255,255,0.06)`
- **Primary** (accent): `--primary: #3B82F6`
- **Text primary**: `--text: #0F172A`
- **Text secondary**: `--muted: #64748B`
- **On-dark text**: `--on-dark: rgba(255,255,255,0.92)`
- **On-dark muted**: `--on-dark-muted: rgba(255,255,255,0.68)`

### 3.2 Typografie
- Font family: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
- Schaal (desktop):
  - H1/pagetitel: 20–22px, 600
  - Section title: 14–16px, 600
  - Body: 14px, 400–500
  - Small/meta: 12px, 400–500
- Line-height: 1.4–1.6

### 3.3 Radius, schaduw, states
- Radius: cards `12px`, inputs/buttons `10px`, badges `999px`
- Shadow card: `0 1px 2px rgba(16,24,40,0.06), 0 8px 24px rgba(16,24,40,0.06)`
- Focus ring: 2px `rgba(59,130,246,0.35)` + outline none
- Hover: subtiele background/border shift (geen grote animaties)
- Transitions: 120–180ms ease-out (background, border, transform)

## 4) Paginastructuur (Dashboard-layout pagina)
### 4.1 App shell
- **Sidebar (links, fixed)**
- **Topbar (boven, sticky)**
- **Main content**
  - Header/intro regel (optioneel)
  - KPI card grid
  - Secundaire cards/secties (zelfde card-stijl)

## 5) Secties & componenten

### 5.1 Sidebar
**Afmetingen & positionering**
- Breedte: 256px (desktop), hoogte: 100vh, `position: sticky` of `fixed`.
- Padding: 16–20px.

**Inhoud**
1. **Brand block**
   - Logo/initials links + productnaam.
   - Tekst kleur: `--on-dark`.
2. **Nav list**
   - Items: icon (20px) + label.
   - Item height: 40–44px, radius 10px.
   - States:
     - Default: label `--on-dark-muted`
     - Hover: background `--sidebar-hover`, label `--on-dark`
     - Active: subtiele accent-indicator (bijv. left border 2px `--primary` of background iets sterker).
3. **Bottom slot** (optioneel)
   - Settings/Help/User (als je huidige site dit heeft).

### 5.2 Topbar
**Afmetingen**
- Hoogte: 64px, `position: sticky; top: 0; z-index: 10`.
- Achtergrond: `--bg` of wit met bottom border `--border`.

**Layout** (Flex)
- Links: pagetitel + (optioneel) breadcrumb.
- Midden: **Search input** (max 480–560px)
- Rechts: action icons + user chip.

**Search input**
- Hoogte: 40px, radius 10px, background wit.
- Border: `1px solid --border`, hover iets donkerder, focus ring primary.
- Placeholder: `--muted`.

**User chip**
- Avatar 28–32px rond + naam/rol (optioneel).

### 5.3 Main content area
- Padding: 24px.
- Max breedte: optioneel 1200–1360px, gecentreerd.
- Sectie spacing: 16–24px.

### 5.4 KPI / Stat Cards (cards in grid)
**Grid**
- Desktop: 3–4 kolommen afhankelijk van ruimte (`minmax(240px, 1fr)`), gap 16px.

**Card container**
- Background `--surface`, border `--border`, radius 12px, shadow (zie tokens).
- Padding: 16–18px.

**Card inhoud**
- Eyebrow/label: 12px, `--muted`, 500.
- Value: 24–28px, `--text`, 700.
- Delta/subtekst: 12–13px; positief groen (optioneel) / negatief rood (optioneel) maar subtiel.
- Rechterkant: kleine icon badge (32px) met lichte tint van primary (bijv. `rgba(59,130,246,0.12)`).

### 5.5 Secundaire cards/secties
- Gebruik exact dezelfde card-stijl voor consistentie.
- Header rij: titel links, kleine action rechts (button/link).

## 6) Interactie- en toegankelijkheidsregels
- Klikbare targets minimaal 40px hoog.
- Contrast: sidebar tekst minimaal AA; gebruik `--on-dark` voor actieve/hover state.
- Focus zichtbaar op alle inputs/knoppen/nav-items.
- Motion: respecteer `prefers-reduced-motion`.
