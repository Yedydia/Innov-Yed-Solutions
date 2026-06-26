import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ user: result.user });
}

export async function PUT(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const { name, phone, company, currentPassword, newPassword } = body;

    const updateData: Record<string, string> = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Le mot de passe actuel est requis" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: result.user.id } });
      if (!user) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 403 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Nouveau mot de passe trop court (6 caractères minimum)" }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: result.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, phone: true, company: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    await prisma.user.delete({ where: { id: result.user.id } });
    return NextResponse.json({ success: true, message: "Compte supprimé" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
