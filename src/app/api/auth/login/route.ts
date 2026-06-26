import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { rateLimitByKey } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rl = rateLimitByKey(`login:${ip}`, 10, 60 * 1000);
    if (rl.limited) return rl.response;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
