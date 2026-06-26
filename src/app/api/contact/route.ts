import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    let userId: string | undefined;
    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      try {
        const payload = await verifyToken(auth.slice(7));
        if (payload) userId = payload.id;
      } catch {}
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        ...(userId && { userId }),
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
