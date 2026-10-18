// Search guides for skills.creai.dev. Every claim here is one the store already
// stands behind in lib/products.ts or on the homepage: the five skills in the
// Agent Skills Pack, the agents that read SKILL.md, the free Meeting Actions
// skill, prices from the catalog. No download counts, ratings or testimonials.

import { kits, bundle } from '@/lib/products';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.creai.dev';

const pack = kits.find((k) => k.id === 'agent-skills-pack')!;

export interface GuideSection {
  h: string;
  body: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  /** <title>, 60 characters or fewer. */
  title: string;
  /** Meta description, 155 characters or fewer. */
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  crumb: string;
}

/** The five skills in the Agent Skills Pack, as the catalog describes them. */
export const PACK_SKILLS: { name: string; does: string }[] = [
  { name: 'Lead qualification', does: 'Scores and ranks inbound leads against a rubric you edit in plain English, with a written reason for every score.' },
  { name: 'Inbox triage', does: 'Labels every email act-now, respond-today, delegate or archive, and drafts a reply for the ones that need one.' },
  { name: 'Content repurposing', does: 'Turns one post or transcript into channel-ready drafts in your voice.' },
  { name: 'Meeting actions', does: 'Turns a meeting transcript into decisions, owned action items with deadlines, and a drafted follow-up email.' },
  { name: 'Weekly review', does: 'Writes an honest weekly review from what actually happened.' },
];

export const PACK = { name: pack.name, price: pack.price, bundleName: bundle.name, bundlePrice: bundle.price };

const AGENTS = 'Claude Code, Cursor, GitHub Copilot, Codex CLI and 20+ other agents that read SKILL.md';

const COMMON_FAQ = [
  {
    q: 'Do skills cost extra to run?',
    a: 'No. A skill is instructions, not a service. It runs inside the agent subscription or API usage you already have.',
  },
  {
    q: 'Can a skill send emails or post for me?',
    a: 'A skill can only do what your agent can do. Every skill CreAI ships drafts for your review and never sends, posts or spends on its own.',
  },
];

export const GUIDES: Guide[] = [
  {
    slug: 'claude-skills',
    title: 'Claude Skills for Business — Install in 60 Seconds | CreAI',
    description:
      'Ready-made Claude skills for lead scoring, inbox triage, content, meetings and weekly reviews. Copy a folder, start a session, done. Try one free.',
    eyebrow: 'Claude skills',
    h1: 'Claude skills that do real business work',
    lede:
      'A skill turns Claude from a general assistant into a specialist that does one job properly, every time. The CreAI Agent Skills Pack is five of them, built for the work that eats a small team’s week, and they install by copying a folder.',
    crumb: 'Claude skills',
    sections: [
      {
        h: 'Five skills, one pack',
        body: [`The ${PACK.name} is ${PACK.price}, one payment. Each skill does one job:`],
        list: PACK_SKILLS.map((s) => `${s.name}: ${s.does}`),
      },
      {
        h: 'Built to be edited, not just installed',
        body: [
          'Each skill keeps its opinions in editable reference files: your ideal-customer rubric, your reply style, your voice. Change one plain-English file once and the skill behaves like it works for you.',
        ],
      },
      {
        h: 'No Python, no API key, no hosting',
        body: [
          `The skills are plain SKILL.md folders. They run in ${AGENTS}, so you use them in the agent you already pay for.`,
        ],
      },
      {
        h: 'Try one before you buy',
        body: [
          'The Meeting Actions skill is free to download with no email required. It is a complete production skill, so you can see exactly what the pack contains.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a Claude skill?',
        a: 'A folder with a SKILL.md file: a short description of when the skill applies and a body of instructions for how to do the job. When your request matches the description, the agent loads the instructions and follows them.',
      },
      {
        q: 'How do I install a Claude skill?',
        a: 'Copy the skill folder into ~/.claude/skills/ for all your projects, or into your-repo/.claude/skills/ to share it with your team through git. Start a new session and it is ready.',
      },
      ...COMMON_FAQ,
    ],
  },
  {
    slug: 'agent-skills',
    title: 'Agent Skills (SKILL.md) for Claude Code & Cursor | CreAI',
    description:
      'Agent skills are SKILL.md folders that Claude Code, Cursor, Copilot and Codex CLI all read. Five business skills, one format, every agent you use.',
    eyebrow: 'Agent skills · SKILL.md',
    h1: 'One skill format, every agent you already use',
    lede:
      'SKILL.md started in Claude Code and spread. Cursor, GitHub Copilot, Codex CLI and 20+ other agents now read the same folders, so a skill you install once works wherever you work.',
    crumb: 'Agent skills',
    sections: [
      {
        h: 'What is inside a SKILL.md file',
        body: [
          'Two parts. Frontmatter with a name and a description, which tells the agent when the skill applies. Then a body of instructions, which tells it how to do the job. Good skills add a references/ folder for the parts you should customise.',
        ],
      },
      {
        h: 'Where the folder goes',
        body: ['Only the install directory differs between agents. In Claude Code it is ~/.claude/skills/ for personal skills, or .claude/skills/ inside a repository for a team. The CreAI pack ships an install guide for every platform.'],
      },
      {
        h: 'What makes an agent skill good',
        body: [],
        list: [
          'A trigger-rich description, so the agent knows when the skill applies.',
          'One job, done properly.',
          'Editable reference files for everything opinionated: rubric, tone, delegation list.',
          'Hard safety rules: it drafts, and never sends, posts or spends on its own.',
          'Honest failure modes: [FILL IN] placeholders instead of invented facts.',
        ],
      },
      {
        h: 'Five ready-made agent skills',
        body: [`The ${PACK.name} (${PACK.price}) follows every rule above, with a structural test suite and an install guide for each platform.`],
        list: PACK_SKILLS.map((s) => `${s.name}: ${s.does}`),
      },
    ],
    faqs: [
      {
        q: 'Which agents support SKILL.md skills?',
        a: `The CreAI skills are built for ${AGENTS}. The folder is the same everywhere; only where you put it changes.`,
      },
      {
        q: 'Do I need to code to use agent skills?',
        a: 'No. Installing a skill is copying a folder, and customising one is editing a plain-English reference file.',
      },
      ...COMMON_FAQ,
    ],
  },
  {
    slug: 'claude-skills-marketplace',
    title: 'Claude Skills Marketplace: Ready-Made Skills | CreAI',
    description:
      'Looking for a Claude skills marketplace? CreAI is a small, tested set of business skills for Claude: one pack, five skills, plus a free one to try first.',
    eyebrow: 'Finding Claude skills',
    h1: 'Fewer skills, each one finished',
    lede:
      'There are plenty of places to find Claude skills, including free open-source ones. CreAI is not a huge catalogue. It is a short list of business skills that are tested, editable and safe by default, so you spend minutes installing instead of hours vetting.',
    crumb: 'Claude skills marketplace',
    sections: [
      {
        h: 'What to check before installing any skill',
        body: ['Whatever you install, from anywhere, look for these:'],
        list: [
          'A description specific enough that the agent knows when to use it.',
          'One clear job, not a grab bag.',
          'Editable reference files for your own rubric, tone and rules.',
          'Safety rules that keep it in draft mode: no sending, posting or spending on its own.',
          'Placeholders instead of invented facts when it lacks information.',
        ],
      },
      {
        h: 'What CreAI sells',
        body: [
          `The ${PACK.name}: five business skills for ${PACK.price}.`,
          `Three Agent Kits for lead qualification, inbox triage and content repurposing, each with a Python CLI and a no-code recipe. The ${PACK.bundleName} has all three kits plus the skills pack for ${PACK.bundlePrice}.`,
          'A Done-For-You Agent Build, from $499, when you want one workflow built and handed over running.',
        ],
      },
      {
        h: 'Start free',
        body: ['Download the Meeting Actions skill with no email required. If it earns its place in your agent, the other four are in the pack.'],
      },
    ],
    faqs: [
      {
        q: 'Is CreAI an official Claude marketplace?',
        a: 'No. CreAI is an independent store. Claude is a trademark of Anthropic, and CreAI is not affiliated with or endorsed by Anthropic.',
      },
      {
        q: 'Is it a one-time purchase?',
        a: 'Yes. Each pack and kit is one payment, and the files are yours.',
      },
      ...COMMON_FAQ,
    ],
  },
  {
    slug: 'claude-code-plugins',
    title: 'Claude Code Plugins vs Skills: What to Install | CreAI',
    description:
      'Claude Code plugins bundle skills with commands and other tools; a skill is the single folder inside. Here is when each fits, plus five ready-made skills.',
    eyebrow: 'Claude Code plugins',
    h1: 'Plugins bundle. Skills do the job.',
    lede:
      'A Claude Code plugin packages several pieces, such as skills, slash commands and connectors, so a team can install them together. A skill is the smallest piece: one folder that teaches the agent one job. Often a skill is all you need.',
    crumb: 'Claude Code plugins',
    sections: [
      {
        h: 'When a skill is enough',
        body: [
          'If you want the agent to do one job well, like triaging an inbox or turning a meeting into action items, a skill does it on its own. There is nothing to configure beyond copying the folder.',
        ],
      },
      {
        h: 'When a plugin makes sense',
        body: [
          'When a team wants the same bundle of skills, commands and integrations everywhere, a plugin keeps it in one installable package. Skills still do the work inside it.',
        ],
      },
      {
        h: 'Five skills, no plugin required',
        body: [`The CreAI ${PACK.name} (${PACK.price}) is plain SKILL.md folders, so it works in Claude Code and in ${AGENTS.replace('Claude Code, ', '')}.`],
        list: PACK_SKILLS.map((s) => `${s.name}: ${s.does}`),
      },
    ],
    faqs: [
      {
        q: 'Do I need a plugin to use CreAI skills?',
        a: 'No. Copy each skill folder into ~/.claude/skills/ or your repository’s .claude/skills/ and start a new session.',
      },
      {
        q: 'Can I share skills with my team?',
        a: 'Yes. Put the folders in your repository’s .claude/skills/ directory and everyone who works in that repo gets them through git.',
      },
      ...COMMON_FAQ,
    ],
  },
];

/** Every guide, including the original Claude Code skills guide, for cross-links. */
export const ALL_GUIDES: { slug: string; label: string }[] = [
  { slug: 'claude-code-skills', label: 'Claude Code skills, explained' },
  { slug: 'claude-skills', label: 'Claude skills for business' },
  { slug: 'agent-skills', label: 'Agent skills (SKILL.md)' },
  { slug: 'claude-skills-marketplace', label: 'Finding Claude skills' },
  { slug: 'claude-code-plugins', label: 'Plugins vs skills' },
];
