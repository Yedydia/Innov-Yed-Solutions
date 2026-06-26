import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token d'authentification manquant" }, { status: 401 });
    }

    const payload = await verifyToken(auth.slice(7));
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
