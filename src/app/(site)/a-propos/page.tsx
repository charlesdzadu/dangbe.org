import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/about';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'fr';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'about', t.about.metaTitle, t.about.metaDescription);

export default function Page() {
  return <AboutPage locale={locale} />;
}
