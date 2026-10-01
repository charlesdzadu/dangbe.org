import type { ActivityType, Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

/** Append-only. Call inside the transaction that made the change. */
export function logActivity(
  tx: Tx,
  entry: {
    type: ActivityType;
    actorId?: string | null;
    enrollmentId?: string | null;
    applicationId?: string | null;
    subjectUserId?: string | null;
    payload?: Prisma.InputJsonValue;
  },
) {
  return tx.activityLog.create({
    data: {
      type: entry.type,
      actorId: entry.actorId ?? null,
      enrollmentId: entry.enrollmentId ?? null,
      applicationId: entry.applicationId ?? null,
      subjectUserId: entry.subjectUserId ?? null,
      payload: entry.payload,
    },
  });
}
