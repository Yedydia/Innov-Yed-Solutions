import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const articles = await prisma.blogArticle.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(articles);
  } catch { return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = await request.json();
    const article = await prisma.blogArticle.create({ data: body });
    return NextResponse.json(article, { status: 201 });
  } catch { return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); }
}
