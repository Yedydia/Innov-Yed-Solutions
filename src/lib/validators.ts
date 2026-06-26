import bcrypt from "bcryptjs";
import { JWT_SECRET } from "@/lib/auth";
import jwt from "jsonwebtoken";

export function generateToken(payload: any, expiresIn: string = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
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

export class ValidationError extends Error {
  constructor(message: string, public field: string, public code: string) {
    super(message);
    this.name = "ValidationError";
  }
}
