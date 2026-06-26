import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { orderIndex: "asc" } });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
