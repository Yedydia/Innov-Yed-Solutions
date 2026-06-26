import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const baseUrl = 'https://www.innovyed.solutions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/academie`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/boutique`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/equipe`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/devis`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  let servicePages: MetadataRoute.Sitemap = [];
  let coursePages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const dbTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB timeout")), 5000)
    );

    const dbQuery = Promise.all([
      prisma.service.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.course.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogArticle.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    const [services, courses, articles] = await Promise.race([dbQuery, dbTimeout]) as Awaited<typeof dbQuery>;

    servicePages = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    coursePages = courses.map((c) => ({
      url: `${baseUrl}/academie/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    blogPages = articles.map((a) => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Fallback to static slugs if DB is unavailable
    const serviceSlugs = [
      'service-bureau', 'support-technique', 'reseaux-securite', 'optimisation-recuperation',
      'maintenance-reparation', 'energie-accessoires', 'creation-web-graphisme', 'formations-mises-a-jour',
      'gaming-logiciels-multimedia', 'systemes-automatises',
    ];
    servicePages = serviceSlugs.map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    const courseSlugs = [
      'javascript-debutant', 'cybersecurite-essentielle', 'python-data-science', 'react-next-maitrise',
      'reseau-certification', 'figma-ui-ux', 'bureautique-microsoft-365', 'reparation-electronique',
      'panneaux-solaires-installation', 'montage-video-premiere', 'cybersecurite-ethical-hacking', 'domotique-iot-pratique',
    ];
    coursePages = courseSlugs.map((slug) => ({
      url: `${baseUrl}/academie/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const blogSlugs = [
      'next-js-14-guide-complet', 'cybersecurite-pme-africaines', 'ia-transforme-afrique',
      'domotique-maison-connectee', 'mobile-money-integration', 'react-vs-vue-2025',
      'panneaux-solaires-benin-guide', 'maintenance-pc-astuces',
    ];
    blogPages = blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }

  return [...staticPages, ...servicePages, ...coursePages, ...blogPages];
}
