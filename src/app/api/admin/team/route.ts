import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["name", "role", "bio", "image", "specialties", "orderIndex"];

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
    const teamMembers = await prisma.teamMember.findMany({ orderBy: { orderIndex: "asc" } });
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { name, role, bio, image, specialties, orderIndex } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Nom et rôle requis" }, { status: 400 });
    }

    const teamMember = await prisma.teamMember.create({
      data: { name, role, bio: bio || "", image: image || "", specialties: specialties || [], orderIndex: orderIndex || 0 },
    });
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
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
    const memberId = id || body.memberId;
    if (!memberId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const member = await prisma.teamMember.update({
      where: { id: memberId },
      data: whitelist(body),
    });
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating team member:", error);
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
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
