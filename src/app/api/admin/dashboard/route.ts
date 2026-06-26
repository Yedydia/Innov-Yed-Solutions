import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest, requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const [recentOrders, totalRevenueAgg, activeUsers, pendingSupportTickets, recentDevis, serviceStats, recentUsers, recentContactMessages] = await Promise.all([
      prisma.order.findMany({
        select: { id: true, reference: true, firstName: true, lastName: true, email: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.order.aggregate({
        where: { status: { in: ["confirmee", "livree"] } },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { status: "actif" } }),
      prisma.ticket.count({ where: { status: "ouvert" } }),
      prisma.devis.findMany({
        select: { id: true, reference: true, name: true, email: true, service: true, budget: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.devis.groupBy({
        by: ["service"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.user.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.contact.findMany({
        select: { id: true, name: true, subject: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const totalRevenue = totalRevenueAgg._sum.total || 0;

    const topServices = serviceStats.map((s, i) => ({
      name: s.service,
      revenue: 0,
      percentage: Math.round((s._count.id / serviceStats.reduce((a, b) => a + b._count.id, 0)) * 100),
    }));

    const activity: Array<{ type: string; text: string; time: string }> = [];
    for (const u of recentUsers) {
      activity.push({ type: "user", text: `Nouvel utilisateur : ${u.name}`, time: `Il y a ${Math.max(1, Math.floor((Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60)))}h` });
    }
    for (const d of recentDevis) {
      activity.push({ type: "devis", text: `Nouveau devis de ${d.name} — ${d.service}`, time: `Il y a ${Math.max(1, Math.floor((Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60)))}h` });
    }
    for (const c of recentContactMessages) {
      activity.push({ type: "contact", text: `Nouveau message de ${c.name} : ${c.subject}`, time: `Il y a ${Math.max(1, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60)))}h` });
    }
    activity.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 10);

    return NextResponse.json({
      recentOrders,
      totalRevenue,
      activeUsers,
      pendingSupportTickets,
      recentDevis,
      topServices,
      activity,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
