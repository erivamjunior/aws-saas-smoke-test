import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["error"],
    });
  }

  return globalForPrisma.prisma;
}
