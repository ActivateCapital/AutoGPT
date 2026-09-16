import type { Metadata } from 'next';
import { LogoMark, IconSkills, IconDownload, IconCheck, IconArrow, IconGift } from '@/components/icons';
import { kits } from '@/lib/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.creai.dev';

// Note: a page-level `openGraph` replaces the root layout's block wholesale
// (Next does not deep-merge it), so the image and Twitter card are repeated
// here or link previews for this page would have no picture.
const OG_TITLE = 'Claude Code Skills: How They Work + 5 Ready-Made Business Skills';
const OG_DESCRIPTION =
  'What SKILL.md files are, how skills trigger, how to install them — and a free production skill to try today.';

export const metadata: Metadata = {
  title: OG_TITLE,
  description:
    'A practical guide to Claude Code skills: what a SKILL.md file is, how skills trigger, how to install them in 60 seconds, and where to get ready-made skills for lead scoring, inbox triage, meetings, and content.',
  alternates: { canonical: `${SITE_URL}/claude-code-skills` },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: `${SITE_URL}/claude-code-skills`,
    siteName: 'CreAI',
    locale: 'en_US',
    type: 'article',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'CreAI — working AI agents, this afternoon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ['/og.png'],
  },
};

function Code({ children }: { children: React.ReactNode }) {
  return <code className="text-brand font-medium">{children}</code>;
}

export default function ClaudeCodeSkillsGuide() {
  const skillsPack = kits.find((k) => k.id === 'agent-skills-pack');

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="sticky top-0 z-50 border-b hairline bg-paper/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <LogoMark className="w-7 h-7 text-brand" />
            <span className="font-display text-2xl font-semibold tracking-tight">CreAI</span>
          </a>
          <a
            href="/#kits"
            className="px-5 py-2.5 bg-brand hover:bg-brand-deep text-paper text-sm font-semibold rounded-md transition-colors"
          >
            Get the kits
          </a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-5 py-16">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-5">
          <IconSkills className="w-4 h-4" />
          Guide
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-6">
          Claude Code skills, explained — and five ready-made ones for your business
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed mb-10">
          Skills are the fastest way to turn Claude Code (or Cursor, Copilot, and other
          SKILL.md-compatible agents) from a general assistant into a specialist that does
          one job properly, every time. Here&apos;s how they actually work, how to install
          one in 60 seconds, and a free production skill to try right now.
        </p>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-12 mb-4">What is a Claude Code skill?</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          A skill is a folder containing a <Code>SKILL.md</Code> file — a small markdown
          document with two parts: frontmatter (a <Code>name</Code> and a{' '}
          <Code>description</Code>) and a body of instructions. The description tells the
          agent <em>when</em> the skill applies; the body tells it <em>how</em> to do the
          job. When your request matches a skill&apos;s description, the agent loads those
          instructions and follows them — your prompt stays short, and the expertise lives
          in the file.
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          Skills can also ship <Code>references/</Code> files — editable documents the
          skill reads at runtime. That&apos;s where good skills put the parts you should
          customize: your ideal-customer rubric, your reply style, your voice. Edit one
          plain-English file once, and the skill behaves like it works for <em>you</em>.
        </p>
        <p className="text-ink-soft leading-relaxed mb-8">
          Because SKILL.md is plain markdown, the format has spread beyond Claude Code:
          Cursor, GitHub Copilot, Codex CLI, and 20+ agents now read the same folders.
          Write once, use in whichever agent you already pay for.
        </p>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-12 mb-4">Installing a skill (60 seconds)</h2>
        <div className="bg-ink text-paper/90 rounded-lg p-5 font-mono text-sm leading-relaxed mb-4 overflow-x-auto">
          <div className="text-paper/50"># personal — available in all your projects</div>
          <div>cp -r the-skill-folder ~/.claude/skills/</div>
          <div className="mt-3 text-paper/50"># or per-project — shared with your team via git</div>
          <div>cp -r the-skill-folder your-repo/.claude/skills/</div>
        </div>
        <p className="text-ink-soft leading-relaxed mb-8">
          Start a new session and the skill triggers automatically when your work matches
          it — or invoke it directly by name, like <Code>/creai-meeting-actions</Code>.
          Uninstalling is deleting the folder. No registries, no daemons.
        </p>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-12 mb-4">What makes a skill good</h2>
        <ul className="space-y-3 mb-8">
          {[
            'A trigger-rich description — the agent can only use a skill it knows applies. "Use when the user pastes emails or asks to triage their inbox" beats "email helper".',
            'One job, done properly. A skill that qualifies leads should not also write your newsletter.',
            'Editable reference files for everything opinionated: your rubric, your tone, your delegation list.',
            'Hard safety rules in the body: a good business skill drafts — it never sends, posts, or spends on its own.',
            'Honest failure modes: instructions to leave [FILL IN] placeholders rather than invent facts.',
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-ink-soft leading-relaxed">
              <IconCheck className="w-4 h-4 text-brand shrink-0 mt-1.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="border border-accent/40 rounded-lg p-7 my-12 bg-paper-deep/50">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-accent mb-3">
            <IconGift className="w-4 h-4" />
            Try one free
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-3">
            Download a production skill, no email required
          </h2>
          <p className="text-ink-soft leading-relaxed mb-5">
            Our Meeting Actions skill turns any meeting transcript into decisions, owned
            action items with deadlines, and a drafted follow-up email. It&apos;s a real,
            complete example of everything above — free.
          </p>
          <a
            href="/downloads/creai-meeting-actions-free.zip"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:opacity-90 text-paper font-semibold rounded-md transition-opacity"
          >
            <IconDownload className="w-4 h-4" />
            Download the free skill
          </a>
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-12 mb-4">Ready-made business skills</h2>
        <p className="text-ink-soft leading-relaxed mb-5">
          If you&apos;d rather install than write, our{' '}
          <a href="/#kits" className="text-brand font-medium underline underline-offset-2">
            Agent Skills Pack
          </a>{' '}
          ships five production skills built exactly this way — lead qualification, inbox
          triage, content repurposing, meeting actions, and weekly reviews — each with the
          editable reference files and safety rules described above, for {skillsPack?.price}.
          Use code <Code>LAUNCH</Code> for 20% off at checkout.
        </p>
        <a
          href="/#kits"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors mb-12"
        >
          See the Agent Skills Pack
          <IconArrow className="w-4 h-4" />
        </a>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-6 mb-4">FAQ</h2>
        <dl className="space-y-6 mb-16">
          {[
            {
              q: 'Do skills cost extra to run?',
              a: 'No — a skill is instructions, not a service. It runs inside the agent subscription or API usage you already have.',
            },
            {
              q: 'Do skills work outside Claude Code?',
              a: 'Yes. The SKILL.md format is read by 20+ agents including Cursor, GitHub Copilot, and Codex CLI; only the install directory differs.',
            },
            {
              q: 'Can a skill take actions on my accounts?',
              a: 'A skill can only do what your agent can do, and a well-written one is explicit about staying in draft mode. Every skill we ship drafts for your review and never sends, posts, or spends.',
            },
          ].map((f) => (
            <div key={f.q}>
              <dt className="font-display text-lg font-semibold mb-1.5">{f.q}</dt>
              <dd className="text-ink-soft leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </article>

      <footer className="py-12 px-5 border-t hairline">
        <div className="max-w-3xl mx-auto text-center text-sm text-ink-soft">
          <p>
            © 2026 CreAI ·{' '}
            <a href="/" className="text-brand font-medium underline underline-offset-2">
              CreAI Automation Kits
            </a>{' '}
            · Claude is a trademark of Anthropic; CreAI is not affiliated with or endorsed by Anthropic.
          </p>
        </div>
      </footer>
    </div>
  );
}
