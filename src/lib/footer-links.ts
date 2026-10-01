import { ROUTES, getDict, type Locale } from '@/i18n';
import { CONTACT_URL, surveyHref } from './links';

export type FooterLink = {
  label: string;
  href: string;
  /** Off-site (the survey, mail): a plain <a>, never next/link. */
  external?: boolean;
};

export type FooterColumn = {
  heading: string;
  links: readonly FooterLink[];
};

/** The footer's three columns. Every href comes from ROUTES — never typed. */
export function footerColumns(locale: Locale): readonly FooterColumn[] {
  const t = getDict(locale).footer;

  const program: FooterLink[] = [
    { label: t.links.theProgram, href: ROUTES.program[locale] },
    { label: t.links.pathways, href: `${ROUTES.program[locale]}#parcours` },
    { label: t.links.howItWorks, href: `${ROUTES.home[locale]}#comment` },
    { label: t.links.apply, href: ROUTES.apply[locale] },
    { label: t.links.login, href: ROUTES.login[locale] },
  ];

  const employers: FooterLink[] = [
    { label: t.links.whyHire, href: ROUTES.employers[locale] },
    { label: t.links.survey, href: surveyHref(locale), external: true },
    { label: t.links.certificate, href: `${ROUTES.employers[locale]}#certification` },
  ];

  const initiative: FooterLink[] = [
    { label: t.links.about, href: ROUTES.about[locale] },
    { label: t.links.team, href: `${ROUTES.about[locale]}#equipe` },
    { label: t.links.milestones, href: `${ROUTES.home[locale]}#etapes` },
    { label: t.links.contact, href: CONTACT_URL, external: true },
    { label: t.links.privacy, href: ROUTES.privacy[locale] },
    { label: t.links.legal, href: ROUTES.legal[locale] },
  ];

  return [
    { heading: t.cols.program, links: program },
    { heading: t.cols.employers, links: employers },
    { heading: t.cols.initiative, links: initiative },
  ];
}
