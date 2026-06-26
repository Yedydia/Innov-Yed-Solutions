import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { orderIndex: "asc" } });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
