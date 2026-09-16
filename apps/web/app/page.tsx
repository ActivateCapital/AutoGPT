import { kits, bundle, doneForYou, CONTACT_EMAIL, PAYMENT_LINK_PENDING, type Product } from '@/lib/products';
import {
  LogoMark,
  IconLeads,
  IconInbox,
  IconRepurpose,
  IconSkills,
  IconKey,
  IconRuns,
  IconCraft,
  IconCheck,
  IconArrow,
  IconDownload,
  IconGift,
  IconMail,
  IconBuild,
} from '@/components/icons';
import { WorkflowSchematic } from '@/components/schematic';

const kitIcons: Record<string, React.ReactNode> = {
  'agent-skills-pack': <IconSkills className="w-9 h-9 text-brand" />,
  'lead-qualifier-kit': <IconLeads className="w-9 h-9 text-brand" />,
  'inbox-triage-kit': <IconInbox className="w-9 h-9 text-brand" />,
  'content-repurposer-kit': <IconRepurpose className="w-9 h-9 text-brand" />,
};

function BuyButton({ product, highlighted = false }: { product: Product; highlighted?: boolean }) {
  const pending = product.paymentLink === PAYMENT_LINK_PENDING;
  const base = 'w-full py-3.5 rounded-md font-semibold text-center block transition-colors';

  if (pending) {
    return (
      <span className={`${base} bg-paper-deep text-ink-soft border border-line cursor-not-allowed`}>
        Launching soon
      </span>
    );
  }
  return (
    <a
      href={product.paymentLink}
      rel="noopener"
      className={`${base} ${
        highlighted
          ? 'bg-brand hover:bg-brand-deep text-paper'
          : 'bg-ink hover:bg-black text-paper'
      }`}
    >
      Buy {product.price} — instant download
    </a>
  );
}

export default function Home() {
  const contactReady = CONTACT_EMAIL !== 'CONTACT_EMAIL_PENDING';

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b hairline bg-paper/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <LogoMark className="w-7 h-7 text-brand" />
            <span className="font-display text-2xl font-semibold tracking-tight">CreAI</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#free-skill" className="hidden sm:block text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              Free skill
            </a>
            <a href="#done-for-you" className="hidden sm:block text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              Done-for-you
            </a>
            <a
              href="#kits"
              className="px-5 py-2.5 bg-brand hover:bg-brand-deep text-paper text-sm font-semibold rounded-md transition-colors"
            >
              Get the kits
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden border-b hairline">
        <WorkflowSchematic className="pointer-events-none absolute inset-y-0 right-0 h-full w-[58rem] max-w-none opacity-80 hidden md:block [mask-image:linear-gradient(to_right,transparent,black_28%)]" />
        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-6">
              <span className="w-8 h-px bg-brand inline-block" />
              Working automations you own
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
              Ship a working AI&nbsp;agent this afternoon.
            </h1>
            <p className="text-lg md:text-xl text-ink-soft leading-relaxed mb-9 max-w-measure">
              CreAI Automation Kits are complete, tested agent automations — the prompt
              system, the runnable code, the recipes, the setup guide. One payment,
              yours forever, doing real work today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#kits"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors"
              >
                See the kits
                <IconArrow className="w-4 h-4" />
              </a>
              <a
                href="#free-skill"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ink/25 hover:border-ink text-ink font-semibold rounded-md transition-colors"
              >
                <IconGift className="w-4 h-4 text-accent" />
                Try a skill free
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              {['15-minute setup', 'No subscription — you own the files', 'Runs on your own Claude API key'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Why a kit */}
      <section className="border-b hairline bg-paper-deep/60">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-12 max-w-2xl">
            Why a kit beats another subscription
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border hairline rounded-lg overflow-hidden">
            {[
              {
                icon: <IconKey className="w-8 h-8 text-brand" />,
                title: 'You own it',
                description:
                  'One payment. The prompts, code, and recipes are yours to run, edit, and reuse forever. No per-seat pricing, no lock-in, nothing hosted by us.',
              },
              {
                icon: <IconRuns className="w-8 h-8 text-brand" />,
                title: 'It actually runs',
                description:
                  'Every kit ships runnable code with sample data and a passing test suite — not a PDF of ideas. If you can paste an API key, you can run it.',
              },
              {
                icon: <IconCraft className="w-8 h-8 text-brand" />,
                title: 'You stay in charge',
                description:
                  'Every automation drafts; you decide. Nothing here sends an email, posts content, or touches your accounts on its own. That’s a design principle, not a limitation.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-paper p-8">
                <div className="mb-5">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-ink-soft leading-relaxed text-[0.95rem]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free skill */}
      <section id="free-skill" className="border-b hairline">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="border border-accent/40 rounded-lg bg-paper p-8 md:p-12 md:flex items-center gap-12">
            <div className="flex-1">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-accent mb-5">
                <IconGift className="w-4 h-4" />
                Free — no email, no signup
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Try the Meeting Actions skill, on us
              </h2>
              <p className="text-ink-soft leading-relaxed mb-3 max-w-measure">
                One of the five skills from the Agent Skills Pack: drop a meeting
                transcript on Claude Code (or any SKILL.md-compatible agent) and get
                decisions, owned action items with deadlines, and a ready-to-paste
                follow-up email.
              </p>
              <p className="text-sm text-ink-soft mb-0">
                Install: unzip into <code className="text-brand font-medium">~/.claude/skills/</code>.
                That&apos;s the whole setup — and exactly how the paid skills work too.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:text-center shrink-0">
              <a
                href="/downloads/creai-meeting-actions-free.zip"
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:opacity-90 text-paper font-semibold rounded-md transition-opacity"
              >
                <IconDownload className="w-4 h-4" />
                Download free skill
              </a>
              <p className="text-xs text-ink-soft mt-3">
                Liked it? The other four are{' '}
                <a href="#kits" className="text-brand font-medium underline underline-offset-2">
                  $29 for the pack
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kits */}
      <section id="kits" className="border-b hairline bg-paper-deep/60">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">The kits</h2>
            <p className="text-lg text-ink-soft">
              Pick the workflow that hurts most. Each kit is complete on its own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {kits.map((kit) => (
              <article key={kit.id} className="flex flex-col bg-paper border hairline rounded-lg p-8">
                <div className="flex items-start justify-between mb-5">
                  {kitIcons[kit.id]}
                  <p className="text-right">
                    <span className="font-display text-3xl font-semibold">{kit.price}</span>
                    <span className="block text-xs text-ink-soft">one-time</span>
                  </p>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight mb-3">{kit.name}</h3>
                <p className="text-ink-soft leading-relaxed mb-6 text-[0.95rem]">{kit.tagline}</p>

                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-brand mb-2.5">What you get done</p>
                <ul className="space-y-2 mb-6">
                  {kit.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-ink">
                      <IconCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>

                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-ink-soft mb-2.5">In the box</p>
                <ul className="space-y-2 mb-8">
                  {kit.contents.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <span className="w-1 h-1 rounded-full bg-ink-soft shrink-0 mt-2" />
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <BuyButton product={kit} />
                </div>
              </article>
            ))}
          </div>

          {/* Bundle */}
          <div className="relative bg-ink text-paper rounded-lg p-8 md:p-10 md:flex items-center gap-10">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-accent mb-3">Best value</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-2">{bundle.name}</h3>
              <p className="text-paper/70 mb-4 max-w-measure">{bundle.tagline}</p>
              <ul className="space-y-1.5">
                {bundle.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-paper/90">
                    <IconCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 md:mt-0 md:w-64 shrink-0 text-center">
              <p className="mb-4">
                <span className="font-display text-5xl font-semibold">{bundle.price}</span>
                <span className="block text-sm text-paper/60 mt-1">one-time</span>
              </p>
              <BuyButton product={bundle} highlighted />
            </div>
          </div>
        </div>
      </section>

      {/* Done-for-you */}
      <section id="done-for-you" className="border-b hairline">
        <div className="max-w-6xl mx-auto px-5 py-20 md:flex items-start gap-14">
          <div className="shrink-0 mb-6 md:mb-0">
            <IconBuild className="w-10 h-10 text-brand" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              {doneForYou.name}
            </h2>
            <p className="text-lg mb-1">
              <span className="font-display font-semibold">{doneForYou.price}</span>
              <span className="text-ink-soft"> · fixed scope, fixed price</span>
            </p>
            <p className="text-ink-soft leading-relaxed mb-7 max-w-measure">{doneForYou.tagline}</p>
            {contactReady ? (
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(doneForYou.contactSubject)}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink hover:bg-black text-paper font-semibold rounded-md transition-colors"
              >
                <IconMail className="w-4 h-4" />
                Tell us about your workflow
              </a>
            ) : (
              <span className="inline-block px-7 py-3.5 bg-paper-deep text-ink-soft border border-line rounded-md font-semibold cursor-not-allowed">
                Launching soon
              </span>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b hairline bg-paper-deep/60">
        <div className="max-w-3xl mx-auto px-5 py-20">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-12">Straight answers</h2>
          <dl className="space-y-10">
            {[
              {
                q: 'What exactly do I download?',
                a: 'A zip with the full kit: the prompt system (editable markdown), a small Python command-line tool, a no-code recipe for Zapier or similar, sample data, a test suite, and a step-by-step setup guide. Nothing is hosted by us; it all runs on your side.',
              },
              {
                q: 'What do I need to run it?',
                a: 'For the Agent Skills Pack: just a SKILL.md-compatible agent you already use (Claude Code, Cursor, Copilot, etc.) — copy the folders in and you’re done. For the full kits: an Anthropic (Claude) API key, and either Python 3.10+ for the CLI or a Zapier-style account for the no-code recipe; API usage typically costs cents per run.',
              },
              {
                q: 'Is this a subscription?',
                a: 'No. One payment, yours forever, including updates to the product you bought. The only recurring cost is your own Claude API usage.',
              },
              {
                q: 'What if it doesn’t work for me?',
                a: '14-day money-back guarantee, no questions asked. Email us your receipt and you get a refund.',
              },
              {
                q: 'Who built this?',
                a: 'These products were built almost entirely by an AI agent — researched, coded, tested, and documented — with humans setting the strategy, reviewing the output, and holding the keys. That’s also why every product is opinionated about keeping you in the loop: the agent drafts, you decide.',
              },
              {
                q: 'Is this the CreAI no-code platform?',
                a: 'Not yet. The visual agent-builder platform is on our roadmap, and kit customers get first access when it ships. The kits are how we deliver value today instead of asking you to join a waitlist.',
              },
            ].map((item) => (
              <div key={item.q}>
                <dt className="font-display text-lg font-semibold mb-2">{item.q}</dt>
                <dd className="text-ink-soft leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b hairline">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <LogoMark className="w-10 h-10 text-brand mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-5">
            One kit. One afternoon.
            <br />
            One workflow off your plate.
          </h2>
          <p className="text-lg text-ink-soft mb-9">
            For less than an hour of anyone&apos;s time — with a 14-day guarantee if we&apos;re wrong.
          </p>
          <a
            href="#kits"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors"
          >
            Pick your kit
            <IconArrow className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <LogoMark className="w-5 h-5 text-brand" />
            <span>© 2026 CreAI. All rights reserved.</span>
          </div>
          <p className="text-center md:text-right max-w-xl text-xs leading-relaxed">
            Kits are independent products built on the Claude API. Claude is a trademark of
            Anthropic; CreAI is not affiliated with or endorsed by Anthropic.
          </p>
        </div>
      </footer>
    </div>
  );
}
