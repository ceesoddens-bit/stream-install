---
name: wire-crud-table
description: Verbind een bestaande visuele tabel-view aan een Firestore-service met werkende subscribe, search, filters, column-toggle, create via EditDialog en delete via ConfirmDeleteDialog. Gebruiken wanneer een module visueel bestaat maar buttons/filters/CRUD niet werken (bv. Sales, Hours, Management-views).
---

# Wire-crud-table

Maak een bestaande dode tabel werkend. Referentie: [src/components/crm/ContactsLayout.tsx](src/components/crm/ContactsLayout.tsx) en [src/components/tickets/TicketsLayout.tsx](src/components/tickets/TicketsLayout.tsx).

## Checklist bij elke wiring-taak

### 1. Data-subscribe
- [ ] Importeer de juiste service (of bouw er één via `scaffold-module` als hij ontbreekt)
- [ ] Vervang mock/hardcoded array door `useEffect` + `subscribeToX(setItems)` met cleanup
- [ ] Loading-state tonen tot eerste snapshot binnen is
- [ ] Empty-state behouden als er 0 items zijn

### 2. Search-bar
- [ ] Maak zoekterm-state (`const [query, setQuery] = useState('')`)
- [ ] Input binden aan `query`
- [ ] Filter `items` client-side: `items.filter(i => zoekvelden.some(v => i[v]?.toLowerCase().includes(query.toLowerCase())))`
- [ ] Zoekvelden expliciet opgeven (niet alle velden)

### 3. Filters
- [ ] Maak filter-state-object
- [ ] Popover/dropdown voor filter-toggles
- [ ] Combineer filter-predicaten in één `filteredItems` afgeleide
- [ ] "Wis filters" knop als er actieve filters zijn

### 4. Kolom-toggle
- [ ] State `visibleColumns: string[]` met localStorage-persistentie per view-naam
- [ ] Popover met checkboxes per kolom
- [ ] Render alleen kolommen uit `visibleColumns`
- [ ] Combineer met `useResizableColumns` voor breedtes

### 5. Create (+ knop)
- [ ] `+ Nieuw` knop opent `EditDialog` in create-mode
- [ ] Submit schrijft via `addX(formData)` en sluit dialog
- [ ] Success-toast (NL)
- [ ] Optimistic UI niet nodig — subscribe zorgt voor refresh

### 6. Edit (rij-klik of pencil-icoon)
- [ ] Opent `EditDialog` met bestaand item pre-filled
- [ ] Submit via `updateX(id, patch)`
- [ ] Alleen veranderde velden meesturen (zod default values vs. dirty fields)

### 7. Delete (trash-icoon)
- [ ] `ConfirmDeleteDialog` — altijd confirmatie, geen stille delete
- [ ] Destructieve items (veel child-data): "typ NAAM ter bevestiging" pattern
- [ ] Na delete: success-toast, dialog dicht, subscribe refresht

### 8. Bulk-acties (indien nodig)
- [ ] Selectie-checkbox per rij + header "alles"
- [ ] Toolbar toont `{n} geselecteerd` + acties
- [ ] Bulk-delete via batch-write

### 9. Export
- [ ] CSV-export van `filteredItems` (niet raw items — respect filters)
- [ ] Escapen van quotes/komma's
- [ ] Bestandsnaam bevat module + datum

### 10. Permissions & gating
- [ ] Layout gewrapped in `<ModuleGuard module="...">`
- [ ] +Nieuw / Edit / Delete knoppen alleen tonen als `usePermission` OK is
- [ ] Read-only fallback voor lagere rollen

## Verificatie

- [ ] `npm run lint` schoon
- [ ] Happy-path in browser: create → list → filter → edit → delete → export
- [ ] Edge-case: 0 items (empty-state), permission-denied, netwerkfout
- [ ] Test met role zonder schrijfrechten → knoppen verborgen/disabled

## Valkuilen

- Filter-logic rechtstreeks in JSX i.p.v. `useMemo` → render-storm bij grote lijsten
- `useEffect` subscribe zonder cleanup → listener-leak
- Form-values niet resetten bij dialog-close → edit toont data van vorig item
- `serverTimestamp()` vergeten bij update → `updatedAt` blijft oud
- `collection(db, 'X')` direct gebruiken i.p.v. `tenantCol('X')` → multi-tenant breuk
