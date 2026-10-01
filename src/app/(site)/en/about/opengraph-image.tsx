import { getDict } from '@/i18n';
import { OG_SIZE, renderOg } from '@/lib/og';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'DANGBE';

export default async function Image() {
  const t = getDict('en');
  return renderOg({ title: t.about.hero.h1, lede: t.about.metaDescription, locale: 'en' });
}
