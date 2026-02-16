import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedDatabase } from "../src/lib/seed";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding database...");

seedDatabase(prisma)
  .then((result) => {
    console.log(`✅ ${result.categories} catégories`);
    console.log(`✅ ${result.products} produits`);
    console.log(`✅ ${result.users} utilisateurs`);
    console.log(`✅ ${result.orders} commandes`);
    console.log("🎉 Seed terminé !");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
