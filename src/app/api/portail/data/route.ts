import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const result = await authenticateRequest(request);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const userId = result.user.id;

    const [tickets, invoices, orders, devis, contacts] = await Promise.all([
      prisma.ticket.findMany({
        where: { userId },
        include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.devis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ tickets, invoices, orders, devis, contacts });
  } catch (error) {
    console.error("Error fetching portail data:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
