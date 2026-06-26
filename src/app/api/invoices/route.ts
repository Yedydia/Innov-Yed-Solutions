import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get("userId");

  try {
    const where: any = {};
    if (userId) where.userId = userId;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
