import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
