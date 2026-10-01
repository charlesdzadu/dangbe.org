import type { MetadataRoute } from 'next';
import { ROUTES } from '@/i18n';
import { absoluteUrl } from '@/lib/seo';

/* Every hreflang pair is declared here as well as in each page's <head>:
 * `alternates.languages` in a sitemap is how Google discovers the OTHER
 * locale of a page it has not fetched yet. */
function entry(
  paths: { fr: string; en: string },
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
): MetadataRoute.Sitemap {
  const languages = {
    fr: absoluteUrl(paths.fr),
    en: absoluteUrl(paths.en),
    'x-default': absoluteUrl(paths.fr),
  };
  return (['fr', 'en'] as const).map((locale) => ({
    url: absoluteUrl(paths[locale]),
    priority,
    changeFrequency,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry(ROUTES.home, 1, 'weekly'),
    ...entry(ROUTES.program, 0.9, 'monthly'),
    ...entry(ROUTES.employers, 0.9, 'monthly'),
    ...entry(ROUTES.apply, 0.9, 'monthly'),
    ...entry(ROUTES.about, 0.8, 'monthly'),
    ...entry(ROUTES.privacy, 0.2, 'yearly'),
    ...entry(ROUTES.legal, 0.2, 'yearly'),
  ];
}
