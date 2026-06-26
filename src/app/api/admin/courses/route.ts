import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["slug", "title", "instructor", "level", "duration", "modules", "price", "rating", "students", "image", "domain", "badge", "description"];

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
    const courses = await prisma.course.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { title, instructor, level, duration, price, rating, students, slug, image, modules, description, domain, badge } = body;

    if (!title || !instructor || !slug || !price) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, instructor, level: level || "Débutant", duration: duration || "0h", price, rating: rating || 0, students: students || 0, slug, image: image || "/images/placeholder.jpg", modules: modules || 1, description: description || "", domain: domain || "", badge },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
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
    const courseId = id || body.courseId;
    if (!courseId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const course = await prisma.course.update({
      where: { id: courseId },
      data: whitelist(body),
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
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
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
