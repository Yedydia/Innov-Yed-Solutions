import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET } from "@/lib/auth";
import jwt from "jsonwebtoken";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute
const AUTH_RATE_LIMIT_MAX = 10; // 10 auth attempts per minute

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const store = rateLimitStore.get(ip);

  if (!store || now > store.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return null;
  }

  if (store.count >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Trop de requêtes, veuillez réessayer plus tard" },
      { status: 429 }
    );
  }

  store.count++;
  return null;
}

export function rateLimitByKey(key: string, max = AUTH_RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW): { limited: boolean; response?: NextResponse } {
  const now = Date.now();
  const store = rateLimitStore.get(key);

  if (!store || now > store.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { limited: false };
  }

  if (store.count >= max) {
    return {
      limited: true,
      response: NextResponse.json(
        { error: "Trop de tentatives, veuillez réessayer plus tard" },
        { status: 429 }
      ),
    };
  }

  store.count++;
  return { limited: false };
}

export function securityHeaders() {
  return [
    ["X-Content-Type-Options", "nosniff"],
    ["X-Frame-Options", "DENY"],
    ["X-XSS-Protection", "1; mode=block"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ] as const;
}

export function csrfProtection(request: NextRequest) {
  const method = request.method.toLowerCase();

  if (["get", "head", "options", "trace"].includes(method)) {
    return null;
  }

  const token = request.headers.get("x-csrf-token") || request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ error: "Jeton CSRF manquant" }, { status: 403 });
  }

  try {
    if (token.startsWith("Bearer ")) {
      jwt.verify(token.slice(7), JWT_SECRET);
    } else {
      jwt.verify(token, JWT_SECRET);
    }
    return null;
  } catch {
    return NextResponse.json({ error: "Jeton CSRF invalide" }, { status: 403 });
  }
}

export function validateRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type");

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type application/json requis" }, { status: 415 });
    }
  }

  return null;
}
