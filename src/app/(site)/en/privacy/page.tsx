import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/legal';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'en';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'privacy', t.legal.privacy.metaTitle, t.legal.privacy.intro);

export default function Page() {
  return <LegalPage locale={locale} doc="privacy" />;
}
