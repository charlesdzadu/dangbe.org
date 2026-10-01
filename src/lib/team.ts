export type Member = {
  id: string;
  name: string;
  role: { fr: string; en: string };
  /** 'Lomé' | 'Washington, DC'… */
  based?: string;
  /** Mandela Washington Fellowship cohort year, if any. */
  mwfYear?: number;
  /** /team/<id>.jpg, self-hosted, never a stock photo. Without it: an initials tile. */
  photo?: string;
  linkedin?: string;
};

/** Empty until the team agrees on who is listed; the About page says so. */
export const TEAM: readonly Member[] = [];

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
