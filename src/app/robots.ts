import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portail/', '/admin/', '/boutique/checkout'],
      },
    ],
    sitemap: 'https://www.innovyed.solutions/sitemap.xml',
  };
}
