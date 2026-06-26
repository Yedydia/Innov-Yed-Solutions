import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
