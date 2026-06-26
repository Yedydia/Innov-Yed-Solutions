import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const session = await authenticateRequest(request);
    if ("error" in session) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = session.user;

    // Validate prices server-side
    let total = 0;
    const validatedItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: `Produit ${item.productId} introuvable` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuffisant pour ${product.name}` }, { status: 400 });
      }
      total += product.price * item.quantity;
      validatedItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        reference: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        firstName: shippingAddress?.firstName || "",
        lastName: shippingAddress?.lastName || "",
        email: user.email,
        phone: shippingAddress?.phone || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        total,
        status: "en_attente",
        user: { connect: { id: userId } },
        items: { create: validatedItems },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
