import { ventures } from '@/lib/family';
import { GenerativeCanvas } from '@/components/generative-canvas';
import { Reveal } from '@/components/reveal';
import { LogoMark, IconCraft, IconRuns, IconKey, IconArrow, IconCheck, IconSkills } from '@/components/icons';

const HEADLINE = ['Creativity,', 'meet', 'AI.'];

export default function Home() {
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
            <a href="#ventures" className="hidden sm:block text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              Ventures
            </a>
            <a href="#manifesto" className="hidden sm:block text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              Manifesto
            </a>
            <a
              href="https://skills.creai.dev"
              className="px-5 py-2.5 bg-brand hover:bg-brand-deep text-paper text-sm font-semibold rounded-md transition-colors"
            >
              Get working agents
            </a>
          </div>
        </div>
      </nav>

      {/* Hero — the living painting */}
      <header className="relative border-b hairline overflow-hidden">
        <GenerativeCanvas className="absolute inset-0 w-full h-full" />
        {/* legibility scrim over the artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-paper/20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-28 md:pt-36 md:pb-40 pointer-events-none">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-7">
            <span className="w-8 h-px bg-brand inline-block" />
            The creative intelligence studio
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-semibold leading-[1.02] tracking-tight mb-7">
            {HEADLINE.map((word, i) => (
              <span key={word} className="reveal-word mr-[0.28em]" style={{ animationDelay: `${0.15 + i * 0.18}s` }}>
                {word}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl mb-10">
            CreAI builds tools and ventures where human taste directs machine capability.
            No demos of the future — things that work, shipping now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pointer-events-auto">
            <a
              href="https://skills.creai.dev"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors"
            >
              <IconSkills className="w-4 h-4" />
              CreAI Skills — live now
            </a>
            <a
              href="#ventures"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ink/25 hover:border-ink text-ink font-semibold rounded-md transition-colors bg-paper/60 backdrop-blur-sm"
            >
              Explore the studio
              <IconArrow className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="absolute bottom-4 right-5 text-[11px] text-ink-soft/80 tracking-wide pointer-events-none">
          ◦ live generative ink — drawn fresh for this visit; move your cursor to bend the field
        </p>
      </header>

      {/* Ventures */}
      <section id="ventures" className="border-b hairline bg-paper-deep/60">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">The ventures</h2>
            <p className="text-lg text-ink-soft mb-12 max-w-2xl">
              One studio, several bets — each one shipped only when it genuinely works.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ventures.map((v, i) => (
              <Reveal key={v.id} delay={i * 110}>
                <article
                  className={`flex flex-col h-full rounded-lg p-8 border ${
                    v.status === 'live' ? 'bg-ink text-paper border-ink' : 'bg-paper border-line'
                  }`}
                >
                  <p
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase mb-4 ${
                      v.status === 'live' ? 'text-emerald-300' : 'text-ink-soft'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${v.status === 'live' ? 'bg-emerald-300' : 'bg-line'}`}
                    />
                    {v.status === 'live' ? 'Live' : 'In development'}
                  </p>
                  <h3 className="font-display text-2xl font-semibold tracking-tight mb-1">{v.name}</h3>
                  <p className={`font-medium mb-3 ${v.status === 'live' ? 'text-paper/80' : 'text-brand'}`}>
                    {v.tagline}
                  </p>
                  <p className={`text-sm leading-relaxed mb-6 ${v.status === 'live' ? 'text-paper/70' : 'text-ink-soft'}`}>
                    {v.detail}
                  </p>
                  <div className="mt-auto">
                    {v.url ? (
                      <a
                        href={v.url}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-deep text-paper text-sm font-semibold rounded-md transition-colors"
                      >
                        Visit {new URL(v.url).hostname}
                        <IconArrow className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-ink-soft">No waitlist. It&apos;ll be here when it works.</span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="border-b hairline">
        <div className="max-w-3xl mx-auto px-5 py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-6">
              <span className="w-8 h-px bg-brand inline-block" />
              Manifesto
            </p>
            <div className="font-display text-2xl md:text-[1.7rem] leading-snug space-y-8 tracking-tight">
              <p>
                <span className="text-brand font-semibold">Taste is the interface.</span> Machines can
                generate anything, which makes choosing well the entire job. Our tools put human
                judgment in the driver&apos;s seat and machine capability in the engine.
              </p>
              <p>
                <span className="text-brand font-semibold">The agent drafts, you decide.</span> Nothing
                we ship sends, posts, or spends on its own. Autonomy that removes the human isn&apos;t a
                feature — it&apos;s a liability with better marketing.
              </p>
              <p>
                <span className="text-brand font-semibold">Working beats waitlist.</span> We announce
                ships, not visions. The painting on this page is generated live; the products behind it
                are tested and downloadable today. That&apos;s the standard.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Atlas of Flow — the studio's own artwork */}
      <section className="border-b hairline">
        <div className="max-w-6xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/plate-001.jpg"
                alt="Field Notation — Plate 001: Directed Current. A generative ink drawing of hundreds of fine flow-field strokes bending around a single annotated hexagonal node."
                className="w-full rounded-sm border hairline shadow-[0_24px_70px_-30px_rgba(26,29,33,0.35)] bg-paper"
                loading="lazy"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-2">
            <Reveal delay={120}>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-5">
                <span className="w-8 h-px bg-brand inline-block" />
                Atlas of Flow
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Plate 001 — Directed Current
              </h2>
              <p className="text-ink-soft leading-relaxed mb-4">
                The studio documents its own thesis the way a cartographer maps a coastline:
                two thousand individually placed strokes, one current, one annotated node
                where the flow bends — the decision.
              </p>
              <p className="text-ink-soft leading-relaxed text-sm">
                Drawn by our generative systems under a written design philosophy, in the
                studio&apos;s own ink. The living version is the artwork above — seeded fresh
                for every visitor.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b hairline bg-paper-deep/60">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border hairline rounded-lg overflow-hidden">
            {[
              {
                icon: <IconCraft className="w-8 h-8 text-brand" />,
                title: 'Made with intent',
                description:
                  'From the type to the tools, everything here is designed on purpose — including the artwork above, drawn by an algorithm and steered by you.',
              },
              {
                icon: <IconRuns className="w-8 h-8 text-brand" />,
                title: 'Proof over promise',
                description:
                  'Every venture launches with something you can run, test, and refund. Our store shipped with passing test suites and a free skill — before the marketing.',
              },
              {
                icon: <IconKey className="w-8 h-8 text-brand" />,
                title: 'You own the output',
                description:
                  'We favor one-time purchases, editable files, and open formats over subscriptions and lock-in. What you buy from this studio is yours.',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 110}>
                <div className="bg-paper p-8 h-full">
                  <div className="mb-5">{item.icon}</div>
                  <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-ink-soft leading-relaxed text-[0.95rem]">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b hairline">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <Reveal>
            <LogoMark className="w-10 h-10 text-brand mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-5">
              Start with the venture
              <br />
              that&apos;s already working.
            </h2>
            <p className="text-lg text-ink-soft mb-9">
              CreAI Skills sells complete AI agent automations you own — with a free skill to try in
              the next five minutes.
            </p>
            <a
              href="https://skills.creai.dev"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors"
            >
              Visit skills.creai.dev
              <IconArrow className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <LogoMark className="w-5 h-5 text-brand" />
            <span>© 2026 CreAI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            {ventures
              .filter((v) => v.url)
              .map((v) => (
                <a key={v.id} href={v.url!} className="hover:text-ink transition-colors inline-flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-brand" />
                  {new URL(v.url!).hostname}
                </a>
              ))}
            <a href="mailto:contact@creai.dev" className="hover:text-ink transition-colors">
              contact@creai.dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
