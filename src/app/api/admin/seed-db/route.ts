import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    // Create some admin users
    const adminUsers = [
      { name: "Yédydia KPLOYA", email: "yedydia@innovyed.com", role: "admin", status: "actif" },
      { name: "Sarah KIKI", email: "sarah@innovyed.com", role: "admin", status: "actif" },
      { name: "David HOUNSOU", email: "david@innovyed.com", role: "Développeur", status: "actif" },
      { name: "Amina DOSSOU", email: "amina@innovyed.com", role: "Designer", status: "actif" },
      { name: "Patrick ADJOVI", email: "patrick@innovyed.com", role: "Expert Sécurité", status: "actif" },
      { name: "Grâce AHOUANNOU", email: "grace@innovyed.com", role: "Data Scientist", status: "actif" },
    ];

    // Create test users
    const testUsers = [
      { name: "Marc TOGNON", email: "marc@payexpress.com", role: "client", status: "actif" },
      { name: "Aïcha BAKO", email: "aicha@greentech.africa", role: "client", status: "actif" },
      { name: "Pierre ASSOGBA", email: "pierre@bankofafrica.bj", role: "client", status: "inactif" },
      { name: "Fatima DIALLO", email: "fatima@afrikfashion.com", role: "client", status: "actif" },
    ];

    // Create all users
    const allUsers = [...adminUsers, ...testUsers];

    // Create or find users
    const createdUsers = await Promise.all(
      allUsers.map(user => 
        prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name, role: user.role, status: user.status },
          create: {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            password: "$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6LmuqnVb8U4sIGaS", // hashPassword("Admin123!")
            phone: "+229 XX XX XX XX",
            company: "Test Company",
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Base de données admin peuplée avec succès",
        usersCount: createdUsers.length,
        totalOrders: await prisma.order.count(),
        totalUsers: await prisma.user.count(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur peuplage admin:", error);
    return NextResponse.json(
      { error: "Erreur serveur",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
