import type { Metadata } from 'next';
import { EmployersPage } from '@/components/pages/employers';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'en';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'employers', t.employers.metaTitle, t.employers.metaDescription);

export default function Page() {
  return <EmployersPage locale={locale} />;
}
