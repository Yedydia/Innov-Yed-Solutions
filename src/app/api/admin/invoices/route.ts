import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const invoices = await prisma.invoice.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { reference, amount, status, dueDate, userId, pdfUrl } = body;

    if (!reference || !amount || !dueDate || !userId) {
      return NextResponse.json({ error: "Référence, montant, date d'échéance et utilisateur requis" }, { status: 400 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        reference,
        amount,
        status: status || "impayee",
        dueDate: new Date(dueDate),
        pdfUrl: pdfUrl || null,
        user: { connect: { id: userId } },
      },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
