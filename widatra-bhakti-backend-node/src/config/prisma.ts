import { PrismaClient } from "@prisma/client";

// Global BigInt JSON serialization support
(BigInt.prototype as any).toJSON = function () {
  const num = Number(this);
  return num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER
    ? num
    : this.toString();
};

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
