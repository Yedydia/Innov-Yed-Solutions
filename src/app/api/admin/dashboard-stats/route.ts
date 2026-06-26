import { NextResponse } from "next/server";
import { authenticateRequest, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totalUsers, newUsers, activeUsers, courses, totalOrders, confirmedRevenue, monthlyOrders] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.user.count({ where: { status: "actif" } }),
      prisma.course.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { in: ["confirmee", "livree"] } },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true, status: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const monthlyRevenue = months.map((label, idx) => {
      const monthOrders = monthlyOrders.filter(
        (o) => o.createdAt.getMonth() === idx && (o.status === "confirmee" || o.status === "livree")
      );
      const total = monthOrders.reduce((s, o) => s + o.total, 0);
      return { label, revenue: total };
    });

    const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
    const chartData = monthlyRevenue.map((m) => ({
      label: m.label.slice(0, 1),
      revenue: m.revenue,
      height: Math.max(5, Math.round((m.revenue / maxRevenue) * 100)),
    }));

    return NextResponse.json({
      totalUsers,
      newUsers,
      activeUsers,
      growthRate: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
      courses,
      totalOrders,
      confirmedRevenue: confirmedRevenue._sum.total || 0,
      chartData,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
