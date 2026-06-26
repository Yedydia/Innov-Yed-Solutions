import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest, requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get("userId");

  try {
    const where: any = {};

    if (userId) where.userId = userId;

    const devises = await prisma.devis.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(devises);
  } catch (error) {
    console.error("Error fetching devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const { services, budget, description, name, email, phone, company } = body;

    const reference = `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const devis = await prisma.devis.create({
      data: {
        reference,
        name, email, phone,
        company: company || null,
        service: services.join(", "),
        budget: budget || null,
        description: description || "",
        user: { connect: { id: result.user.id } },
      },
    });

    return NextResponse.json({ success: true, reference: devis.reference });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
