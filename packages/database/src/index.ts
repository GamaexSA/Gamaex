import { PrismaClient } from "@prisma/client";

// Singleton pattern — evita múltiples conexiones en desarrollo con hot-reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export all Prisma types so consumers don't import from @prisma/client directly
export * from "@prisma/client";
export type { Prisma } from "@prisma/client";
