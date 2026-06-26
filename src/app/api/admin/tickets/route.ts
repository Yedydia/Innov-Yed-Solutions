import { NextResponse } from "next/server";
import { authenticateRequest, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          select: { id: true, content: true, authorId: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const auth = await requireAdmin(request);

  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { ticketId, status, description, response } = await request.json();

    if (!ticketId || !status) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const updateData: any = { status };

    if (response) {
      updateData.messages = {
        create: {
          content: response,
          authorId: auth.user.id,
        },
      };
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
