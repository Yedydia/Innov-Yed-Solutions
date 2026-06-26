import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET non défini dans .env — fallback dev utilisé (INSECURE en production)");
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtPayload, expiresIn: string = "7d"): string {
  return jwt.sign(payload as any, JWT_SECRET as string, { expiresIn: expiresIn as any });
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateEmail(email: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Format d'email invalide");
  }
  
  return { valid: errors.length === 0, errors };
}

export function validatePhone(phone: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const phoneRegex = /^[+0-9\s\-()]+$/;
  if (!phoneRegex.test(phone)) {
    errors.push("Format de numéro de téléphone invalide");
  }
  
  return { valid: errors.length === 0, errors };
}

export async function createUser(data: any) {
  const { name, email, phone, company, password } = data;
  
  if (password.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Cet email est déjà utilisé");
  }

  const hashed = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: { name, email, phone, company, password: hashed },
  });
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, company: true, createdAt: true, updatedAt: true },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, company: true, createdAt: true, updatedAt: true },
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function authenticateRequest(request: Request) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return { error: "Token manquant", status: 401 };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { error: "Token invalide ou expiré", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, company: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    return { error: "Utilisateur introuvable", status: 401 };
  }

  if (user.status !== "actif") {
    return { error: "Compte désactivé", status: 403 };
  }

  return { user };
}

export async function requireAdmin(request: Request) {
  const result = await authenticateRequest(request);
  if ("error" in result) return result as { error: string; status: number };
  if (result.user.role !== "admin") return { error: "Accès refusé", status: 403 };
  return { user: result.user };
}

export async function requireAuth(request: Request) {
  return await authenticateRequest(request);
}
