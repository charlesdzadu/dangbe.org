import type { Metadata } from 'next';
import { ApplyPage } from '@/components/pages/apply';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'fr';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'apply', t.apply.metaTitle, t.apply.metaDescription);

export default function Page() {
  return <ApplyPage locale={locale} />;
}
