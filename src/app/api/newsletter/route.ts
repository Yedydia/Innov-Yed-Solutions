import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
    }

    const subscription = await prisma.newsletter.create({
      data: { email },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
