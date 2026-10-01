import { fr } from './fr';
import { en } from './en';

export type Locale = 'fr' | 'en';
export type Dict = typeof fr;

export function getDict(locale: Locale): Dict {
  return locale === 'en' ? en : fr;
}

/** Each public page exists once per locale; the switcher maps between the two. */
export const ROUTES = {
  home: { fr: '/', en: '/en' },
  program: { fr: '/programme', en: '/en/program' },
  about: { fr: '/a-propos', en: '/en/about' },
  employers: { fr: '/employeurs', en: '/en/employers' },
  apply: { fr: '/postuler', en: '/en/apply' },
  applyThanks: { fr: '/postuler/merci', en: '/en/apply/thank-you' },
  /* The authenticated space is French-only in v1: both locales sign in here. */
  login: { fr: '/connexion', en: '/connexion' },
  privacy: { fr: '/confidentialite', en: '/en/privacy' },
  legal: { fr: '/mentions-legales', en: '/en/legal-notice' },
} as const;

export type PageKey = keyof typeof ROUTES;

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

export function pageKeyFromPath(pathname: string): PageKey {
  for (const key of Object.keys(ROUTES) as PageKey[]) {
    if (pathname === ROUTES[key].fr || pathname === ROUTES[key].en) return key;
  }
  return 'home';
}

/** The same page in the other locale. A path nothing recognises falls back to the homepage. */
export function localizedPath(pathname: string, target: Locale): string {
  return ROUTES[pageKeyFromPath(pathname)][target];
}

/** Every French path → its English twin, for the layout's boot script. */
export function redirectMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const key of Object.keys(ROUTES) as PageKey[]) {
    const pair = ROUTES[key];
    if (pair.fr !== pair.en) map[pair.fr] = pair.en;
  }
  return map;
}

/** Intl locale used for every number and date on the page. */
export function numberLocale(locale: Locale): string {
  return locale === 'en' ? 'en-GB' : 'fr-FR';
}
