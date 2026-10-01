import { prisma } from '@/lib/db/prisma';
import { computeProgress, isInactive } from '@/lib/progress';

/** The cohort and one row per participant: progress, last activity, the pending proofs. */
export async function cohortDashboard(cohortId: string) {
  const cohort = await prisma.cohort.findUnique({
    where: { id: cohortId },
    include: {
      pathwayTemplate: { select: { id: true, name: true, items: { select: { id: true } } } },
      enrollments: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, status: true } },
          mentor: { select: { id: true, firstName: true, lastName: true } },
          progress: { select: { isRequired: true, status: true, validationStatus: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!cohort) return null;
  const now = new Date();
  const rows = cohort.enrollments.map((e) => ({
    enrollment: e,
    summary: computeProgress(e.progress),
    inactive: e.status === 'ACTIVE' && isInactive(e.lastActivityAt, now),
  }));
  return { cohort, rows };
}

export async function listCohorts() {
  return prisma.cohort.findMany({
    orderBy: [{ status: 'asc' }, { startDate: 'desc' }],
    include: { _count: { select: { enrollments: true } }, pathwayTemplate: { select: { name: true } } },
  });
}

export async function teamMembers() {
  return prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'MENTOR'] }, status: 'ACTIVE' },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true, role: true },
  });
}
