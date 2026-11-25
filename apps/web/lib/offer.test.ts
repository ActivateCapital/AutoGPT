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
