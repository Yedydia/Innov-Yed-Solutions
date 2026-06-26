import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) return NextResponse.json({ error: "Témoignage introuvable" }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
