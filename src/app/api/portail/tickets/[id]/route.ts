import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

function getToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  const { id } = await params;

  try {
    const ticket = await prisma.ticket.findFirst({
      where: { id, userId: payload.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });

    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  const { id } = await params;

  try {
    const ticket = await prisma.ticket.findFirst({
      where: { id, userId: payload.id },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        content: message,
        authorId: payload.id,
      },
    });

    return NextResponse.json({ success: true, message: ticketMessage });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
