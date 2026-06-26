import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["name", "role", "text", "rating", "avatar", "orderIndex"];

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
    const testimonials = await prisma.testimonial.findMany({ orderBy: { orderIndex: "asc" } });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { name, role, text, rating, avatar, orderIndex } = body;

    if (!name || !role || !text) {
      return NextResponse.json({ error: "Nom, rôle et texte requis" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: { name, role, text, rating: rating || 5, avatar: avatar || "", orderIndex: orderIndex || 0 },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
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
    const testimonialId = id || body.id;
    if (!testimonialId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const testimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: whitelist(body),
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
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
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
