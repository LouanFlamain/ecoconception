import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.SEED_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "SEED_SECRET non configuré sur le serveur" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await seedDatabase(prisma);
    return NextResponse.json({
      message: "Seed terminé",
      ...result,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed", details: String(error) },
      { status: 500 },
    );
  }
}
