import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.creai.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/thanks/', '/dl-'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
