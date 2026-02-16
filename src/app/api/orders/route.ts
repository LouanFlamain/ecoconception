import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("API /orders POST called"); // Anti-pattern: console.log

  const body = await request.json();
  const { userId, items } = body;

  if (!userId || !items || items.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Anti-pattern: pas de validation des données, pas de vérification du stock
  const total = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      total: Math.round(total * 100) / 100,
      status: "pending",
      items: {
        create: items.map((item: { productId: number; quantity: number; price: number }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  console.log("API /orders GET called"); // Anti-pattern: console.log

  // Anti-pattern: retourne TOUTES les commandes sans auth ni pagination
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
