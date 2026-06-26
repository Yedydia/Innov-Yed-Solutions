import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  const token = request.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token d'authentification manquant" }, { status: 401 });
  }

  const tokenValue = token.slice(7);
  const payload = verifyToken(tokenValue);

  if (!payload) {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: payload.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Email de vérification envoyé" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
