import { NextRequest, NextResponse } from "next/server";

function getTokenFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get("token")?.value;
  if (cookie) return cookie;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function parseJwtPayload(token: string): { id?: string; email?: string; role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const pathname = request.nextUrl.pathname;

  // Protect /portail/* (except /portail/auth)
  if (pathname.startsWith("/portail") && !pathname.startsWith("/portail/auth")) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL("/portail/auth", request.url));
    }
    const payload = parseJwtPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/portail/auth", request.url));
    }
  }

  // Protect /admin/* pages (not API routes — they have requireAdmin)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL("/portail/auth", request.url));
    }
    const payload = parseJwtPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/portail/auth", request.url));
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/portail/:path*", "/admin/:path*"],
};
