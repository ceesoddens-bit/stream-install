import { ModuleKey } from './modules';

// Vul hier de echte Stripe Price ID's in vanuit het Stripe Dashboard.
// Drie basisprijzen (één per roltype) + modulekosten per betaalde gebruiker (owner + admin).
export const STRIPE_PRICES: Record<'owner_basis' | 'admin_basis' | 'member_basis' | ModuleKey, string | null> = {
  owner_basis:  'price_owner_monthly_2900',   // €29/owner/maand
  admin_basis:  'price_admin_monthly_1900',   // €19/admin/maand
  member_basis: 'price_member_monthly_900',   // €9/member/maand
  crm:          null,                          // inbegrepen
  dashboarding: null,                          // inbegrepen
  offertes:           'price_offertes_monthly_1500',
  planning:           'price_planning_monthly_1500',
  facturering:        'price_facturering_monthly_1500',
  projectmanagement:  'price_projectmanagement_monthly_1500',
  voorraadbeheer:     'price_voorraadbeheer_monthly_1500',
  formulieren:        'price_formulieren_monthly_1000',
  documenten:         'price_documenten_monthly_1000',
  klantportaal:       'price_klantportaal_monthly_1500',
  automatiseringen:   'price_automatiseringen_monthly_2000',
  ai_assistent:       'price_ai_assistent_monthly_2000',
};

export function buildLineItems(
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number,
  modules: ModuleKey[]
): Array<{ price: string; quantity: number }> {
  const items: Array<{ price: string; quantity: number }> = [];
  const betaaldeGebruikers = aantalOwners + aantalAdmins;

  if (aantalOwners > 0)
    items.push({ price: STRIPE_PRICES.owner_basis as string, quantity: aantalOwners });
  if (aantalAdmins > 0)
    items.push({ price: STRIPE_PRICES.admin_basis as string, quantity: aantalAdmins });
  if (aantalMembers > 0)
    items.push({ price: STRIPE_PRICES.member_basis as string, quantity: aantalMembers });

  for (const m of modules) {
    const price = STRIPE_PRICES[m];
    if (price && betaaldeGebruikers > 0) {
      items.push({ price, quantity: betaaldeGebruikers });
    }
  }

  return items;
}

export const createCheckoutSessionPayload = (
  tenantId: string,
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number,
  modules: ModuleKey[],
  successUrl: string,
  cancelUrl: string
) => {
  return {
    mode: 'subscription',
    line_items: buildLineItems(aantalOwners, aantalAdmins, aantalMembers, modules),
    success_url: successUrl,
    cancel_url: cancelUrl,
    trial_period_days: 14,
    metadata: { tenantId },
  };
};

export const createSubscriptionUpdatePayload = (
  tenantId: string,
  subscriptionId: string,
  aantalOwners: number,
  aantalAdmins: number,
  aantalMembers: number,
  modules: ModuleKey[]
) => {
  return {
    subscriptionId,
    items: buildLineItems(aantalOwners, aantalAdmins, aantalMembers, modules),
    proration_behavior: 'create_prorations',
    metadata: { tenantId, reden: 'subscription_update' },
  };
};

export const createCancelSubscriptionPayload = (
  tenantId: string,
  subscriptionId: string
) => {
  return {
    subscriptionId,
    cancel_at_period_end: true,
    metadata: { tenantId },
  };
};

export function getModuleKeyFromPrice(priceId: string): ModuleKey | 'owner_basis' | 'admin_basis' | 'member_basis' | null {
  for (const [key, id] of Object.entries(STRIPE_PRICES)) {
    if (id === priceId) return key as ModuleKey | 'owner_basis' | 'admin_basis' | 'member_basis';
  }
  return null;
}
