'use server';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/i18n';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { logActivity } from '@/lib/activity';
import { prisma } from '@/lib/db/prisma';
import { sendMail, teamNotifyEmails } from '@/lib/email/send';
import { applicationReceived, newApplicationNotice } from '@/lib/email/templates/application';
import { applicationSchema } from '@/lib/validation/application';

const MIN_SECONDS_ON_FORM = 5;

/**
 * The public application form. Bots and duplicates get a quiet `ok` (no
 * enumeration, no second row); a real applicant gets a row, a confirmation
 * mail and the thank-you page. Emails are sent AFTER the commit and never
 * fail the submission — the failure is logged instead.
 */
export async function submitApplication(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(applicationSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors, formError: 'invalid' };
  const d = parsed.data;
  const thanks = ROUTES.applyThanks[d.locale];

  const tooFast = d.startedAt !== undefined && Date.now() - d.startedAt < MIN_SECONDS_ON_FORM * 1000;
  if (d.website || tooFast) redirect(thanks);

  const existing = await prisma.application.findFirst({
    where: { email: d.email, status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
    select: { id: true },
  });
  if (existing) redirect(thanks);

  const application = await prisma.$transaction(async (tx) => {
    const row = await tx.application.create({
      data: {
        locale: d.locale,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        city: d.city,
        degreeLevel: d.degreeLevel,
        fieldOfStudy: d.fieldOfStudy,
        institution: d.institution,
        graduationYear: d.graduationYear,
        motivation: d.motivation,
        deviceAccess: d.deviceAccess,
        internetAccess: d.internetAccess,
        hoursPerWeek: d.hoursPerWeek,
        pathwayPreference: d.pathwayPreference ?? null,
        feedbackWilling: d.feedbackWilling,
        frenchLevel: d.frenchLevel,
        englishLevel: d.englishLevel,
        howHeard: d.howHeard ?? null,
        consentAt: new Date(),
      },
    });
    await logActivity(tx, { type: 'APPLICATION_SUBMITTED', applicationId: row.id });
    return row;
  });

  await notify(application.id, async () => {
    const mail = applicationReceived({ firstName: application.firstName, locale: d.locale });
    return sendMail({ to: { email: application.email, name: `${application.firstName} ${application.lastName}` }, ...mail, tags: ['application-received'] });
  });
  for (const email of teamNotifyEmails()) {
    await notify(application.id, async () => {
      const mail = newApplicationNotice({
        firstName: application.firstName,
        lastName: application.lastName,
        city: application.city,
        applicationId: application.id,
      });
      return sendMail({ to: { email }, ...mail, tags: ['team-notice'] });
    });
  }

  redirect(thanks);
}

async function notify(applicationId: string, send: () => Promise<{ transport: string }>) {
  try {
    const outcome = await send();
    await prisma.activityLog.create({ data: { type: 'EMAIL_SENT', applicationId, payload: outcome } });
  } catch (error) {
    console.error('[mail] failed', error);
    await prisma.activityLog.create({
      data: { type: 'EMAIL_FAILED', applicationId, payload: { message: error instanceof Error ? error.message : String(error) } },
    });
  }
}

// ============================================================ screening ==

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/guards';
import { AdmissionError, admitToCohort } from '@/lib/admission';
import { INVITE_TTL_MS } from '@/lib/auth/tokens';
import { applicationDecision, invitation } from '@/lib/email/templates/application';
import { SITE_URL } from '@/lib/links';
import { decisionSchema, reviewSchema } from '@/lib/validation/screening';

/** One score card per screener; the first review moves SUBMITTED → UNDER_REVIEW. */
export async function reviewApplication(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireRole('ADMIN', 'MENTOR');
  const parsed = parseForm(reviewSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const application = await prisma.application.findUnique({ where: { id: d.applicationId } });
  if (!application) return { ok: false, formError: 'notFound' };

  await prisma.$transaction(async (tx) => {
    await tx.applicationReview.upsert({
      where: { applicationId_reviewerId: { applicationId: d.applicationId, reviewerId: user.id } },
      update: { motivationScore: d.motivationScore, accessScore: d.accessScore, feedbackScore: d.feedbackScore, comment: d.comment ?? null },
      create: { applicationId: d.applicationId, reviewerId: user.id, motivationScore: d.motivationScore, accessScore: d.accessScore, feedbackScore: d.feedbackScore, comment: d.comment ?? null },
    });
    if (application.status === 'SUBMITTED') {
      await tx.application.update({ where: { id: d.applicationId }, data: { status: 'UNDER_REVIEW' } });
    }
    await logActivity(tx, { type: 'APPLICATION_REVIEWED', actorId: user.id, applicationId: d.applicationId });
  });
  revalidatePath(`/espace/candidatures/${d.applicationId}`);
  revalidatePath('/espace/candidatures');
  return { ok: true };
}

/** ADMIN only. ACCEPTED admits (account, enrollment, progress rows, invitation); the rest is a mail. */
export async function decideApplication(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const admin = await requireRole('ADMIN');
  const parsed = parseForm(decisionSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  const application = await prisma.application.findUnique({ where: { id: d.applicationId } });
  if (!application) return { ok: false, formError: 'notFound' };
  if (!['SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED'].includes(application.status)) return { ok: false, formError: 'alreadyDecided' };

  if (d.decision === 'ACCEPTED') {
    let admitted: Awaited<ReturnType<typeof admitToCohort>>;
    try {
      admitted = await prisma.$transaction((tx) =>
        admitToCohort(tx, { application, cohortId: d.cohortId, mentorId: d.mentorId ?? null, actorId: admin.id, notes: d.notes ?? null }),
      );
    } catch (error) {
      if (error instanceof AdmissionError) return { ok: false, formError: error.code };
      throw error;
    }
    await notify(application.id, async () => {
      const url = admitted.rawToken ? `${SITE_URL}/invitation/${admitted.rawToken}` : `${SITE_URL}/connexion`;
      const mail = invitation({ firstName: admitted.user.firstName, url, locale: admitted.user.locale, cohortName: admitted.cohort.name, expiresDays: INVITE_TTL_MS / 86_400_000, existingAccount: !admitted.rawToken });
      const outcome = await sendMail({ to: { email: admitted.user.email, name: `${admitted.user.firstName} ${admitted.user.lastName}` }, ...mail, tags: ['invitation'] });
      await prisma.activityLog.create({ data: { type: 'INVITE_SENT', actorId: admin.id, enrollmentId: admitted.enrollment.id, subjectUserId: admitted.user.id, payload: outcome } });
      return outcome;
    });
  } else {
    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: application.id },
        data: { status: d.decision, decidedById: admin.id, decidedAt: new Date(), decisionNotes: d.notes ?? null },
      });
      await logActivity(tx, { type: 'APPLICATION_DECIDED', actorId: admin.id, applicationId: application.id, payload: { decision: d.decision } });
    });
    await notify(application.id, async () => {
      const mail = applicationDecision({ firstName: application.firstName, decision: d.decision, locale: application.locale });
      return sendMail({ to: { email: application.email, name: `${application.firstName} ${application.lastName}` }, ...mail, tags: ['decision'] });
    });
  }

  revalidatePath(`/espace/candidatures/${application.id}`);
  revalidatePath('/espace/candidatures');
  revalidatePath('/espace/cohortes');
  return { ok: true };
}
