// Product catalog for the CreAI Automation Kits storefront.
//
// PAYMENT LINKS: each `paymentLink` below must be replaced with a real checkout
// URL from the merchant-of-record account (Gumroad or Lemon Squeezy) before
// launch — see /LAUNCH-CHECKLIST.md at the repo root. While a link still holds
// the PAYMENT_LINK_PENDING sentinel, the storefront renders that product's buy
// button in a disabled "launching soon" state, so the site is safe to deploy
// at any time.

export const PAYMENT_LINK_PENDING = 'PAYMENT_LINK_PENDING';

export const CONTACT_EMAIL: string = 'contact@creai.dev';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  paymentLink: string;
  outcomes: string[];
  contents: string[];
}

export const kits: Product[] = [
  {
    id: 'lead-qualifier-kit',
    name: 'Lead Qualifier Agent Kit',
    tagline:
      'Stop eyeballing your lead list. Score, rank, and route every inbound lead with a Claude-powered agent you run yourself.',
    price: '$49',
    paymentLink: PAYMENT_LINK_PENDING,
    outcomes: [
      'Every lead scored 0–100 with a written reason, not a black box',
      'Ranked CSV out — your best 10 leads on top every morning',
      'Tune the scoring rubric to your ICP in plain English',
    ],
    contents: [
      'Battle-ready scoring prompt system + editable rubric',
      'Python CLI: leads.csv in → scored, ranked CSV out',
      'No-code recipe (Zapier / webhook) for CRM auto-scoring',
      'Sample data, test suite, and a 15-minute setup guide',
    ],
  },
  {
    id: 'inbox-triage-kit',
    name: 'Inbox Triage Agent Kit',
    tagline:
      'Turn a 200-email inbox into a 20-minute review. Classify, prioritize, and pre-draft replies for everything that lands.',
    price: '$39',
    paymentLink: PAYMENT_LINK_PENDING,
    outcomes: [
      'Every email labeled: act-now, respond-today, delegate, archive',
      'A drafted reply attached to everything that needs one',
      'Works on exported email — no risky inbox permissions required to start',
    ],
    contents: [
      'Triage prompt system with priority + intent taxonomy',
      'Python CLI: .eml / mbox files in → triage report + reply drafts out',
      'Gmail label workflow recipe (Zapier / Apps Script)',
      'Sample inbox, test suite, and a 15-minute setup guide',
    ],
  },
  {
    id: 'content-repurposer-kit',
    name: 'Content Repurposer Kit',
    tagline:
      'One blog post or transcript in — an X thread, LinkedIn post, newsletter section, and YouTube description out, in your voice.',
    price: '$49',
    paymentLink: PAYMENT_LINK_PENDING,
    outcomes: [
      'Four channel-native drafts from every piece you publish',
      'Voice profile keeps output sounding like you, not like AI',
      'Minutes per piece instead of an afternoon',
    ],
    contents: [
      'Repurposing prompt system + voice-profile template',
      'Python CLI: post/transcript in → 4 platform-ready drafts out',
      'Channel style guides (X, LinkedIn, newsletter, YouTube)',
      'Sample content, test suite, and a 15-minute setup guide',
    ],
  },
];

export const bundle: Product = {
  id: 'all-kits-bundle',
  name: 'All Three Kits',
  tagline: 'The full stack: leads scored, inbox triaged, content shipped.',
  price: '$99',
  paymentLink: PAYMENT_LINK_PENDING,
  outcomes: ['Everything in all three kits', 'Save $38 vs. buying separately', 'All future kit updates included'],
  contents: [],
};

export const doneForYou = {
  name: 'Done-For-You Agent Build',
  price: 'from $499',
  tagline:
    'We scope one workflow, build the automation, test it against your real data, and hand it over running — fixed price, one revision round included.',
  contactSubject: 'Done-For-You Agent Build inquiry',
};
