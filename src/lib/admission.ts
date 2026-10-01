import type { Application, Prisma } from '@prisma/client';
import { logActivity } from './activity';
import { INVITE_TTL_MS, issueAuthToken } from './auth/tokens';

type Tx = Prisma.TransactionClient;

export class AdmissionError extends Error {
  constructor(public readonly code: 'alreadyEnrolled' | 'teamEmail' | 'cohortNotFound') {
    super(code);
  }
}

/**
 * Turns an application into a participant of a cohort, inside the caller's
 * transaction: the account (or the existing one), the enrollment, and one
 * CourseProgress row per item of the cohort's template — materialised now,
 * so editing the template later never rewrites a running cohort.
 */
export async function admitToCohort(
  tx: Tx,
  args: { application: Application; cohortId: string; mentorId?: string | null; actorId: string; notes?: string | null },
) {
  const { application } = args;
  const cohort = await tx.cohort.findUnique({
    where: { id: args.cohortId },
    include: { pathwayTemplate: { include: { items: { orderBy: { sortOrder: 'asc' } } } } },
  });
  if (!cohort) throw new AdmissionError('cohortNotFound');

  let user = await tx.user.findUnique({ where: { email: application.email } });
  if (user && user.role !== 'PARTICIPANT') throw new AdmissionError('teamEmail');
  if (!user) {
    user = await tx.user.create({
      data: {
        email: application.email,
        firstName: application.firstName,
        lastName: application.lastName,
        phone: application.phone,
        role: 'PARTICIPANT',
        status: 'INVITED',
        locale: application.locale,
      },
    });
  }

  const already = await tx.enrollment.findUnique({ where: { userId_cohortId: { userId: user.id, cohortId: cohort.id } } });
  if (already) throw new AdmissionError('alreadyEnrolled');

  const enrollment = await tx.enrollment.create({
    data: { userId: user.id, cohortId: cohort.id, mentorId: args.mentorId ?? null, status: 'ACTIVE' },
  });
  await tx.courseProgress.createMany({
    data: cohort.pathwayTemplate.items.map((item) => ({
      enrollmentId: enrollment.id,
      courseId: item.courseId,
      competencyId: item.competencyId,
      isRequired: item.isRequired,
      sortOrder: item.sortOrder,
    })),
  });

  /* One account per application; an older application of the same person keeps its link. */
  const linked = await tx.application.findFirst({ where: { userId: user.id }, select: { id: true } });
  await tx.application.update({
    where: { id: application.id },
    data: {
      status: 'ACCEPTED',
      decidedById: args.actorId,
      decidedAt: new Date(),
      decisionNotes: args.notes ?? null,
      ...(linked ? {} : { userId: user.id }),
    },
  });

  const needsInvite = user.status === 'INVITED' || !user.passwordHash;
  const rawToken = needsInvite ? await issueAuthToken(tx, user.id, 'INVITE', INVITE_TTL_MS) : null;

  await logActivity(tx, { type: 'APPLICATION_DECIDED', actorId: args.actorId, applicationId: application.id, payload: { decision: 'ACCEPTED', cohortId: cohort.id } });
  await logActivity(tx, { type: 'PARTICIPANT_ADMITTED', actorId: args.actorId, enrollmentId: enrollment.id, subjectUserId: user.id, applicationId: application.id, payload: { cohortId: cohort.id } });

  return { user, enrollment, cohort, rawToken };
}
