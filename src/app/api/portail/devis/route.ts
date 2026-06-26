import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const { service, description, budget } = body;

    if (!service || !description) {
      return NextResponse.json({ error: "Service et description requis" }, { status: 400 });
    }

    const reference = `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const user = await prisma.user.findUnique({ where: { id: result.user.id } });

    const devis = await prisma.devis.create({
      data: {
        reference,
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        company: user?.company || null,
        service,
        budget: budget || null,
        description,
        user: { connect: { id: result.user.id } },
      },
    });

    return NextResponse.json({ success: true, reference: devis.reference, id: devis.id });
  } catch (error) {
    console.error("Error creating devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
