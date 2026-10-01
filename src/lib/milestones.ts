import { getDict, numberLocale, type Locale } from '@/i18n';

export type MilestoneStatus = 'done' | 'now' | 'next';
export type MilestoneKey = 'survey' | 'pilotApplications' | 'pilotCohort' | 'feedback' | 'launch';
export type FigureKey = 'surveyResponses' | 'pilotApplicants' | 'pilotCertified';

export type Milestone = {
  key: MilestoneKey;
  status: MilestoneStatus;
  /** ISO date, shown as « depuis septembre 2026 ». */
  since?: string;
  /** A real figure, or nothing. A missing figure renders nothing — never a 0. */
  figure?: { value: number; labelKey: FigureKey };
};

/**
 * Where the initiative stands. Updated by hand by the team; the copy for
 * each step lives in the dictionaries. No number is typed anywhere else.
 */
export const MILESTONES: readonly Milestone[] = [
  { key: 'survey', status: 'now', since: '2026-09-01' },
  { key: 'pilotApplications', status: 'now' },
  { key: 'pilotCohort', status: 'next' },
  { key: 'feedback', status: 'next' },
  { key: 'launch', status: 'next' },
];

export const applicationsOpen = (): boolean =>
  MILESTONES.some((m) => m.key === 'pilotApplications' && m.status === 'now');

/** « septembre 2026 » / "September 2026". Lomé is UTC+0, so UTC is the local date. */
export function formatMonthYear(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(numberLocale(locale), {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export function formatFigure(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale)).format(value);
}

/** The timeline rows, with the words from the dictionary. */
export function buildTimeline(locale: Locale) {
  const t = getDict(locale).home.milestones;
  return MILESTONES.map((m) => ({
    key: m.key,
    status: m.status,
    title: t.items[m.key].title,
    body: t.items[m.key].body,
    since: m.since ? t.since.replace('{date}', formatMonthYear(m.since, locale)) : undefined,
  }));
}

/** Only the figures that exist. An empty list renders nothing. */
export function buildFacts(locale: Locale) {
  const t = getDict(locale).home.milestones;
  return MILESTONES.flatMap((m) =>
    m.figure && m.figure.value > 0
      ? [{ value: formatFigure(m.figure.value, locale), label: t.figures[m.figure.labelKey] }]
      : [],
  );
}
