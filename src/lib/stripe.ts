import { ModuleKey } from './modules';

// TODO: Vul hier de echte Stripe Price ID's in vanuit je Stripe Dashboard
export const STRIPE_PRICES: Record<'basis' | ModuleKey, string | null> = {
  basis: 'price_basis_monthly_2900', // €29/user/month
  crm: null,            // inbegrepen
  dashboarding: null,   // inbegrepen
  offertes: 'price_offertes_monthly_1500', // €15/user/month
  planning: 'price_planning_monthly_1500', // €15/user/month
  facturering: 'price_facturering_monthly_1500', // €15/user/month
  projectmanagement: 'price_projectmanagement_monthly_1500', // €15/user/month
  voorraadbeheer: 'price_voorraadbeheer_monthly_1500', // €15/user/month
  formulieren: 'price_formulieren_monthly_1000', // €10/user/month
  documenten: 'price_documenten_monthly_1000', // €10/user/month
  klantportaal: 'price_klantportaal_monthly_1500', // €15/user/month
  automatiseringen: 'price_automatiseringen_monthly_2000', // €20/user/month
  ai_assistent: 'price_ai_assistent_monthly_2000', // €20/user/month
};

/**
 * Bouwt de line_items array op voor een Stripe Checkout Session of Subscription Update.
 */
export function buildLineItems(
  users: number,
  modules: ModuleKey[]
): Array<{ price: string; quantity: number }> {
  // Voeg altijd het basispakket toe
  const items = [{ price: STRIPE_PRICES.basis as string, quantity: users }];
  
  // Voeg de extra gekozen modules toe
  for (const m of modules) {
    const price = STRIPE_PRICES[m];
    if (price) {
      items.push({ price, quantity: users });
    }
  }
  
  return items;
}

/**
 * Helper voor registratie checkout (Fase 12 voorbereiding)
 * Zodra de Stripe Extension actief is, schrijf je deze data naar de juiste subcollectie (bijv. customers/{uid}/checkout_sessions)
 */
export const createCheckoutSessionPayload = (
  tenantId: string,
  users: number,
  modules: ModuleKey[],
  successUrl: string,
  cancelUrl: string
) => {
  return {
    mode: 'subscription',
    line_items: buildLineItems(users, modules),
    success_url: successUrl,
    cancel_url: cancelUrl,
    trial_period_days: 14,
    metadata: { tenantId }
  };
};

/**
 * Helper voor module/user update (Fase 12 voorbereiding)
 */
export const createSubscriptionUpdatePayload = (
  tenantId: string,
  subscriptionId: string,
  users: number,
  modules: ModuleKey[]
) => {
  return {
    subscriptionId,
    items: buildLineItems(users, modules),
    proration_behavior: 'create_prorations',
    metadata: { tenantId, reden: 'subscription_update' }
  };
};

/**
 * Helper voor opzegging (Fase 12 voorbereiding)
 */
export const createCancelSubscriptionPayload = (
  tenantId: string,
  subscriptionId: string
) => {
  return {
    subscriptionId,
    cancel_at_period_end: true,
    metadata: { tenantId }
  };
};
/**
 * Haalt de module key op basis van een Stripe Price ID.
 */
export function getModuleKeyFromPrice(priceId: string): ModuleKey | 'basis' | null {
  for (const [key, id] of Object.entries(STRIPE_PRICES)) {
    if (id === priceId) return key as ModuleKey | 'basis';
  }
  return null;
}
