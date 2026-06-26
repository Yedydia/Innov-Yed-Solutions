import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { year: "desc" } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
