import { NextResponse } from "next/server";
import { authenticateRequest, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

const ALLOWED_FIELDS = ["amount", "status", "dueDate", "paidAt", "pdfUrl"];

function whitelist(data: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in data) result[field] = data[field];
  }
  return result;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true, company: true } } },
    });
    if (!invoice) return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
    if (auth.user.role !== "admin" && invoice.userId !== auth.user.id)
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.update({ where: { id }, data: whitelist(body) });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  try {
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
