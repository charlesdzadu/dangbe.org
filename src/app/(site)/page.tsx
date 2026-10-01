import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { HomePage, homeStructuredData } from '@/components/pages/home';
import { getDict, ROUTES } from '@/i18n';
import { absoluteUrl, alternatesFor, faqPageLd, graph, howToLd, openGraphLocale, webPageLd } from '@/lib/seo';

const locale = 'fr';
const t = getDict(locale).home;
const url = absoluteUrl(ROUTES.home[locale]);

export const metadata: Metadata = {
  title: { absolute: t.metaTitle },
  description: t.metaDescription,
  alternates: alternatesFor(locale, ROUTES.home),
  openGraph: { title: t.metaTitle, description: t.metaDescription, url, ...openGraphLocale(locale) },
};

export default function Page() {
  const sd = homeStructuredData(locale);
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.metaDescription, locale }),
          faqPageLd(sd.faq, url),
          howToLd(sd.howToName, sd.steps, url),
        )}
      />
      <HomePage locale={locale} />
    </>
  );
}
