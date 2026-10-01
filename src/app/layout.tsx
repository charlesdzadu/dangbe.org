import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { JsonLd } from '@/components/json-ld';
import { redirectMap } from '@/i18n';
import { graph, organizationLd, websiteLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/links';
import './globals.css';
/* The page language, after globals so its overrides win on equal specificity. */
import './styles/blocks.css';
import './styles/forms.css';

/* The font files live in the repo (src/fonts) instead of being pulled by
 * `next/font/google`: that loader downloads at BUILD time, and a builder
 * without egress turns a font fetch into a failed deployment. Rebuilt with
 * tools/fonts/build.sh. */
const display = localFont({
  src: '../fonts/instrument-sans-latin-variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', 'sans-serif'],
});

const body = localFont({
  src: '../fonts/instrument-sans-latin-variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
});

/* Counts and indexes only: tabular figures. */
const mono = localFont({
  src: '../fonts/jetbrains-mono-latin-variable.woff2',
  weight: '100 800',
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DANGBE — Les compétences que les employeurs attendent',
    template: '%s · DANGBE',
  },
  description:
    'Programme gratuit, en ligne et à votre rythme pour préparer les jeunes diplômés togolais aux attentes des entreprises et des ONG. Initiative indépendante et bénévole.',
  openGraph: {
    type: 'website',
    siteName: 'DANGBE',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  applicationName: 'DANGBE',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

/**
 * Runs before first paint. Its FIRST statement stamps `js` on <html>: the
 * reveal animations hide a section only under `html.js`, so a reader whose
 * script never ran gets every section painted at once.
 *
 * Then the locale: an English-speaking first visit is redirected to the
 * English twin of the page before paint; the choice is remembered. Crawlers
 * are excluded — Googlebot renders with `navigator.language === 'en-US'` and
 * would otherwise leave every French URL.
 */
const BOT_UA =
  'bot|crawler|spider|crawling|headless|lighthouse|preview|slurp|facebookexternalhit|whatsapp|telegram|embedly|gptbot|claude|perplexity|applebot|bingpreview|chatgpt';

const bootScript = `(function(){try{
var d=document.documentElement;
d.classList.add('js');
var p=location.pathname;
var en=p==='/en'||p.indexOf('/en/')===0;
if(en){d.lang='en';}
if(/${BOT_UA}/i.test(navigator.userAgent||''))return;
if(!localStorage.getItem('dg-lang')){
if(en){localStorage.setItem('dg-lang','en');}
else{
var b=((navigator.languages&&navigator.languages[0])||navigator.language||'fr').toLowerCase();
var want=b.indexOf('fr')===0?'fr':'en';
localStorage.setItem('dg-lang',want);
if(want==='en'){var map=${JSON.stringify(redirectMap())};if(map[p]){location.replace(map[p]);}}
}}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.reveal,.fade-up{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <JsonLd data={graph(organizationLd('fr'), websiteLd('fr'))} />
      </head>
      <body>{children}</body>
    </html>
  );
}
