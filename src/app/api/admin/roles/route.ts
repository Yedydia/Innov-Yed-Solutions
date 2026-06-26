import { NextResponse } from "next/server";
import { authenticateRequest, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const roles = await prisma.role.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { name, label, description, color } = body;
    if (!name || !label) {
      return NextResponse.json({ error: "name et label requis" }, { status: 400 });
    }
    const role = await prisma.role.create({
      data: { name: name.toLowerCase().replace(/\s+/g, "-"), label, description, color: color || "#8B5CF6" },
    });
    return NextResponse.json(role, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    const role = await prisma.role.findUnique({ where: { id } });
    if (role?.isDefault) return NextResponse.json({ error: "Impossible de supprimer un rôle par défaut" }, { status: 400 });
    await prisma.role.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
