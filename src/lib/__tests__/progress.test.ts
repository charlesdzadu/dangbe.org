import { describe, expect, it } from 'vitest';
import { computeProgress, isInactive } from '../progress';

describe('computeProgress', () => {
  it('counts validated over required', () => {
    const summary = computeProgress([
      { isRequired: true, status: 'COMPLETED', validationStatus: 'VALIDATED' },
      { isRequired: true, status: 'COMPLETED', validationStatus: 'PENDING' },
      { isRequired: true, status: 'IN_PROGRESS', validationStatus: 'NONE' },
      { isRequired: true, status: 'NOT_STARTED', validationStatus: 'NONE' },
      { isRequired: false, status: 'COMPLETED', validationStatus: 'VALIDATED' },
    ]);
    expect(summary).toEqual({ required: 4, declared: 2, validated: 1, pending: 1, pct: 25, declaredPct: 50 });
  });

  it('is 0 with no required rows', () => {
    expect(computeProgress([]).pct).toBe(0);
  });
});

describe('isInactive', () => {
  it('flags 14 days of silence', () => {
    const now = new Date('2026-10-01T00:00:00Z');
    expect(isInactive(new Date('2026-09-20T00:00:00Z'), now)).toBe(false);
    expect(isInactive(new Date('2026-09-10T00:00:00Z'), now)).toBe(true);
    expect(isInactive(null, now)).toBe(true);
  });
});
