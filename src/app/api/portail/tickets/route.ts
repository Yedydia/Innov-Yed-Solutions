import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

function getToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: Request) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const body = await request.json();
    const { subject, category, priority, message } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Sujet et message requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        category: category || "general",
        priority: priority || "moyenne",
        userId: payload.id,
        messages: {
          create: {
            content: message,
            authorId: payload.id,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
