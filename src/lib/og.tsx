import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { Locale } from '@/i18n';

/**
 * The link-preview card every public page ships: the wordmark, the page's
 * H1, one line under it, the continuity mark. Rendered by next/og (Satori),
 * which reads TTF, hence the two static instances in src/fonts.
 */
export const OG_SIZE = { width: 1200, height: 630 };

/* process.cwd() rather than import.meta.url: the bundler hands the latter a
 * URL from another realm that node's fs refuses. next.config lists the files
 * in outputFileTracingIncludes so the serverless bundle carries them. */
const FONTS = join(process.cwd(), 'src', 'fonts');
const bold = readFile(join(FONTS, 'instrument-sans-bold-og.ttf'));
const regular = readFile(join(FONTS, 'instrument-sans-regular-og.ttf'));

export async function renderOg({ title, lede, locale }: { title: string; lede: string; locale: Locale }) {
  const [boldData, regularData] = await Promise.all([bold, regular]);
  const tagline = locale === 'en' ? 'Free · Online · Independent and volunteer-led' : 'Gratuit · En ligne · Indépendant et bénévole';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: '#f0e4cf',
          backgroundImage: 'linear-gradient(to right, rgba(27,31,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,31,72,0.07) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          color: '#1b1f48',
          fontFamily: 'Instrument Sans',
        }}
      >
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, letterSpacing: '-0.045em' }}>
          dangbe<span style={{ color: '#b6431a' }}>.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div style={{ display: 'flex', fontSize: title.length > 60 ? 54 : 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em' }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 400, lineHeight: 1.4, color: 'rgba(27,31,72,0.72)' }}>{lede}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, color: 'rgba(27,31,72,0.72)' }}>
          <span>dangbe.org · {tagline}</span>
          <svg width="160" height="60" viewBox="0 0 160 60">
            <path d="M8 50 C 28 50, 28 10, 48 10 S 68 50, 88 50 S 108 10, 128 10" fill="none" stroke="#b6431a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="128" cy="10" r="7" fill="#e4672f" />
          </svg>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Instrument Sans', data: boldData, weight: 700, style: 'normal' },
        { name: 'Instrument Sans', data: regularData, weight: 400, style: 'normal' },
      ],
    },
  );
}
