---
name: scaffold-module
description: Scaffold een nieuwe tenant-scoped CRM-module conform projectconventies (service + layout + edit-dialog + sidebar-entry + viewRegistry + ModuleGuard). Gebruiken wanneer de gebruiker een nieuwe module of view wil toevoegen die data leest/schrijft uit Firestore.
---

# Scaffold-module

Genereer de standaard bestanden voor een nieuwe module. Referentie-implementaties: `src/lib/ticketService.ts` en `src/components/tickets/TicketsLayout.tsx`.

## Inputs die je moet uitvragen
Als niet aangeleverd, vraag:
1. **Module-naam** (NL, weergave in UI) — bv. "Projectgroepen"
2. **Technische naam** (camelCase, Engels) — bv. `projectGroups`
3. **Firestore collection-name** (snake_case) — bv. `project_groups`
4. **`ModuleKey`** uit `src/lib/modules.ts` die toegang gate't — bv. `projectmanagement`. Als geen passende key bestaat, vraag of module-key toegevoegd moet worden.
5. **Required role(s)** — default `['owner','admin','manager']`
6. **Velden-schema** — lijst van `{ naam, type, verplicht }` die in create/edit-form staan
7. **Kolommen in lijstweergave** — subset van de velden

## Stappenplan

### 1. Service aanmaken: `src/lib/{naam}Service.ts`
- Importeer `tenantCol` uit `firebase.ts`
- Exporteer `{Naam}` type (op basis van velden-schema + `id`, `createdAt`, `updatedAt`)
- Exporteer: `subscribeTo{Naam}s(cb)`, `add{Naam}(data)`, `update{Naam}(id, patch)`, `delete{Naam}(id)`
- Writes gebruiken `serverTimestamp()` voor timestamps
- **Gebruik `tenantCol('{collection}')` — nooit `collection(db, '{collection}')`**

### 2. Zod-schema: `src/components/{naam}/{Naam}Form.schema.ts`
- Exporteer `{naam}Schema` op basis van velden
- Exporteer `type {Naam}FormValues = z.infer<typeof {naam}Schema>`

### 3. Edit-dialog: `src/components/{naam}/{Naam}EditDialog.tsx`
- Hergebruik `src/components/ui/EditDialog.tsx`
- Gebruik `react-hook-form` + `zodResolver`
- Props: `{ open, onClose, item?: {Naam} }` (item optioneel = create-mode)
- Submit → `add{Naam}` of `update{Naam}`

### 4. Layout: `src/components/{naam}/{Naam}Layout.tsx`
- Subscribe via `useCollection` of direct `subscribeTo{Naam}s`
- `DataTableToolbar` met search + kolom-toggle + export
- Tabel met `useResizableColumns`
- "+ Nieuw" knop opent `{Naam}EditDialog` in create-mode
- Rij-actie Bewerken → dialog in edit-mode
- Rij-actie Verwijderen → `ConfirmDeleteDialog` → `delete{Naam}`

### 5. Sidebar-entry: [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)
- Voeg menu-item toe met icoon (lucide-react), label, target route
- Controleer of `requiredModule` leidt tot 🔒-weergave bij geen toegang

### 6. View-registry: [src/lib/viewRegistry.ts](src/lib/viewRegistry.ts)
- Voeg entry met `requiredRoles` en `requiredModule`

### 7. Routing: voeg route in router-config
- Pad `/dashboard/{naam}` → `<ModuleGuard module="{key}"><{Naam}Layout /></ModuleGuard>`

### 8. Security rules: `firestore.rules`
- Voeg regel binnen `match /tenants/{tenantId}/{collection}/{docId}` met `hasRole()` + `hasModule()` (gebruik de `firestore-rules` skill)

## Afronding

- Draai `npm run lint` — moet schoon zijn
- Start `npm run dev` en test: create → list → edit → delete
- Test met een user-account dat de module NIET heeft → moet UpgradeOverlay zien
- Test met role zonder rechten → menu-item verborgen

## Do-nots

- Geen eigen subscribe-hook bouwen als `useCollection` volstaat
- Geen magic strings voor collectie-namen buiten de service
- Geen inline vertalingen of hardcoded `tenantId`
- Niet de service buiten de layout hergebruiken zonder eerst te kijken of een bestaande service past
