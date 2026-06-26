import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["slug", "title", "client", "year", "domain", "image", "description", "technologies", "results"];

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
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { slug, title, client, year, domain, image, description, technologies, results } = body;

    if (!title || !client || !slug) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: { slug, title, client, year: year || new Date().getFullYear(), domain: domain || "", image: image || "/images/placeholder.jpg", description: description || "", technologies: technologies || [], results: results || [] },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
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
    const projectId = id || body.projectId;
    if (!projectId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const project = await prisma.project.update({
      where: { id: projectId },
      data: whitelist(body),
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
