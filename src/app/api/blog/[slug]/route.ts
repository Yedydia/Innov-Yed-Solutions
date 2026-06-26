import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const article = await prisma.blogArticle.findUnique({ where: { slug } });
    if (!article) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
