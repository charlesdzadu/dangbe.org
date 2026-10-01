import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import type { Locale, Role, UserStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { generateToken, hashToken } from './tokens';

export const SESSION_COOKIE = 'dangbe_session';
/* Fixed 30 days, no sliding renewal: Next 15 cannot set a cookie from a
 * layout, and a volunteer who signs in once a month is fine. */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  locale: Locale;
};

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

/** Creates the row and sets the cookie. Server actions and route handlers only. */
export async function createSession(userId: string): Promise<void> {
  const raw = generateToken();
  const h = await headers();
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      userAgent: h.get('user-agent')?.slice(0, 250) ?? null,
    },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, raw, { ...cookieOptions, maxAge: SESSION_TTL_MS / 1000 });
}

/** Deletes the row and clears the cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) await prisma.session.deleteMany({ where: { tokenHash: hashToken(raw) } });
  store.delete(SESSION_COOKIE);
}

/** Every session of a user, e.g. after a password change. */
export async function revokeAllSessions(userId: string, exceptRaw?: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId, ...(exceptRaw ? { NOT: { tokenHash: hashToken(exceptRaw) } } : {}) },
  });
}

/**
 * The signed-in user, or null. `cache()` dedupes the lookup across the
 * layout, the page and the components of one request.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw || raw.length > 128) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || session.user.status !== 'ACTIVE') return null;
  const u = session.user;
  return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, status: u.status, locale: u.locale };
});

export async function currentSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}
