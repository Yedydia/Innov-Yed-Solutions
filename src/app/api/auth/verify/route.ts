import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token verify error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
