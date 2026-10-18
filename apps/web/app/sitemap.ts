import type { MetadataRoute } from 'next';
import { ALL_GUIDES } from '@/lib/guides';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.creai.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...ALL_GUIDES.map((g) => ({
      url: `${SITE_URL}/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
