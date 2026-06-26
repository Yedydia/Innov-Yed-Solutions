import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const result = await authenticateRequest(request);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const user = await prisma.user.findUnique({
      where: { id: result.user.id },
      select: { id: true, name: true, email: true, phone: true, company: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const result = await authenticateRequest(request);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const body = await request.json();
    const { name, email, phone, company, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({ where: { id: result.user.id } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
      if (newPassword.length < 8) return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
    }

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 12);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: result.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, company: true, role: true, status: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
