import { createHash, randomBytes } from 'node:crypto';
import type { AuthTokenPurpose, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

type Tx = Prisma.TransactionClient;

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const RESET_TTL_MS = 30 * 60 * 1000;

/** 32 random bytes, URL-safe: what goes in the link and the cookie. */
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Only the hash is stored, so a database read never yields a usable token. */
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/** Issues a fresh token and consumes any older live one of the same purpose. */
export async function issueAuthToken(tx: Tx, userId: string, purpose: AuthTokenPurpose, ttlMs: number): Promise<string> {
  await tx.authToken.updateMany({
    where: { userId, purpose, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  const raw = generateToken();
  await tx.authToken.create({
    data: { userId, purpose, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + ttlMs) },
  });
  return raw;
}

/** The token's user, if it is live. Does not consume it (see `consumeAuthToken`). */
export async function peekAuthToken(purpose: AuthTokenPurpose, raw: string) {
  if (!raw || raw.length > 128) return null;
  const token = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(raw) }, include: { user: true } });
  if (!token || token.purpose !== purpose || token.consumedAt || token.expiresAt < new Date()) return null;
  return token;
}

/** Marks the token consumed inside the caller's transaction. */
export async function consumeAuthToken(tx: Tx, tokenId: string) {
  await tx.authToken.update({ where: { id: tokenId }, data: { consumedAt: new Date() } });
}
