import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(userId && { userId }),
        ...(status && { status }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, image: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { orderId, status } = await request.json();

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const searchParams = new URL(request.url).searchParams;
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json({ error: "ID de commande requis" }, { status: 400 });
  }

  try {
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
