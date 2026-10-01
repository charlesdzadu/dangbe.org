import { prisma } from '@/lib/db/prisma';

const PROGRESS_INCLUDE = {
  course: { select: { id: true, title: true, provider: true, url: true, language: true, estimatedHours: true, hasCertificate: true, certificateIsFree: true } },
  competency: { select: { id: true, slug: true, nameFr: true, sortOrder: true } },
  validatedBy: { select: { firstName: true, lastName: true } },
} as const;

/** Everything a participant's page shows, for the team and for the participant. */
export async function participantDetail(enrollmentId: string) {
  return prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, status: true } },
      cohort: { select: { id: true, name: true, status: true, pathwayType: true } },
      mentor: { select: { id: true, firstName: true, lastName: true } },
      progress: { include: PROGRESS_INCLUDE, orderBy: { sortOrder: 'asc' } },
      evaluations: { include: { competency: { select: { id: true, nameFr: true } }, evaluator: { select: { firstName: true, lastName: true } } }, orderBy: { evaluatedAt: 'desc' } },
      notes: { include: { author: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } },
      activity: { orderBy: { createdAt: 'desc' }, take: 30 },
    },
  });
}

/** The participant's own current enrollment (the latest that is not dropped). */
export async function myEnrollment(userId: string) {
  return prisma.enrollment.findFirst({
    where: { userId, status: { in: ['ACTIVE', 'PAUSED', 'COMPLETED'] } },
    orderBy: { createdAt: 'desc' },
    include: {
      cohort: { select: { id: true, name: true, status: true, pathwayType: true, endDate: true } },
      mentor: { select: { firstName: true, lastName: true } },
      progress: { include: PROGRESS_INCLUDE, orderBy: { sortOrder: 'asc' } },
    },
  });
}

export type ProgressRowFull = NonNullable<Awaited<ReturnType<typeof myEnrollment>>>['progress'][number];

/** Rows grouped by competency, in the template's order. */
export function groupByCompetency<T extends { competency: { id: string; nameFr: string; sortOrder: number } }>(rows: readonly T[]) {
  const groups = new Map<string, { competency: T['competency']; rows: T[] }>();
  for (const row of rows) {
    const g = groups.get(row.competency.id) ?? { competency: row.competency, rows: [] as T[] };
    g.rows.push(row);
    groups.set(row.competency.id, g);
  }
  return [...groups.values()].sort((a, b) => a.competency.sortOrder - b.competency.sortOrder);
}

/** The proofs waiting for a human, oldest first; optionally only one mentor's participants. */
export async function pendingProofs(mentorId?: string) {
  return prisma.courseProgress.findMany({
    where: { validationStatus: 'PENDING', ...(mentorId ? { enrollment: { mentorId } } : {}) },
    orderBy: { proofSubmittedAt: 'asc' },
    include: {
      course: { select: { title: true, provider: true } },
      competency: { select: { nameFr: true } },
      enrollment: { include: { user: { select: { firstName: true, lastName: true } }, cohort: { select: { name: true } } } },
    },
  });
}
