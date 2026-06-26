import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 401 });
    }

    if (user.status !== "actif") {
      return NextResponse.json({ error: "Compte désactivé" }, { status: 403 });
    }

    const newToken = generateToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      success: true,
      token: newToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
