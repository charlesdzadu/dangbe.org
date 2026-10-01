import { PrismaClient } from '@prisma/client';

/* One client per process. In dev, HMR re-evaluates modules; the singleton on
 * globalThis stops a new pool being opened on every save. Node runtime only:
 * never import this from an edge route or the middleware. */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
