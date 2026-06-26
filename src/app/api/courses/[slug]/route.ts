import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
