import { PrismaClient } from "./generated/client";

/* ════════════════════════════════════════════════════════════════════
 *  Prisma Client Singleton — prevents connection pool exhaustion
 *  during Next.js hot-reloads in development mode.
 * ════════════════════════════════════════════════════════════════════ */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
