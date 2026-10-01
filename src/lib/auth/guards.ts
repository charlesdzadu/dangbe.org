import { notFound, redirect } from 'next/navigation';
import type { Role } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser, type SessionUser } from './session';

export const LOGIN_PATH = '/connexion';
export const APP_HOME = '/espace';

/** Signed in, or off to the login page. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

/** Signed in with one of these roles, or back to the space's home (never a 404). */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(APP_HOME);
  return user;
}

export const isTeam = (user: SessionUser) => user.role === 'ADMIN' || user.role === 'MENTOR';

/** A participant may only touch their own enrollment. */
export async function requireOwnEnrollment(enrollmentId: string) {
  const user = await requireRole('PARTICIPANT');
  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.userId !== user.id) notFound();
  return { user, enrollment };
}

/** Only a same-origin path inside the space is a valid `next`. */
export function safeNext(next: string | undefined): string {
  return next && next.startsWith('/espace') && !next.startsWith('//') ? next : APP_HOME;
}
