import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const [users, orders, tickets, revenue] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.order.findMany({
        select: { id: true, reference: true, firstName: true, lastName: true, email: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.ticket.findMany({
        select: { id: true, subject: true, category: true, priority: true, status: true, userId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.order.aggregate({
        where: { status: { in: ["confirmee", "livree"] } },
        _sum: { total: true },
      }),
    ]);

    return NextResponse.json({
      users,
      orders,
      tickets,
      revenue: revenue._sum.total || 0,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
