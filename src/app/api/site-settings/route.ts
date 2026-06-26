import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const allowedFields = [
  "siteName", "siteTagline", "badgeText", "projectsDelivered", "satisfiedClients",
  "yearsExperience", "satisfactionRate", "phone", "email", "whatsapp", "address",
  "facebook", "twitter", "linkedin", "instagram", "youtube",
];

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "singleton" } });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const data: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in body) data[field] = body[field];
    }

    let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "singleton", ...data } });
    } else {
      settings = await prisma.siteSettings.update({ where: { id: "singleton" }, data });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
