"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authHeaders } from "@/lib/auth-helpers";
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  Menu, Bell, ChevronRight, Shield, Clock,
  FolderKanban, MessageSquare, ShoppingBag, BookOpen, X,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&q=80" },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&q=80" },
  { href: "/admin/devis", label: "Pipeline Devis", icon: FileText, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&q=80" },
  { href: "/admin/tickets", label: "Tickets", icon: MessageSquare, image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=120&q=80" },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&q=80" },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=120&q=80" },
  { href: "/admin/boutique", label: "Boutique", icon: ShoppingBag, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&q=80" },
  { href: "/admin/formations", label: "Formations", icon: BookOpen, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=120&q=80" },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquare, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&q=80" },
  { href: "/admin/equipe", label: "Équipe", icon: Users, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&q=80" },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&q=80" },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
];

interface Notification {
  id: string; type: string; text: string; time: string; read: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminName, setAdminName] = useState("Administrateur");
  const [adminEmail, setAdminEmail] = useState("admin@innovyed.com");

  useEffect(() => {
    fetch("/api/auth/me", { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setAdminName(data.user.name || "Administrateur");
          setAdminEmail(data.user.email || "admin@innovyed.com");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const [devisRes, contactsRes, ticketsRes] = await Promise.all([
          fetch("/api/admin/devis", { headers: authHeaders() }).catch(() => null),
          fetch("/api/admin/contacts", { headers: authHeaders() }).catch(() => null),
          fetch("/api/admin/tickets", { headers: authHeaders() }).catch(() => null),
        ]);

        const notifs: Notification[] = [];

        if (devisRes?.ok) {
          const devis = await devisRes.json();
          devis.slice(0, 3).forEach((d: any) => {
            notifs.push({ id: `devis-${d.id}`, type: "devis", text: `Nouveau devis de ${d.name}`, time: d.createdAt, read: false });
          });
        }

        if (contactsRes?.ok) {
          const contacts = await contactsRes.json();
          contacts.filter((c: any) => !c.read).slice(0, 3).forEach((c: any) => {
            notifs.push({ id: `contact-${c.id}`, type: "contact", text: `Message de ${c.name}: ${c.subject}`, time: c.createdAt, read: c.read });
          });
        }

        if (ticketsRes?.ok) {
          const tickets = await ticketsRes.json();
          tickets.filter((t: any) => t.status === "ouvert").slice(0, 3).forEach((t: any) => {
            notifs.push({ id: `ticket-${t.id}`, type: "ticket", text: `Ticket ouvert: ${t.subject}`, time: t.createdAt, read: false });
          });
        }

        notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(notifs.slice(0, 10));
        setUnreadCount(notifs.filter((n) => !n.read).length);
      } catch {}
    }
    fetchNotifs();
  }, []);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-[#0B0F1A] border-r border-white/5 flex flex-col transition-transform`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link href="/" className="font-display font-bold text-xl text-white">Admin <span className="text-violet-light">Panel</span></Link>
            <p className="text-xs text-gray-500 mt-1">Innov&apos;Yed Solutions</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.label + item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group ${active ? "bg-violet/10 text-violet-light" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className={`absolute inset-0 transition-colors ${active ? "bg-violet/30" : "bg-black/40 group-hover:bg-black/20"}`} />
                  <item.icon className={`absolute inset-0 m-auto w-4 h-4 ${active ? "text-white" : "text-gray-300 group-hover:text-white"}`} />
                </div>
                <span className="truncate">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm"><Shield className="w-4 h-4" /></div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{adminName}</p>
              <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-red transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5">
            <LogOut className="w-3 h-3" /> Retour au site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-[var(--card-border)] px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[var(--card-bg)]"><Menu className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-[var(--card-bg)] transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full" />}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-2xl border border-white/[0.08] z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/20 text-violet-light">{unreadCount} nouvelles</span>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">Aucune notification</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-violet/[0.03]" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "devis" ? "bg-cyan" : n.type === "contact" ? "bg-violet" : "bg-amber"}`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs">{n.text}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {timeAgo(n.time)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link href="/admin/messages" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs text-violet-light hover:bg-white/[0.03] border-t border-white/[0.06]">
                      Voir tous les messages
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
