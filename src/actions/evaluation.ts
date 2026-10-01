'use server';

import { revalidatePath } from 'next/cache';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { logActivity } from '@/lib/activity';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { evaluationSchema, noteSchema } from '@/lib/validation/progress';

/** One score per competency per sitting; the latest is "the" result. */
export async function createEvaluation(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const actor = await requireRole('ADMIN', 'MENTOR');
  const parsed = parseForm(evaluationSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const inPathway = await prisma.courseProgress.findFirst({ where: { enrollmentId: d.enrollmentId, competencyId: d.competencyId }, select: { id: true } });
  if (!inPathway) return { ok: false, fieldErrors: { competencyId: ['invalid'] } };
  await prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.findUniqueOrThrow({ where: { id: d.enrollmentId } });
    await tx.evaluation.create({ data: { enrollmentId: d.enrollmentId, competencyId: d.competencyId, evaluatorId: actor.id, score: d.score, notes: d.notes ?? null } });
    await logActivity(tx, { type: 'EVALUATION_CREATED', actorId: actor.id, enrollmentId: d.enrollmentId, subjectUserId: enrollment.userId, payload: { competencyId: d.competencyId, score: d.score } });
  });
  revalidatePath(`/espace/participants/${d.enrollmentId}`);
  revalidatePath('/espace/mes-evaluations');
  return { ok: true };
}

export async function addMentorNote(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const actor = await requireRole('ADMIN', 'MENTOR');
  const parsed = parseForm(noteSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  await prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.findUniqueOrThrow({ where: { id: d.enrollmentId } });
    await tx.mentorNote.create({ data: { enrollmentId: d.enrollmentId, authorId: actor.id, body: d.body, visibleToParticipant: d.visibleToParticipant } });
    await logActivity(tx, { type: 'NOTE_ADDED', actorId: actor.id, enrollmentId: d.enrollmentId, subjectUserId: enrollment.userId, payload: { visible: d.visibleToParticipant } });
  });
  revalidatePath(`/espace/participants/${d.enrollmentId}`);
  revalidatePath('/espace/mes-evaluations');
  return { ok: true };
}
