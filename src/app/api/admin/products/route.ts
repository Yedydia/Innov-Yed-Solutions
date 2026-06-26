import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["slug", "name", "category", "price", "originalPrice", "image", "rating", "reviews", "stock", "description"];

function whitelist(data: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in data) result[field] = data[field];
  }
  return result;
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { slug, name, category, price, originalPrice, image, stock, rating, reviews, description } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { slug, name, category, price, originalPrice, image: image || "/images/placeholder.jpg", stock: stock || 0, rating: rating || 0, reviews: reviews || 0, description: description || "" },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const productId = id || body.productId;
    if (!productId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const product = await prisma.product.update({
      where: { id: productId },
      data: whitelist(body),
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
