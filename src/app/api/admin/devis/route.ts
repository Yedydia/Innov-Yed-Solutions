import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const devises = await prisma.devis.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(devises);
  } catch (error) {
    console.error("Error fetching devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { reference, name, email, phone, company, service, budget, description, status, userId } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ error: "Nom, email et service requis" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    const devis = await prisma.devis.create({
      data: {
        reference: reference || `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
        name, email, phone: phone || "", company: company || null,
        service, budget: budget || null, description: description || "",
        status: status || "en_attente",
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });
    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    console.error("Error creating devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { devisId, status } = body;
    if (!devisId || !status) {
      return NextResponse.json({ error: "devisId et status requis" }, { status: 400 });
    }

    const allowed = ["en_attente", "accepte", "refuse", "gagne", "perdu"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const updated = await prisma.devis.update({
      where: { id: devisId },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    await prisma.devis.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
