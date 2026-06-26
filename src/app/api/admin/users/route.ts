import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, phone: true, company: true, role: true, status: true, createdAt: true,
        _count: { select: { devis: true, orders: true, tickets: true, invoices: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { name, email, password, phone, company, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nom, email et mot de passe requis" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Mot de passe trop court (8 caractères minimum)" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone: phone || null, company: company || null, role: role || "client", status: "actif" },
      select: { id: true, name: true, email: true, phone: true, company: true, role: true, status: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const ALLOWED_FIELDS = ["status", "role", "name", "phone", "company"];

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { userId, status, role, name, phone, company } = body;

    if (!userId) return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });

    const updateData: Record<string, string> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body && body[field] !== undefined) updateData[field] = body[field];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, company: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
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
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
