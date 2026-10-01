/** The rows the cohort dashboard counts — a subset of CourseProgress. */
export type ProgressRow = {
  isRequired: boolean;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  validationStatus: 'NONE' | 'PENDING' | 'VALIDATED' | 'REJECTED';
};

export type ProgressSummary = {
  required: number;
  declared: number;
  validated: number;
  pending: number;
  /** validated / required, 0–100. */
  pct: number;
  /** declared / required, 0–100. */
  declaredPct: number;
};

export function computeProgress(rows: readonly ProgressRow[]): ProgressSummary {
  const required = rows.filter((r) => r.isRequired);
  const declared = required.filter((r) => r.status === 'COMPLETED').length;
  const validated = required.filter((r) => r.validationStatus === 'VALIDATED').length;
  const pending = rows.filter((r) => r.validationStatus === 'PENDING').length;
  const pct = required.length === 0 ? 0 : Math.round((validated / required.length) * 100);
  const declaredPct = required.length === 0 ? 0 : Math.round((declared / required.length) * 100);
  return { required: required.length, declared, validated, pending, pct, declaredPct };
}

export const INACTIVE_AFTER_DAYS = 14;

export function isInactive(lastActivityAt: Date | null, now = new Date()): boolean {
  if (!lastActivityAt) return true;
  const ms = now.getTime() - lastActivityAt.getTime();
  return ms > INACTIVE_AFTER_DAYS * 24 * 60 * 60 * 1000;
}
