import type { Metadata } from 'next';
import { ROUTES, type Locale, type PageKey } from '@/i18n';
import { LINKEDIN_URL, SITE_URL } from './links';

/**
 * Everything the site says about itself to a machine: canonical + hreflang
 * for a search engine, and the FACTS (independent, volunteer-led, free,
 * three pathways) in a shape a language model can lift into an answer.
 */

export { SITE_URL };

/* '/' resolves to the bare origin, with no trailing slash — what Next emits for `canonical: '/'`. */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** hreflang. `x-default` is the French page: the reference translation. */
export function alternatesFor(locale: Locale, paths: { fr: string; en: string }) {
  return {
    canonical: paths[locale],
    languages: { fr: paths.fr, en: paths.en, 'x-default': paths.fr },
  };
}

export function openGraphLocale(locale: Locale) {
  return locale === 'en'
    ? { locale: 'en_US', alternateLocale: 'fr_FR' }
    : { locale: 'fr_FR', alternateLocale: 'en_US' };
}

type Json = Record<string, unknown>;

const SOCIAL_PROFILES = [LINKEDIN_URL].filter((url): url is string => Boolean(url));

/* `Organization`, not `NGO`: there is no legal entity yet, and the description says so. */
export function organizationLd(locale: Locale): Json {
  const description =
    locale === 'en'
      ? 'DANGBE is an independent, volunteer-led initiative in Togo that prepares college graduates for jobs in Western-oriented businesses and NGOs through a free, self-paced certification program built on open online courseware: digital literacy, critical thinking, problem-solving, logical reasoning, teamwork and adaptability. It is not affiliated with or sponsored by any government, embassy or NGO, and receives no funding.'
      : 'DANGBE est une initiative indépendante et bénévole au Togo qui prépare les jeunes diplômés aux emplois dans les entreprises et ONG à standards internationaux, par un programme de certification gratuit et à votre rythme bâti sur des cours en ligne ouverts : culture numérique, pensée critique, résolution de problèmes, raisonnement logique, travail en équipe et adaptabilité. Elle n’est affiliée à aucun gouvernement, ambassade ou ONG, et ne reçoit aucun financement.';

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'DANGBE',
    alternateName: ['Dangbe', 'Dangbé', 'The DANGBE Project', 'Projet DANGBE', 'dangbe.org'],
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/web-app-manifest-512x512.png'),
      width: 512,
      height: 512,
    },
    description,
    knowsLanguage: ['fr', 'en'],
    address: { '@type': 'PostalAddress', addressLocality: 'Lomé', addressCountry: 'TG' },
    foundingLocation: { '@type': 'Place', name: 'Lomé, Togo' },
    foundingDate: '2026',
    areaServed: { '@type': 'Country', name: 'Togo', identifier: 'TG' },
    knowsAbout: [
      'employability',
      'digital literacy',
      'critical thinking',
      'problem-solving',
      'teamwork',
      'open online courses',
      'youth employment in Togo',
    ],
    nonprofitStatus: 'NonprofitType',
    ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
  };
}

export function websiteLd(locale: Locale): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: 'DANGBE',
    inLanguage: ['fr', 'en'],
    publisher: { '@id': ORGANIZATION_ID },
    description:
      locale === 'en'
        ? 'Free, self-paced skills certification for Togolese graduates, shaped by employers.'
        : 'Certification gratuite et à votre rythme pour les diplômés togolais, construite avec les employeurs.',
  };
}

export function webPageLd(args: {
  url: string;
  name: string;
  description: string;
  locale: Locale;
  primaryImage?: string;
}): Json {
  return {
    '@type': 'WebPage',
    '@id': args.url,
    url: args.url,
    name: args.name,
    description: args.description,
    inLanguage: args.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    ...(args.primaryImage ? { primaryImageOfPage: args.primaryImage } : {}),
  };
}

export function faqPageLd(items: readonly { q: string; a: string }[], url: string): Json {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function howToLd(name: string, steps: readonly { title: string; body: string }[], url: string): Json {
  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

export function breadcrumbLd(items: readonly { name: string; path: string }[], url: string): Json {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** The program itself, as schema.org sees an educational program. */
export function programLd(locale: Locale, url: string): Json {
  return {
    '@type': 'EducationalOccupationalProgram',
    '@id': `${url}#program`,
    name: locale === 'en' ? 'DANGBE certification program' : 'Programme de certification DANGBE',
    provider: { '@id': ORGANIZATION_ID },
    educationalProgramMode: 'online',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'XOF' },
    educationalCredentialAwarded: locale === 'en' ? 'DANGBE certificate' : 'Certification DANGBE',
    timeToComplete: ['P3M', 'P6M'],
    programPrerequisites:
      locale === 'en' ? 'A higher-education degree obtained in Togo' : 'Un diplôme de l’enseignement supérieur obtenu au Togo',
    inLanguage: ['fr', 'en'],
    url,
  };
}

/** Wraps a set of nodes into one @graph — one <script> per page. */
export function graph(...nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Title, description, canonical + hreflang and Open Graph for one public page. */
export function pageMetadata(
  locale: Locale,
  key: PageKey,
  title: string,
  description: string,
  extra: Metadata = {},
): Metadata {
  const url = absoluteUrl(ROUTES[key][locale]);
  return {
    title,
    description,
    alternates: alternatesFor(locale, ROUTES[key]),
    openGraph: { title, description, url, ...openGraphLocale(locale) },
    ...extra,
  };
}
