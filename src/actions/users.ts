'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { requireRole } from '@/lib/auth/guards';
import { INVITE_TTL_MS, issueAuthToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/lib/email/send';
import { invitation, teamInvitation } from '@/lib/email/templates/application';
import { SITE_URL } from '@/lib/links';
import { inviteSchema, userIdSchema, userStatusSchema } from '@/lib/validation/users';

const DAYS = INVITE_TTL_MS / 86_400_000;

/** A new ADMIN or MENTOR: an INVITED row and a link to set the first password. */
export async function inviteTeamMember(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const admin = await requireRole('ADMIN');
  const parsed = parseForm(inviteSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  if (await prisma.user.findUnique({ where: { email: d.email } })) return { ok: false, fieldErrors: { email: ['exists'] } };

  const { user, raw } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email: d.email, firstName: d.firstName, lastName: d.lastName, role: d.role, status: 'INVITED' } });
    const raw = await issueAuthToken(tx, user.id, 'INVITE', INVITE_TTL_MS);
    return { user, raw };
  });
  await sendInvite(admin.id, user.id, () => teamInvitation({ firstName: user.firstName, url: `${SITE_URL}/invitation/${raw}`, role: d.role, expiresDays: DAYS }), user.email, `${user.firstName} ${user.lastName}`);
  revalidatePath('/espace/utilisateurs');
  redirect('/espace/utilisateurs?invited=1');
}

/** A fresh link for anyone still INVITED (team or participant). */
export async function resendInvitation(formData: FormData): Promise<void> {
  const admin = await requireRole('ADMIN');
  const parsed = parseForm(userIdSchema, formData);
  if (!parsed.ok) return;
  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    include: { enrollments: { include: { cohort: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  if (!user || user.status !== 'INVITED') return;
  const raw = await prisma.$transaction((tx) => issueAuthToken(tx, user.id, 'INVITE', INVITE_TTL_MS));
  const url = `${SITE_URL}/invitation/${raw}`;
  const cohortName = user.enrollments[0]?.cohort.name ?? 'cohorte DANGBE';
  await sendInvite(
    admin.id,
    user.id,
    () =>
      user.role === 'PARTICIPANT'
        ? invitation({ firstName: user.firstName, url, locale: user.locale, cohortName, expiresDays: DAYS })
        : teamInvitation({ firstName: user.firstName, url, role: user.role, expiresDays: DAYS }),
    user.email,
    `${user.firstName} ${user.lastName}`,
  );
  revalidatePath('/espace/utilisateurs');
}

/** DISABLED closes every session. Nobody can disable themselves. */
export async function setUserStatus(formData: FormData): Promise<void> {
  const admin = await requireRole('ADMIN');
  const parsed = parseForm(userStatusSchema, formData);
  if (!parsed.ok || parsed.data.userId === admin.id) return;
  const { userId, status } = parsed.data;
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { status } });
    if (status === 'DISABLED') await tx.session.deleteMany({ where: { userId } });
  });
  revalidatePath('/espace/utilisateurs');
}

async function sendInvite(actorId: string, userId: string, build: () => { subject: string; html: string; text: string }, email: string, name: string) {
  try {
    const outcome = await sendMail({ to: { email, name }, ...build(), tags: ['invitation'] });
    await prisma.activityLog.create({ data: { type: 'INVITE_SENT', actorId, subjectUserId: userId, payload: outcome } });
  } catch (error) {
    await prisma.activityLog.create({ data: { type: 'EMAIL_FAILED', actorId, subjectUserId: userId, payload: { message: String(error) } } });
  }
}
