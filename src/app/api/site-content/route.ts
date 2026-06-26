import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const models: Record<string, any> = {
  processSteps: prisma.processStep,
  techStack: prisma.techStack,
  heroImages: prisma.heroImage,
  advantages: prisma.companyAdvantage,
  faqs: prisma.fAQ,
  values: prisma.companyValue,
  timeline: prisma.companyTimeline,
  certifications: prisma.certification,
  devisServices: prisma.devisService,
  devisBudgets: prisma.devisBudget,
  devisTimelines: prisma.devisTimeline,
};

const allowedFields: Record<string, string[]> = {
  processSteps: ["title", "description", "duration", "icon", "orderIndex"],
  techStack: ["name", "orderIndex"],
  heroImages: ["url", "alt", "orderIndex"],
  advantages: ["title", "description", "icon", "color", "orderIndex"],
  faqs: ["question", "answer", "category", "orderIndex"],
  values: ["title", "description", "icon", "color", "orderIndex"],
  timeline: ["year", "title", "description", "icon", "orderIndex"],
  certifications: ["name", "icon", "orderIndex"],
  devisServices: ["name", "icon", "orderIndex"],
  devisBudgets: ["label", "value", "orderIndex"],
  devisTimelines: ["label", "value", "orderIndex"],
};

function whitelist(type: string, data: Record<string, any>) {
  const fields = allowedFields[type];
  if (!fields) return {};
  const result: Record<string, any> = {};
  for (const field of fields) {
    if (field in data) result[field] = data[field];
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type && models[type]) {
      const data = await models[type].findMany({ orderBy: { orderIndex: "asc" } });
      return NextResponse.json(data);
    }

    const allData: Record<string, any[]> = {};
    for (const [key, model] of Object.entries(models)) {
      allData[key] = await model.findMany({ orderBy: { orderIndex: "asc" } });
    }
    return NextResponse.json(allData);
  } catch (error) {
    console.error("Error fetching site content:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { type, ...rawData } = await req.json();
    if (!type || !models[type]) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }
    const data = whitelist(type, rawData);
    const maxOrder = await models[type].aggregate({ _max: { orderIndex: true } });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    const item = await models[type].create({ data: { ...data, orderIndex } });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating site content:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { type, id, ...rawData } = await req.json();
    if (!type || !models[type]) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }
    const data = whitelist(type, rawData);
    const item = await models[type].update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating site content:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    if (!type || !models[type] || !id) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }
    await models[type].delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site content:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
