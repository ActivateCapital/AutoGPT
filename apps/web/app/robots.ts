import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://storefront-production-c1a7.up.railway.app';

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
