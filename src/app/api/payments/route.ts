import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId requis" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "confirmee" },
    });

    return NextResponse.json({
      success: true,
      message: "Paiement traité (mode démo)",
    });
  } catch {
    return NextResponse.json({ error: "Erreur de traitement du paiement" }, { status: 500 });
  }
}
