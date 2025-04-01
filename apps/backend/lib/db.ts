import { PrismaClient } from "@prisma/client";

// Add prisma to the global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use global prisma to avoid multiple instances in development
export const db = global.prisma || new PrismaClient();

// Set the global prisma in development for hot reloading
if (process.env.NODE_ENV !== "production") global.prisma = db;
