// Black Friday / Cyber Monday 2026 offer on the Everything Bundle.
//
// Approved by Mosaiah 2026-11-25: $69 instead of $99, Nov 27 – Dec 1 2026
// (Puerto Rico time, UTC-4). It needs its own Stripe Payment Link at $69,
// which only the Stripe account owner can create. The offer stays OFF unless:
//   - BF_BUNDLE_LINK is a https://buy.stripe.com/ URL,
//   - BF_BUNDLE_PLINK_ID is that link's plink_ id (so /thanks can deliver it),
//   - STRIPE_SECRET_KEY is set (paid files are gated; no discounting free files),
//   - and "now" is inside the window.
// Values starting with "paste-" are placeholders and count as unset.

export const BF_START = Date.parse('2026-11-27T04:00:00Z'); // Nov 27 00:00 AST
export const BF_END = Date.parse('2026-12-02T04:00:00Z'); // end of Dec 1 AST
export const BF_PRICE = '$69';
export const BF_WAS = '$99';

export function envValue(name: string, env: Record<string, string | undefined> = process.env): string | undefined {
  const v = env[name]?.trim();
  if (!v || v.startsWith('paste-')) return undefined;
  return v;
}

export interface BundleOffer {
  link: string;
  paymentLinkId: string;
}

export function activeBundleOffer(
  now: number = Date.now(),
  env: Record<string, string | undefined> = process.env,
): BundleOffer | null {
  if (now < BF_START || now >= BF_END) return null;
  const link = envValue('BF_BUNDLE_LINK', env);
  const plink = envValue('BF_BUNDLE_PLINK_ID', env);
  if (!envValue('STRIPE_SECRET_KEY', env)) return null;
  if (!link || !/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_-]+$/.test(link)) return null;
  if (!plink || !/^plink_[A-Za-z0-9]+$/.test(plink)) return null;
  return { link, paymentLinkId: plink };
}

/** Payment Link ids that may unlock a deliverable, incl. the offer link (any time, so late buyers still get files). */
export function extraPaymentLinkIds(slug: string, env: Record<string, string | undefined> = process.env): string[] {
  if (slug !== 'all-kits-bundle') return [];
  const plink = envValue('BF_BUNDLE_PLINK_ID', env);
  return plink && /^plink_[A-Za-z0-9]+$/.test(plink) ? [plink] : [];
}
