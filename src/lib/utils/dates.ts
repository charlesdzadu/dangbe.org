/* Lomé is UTC+0 with no DST: the server's UTC clock is the local clock. Only
 * the two @db.Date cohort columns need care, and they are formatted here. */
const TZ = 'Africa/Lome';

export function formatDate(date: Date | string, style: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: TZ,
    ...(style === 'long' ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: '2-digit', month: '2-digit', year: 'numeric' }),
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
}

/** A `YYYY-MM-DD` form value → the UTC midnight the @db.Date column stores. */
export function dateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** The reverse: what an <input type="date"> wants. */
export function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function daysAgo(date: Date | null | undefined, now = new Date()): number | null {
  if (!date) return null;
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}
