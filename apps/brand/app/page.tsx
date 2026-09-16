import { ventures } from '@/lib/family';
import { GenerativeCanvas } from '@/components/generative-canvas';
import { Reveal } from '@/components/reveal';
import { LogoMark } from '@/components/icons';

const HEADLINE = ['Creativity,', 'meet', 'AI.'];

const MARQUEE = [
  'TASTE IS THE INTERFACE',
  'THE AGENT DRAFTS — YOU DECIDE',
  'WORKING BEATS WAITLIST',
  'PROOF OVER PROMISE',
  'YOU OWN THE OUTPUT',
];

function MarqueeStrip() {
  const run = (
    <div aria-hidden="true">
      {MARQUEE.map((phrase) => (
        <span key={phrase} className="font-mono-label text-[11px] tracking-[0.28em] text-cream-soft/70 px-8">
          {phrase} <span className="text-leaf px-2">·</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee border-y hairline py-3.5 bg-night-deep/60">
      {run}
      {run}
    </div>
  );
}

function RoomLabel({ n, title }: { n: string; title: string }) {
  return (
    <p className="font-mono-label text-[11px] tracking-[0.28em] text-cream-soft/80 uppercase mb-10 flex items-center gap-4">
      <span className="text-leaf">{n}</span>
      <span className="w-10 h-px bg-cream/20 inline-block" />
      {title}
    </p>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-night text-cream relative">
      {/* the field runs behind the entire site */}
      <GenerativeCanvas className="fixed inset-0 w-full h-full opacity-90" />
      <div className="fixed inset-0 bg-gradient-to-b from-night/30 via-night/62 to-night/88 pointer-events-none" />

      <div className="relative">
        {/* Masthead */}
        <nav className="absolute top-0 left-0 right-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <LogoMark className="w-7 h-7 text-leaf" />
              <span className="font-display text-2xl tracking-tight">CreAI</span>
            </a>
            <div className="flex items-center gap-7 font-mono-label text-[11px] tracking-[0.22em] uppercase">
              <a href="#index" className="text-cream-soft hover:text-cream transition-colors hidden sm:block">
                Index
              </a>
              <a href="#atlas" className="text-cream-soft hover:text-cream transition-colors hidden sm:block">
                Atlas
              </a>
              <a
                href="https://skills.creai.dev"
                className="border border-leaf/60 hover:bg-leaf hover:text-night text-leaf px-4 py-2 transition-colors"
              >
                Skills — Live
              </a>
            </div>
          </div>
        </nav>

        {/* Room 00 — the field */}
        <header className="min-h-screen flex flex-col justify-end">
          <div className="max-w-6xl mx-auto px-6 w-full pb-10">
            <p className="font-mono-label text-[11px] tracking-[0.28em] uppercase text-cream-soft mb-6">
              <span className="text-leaf">00</span> · The creative intelligence studio
            </p>
            <h1 className="font-display text-[17vw] md:text-[9.5rem] leading-[0.95] tracking-tight mb-8">
              {HEADLINE.map((word, i) => (
                <span key={word} className="reveal-word mr-[0.22em]" style={{ animationDelay: `${0.2 + i * 0.22}s` }}>
                  {word}
                </span>
              ))}
            </h1>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <p className="text-cream-soft leading-relaxed max-w-md">
                Ventures where human taste directs machine capability. The field behind these
                words is being painted live — for you, right now. Move, and it moves.
              </p>
              <p className="font-mono-label text-[11px] tracking-[0.2em] text-cream-soft/60 uppercase shrink-0">
                scroll ↓
              </p>
            </div>
          </div>
          <MarqueeStrip />
        </header>

        {/* Room 01 — the index */}
        <section id="index" className="py-28 bg-night/40">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <RoomLabel n="01" title="Index of ventures" />
            </Reveal>
            <div className="border-t hairline">
              {ventures.map((v, i) => (
                <Reveal key={v.id} delay={i * 90}>
                  <a
                    href={v.url ?? '#index'}
                    className={`index-row grid grid-cols-12 gap-4 items-baseline border-b hairline py-8 ${
                      v.url ? '' : 'pointer-events-none'
                    }`}
                  >
                    <span className="col-span-2 md:col-span-1 font-mono-label text-sm text-cream-soft/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="col-span-10 md:col-span-4 font-display text-3xl md:text-5xl tracking-tight">
                      {v.name}
                    </span>
                    <span className="col-span-6 col-start-3 md:col-span-4 md:col-start-auto text-cream-soft text-sm leading-relaxed">
                      {v.tagline}
                      <span className="block text-cream-soft/60 mt-1 text-[13px]">{v.detail}</span>
                    </span>
                    <span className="col-span-4 md:col-span-3 text-right">
                      {v.status === 'live' ? (
                        <span className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-leaf">
                          ● live — visit ↗
                        </span>
                      ) : (
                        <span className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50">
                          ○ in development
                        </span>
                      )}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
            <p className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50 mt-6">
              No waitlists kept. A venture appears here when it works.
            </p>
          </div>
        </section>

        {/* Room 02 — thesis */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <RoomLabel n="02" title="Thesis" />
            </Reveal>
            <div className="space-y-16">
              {[
                { lead: 'Taste is the interface.', rest: 'Machines can generate anything — choosing well is now the entire job.' },
                { lead: 'The agent drafts. You decide.', rest: 'Nothing we ship sends, posts, or spends on its own. That is a design principle, not a limitation.' },
                { lead: 'Working beats waitlist.', rest: 'We announce ships, not visions. The painting behind this page is generated live; the products are downloadable today.' },
              ].map((t, i) => (
                <Reveal key={t.lead} delay={i * 100}>
                  <p className="font-display text-3xl md:text-5xl leading-[1.15] tracking-tight">
                    <span className="text-leaf">{t.lead}</span>{' '}
                    <span className="text-cream/90">{t.rest}</span>
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Room 03 — atlas */}
        <section id="atlas" className="py-28 bg-night/40">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <RoomLabel n="03" title="Atlas of Flow" />
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center">
              <div className="lg:col-span-3">
                <Reveal>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/plate-001.jpg"
                    alt="Field Notation — Plate 001: Directed Current. A generative ink drawing of two thousand fine flow-field strokes bending around a single annotated hexagonal node."
                    className="w-full shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
                    loading="lazy"
                  />
                </Reveal>
              </div>
              <div className="lg:col-span-2">
                <Reveal delay={120}>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-5">
                    Plate 001 — Directed Current
                  </h2>
                  <p className="text-cream-soft leading-relaxed mb-4">
                    The studio documents its own thesis the way a cartographer maps a
                    coastline: two thousand individually placed strokes, one current, one
                    annotated node where the flow bends. The decision.
                  </p>
                  <p className="text-cream-soft/70 leading-relaxed text-sm mb-6">
                    Drawn by our generative systems under a written design philosophy, in
                    the studio&apos;s daylight ink. Its living, nocturnal sibling surrounds
                    you now — seeded fresh for every visitor.
                  </p>
                  <p className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50">
                    obs. 2026-09 · n = 2,040 strokes · archival
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Room 04 — colophon / contact */}
        <footer className="py-24 border-t hairline bg-night-deep/70">
          <div className="max-w-6xl mx-auto px-6">
            <RoomLabel n="04" title="Colophon" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
              <div>
                <p className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50 mb-3">Studio</p>
                <p className="text-cream-soft text-sm leading-relaxed">
                  CreAI — the creative intelligence studio behind{' '}
                  <a href="https://skills.creai.dev" className="text-leaf hover:underline underline-offset-4">
                    skills.creai.dev
                  </a>
                  . Built in the open, largely by its own agents, entirely under human direction.
                </p>
              </div>
              <div>
                <p className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50 mb-3">Contact</p>
                <a href="mailto:contact@creai.dev" className="text-cream hover:text-leaf transition-colors font-display text-2xl tracking-tight">
                  contact@creai.dev
                </a>
              </div>
              <div>
                <p className="font-mono-label text-[11px] tracking-[0.2em] uppercase text-cream-soft/50 mb-3">Set in</p>
                <p className="text-cream-soft text-sm leading-relaxed">
                  Gloock &amp; Space Grotesk, instrumented with IBM Plex Mono. Artwork
                  generated live, never stock. Grain is intentional.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t hairline">
              <div className="flex items-center gap-2.5 text-cream-soft text-sm">
                <LogoMark className="w-5 h-5 text-leaf" />
                <span>© 2026 CreAI. All rights reserved.</span>
              </div>
              <p className="font-mono-label text-[10px] tracking-[0.16em] uppercase text-cream-soft/40 max-w-xl md:text-right leading-relaxed">
                Claude is a trademark of Anthropic. CreAI is not affiliated with or endorsed by Anthropic.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
