import type { Metadata } from 'next';
import { ApplyThanksPage } from '@/components/pages/apply';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'fr';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'applyThanks', t.apply.thanks.metaTitle, t.apply.metaDescription, { robots: { index: false, follow: false } });

export default function Page() {
  return <ApplyThanksPage locale={locale} />;
}
