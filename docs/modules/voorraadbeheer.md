# Voorraadbeheer

## Status
Volledig gebouwd. 7 tabs: Artikelen, Magazijnen, Leveranciers, Inkooporders, Stkoverzicht, Mutaties, BOM. CRUD voor alle entiteiten.

## Firestore collecties
- `tenants/{tenantId}/inventory` — artikelen: sku, name, category, stock, minStock, price, unit, location, status (Op voorraad/Bijna op/Niet op voorraad)
- `tenants/{tenantId}/warehouses` — magazijnen: shortCode, name, subCount
- `tenants/{tenantId}/suppliers` — leveranciers: name, currency, address, kvk
- `tenants/{tenantId}/purchase_orders` — inkooporders: orderNumber, supplierId, supplierName, status (Concept/Verzonden/Ontvangen/Geannuleerd), totalAmount, orderDate, expectedDeliveryDate
- `tenants/{tenantId}/mutations` — voorraadmutaties: itemId, warehouseId, type (In/Uit/Correctie), quantity, date, reference, note
- `tenants/{tenantId}/stock_overview` — geaggregeerd stockoverzicht: artikel, magazijn, locatie, statusLocatie, hoeveelheid, prijsPerStuk, wisselkoers, totaal
- `tenants/{tenantId}/bom_items` — bill of materials: projectName, projectStatus, planningStatus, plannedDate, articleName, sku, requiredQuantity

## Services
- [src/lib/inventoryService.ts](../../src/lib/inventoryService.ts) — CRUD voor alle 7 voorraadbeheer-entiteiten

## Componenten
- [src/components/inventory/InventoryLayout.tsx](../../src/components/inventory/InventoryLayout.tsx) — module entry met tabs
- [src/components/inventory/ArticlesTable.tsx](../../src/components/inventory/ArticlesTable.tsx) — artikeltabel
- [src/components/inventory/WarehousesTable.tsx](../../src/components/inventory/WarehousesTable.tsx) — magazijntabel
- [src/components/inventory/SuppliersTable.tsx](../../src/components/inventory/SuppliersTable.tsx) — leverancierstabel
- [src/components/inventory/PurchaseOrdersTable.tsx](../../src/components/inventory/PurchaseOrdersTable.tsx) — inkoopordertabel
- [src/components/inventory/StockOverviewTable.tsx](../../src/components/inventory/StockOverviewTable.tsx) — stockoverzicht
- [src/components/inventory/MutationsTable.tsx](../../src/components/inventory/MutationsTable.tsx) — mutaties-log
- [src/components/inventory/BOMTable.tsx](../../src/components/inventory/BOMTable.tsx) — bill of materials

## Koppelingen met andere modules
- **Projectmanagement**: BOM-items bevatten `projectName`, `projectStatus` en `planningStatus`
- **Planning**: BOM-items bevatten `plannedDate` (gekoppeld aan planningsregel)
- **Offertes**: offerteregels kunnen artikelen uit `inventory` bevatten (SKU-referentie)
- **Facturering**: [TODO: verificatie nodig] artikelen hergebruikt als factuurregels

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | `voorraad.view` + optioneel `voorraad.edit` |
| customer | geen toegang |

Permissie-keys: `voorraad.view`, `voorraad.edit`, `voorraad.delete`

## Module-toegang
Module-key: `voorraadbeheer` — **betaald** (€15/gebruiker/maand)
Wrap views met `<ModuleGuard module="voorraadbeheer">`.

## Nog te bouwen
- [TODO: verificatie nodig] Automatische stock-alert bij minStock overschrijding (via Trigger Email)
- [TODO: verificatie nodig] Barcode-scanner integratie (mobiel)
- [TODO: verificatie nodig] Stock-overzicht realtime aggregatie (nu handmatig in stock_overview?)
- [TODO: verificatie nodig] Wisselkoers automatisch bijwerken
