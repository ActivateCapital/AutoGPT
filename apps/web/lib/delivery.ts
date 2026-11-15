// Post-purchase delivery.
//
// Paid files live in /private-downloads (NOT /public), so they can only be
// fetched through /api/download/<slug>. Each Stripe Payment Link redirects to
// /thanks/<slug>?session_id={CHECKOUT_SESSION_ID}.
//
// Gate: when STRIPE_SECRET_KEY is set (a restricted key with read access to
// Checkout Sessions is enough), the thanks page and the download route both
// confirm with Stripe that the session is paid and came from this product's
// Payment Link. When the key is NOT set, delivery stays open exactly as it
// was before this change, so deploying this code alone changes nothing for
// buyers; setting the key switches the gate on, unsetting it switches it off.

export interface Deliverable {
  slug: string;
  name: string;
  /** Stripe Payment Link id that sells this product. */
  paymentLinkId: string;
  files: { label: string; file: string }[];
}

export const deliverables: Deliverable[] = [
  {
    slug: 'agent-skills-pack',
    name: 'Agent Skills Pack',
    paymentLinkId: 'plink_1UGCwGEbn7Qq6jsmUz9ersLE',
    files: [{ label: 'creai-agent-skills-pack-v1.0.zip', file: 'creai-agent-skills-pack-v1.0.zip' }],
  },
  {
    slug: 'lead-qualifier-kit',
    name: 'Lead Qualifier Agent Kit',
    paymentLinkId: 'plink_1UGCwREbn7Qq6jsm1pmbsy5p',
    files: [{ label: 'creai-lead-qualifier-kit-v1.0.zip', file: 'creai-lead-qualifier-kit-v1.0.zip' }],
  },
  {
    slug: 'inbox-triage-kit',
    name: 'Inbox Triage Agent Kit',
    paymentLinkId: 'plink_1UGCwUEbn7Qq6jsmMbSH3sWQ',
    files: [{ label: 'creai-inbox-triage-kit-v1.0.zip', file: 'creai-inbox-triage-kit-v1.0.zip' }],
  },
  {
    slug: 'content-repurposer-kit',
    name: 'Content Repurposer Kit',
    paymentLinkId: 'plink_1UGCwYEbn7Qq6jsmYCKk345s',
    files: [{ label: 'creai-content-repurposer-kit-v1.0.zip', file: 'creai-content-repurposer-kit-v1.0.zip' }],
  },
  {
    slug: 'all-kits-bundle',
    name: 'Everything Bundle',
    paymentLinkId: 'plink_1UGCwbEbn7Qq6jsmWW00ULxI',
    files: [{ label: 'creai-everything-bundle-v1.0.zip', file: 'creai-everything-bundle-v1.0.zip' }],
  },
];

export function findDeliverable(slug: string): Deliverable | undefined {
  return deliverables.find((d) => d.slug === slug);
}

export type PurchaseCheck =
  | { ok: true; mode: 'open' | 'verified' }
  | { ok: false; reason: 'missing-session' | 'not-paid' | 'wrong-product' | 'stripe-error' };

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

/** Confirms a Checkout Session paid for this deliverable. Never throws. */
export async function checkPurchase(
  item: Deliverable,
  sessionId: string | null | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<PurchaseCheck> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: true, mode: 'open' };
  if (!sessionId || !SESSION_ID.test(sessionId)) return { ok: false, reason: 'missing-session' };
  try {
    const res = await fetchImpl(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${key}` }, cache: 'no-store' },
    );
    if (res.status === 404) return { ok: false, reason: 'missing-session' };
    if (!res.ok) return { ok: false, reason: 'stripe-error' };
    const s = (await res.json()) as { payment_status?: string; payment_link?: string | null };
    if (s.payment_link !== item.paymentLinkId) return { ok: false, reason: 'wrong-product' };
    if (s.payment_status !== 'paid' && s.payment_status !== 'no_payment_required') {
      return { ok: false, reason: 'not-paid' };
    }
    return { ok: true, mode: 'verified' };
  } catch {
    return { ok: false, reason: 'stripe-error' };
  }
}
