---
name: module-guard-wrap
description: Wrap een view of route met ModuleGuard zodat vergrendelde modules een UpgradeOverlay tonen en sidebar-items een 🔒 krijgen. Gebruiken telkens een nieuwe betaalde module-view wordt toegevoegd of een bestaande view nog niet is gated.
---

# Module-guard-wrap

Zorg dat een view correct achter de module-access-check staat. Een view met een vergrendelde module toont een overlay met upgrade-CTA; de sidebar-entry blijft zichtbaar maar met 🔒.

## Wanneer nodig

- Nieuwe view toegevoegd voor een betaalde ModuleKey
- Bestaande view is nog niet gewrapped (audit via grep)
- ModuleKey in `src/lib/modules.ts` gewijzigd (split/merge)

## Stappen

### 1. Kies de juiste `ModuleKey`
Kijk in `src/lib/modules.ts`. Voor inbegrepen modules (`crm`, `dashboarding`) is geen guard nodig — `heeftToegang` retourneert altijd `true`.

### 2. Wrap in routing of layout
Op route-niveau in router-config:
```tsx
<Route path="/dashboard/offertes" element={
  <ModuleGuard module="offertes">
    <QuotesLayout />
  </ModuleGuard>
} />
```

Op tab-niveau (als één layout meerdere modules combineert zoals Finance):
```tsx
<TabsContent value="offertes">
  <ModuleGuard module="offertes"><QuotesTab /></ModuleGuard>
</TabsContent>
<TabsContent value="facturen">
  <ModuleGuard module="facturering"><InvoicesTab /></ModuleGuard>
</TabsContent>
```

### 3. Registry updaten
`src/lib/viewRegistry.ts`: voeg `requiredModule: 'moduleKey'` toe aan de view-entry. Sidebar leest dit en toont 🔒 + route naar `/dashboard/instellingen/abonnement?activeer={key}`.

### 4. Sidebar-gedrag verifiëren
- Menu-item zichtbaar met 🔒 suffix als module niet actief
- Klik stuurt naar subscription-page met query-param
- SubscriptionPage highlight de juiste module-card en scrollt erheen

### 5. Firestore rules synchroniseren
Module-gating in de UI is geen beveiliging — altijd bijpassende `hasModule('key')` in `firestore.rules` (zie `firestore-rules` skill).

## Audit-commando
Grep of elke betaalde module-view gewrapped is:
```
grep -rL "ModuleGuard" src/components/finance src/components/planning src/components/kanban src/components/tickets src/components/hours src/components/tasks src/components/forms src/components/inventory src/components/portal
```

## ModuleGuard component (referentie)

```tsx
// src/components/auth/ModuleGuard.tsx
import { ReactNode } from 'react';
import { useTenant } from '@/lib/tenantContext';
import { UpgradeOverlay } from './UpgradeOverlay';
import type { ModuleKey } from '@/lib/modules';

interface Props {
  module: ModuleKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ModuleGuard({ module, children, fallback }: Props) {
  const { heeftToegang } = useTenant();
  if (heeftToegang(module)) return <>{children}</>;
  return <>{fallback ?? <UpgradeOverlay module={module} />}</>;
}
```

## Valkuilen

- Niet-betaalde module (crm, dashboarding) per ongeluk wrappen → UpgradeOverlay kan onterecht verschijnen als `MODULES` array niet klopt
- Guard in alleen sidebar zonder route-wrap → directe URL-toegang omzeilt de guard
- Vergeten `firestore.rules` mee aan te passen → client zegt "geen toegang" maar server staat wel toe (of vice versa)
- Dubbele wraps (route + parent-component) → overlay kan niet geheel renderen
