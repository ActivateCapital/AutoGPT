import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeBundleOffer, extraPaymentLinkIds, envValue, BF_START, BF_END } from './offer';
const full = { STRIPE_SECRET_KEY: 'rk_live_x', BF_BUNDLE_LINK: 'https://buy.stripe.com/abc123', BF_BUNDLE_PLINK_ID: 'plink_1ABC' };
const mid = BF_START + 3600e3;
test('off before/after window', () => { assert.equal(activeBundleOffer(BF_START - 1, full), null); assert.equal(activeBundleOffer(BF_END, full), null); });
test('on in window with all env', () => { assert.deepEqual(activeBundleOffer(mid, full), { link: full.BF_BUNDLE_LINK, paymentLinkId: 'plink_1ABC' }); });
test('off without key or with placeholders', () => {
  assert.equal(activeBundleOffer(mid, { ...full, STRIPE_SECRET_KEY: undefined }), null);
  assert.equal(activeBundleOffer(mid, { ...full, STRIPE_SECRET_KEY: 'paste-key' }), null);
  assert.equal(activeBundleOffer(mid, { ...full, BF_BUNDLE_LINK: 'paste-link' }), null);
  assert.equal(activeBundleOffer(mid, { ...full, BF_BUNDLE_LINK: 'https://evil.com/x' }), null);
  assert.equal(activeBundleOffer(mid, { ...full, BF_BUNDLE_PLINK_ID: 'nope' }), null);
});
test('extra plink only for bundle', () => { assert.deepEqual(extraPaymentLinkIds('all-kits-bundle', full), ['plink_1ABC']); assert.deepEqual(extraPaymentLinkIds('lead-qualifier-kit', full), []); assert.deepEqual(extraPaymentLinkIds('all-kits-bundle', { BF_BUNDLE_PLINK_ID: 'paste-x' }), []); });
test('envValue', () => { assert.equal(envValue('A', { A: ' paste-1' }), undefined); assert.equal(envValue('A', { A: 'v' }), 'v'); });
test('window = Nov 27 00:00 AST to Dec 2 00:00 AST', () => { assert.equal(new Date(BF_START).toISOString(), '2026-11-27T04:00:00.000Z'); assert.equal(new Date(BF_END).toISOString(), '2026-12-02T04:00:00.000Z'); });

import { checkPurchase, findDeliverable } from './delivery';
const paidFrom = (plink: string) => (async () => new Response(JSON.stringify({ payment_status: 'paid', payment_link: plink }), { status: 200 })) as unknown as typeof fetch;
test('checkPurchase: offer link unlocks the bundle only; main link still works', async () => {
  const saved = { k: process.env.STRIPE_SECRET_KEY, p: process.env.BF_BUNDLE_PLINK_ID };
  process.env.STRIPE_SECRET_KEY = 'rk_test_x';
  process.env.BF_BUNDLE_PLINK_ID = 'plink_OFFER1';
  try {
    const bundle = findDeliverable('all-kits-bundle')!;
    const kit = findDeliverable('lead-qualifier-kit')!;
    const sid = 'cs_live_abcdefghijklmnop';
    assert.deepEqual(await checkPurchase(bundle, sid, paidFrom('plink_OFFER1')), { ok: true, mode: 'verified' });
    assert.deepEqual(await checkPurchase(bundle, sid, paidFrom(bundle.paymentLinkId)), { ok: true, mode: 'verified' });
    assert.deepEqual(await checkPurchase(kit, sid, paidFrom('plink_OFFER1')), { ok: false, reason: 'wrong-product' });
    process.env.STRIPE_SECRET_KEY = 'paste-key';
    assert.deepEqual(await checkPurchase(kit, null), { ok: true, mode: 'open' });
  } finally {
    if (saved.k === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = saved.k;
    if (saved.p === undefined) delete process.env.BF_BUNDLE_PLINK_ID; else process.env.BF_BUNDLE_PLINK_ID = saved.p;
  }
});

// Checkout and delivery must point at the same Stripe account (CreaiDev, acct_1QU4AFIritf6Tf1Z):
// a session from another account can't be verified with that account's key.
test('every deliverable plink is on the CreaiDev account and every product has a matching link', async () => {
  const { deliverables } = await import('./delivery');
  const { kits, bundle } = await import('./products');
  for (const d of deliverables) assert.match(d.paymentLinkId, /^plink_1\w+Iritf6Tf1Z\w+$/, d.slug);
  const links = [...kits, bundle].map((p) => p.paymentLink);
  for (const l of links) assert.match(l, /^https:\/\/buy\.stripe\.com\/\w+cIE0\d$/);
  assert.equal(new Set(links).size, links.length);
});
