import { app } from '@/i18n/app/fr';

type Kind = 'applicationStatus' | 'userStatus' | 'cohortStatus' | 'enrollmentStatus' | 'validationStatus' | 'progressStatus' | 'role';

const VARIANT: Record<Kind, Record<string, string>> = {
  applicationStatus: { SUBMITTED: '', UNDER_REVIEW: 'badge--warn', ACCEPTED: 'badge--success', WAITLISTED: 'badge--muted', REJECTED: 'badge--danger', WITHDRAWN: 'badge--muted' },
  userStatus: { ACTIVE: 'badge--success', INVITED: 'badge--warn', DISABLED: 'badge--danger' },
  cohortStatus: { PLANNED: 'badge--warn', ACTIVE: 'badge--success', COMPLETED: 'badge--ink', ARCHIVED: 'badge--muted' },
  enrollmentStatus: { ACTIVE: 'badge--success', PAUSED: 'badge--warn', COMPLETED: 'badge--ink', DROPPED: 'badge--danger' },
  validationStatus: { NONE: 'badge--muted', PENDING: 'badge--warn', VALIDATED: 'badge--success', REJECTED: 'badge--danger' },
  progressStatus: { NOT_STARTED: 'badge--muted', IN_PROGRESS: 'badge--warn', COMPLETED: 'badge--success' },
  role: { ADMIN: 'badge--ink', MENTOR: '', PARTICIPANT: 'badge--muted' },
};

/** A status as a word in a pill, coloured by what it means. */
export function StatusBadge({ kind, value }: { kind: Kind; value: string }) {
  const labels = app.labels[kind] as Record<string, string>;
  return <span className={`badge ${VARIANT[kind][value] ?? ''}`}>{labels[value] ?? value}</span>;
}
