import { getDict } from '@/i18n';
import { OG_SIZE, renderOg } from '@/lib/og';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'DANGBE';

export default async function Image() {
  const t = getDict('fr');
  return renderOg({ title: t.employers.hero.h1, lede: t.employers.metaDescription, locale: 'fr' });
}
