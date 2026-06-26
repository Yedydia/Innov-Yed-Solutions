import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token et nouveau mot de passe requis" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Mot de passe trop court (8 caractères minimum)" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
