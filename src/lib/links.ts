import type { Locale } from '@/i18n';

/** Absent config degrades, never breaks: every optional link has a fallback. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dangbe.org').replace(/\/+$/, '');

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@dangbe.org';
export const CONTACT_URL = `mailto:${CONTACT_EMAIL}`;

/** The employer survey (a form hosted elsewhere). Empty → the button writes to us instead. */
export const SURVEY_URL = process.env.NEXT_PUBLIC_SURVEY_URL || null;

export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || null;

export function surveyHref(locale: Locale): string {
  if (SURVEY_URL) return SURVEY_URL;
  const subject = locale === 'en' ? 'Employer survey' : 'Enquête employeurs';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
