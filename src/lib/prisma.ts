import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Anti-pattern: pas de singleton, nouvelle instance à chaque import en dev
// (en vrai Next.js hot-reload crée plein de connexions)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"], // Anti-pattern: logging excessif en production
});

export default prisma;
