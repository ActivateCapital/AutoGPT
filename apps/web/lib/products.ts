// Product catalog for the CreAI Automation Kits storefront.
//
// PAYMENT LINKS are live Stripe Payment Links (Managed Payments enabled —
// Stripe is merchant of record and handles tax and invoicing). Each link
// redirects after purchase to /thanks/<slug>, which serves the download
// (see lib/delivery.ts). If a product ever needs to be pulled, set its
// paymentLink back to PAYMENT_LINK_PENDING and the buy button disables.

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
    id: 'agent-skills-pack',
    name: 'Agent Skills Pack',
    tagline:
      'Five business skills for Claude Code, Cursor, and every SKILL.md-compatible agent. Copy a folder — the AI you already pay for becomes your ops team.',
    price: '$29',
    paymentLink: 'https://buy.stripe.com/aFa00jdQBbVv64k7cgcIE00',
    outcomes: [
      'Lead scoring, inbox triage, and content repurposing inside your agent',
      'Plus two more: meeting transcripts → owned action items, and honest weekly reviews',
      'Installs in 60 seconds — no Python, no API key, no hosting',
    ],
    contents: [
      'Five production SKILL.md skills with editable reference files',
      'Works in Claude Code, Cursor, Copilot, Codex CLI, and 20+ agents',
      'Structural test suite + install guide for every platform',
      'Same customization layer as the full kits (rubric, context, voice)',
    ],
  },
  {
    id: 'lead-qualifier-kit',
    name: 'Lead Qualifier Agent Kit',
    tagline:
      'Stop eyeballing your lead list. Score, rank, and route every inbound lead with a Claude-powered agent you run yourself.',
    price: '$49',
    paymentLink: 'https://buy.stripe.com/4gMbJ1cMxgbLeAQdAEcIE01',
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
    paymentLink: 'https://buy.stripe.com/fZu00j27T1gR2S868ccIE02',
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
    paymentLink: 'https://buy.stripe.com/eVqbJ1h2N2kVboE548cIE03',
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
  name: 'Everything Bundle',
  tagline: 'All three kits plus the Agent Skills Pack: every workflow, both formats.',
  price: '$99',
  paymentLink: 'https://buy.stripe.com/3cIcN5dQB8JjfEU9kocIE04',
  outcomes: ['All three kits + the Agent Skills Pack', 'Save $67 vs. buying separately', 'All future updates included'],
  contents: [],
};

export const doneForYou = {
  name: 'Done-For-You Agent Build',
  price: 'from $499',
  tagline:
    'We scope one workflow, build the automation, test it against your real data, and hand it over running — fixed price, one revision round included.',
  contactSubject: 'Done-For-You Agent Build inquiry',
};
