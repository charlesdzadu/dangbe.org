'use server';

import { redirect } from 'next/navigation';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { logActivity } from '@/lib/activity';
import { requireUser, safeNext } from '@/lib/auth/guards';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, currentSessionToken, destroySession, revokeAllSessions } from '@/lib/auth/session';
import { RESET_TTL_MS, consumeAuthToken, issueAuthToken, peekAuthToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/lib/email/send';
import { passwordReset } from '@/lib/email/templates/application';
import { SITE_URL } from '@/lib/links';
import { changePasswordSchema, forgotSchema, loginSchema, profileSchema, setPasswordSchema } from '@/lib/validation/auth';

/** Email + password. The compare always runs, so a missing account costs the same time. */
export async function login(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(loginSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const { email, password, next } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await verifyPassword(password, user?.passwordHash);
  if (!user || !ok) return { ok: false, formError: 'invalid' };
  if (user.status === 'DISABLED') return { ok: false, formError: 'disabled' };
  if (user.status === 'INVITED' || !user.passwordHash) return { ok: false, formError: 'invited' };

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await tx.enrollment.updateMany({ where: { userId: user.id, status: 'ACTIVE' }, data: { lastActivityAt: new Date() } });
    await logActivity(tx, { type: 'LOGIN', actorId: user.id, subjectUserId: user.id });
  });
  await createSession(user.id);
  redirect(safeNext(next));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/connexion');
}

/** Always answers "sent": the form never says whether an account exists. */
export async function requestPasswordReset(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(forgotSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user && user.status === 'ACTIVE') {
    const raw = await prisma.$transaction(async (tx) => {
      const token = await issueAuthToken(tx, user.id, 'PASSWORD_RESET', RESET_TTL_MS);
      await logActivity(tx, { type: 'PASSWORD_RESET_REQUESTED', actorId: user.id, subjectUserId: user.id });
      return token;
    });
    try {
      const mail = passwordReset({ firstName: user.firstName, url: `${SITE_URL}/reinitialiser/${raw}`, locale: user.locale, expiresMinutes: RESET_TTL_MS / 60000 });
      const outcome = await sendMail({ to: { email: user.email, name: `${user.firstName} ${user.lastName}` }, ...mail, tags: ['password-reset'] });
      await prisma.activityLog.create({ data: { type: 'EMAIL_SENT', subjectUserId: user.id, payload: outcome } });
    } catch (error) {
      await prisma.activityLog.create({ data: { type: 'EMAIL_FAILED', subjectUserId: user.id, payload: { message: String(error) } } });
    }
  }
  return { ok: true };
}

/** A reset link: new password, every other session gone, signed in. */
export async function resetPassword(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(setPasswordSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const token = await peekAuthToken('PASSWORD_RESET', parsed.data.token);
  if (!token || token.user.status === 'DISABLED') return { ok: false, formError: 'invalidToken' };
  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction(async (tx) => {
    await consumeAuthToken(tx, token.id);
    await tx.user.update({ where: { id: token.userId }, data: { passwordHash, status: 'ACTIVE' } });
  });
  await revokeAllSessions(token.userId);
  await createSession(token.userId);
  redirect('/espace');
}

/** An invitation link: first password, INVITED → ACTIVE, signed in. */
export async function acceptInvitation(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(setPasswordSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const token = await peekAuthToken('INVITE', parsed.data.token);
  if (!token || token.user.status === 'DISABLED') return { ok: false, formError: 'invalidToken' };
  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction(async (tx) => {
    await consumeAuthToken(tx, token.id);
    await tx.user.update({ where: { id: token.userId }, data: { passwordHash, status: 'ACTIVE', lastLoginAt: new Date() } });
    await logActivity(tx, { type: 'INVITE_ACCEPTED', actorId: token.userId, subjectUserId: token.userId });
  });
  await createSession(token.userId);
  redirect('/espace');
}

export async function updateProfile(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = parseForm(profileSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const d = parsed.data;
  await prisma.user.update({ where: { id: user.id }, data: { firstName: d.firstName, lastName: d.lastName, phone: d.phone ?? null, locale: d.locale } });
  return { ok: true };
}

export async function changePassword(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = parseForm(changePasswordSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const row = await prisma.user.findUnique({ where: { id: user.id } });
  if (!(await verifyPassword(parsed.data.currentPassword, row?.passwordHash))) {
    return { ok: false, fieldErrors: { currentPassword: ['invalid'] } };
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(parsed.data.password) } });
  await revokeAllSessions(user.id, await currentSessionToken());
  return { ok: true };
}
