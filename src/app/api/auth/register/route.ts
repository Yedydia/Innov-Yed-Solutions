import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { rateLimitByKey } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Mot de passe trop court (8 caractères minimum)" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rl = rateLimitByKey(`register:${ip}`, 5, 60 * 1000);
    if (rl.limited) return rl.response;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, phone, company: company || null, password: hashed },
    });

    return NextResponse.json({ success: true, message: "Compte créé avec succès" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
