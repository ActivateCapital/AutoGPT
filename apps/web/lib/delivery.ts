// Post-purchase delivery manifest. The download directory carries an
// unguessable token; /thanks/* and /dl-*/ are excluded from robots and
// noindexed. Good enough for launch — upgrade path is a route handler that
// verifies the Checkout session with STRIPE_SECRET_KEY before serving.

export const DL_PREFIX = '/dl-eb59cffb6278';

export interface Deliverable {
  slug: string;
  name: string;
  files: { label: string; path: string }[];
}

export const deliverables: Deliverable[] = [
  {
    slug: 'agent-skills-pack',
    name: 'Agent Skills Pack',
    files: [{ label: 'creai-agent-skills-pack-v1.0.zip', path: `${DL_PREFIX}/creai-agent-skills-pack-v1.0.zip` }],
  },
  {
    slug: 'lead-qualifier-kit',
    name: 'Lead Qualifier Agent Kit',
    files: [{ label: 'creai-lead-qualifier-kit-v1.0.zip', path: `${DL_PREFIX}/creai-lead-qualifier-kit-v1.0.zip` }],
  },
  {
    slug: 'inbox-triage-kit',
    name: 'Inbox Triage Agent Kit',
    files: [{ label: 'creai-inbox-triage-kit-v1.0.zip', path: `${DL_PREFIX}/creai-inbox-triage-kit-v1.0.zip` }],
  },
  {
    slug: 'content-repurposer-kit',
    name: 'Content Repurposer Kit',
    files: [{ label: 'creai-content-repurposer-kit-v1.0.zip', path: `${DL_PREFIX}/creai-content-repurposer-kit-v1.0.zip` }],
  },
  {
    slug: 'all-kits-bundle',
    name: 'Everything Bundle',
    files: [{ label: 'creai-everything-bundle-v1.0.zip', path: `${DL_PREFIX}/creai-everything-bundle-v1.0.zip` }],
  },
];
