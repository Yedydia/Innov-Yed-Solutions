import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const { courseId, lessonId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
