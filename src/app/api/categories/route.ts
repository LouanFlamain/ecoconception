import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Anti-pattern: pas de cache
export async function GET() {
  console.log("API /categories called at", new Date().toISOString()); // Anti-pattern: console.log

  const categories = await prisma.category.findMany();

  return NextResponse.json(categories, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
    },
  });
}
