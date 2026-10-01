import type { Metadata } from 'next';
import { ProgramPage } from '@/components/pages/program';
import { getDict } from '@/i18n';
import { pageMetadata } from '@/lib/seo';

const locale = 'fr';
const t = getDict(locale);

export const metadata: Metadata = pageMetadata(locale, 'program', t.program.metaTitle, t.program.metaDescription);

export default function Page() {
  return <ProgramPage locale={locale} />;
}
