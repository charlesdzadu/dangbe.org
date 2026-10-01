'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { logActivity } from '@/lib/activity';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { dateOnly } from '@/lib/utils/dates';
import { slugify } from '@/lib/utils/slug';
import { assignMentorSchema, cohortSchema, enrollmentStatusSchema } from '@/lib/validation/cohort';

async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  let slug = slugify(base) || 'cohorte';
  for (let n = 2; ; n++) {
    const clash = await prisma.cohort.findUnique({ where: { slug }, select: { id: true } });
    if (!clash || clash.id === exceptId) return slug;
    slug = `${slugify(base)}-${n}`;
  }
}

/** Create or update. The template's type must match the cohort's. */
export async function saveCohort(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  await requireRole('ADMIN');
  const parsed = parseForm(cohortSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const template = await prisma.pathwayTemplate.findUnique({ where: { id: d.pathwayTemplateId } });
  if (!template || template.type !== d.pathwayType) return { ok: false, fieldErrors: { pathwayTemplateId: ['typeMismatch'] } };

  const data = {
    name: d.name,
    pathwayType: d.pathwayType,
    pathwayTemplateId: d.pathwayTemplateId,
    startDate: dateOnly(d.startDate),
    endDate: dateOnly(d.endDate),
    status: d.status,
    description: d.description ?? null,
  };
  let id = d.id;
  if (id) {
    await prisma.cohort.update({ where: { id }, data });
  } else {
    const row = await prisma.cohort.create({ data: { ...data, slug: await uniqueSlug(d.name) } });
    id = row.id;
  }
  revalidatePath('/espace/cohortes');
  revalidatePath(`/espace/cohortes/${id}`);
  redirect(`/espace/cohortes/${id}`);
}

export async function assignMentor(formData: FormData): Promise<void> {
  const admin = await requireRole('ADMIN');
  const parsed = parseForm(assignMentorSchema, formData);
  if (!parsed.ok) return;
  const { enrollmentId, mentorId } = parsed.data;
  if (mentorId) {
    const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
    if (!mentor || mentor.status !== 'ACTIVE' || mentor.role === 'PARTICIPANT') return;
  }
  const enrollment = await prisma.$transaction(async (tx) => {
    const row = await tx.enrollment.update({ where: { id: enrollmentId }, data: { mentorId: mentorId ?? null } });
    await logActivity(tx, { type: 'MENTOR_ASSIGNED', actorId: admin.id, enrollmentId, subjectUserId: row.userId, payload: { mentorId: mentorId ?? null } });
    return row;
  });
  revalidatePath(`/espace/participants/${enrollmentId}`);
  revalidatePath(`/espace/cohortes/${enrollment.cohortId}`);
}

export async function setEnrollmentStatus(formData: FormData): Promise<void> {
  const actor = await requireRole('ADMIN', 'MENTOR');
  const parsed = parseForm(enrollmentStatusSchema, formData);
  if (!parsed.ok) return;
  const { enrollmentId, status } = parsed.data;
  const enrollment = await prisma.$transaction(async (tx) => {
    const row = await tx.enrollment.update({
      where: { id: enrollmentId },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : null },
    });
    await logActivity(tx, { type: 'ENROLLMENT_STATUS_CHANGED', actorId: actor.id, enrollmentId, subjectUserId: row.userId, payload: { status } });
    return row;
  });
  revalidatePath(`/espace/participants/${enrollmentId}`);
  revalidatePath(`/espace/cohortes/${enrollment.cohortId}`);
}
