import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Anti-pattern: pas de cache, headers no-store
export async function GET() {
  console.log("API /products called at", new Date().toISOString()); // Anti-pattern: console.log

  // Anti-pattern: charge TOUS les produits sans pagination
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate", // Anti-pattern: pas de cache
    },
  });
}
