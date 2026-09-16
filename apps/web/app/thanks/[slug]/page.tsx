import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { deliverables } from '@/lib/delivery';
import { CONTACT_EMAIL } from '@/lib/products';
import { LogoMark, IconDownload, IconCheck } from '@/components/icons';

export const dynamicParams = false;

export function generateStaticParams() {
  return deliverables.map((d) => ({ slug: d.slug }));
}

export const metadata: Metadata = {
  title: 'Thank you — CreAI',
  robots: { index: false, follow: false },
};

export default function ThanksPage({ params }: { params: { slug: string } }) {
  const item = deliverables.find((d) => d.slug === params.slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-5">
      <div className="max-w-xl w-full py-20 text-center">
        <LogoMark className="w-10 h-10 text-brand mx-auto mb-6" />
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-4">
          <IconCheck className="w-4 h-4" />
          Payment received
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-4">
          Thank you — here&apos;s your {item.name}.
        </h1>
        <p className="text-ink-soft mb-8">
          Your Stripe receipt is on its way by email. Download below, then start with the
          README inside — setup is about 15 minutes.
        </p>
        <div className="space-y-3 mb-10">
          {item.files.map((f) => (
            <a
              key={f.path}
              href={f.path}
              download
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-brand hover:bg-brand-deep text-paper font-semibold rounded-md transition-colors"
            >
              <IconDownload className="w-4 h-4" />
              {f.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-ink-soft">
          Bookmark this page — the link keeps working. Problems or a refund within 14 days,
          no questions asked:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand font-medium underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
