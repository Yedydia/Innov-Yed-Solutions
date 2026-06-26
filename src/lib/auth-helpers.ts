"use client";

const TOKEN_KEY = "token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "token=; path=/; max-age=0";
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function logoutAndRedirect(): Promise<void> {
  const token = getAuthToken();
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {}
  removeAuthToken();
  window.location.replace("/portail/auth");
}
