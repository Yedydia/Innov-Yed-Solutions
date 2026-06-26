"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAuthToken, authHeaders, logoutAndRedirect } from "@/lib/auth-helpers";
import {
  LayoutDashboard, FolderKanban, Ticket, FileText,
  GraduationCap, Settings, LogOut, Menu, Bell,
  ChevronRight, Search, User, ChevronDown,
  HelpCircle, MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/portail/dashboard", label: "Tableau de bord", icon: LayoutDashboard, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&q=80" },
  { href: "/portail/projets", label: "Mes Projets", icon: FolderKanban, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&q=80" },
  { href: "/portail/tickets", label: "Tickets Support", icon: Ticket, image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=120&q=80" },
  { href: "/portail/factures", label: "Factures", icon: FileText, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&q=80" },
  { href: "/portail/messages", label: "Messages", icon: MessageSquare, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&q=80" },
  { href: "/portail/parametres", label: "Paramètres", icon: Settings, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
];

const quickLinks = [
  { label: "Centre d'aide", icon: HelpCircle, href: "/portail/aide" },
  { label: "Contact support", icon: MessageSquare, href: "/contact" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { logoutAndRedirect(); return; }

    let cancelled = false;
    const controller = new AbortController();

    fetch("/api/portail/profile", {
      headers: authHeaders(),
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.user) {
          setUser({ name: data.user.name, email: data.user.email });
        } else {
          logoutAndRedirect();
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.name === "AbortError") return;
        logoutAndRedirect();
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const displayName = user?.name || "Client";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const currentLabel = navItems.find((i) => i.href === pathname)?.label || "Paramètres";

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-[#0D1525] to-[#0B1120] border-r border-white/[0.04] flex flex-col transition-all duration-300 ease-out`}>
        <div className="p-5 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center shadow-lg shadow-cyan/20">
              <span className="text-white font-bold text-sm">IY</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white leading-tight">Innov&apos;Yed</p>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase">Espace Client</p>
            </div>
          </Link>
        </div>

        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-lg text-xs text-white/70 placeholder:text-gray-600 focus:outline-none focus:border-cyan/30 transition-all" />
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-semibold">Menu principal</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${active ? "bg-gradient-to-r from-cyan/15 to-blue-500/5 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"}`}>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className={`absolute inset-0 transition-colors ${active ? "bg-cyan/30" : "bg-black/40 group-hover:bg-black/20"}`} />
                  <item.icon className={`absolute inset-0 m-auto w-4 h-4 ${active ? "text-white" : "text-gray-300 group-hover:text-white"}`} />
                </div>
                <span className="font-medium">{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan shadow-sm shadow-cyan/50" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/[0.04]">
            <p className="px-3 text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-semibold">Ressources</p>
            {quickLinks.map((item) => (
              <Link key={item.label} href={item.href} className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:bg-white/[0.06] group-hover:text-gray-300 transition-all">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <Link href="/portail/parametres" className="flex items-center gap-3 px-1 mb-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-cyan/10 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate leading-tight">{displayName}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </Link>
          <button onClick={logoutAndRedirect} className="w-full flex items-center justify-center gap-2 text-[11px] text-gray-500 hover:text-red-400 hover:bg-red-400/5 py-2 rounded-lg transition-all duration-200">
            <LogOut className="w-3 h-3" /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen w-0">
        {/* Single sticky header with breadcrumb integrated */}
        <header className="sticky top-0 z-30 bg-[#0B1120] border-b border-white/[0.06] px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
              <Menu className="w-4 h-4 text-gray-400" />
            </button>
            <nav className="flex items-center gap-2 text-xs">
              <Link href="/portail/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">Espace Client</Link>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-white font-medium">{currentLabel}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] transition-colors group">
              <Bell className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0B1120]" />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                  {initials}
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0D1525] border border-white/[0.06] rounded-xl shadow-2xl shadow-black/50 py-2">
                  <div className="px-4 py-3 border-b border-white/[0.04]">
                    <p className="text-sm font-medium text-white">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/portail/parametres" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">
                      <User className="w-4 h-4" /> Mon profil
                    </Link>
                    <Link href="/portail/parametres" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">
                      <Settings className="w-4 h-4" /> Paramètres
                    </Link>
                  </div>
                  <div className="border-t border-white/[0.04] pt-1">
                    <button onClick={logoutAndRedirect} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors">
                      <LogOut className="w-4 h-4" /> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
