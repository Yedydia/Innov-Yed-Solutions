import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);

  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const [totalOrders, pendingOrders, completedOrders, totalRevenue, revenueData, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "en_attente" } }),
      prisma.order.count({ where: { status: "confirmee" } }),
      prisma.order.aggregate({
        where: { status: { in: ["confirmee", "livree"] } },
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ["createdAt"],
        where: { status: { in: ["confirmee", "livree"] } },
        _sum: { total: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.order.findMany({
        select: { id: true, reference: true, firstName: true, lastName: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      stats: { totalOrders, pendingOrders, completedOrders, totalRevenue },
      revenueData,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
