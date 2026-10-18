import type { Metadata } from 'next';
import { LogoMark, IconSkills, IconCheck, IconArrow, IconDownload } from '@/components/icons';
import { GUIDES, ALL_GUIDES, SITE_URL, PACK, type Guide } from '@/lib/guides';

export function guide(slug: string): Guide {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`unknown guide ${slug}`);
  return g;
}

// A page-level openGraph replaces the layout's block wholesale, so the image
// and Twitter card are repeated here or link previews would have no picture.
export function guideMetadata(slug: string): Metadata {
  const g = guide(slug);
  const url = `${SITE_URL}/${g.slug}`;
  const ogTitle = g.title.replace(/ \| CreAI$/, '');
  return {
    title: { absolute: g.title },
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: g.description,
      url,
      siteName: 'CreAI',
      locale: 'en_US',
      type: 'article',
      images: [{ url: '/og.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'CreAI — working AI agents, this afternoon' }],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: g.description, images: ['/og.jpg'] },
  };
}

export function GuidePage({ slug }: { slug: string }) {
  const g = guide(slug);
  const url = `${SITE_URL}/${g.slug}`;
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.h1,
      description: g.description,
      url,
      image: `${SITE_URL}/og.jpg`,
      publisher: { '@type': 'Organization', name: 'CreAI', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'CreAI', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: g.crumb, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <nav className="sticky top-0 z-50 border-b hairline bg-paper/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <LogoMark className="w-7 h-7 text-brand" />
            <span className="font-display text-2xl font-semibold tracking-tight">CreAI</span>
          </a>
          <a href="/#kits" className="px-5 py-2.5 bg-brand hover:bg-brand-deep text-paper text-sm font-semibold rounded-md transition-colors">
            Get the skills
          </a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-5 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft mb-6">
          <a href="/" className="underline underline-offset-2">CreAI</a> <span aria-hidden="true">/</span> {g.crumb}
        </nav>
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-5">
          <IconSkills className="w-4 h-4" />
          {g.eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-6">{g.h1}</h1>
        <p className="text-lg text-ink-soft leading-relaxed mb-8">{g.lede}</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <a href="/#kits" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors">
            Get the {PACK.name} — {PACK.price}
            <IconArrow className="w-4 h-4" />
          </a>
          <a href="/downloads/creai-meeting-actions-free.zip" download className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/25 hover:border-ink text-ink font-semibold rounded-md transition-colors">
            <IconDownload className="w-4 h-4" />
            Try one skill free
          </a>
        </div>

        {g.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-2xl font-semibold tracking-tight mt-12 mb-4">{s.h}</h2>
            {s.body.map((p) => (
              <p key={p} className="text-ink-soft leading-relaxed mb-4">{p}</p>
            ))}
            {s.list && (
              <ul className="space-y-3 mb-4">
                {s.list.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-ink-soft leading-relaxed">
                    <IconCheck className="w-4 h-4 text-brand shrink-0 mt-1.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="border border-brand/30 rounded-lg p-7 my-12 bg-paper-deep/50">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-3">Put five skills to work today</h2>
          <p className="text-ink-soft leading-relaxed mb-5">
            Lead qualification, inbox triage, content repurposing, meeting actions and weekly reviews, for {PACK.price}, one payment. Installs in 60 seconds.
          </p>
          <a href="/#kits" className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors">
            See the {PACK.name}
            <IconArrow className="w-4 h-4" />
          </a>
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-tight mt-6 mb-4">FAQ</h2>
        <dl className="space-y-6 mb-12">
          {g.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-display text-lg font-semibold mb-1.5">{f.q}</dt>
              <dd className="text-ink-soft leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>

        <GuideLinks current={g.slug} />
      </article>

      <footer className="py-12 px-5 border-t hairline">
        <div className="max-w-3xl mx-auto text-center text-sm text-ink-soft">
          <p>
            © 2026 CreAI · <a href="/" className="text-brand font-medium underline underline-offset-2">CreAI Automation Kits</a> · Claude is a trademark of Anthropic; CreAI is not affiliated with or endorsed by Anthropic.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function GuideLinks({ current }: { current?: string }) {
  return (
    <nav aria-label="Guides" className="border-t hairline pt-8">
      <h2 className="font-display text-xl font-semibold tracking-tight mb-4">More guides</h2>
      <ul className="flex flex-wrap gap-2">
        {ALL_GUIDES.filter((x) => x.slug !== current).map((x) => (
          <li key={x.slug}>
            <a href={`/${x.slug}`} className="inline-block px-4 py-2 border border-ink/20 hover:border-brand rounded-md text-sm">
              {x.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
