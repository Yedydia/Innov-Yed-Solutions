import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
