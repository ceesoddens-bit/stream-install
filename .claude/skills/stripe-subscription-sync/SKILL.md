---
name: stripe-subscription-sync
description: Synchroniseer een Stripe-subscription met de abonnementsvelden op tenants/{tenantId} als actiefModules, aantalGebruikers of opzeggingsstatus wijzigen. Gebruiken bij registratie-flow, module-toggle in SubscriptionPage, en opzegging. Werkt via de firestore-stripe-payments Firebase Extension.
---

# Stripe-subscription-sync

Houd Stripe en Firestore synchroon. We gebruiken **NIET** eigen Cloud Functions — alles via de `invertase/firestore-stripe-payments` Extension, die ook de webhooks afhandelt.

## Basisprincipe

- **Stripe → Firestore (webhook-sync):** Extension schrijft naar `customers/{uid}/subscriptions/{subId}`. Onze `tenantContext` luistert hierop en kopieert relevante velden naar `tenants/{tId}.{abonnementStatus, stripeSubscriptionId, abonnementEindDatum}`.
- **Firestore → Stripe (client-write):** We schrijven documenten in Extension-specifieke subcollecties en laten Extension dat naar Stripe propageren.

## Setup eenmalig

- [ ] Stripe products aanmaken:
  - `basis_per_user` — recurring, €29/maand, metered: per user
  - `offertes_per_user` — €15/maand per user
  - `planning_per_user` — €15
  - `facturering_per_user` — €15
  - `projectmanagement_per_user` — €15
  - `voorraadbeheer_per_user` — €15
  - `formulieren_per_user` — €10
  - `documenten_per_user` — €10
  - `klantportaal_per_user` — €15
  - `automatiseringen_per_user` — €20
  - `ai_assistent_per_user` — €20
- [ ] Price-IDs opslaan in `src/lib/stripe.ts`:
  ```ts
  export const STRIPE_PRICES: Record<'basis' | ModuleKey, string | null> = {
    basis: 'price_...',
    crm: null,            // inbegrepen
    dashboarding: null,   // inbegrepen
    offertes: 'price_...',
    planning: 'price_...',
    // ...
  };
  ```
- [ ] Firebase Extension `firestore-stripe-payments` installeren met secret Stripe-key
- [ ] Webhook-endpoint uit Extension in Stripe Dashboard registreren

## Flow 1 — Nieuwe registratie (Fase 2.1 stap 4)

- [ ] Na account-creatie: zet `stripeCustomerId` via Extension (luistert op `customers/{uid}`)
- [ ] Schrijf `customers/{uid}/checkout_sessions/{autoId}` met:
  ```ts
  {
    mode: 'subscription',
    line_items: buildLineItems(aantalGebruikers, actiefModules),
    success_url: `${origin}/dashboard?welkom=1`,
    cancel_url: `${origin}/registreren?step=3`,
    trial_period_days: 14,
    metadata: { tenantId }
  }
  ```
- [ ] Extension genereert Checkout-URL → redirect user
- [ ] Na betaling: webhook update `customers/{uid}/subscriptions/{subId}` → onze tenant-sync hook schrijft naar `tenants/{tId}`

## Flow 2 — Module toggle (SubscriptionPage)

- [ ] Gebruiker vinkt module aan/uit in UI
- [ ] Bevestigingsmodal toont nieuwe prijs (`berekenMaandprijs`)
- [ ] Op bevestig: schrijf update-intent naar subscription:
  ```ts
  // via Extension: update de subscription items
  await setDoc(doc(db, `customers/${uid}/subscription_updates/${autoId}`), {
    subscriptionId: tenant.stripeSubscriptionId,
    items: buildLineItems(aantalGebruikers, nieuweModules),
    proration_behavior: 'create_prorations',
    metadata: { tenantId, reden: 'module_toggle' }
  });
  ```
  *(Let op: Extension ondersteunt standaard geen subscription-updates via Firestore — check versie; anders callable Cloud Function aanmaken die Stripe SDK gebruikt.)*
- [ ] Extension/webhook updatet Firestore; onze sync schrijft `actiefModules + maandprijs` naar `tenants/{tId}`
- [ ] Toon toast "Pakket bijgewerkt" pas na webhook-confirmatie (luister op `tenants/{tId}.maandprijs`)

## Flow 3 — Aantal gebruikers wijzigen

- [ ] Elke price-line heeft `quantity = aantalGebruikers`
- [ ] Zelfde update-flow als module-toggle
- [ ] Bij user-invite accepteren of user-delete: herbereken en update

## Flow 4 — Opzegging

- [ ] Confirm ("typ OPZEGGEN"): schrijf `customers/{uid}/subscription_cancellations/{autoId}`:
  ```ts
  {
    subscriptionId: tenant.stripeSubscriptionId,
    cancel_at_period_end: true,
    metadata: { tenantId }
  }
  ```
- [ ] Webhook sync: `abonnementStatus = 'opgezegd'`, `abonnementEindDatum = current_period_end`
- [ ] UI toont "Loopt af op DD-MM-YYYY"
- [ ] Reactiveren vóór einddatum: `cancel_at_period_end: false` set

## Flow 5 — Betaling mislukt / subscription verlopen

- [ ] Webhook update `subscriptions/{subId}.status` → `past_due` of `canceled`
- [ ] Tenant-sync schrijft `abonnementStatus = 'verlopen'`
- [ ] TenantContext stuurt gebruiker bij login naar `/dashboard/instellingen/abonnement` (read-only modus voor rest van app tot betaling)

## Build helpers — `src/lib/stripe.ts`

```ts
export function buildLineItems(
  users: number,
  modules: ModuleKey[]
): Array<{ price: string; quantity: number }> {
  const items = [{ price: STRIPE_PRICES.basis, quantity: users }];
  for (const m of modules) {
    const price = STRIPE_PRICES[m];
    if (price) items.push({ price, quantity: users });
  }
  return items;
}
```

## Testen (Stripe test-mode)

- [ ] Gebruik test-keys + test-cards (4242...)
- [ ] Registreer → checkout → succes → verifieer tenant-doc
- [ ] Toggle module → verifieer prorated invoice in Stripe Dashboard
- [ ] Opzegging → check `cancel_at` timestamp
- [ ] Trial: forceer trial-end via Stripe CLI (`stripe trigger customer.subscription.trial_will_end`)

## Valkuilen

- **Race conditions** bij snelle module-toggles → debounce UI én idempotent via `metadata.tenantId + version`
- **Dubbele subscriptions** na failed checkout → Extension cleaner niet altijd betrouwbaar; voeg guard in UI (als `stripeSubscriptionId` al bestaat, update i.p.v. create)
- **Prijs-mismatch** tussen `src/lib/modules.ts` en Stripe products → één bron van waarheid kiezen; UI toont `berekenMaandprijs`, Stripe rekent af op Price-IDs. **Synchroniseer bij elke prijswijziging.**
- **VAT**: Stripe Tax pas activeren na BTW-validatie (Fase later); voor nu excl. btw factureren
- **Currency**: altijd `eur`; hard-coded in helper
- **Multi-tenant Stripe Customer**: 1 Customer = 1 tenant (niet 1 user!) — gebruik `tenantId` als key, niet `uid`. Custom Extension-config nodig of wrapper-Cloud Function
