import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
