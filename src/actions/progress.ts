'use server';

import { revalidatePath } from 'next/cache';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { logActivity } from '@/lib/activity';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/lib/email/send';
import { proofValidated } from '@/lib/email/templates/application';
import { progressSchema, validateProofSchema } from '@/lib/validation/progress';

/**
 * A participant declares where they stand on one course. COMPLETED needs a
 * proof link and queues it for validation; a row already VALIDATED is
 * read-only (a mentor must reject it first); stepping back clears the proof.
 */
export async function upsertCourseProgress(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireRole('PARTICIPANT');
  const parsed = parseForm(progressSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const row = await prisma.courseProgress.findUnique({ where: { id: d.courseProgressId }, include: { enrollment: true } });
  if (!row || row.enrollment.userId !== user.id) return { ok: false, formError: 'notFound' };
  if (row.enrollment.status !== 'ACTIVE') return { ok: false, formError: 'enrollmentClosed' };
  if (row.validationStatus === 'VALIDATED') return { ok: false, formError: 'locked' };

  const now = new Date();
  const data =
    d.status === 'COMPLETED'
      ? {
          status: 'COMPLETED' as const,
          startedAt: row.startedAt ?? now,
          completedAt: row.completedAt ?? now,
          proofType: 'LINK' as const,
          proofUrl: d.proofUrl ?? null,
          proofSubmittedAt: now,
          validationStatus: 'PENDING' as const,
          validatedById: null,
          validatedAt: null,
          validationNote: null,
        }
      : d.status === 'IN_PROGRESS'
        ? {
            status: 'IN_PROGRESS' as const,
            startedAt: row.startedAt ?? now,
            completedAt: null,
            proofType: 'NONE' as const,
            proofUrl: null,
            proofSubmittedAt: null,
            validationStatus: 'NONE' as const,
            validatedById: null,
            validatedAt: null,
            validationNote: null,
          }
        : {
            status: 'NOT_STARTED' as const,
            startedAt: null,
            completedAt: null,
            proofType: 'NONE' as const,
            proofUrl: null,
            proofSubmittedAt: null,
            validationStatus: 'NONE' as const,
            validatedById: null,
            validatedAt: null,
            validationNote: null,
          };

  await prisma.$transaction(async (tx) => {
    await tx.courseProgress.update({ where: { id: row.id }, data });
    await tx.enrollment.update({ where: { id: row.enrollmentId }, data: { lastActivityAt: now } });
    await logActivity(tx, {
      type: d.status === 'COMPLETED' ? 'PROOF_SUBMITTED' : 'PROGRESS_UPDATED',
      actorId: user.id,
      enrollmentId: row.enrollmentId,
      subjectUserId: user.id,
      payload: { courseId: row.courseId, status: d.status },
    });
  });
  revalidatePath('/espace/mon-parcours');
  revalidatePath(`/espace/participants/${row.enrollmentId}`);
  revalidatePath('/espace/validations');
  return { ok: true };
}

/** A mentor validates or rejects a proof; a rejection carries a note the participant reads. */
export async function validateProof(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const actor = await requireRole('ADMIN', 'MENTOR');
  const parsed = parseForm(validateProofSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const row = await prisma.courseProgress.findUnique({
    where: { id: d.courseProgressId },
    include: { course: true, enrollment: { include: { user: true } } },
  });
  if (!row) return { ok: false, formError: 'notFound' };
  if (row.validationStatus !== 'PENDING' && d.decision === 'VALIDATED' && row.status !== 'COMPLETED') return { ok: false, formError: 'notPending' };

  await prisma.$transaction(async (tx) => {
    await tx.courseProgress.update({
      where: { id: row.id },
      data: { validationStatus: d.decision, validatedById: actor.id, validatedAt: new Date(), validationNote: d.note ?? null },
    });
    await logActivity(tx, {
      type: d.decision === 'VALIDATED' ? 'PROOF_VALIDATED' : 'PROOF_REJECTED',
      actorId: actor.id,
      enrollmentId: row.enrollmentId,
      subjectUserId: row.enrollment.userId,
      payload: { courseId: row.courseId, note: d.note ?? null },
    });
  });

  try {
    const u = row.enrollment.user;
    const mail = proofValidated({ firstName: u.firstName, courseTitle: row.course.title, decision: d.decision, note: d.note });
    const outcome = await sendMail({ to: { email: u.email, name: `${u.firstName} ${u.lastName}` }, ...mail, tags: ['proof'] });
    await prisma.activityLog.create({ data: { type: 'EMAIL_SENT', actorId: actor.id, enrollmentId: row.enrollmentId, subjectUserId: u.id, payload: outcome } });
  } catch (error) {
    await prisma.activityLog.create({ data: { type: 'EMAIL_FAILED', actorId: actor.id, enrollmentId: row.enrollmentId, payload: { message: String(error) } } });
  }

  revalidatePath('/espace/validations');
  revalidatePath(`/espace/participants/${row.enrollmentId}`);
  revalidatePath(`/espace/cohortes/${row.enrollment.cohortId}`);
  revalidatePath('/espace/mon-parcours');
  return { ok: true };
}
