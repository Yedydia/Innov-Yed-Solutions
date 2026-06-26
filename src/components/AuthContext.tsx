"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setAuthToken, removeAuthToken, getAuthToken } from "@/lib/auth-helpers";

type User = { id: string; name: string; email: string; role: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; company?: string }) => Promise<{ error?: string }>;
  logout: () => void;
  requireAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getAuthToken();
    if (!stored) { setLoading(false); return; }

    const controller = new AbortController();
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${stored}` },
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setToken(stored);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Erreur de connexion" };

      setAuthToken(data.token);
      setUser(data.user);
      setToken(data.token);
      return {};
    } catch {
      return { error: "Erreur réseau" };
    }
  }, []);

  const register = useCallback(async (formData: { name: string; email: string; password: string; phone?: string; company?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Erreur d'inscription" };

      const loginResult = await login(formData.email, formData.password);
      return loginResult;
    } catch {
      return { error: "Erreur réseau" };
    }
  }, [login]);

  const logout = useCallback(async () => {
    const currentToken = getAuthToken();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {},
      });
    } catch {}
    removeAuthToken();
    setUser(null);
    setToken(null);
  }, []);

  const requireAuth = useCallback(() => !!token, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
