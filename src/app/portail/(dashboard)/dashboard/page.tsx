"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  FolderKanban, Ticket, GraduationCap, FileText,
  TrendingUp, Clock, CheckCircle, AlertCircle,
  ArrowRight, Plus, Sparkles, BarChart3, Users,
  MessageSquare, Calendar, ChevronRight, Download,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import PortalPageHeader from "@/components/PortalPageHeader";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const statusStyles: Record<string, string> = {
  en_attente: "text-amber bg-amber/10 border-amber/20",
  confirmee: "text-cyan bg-cyan/10 border-cyan/20",
  livree: "text-green bg-green/10 border-green/20",
  annulee: "text-red bg-red/10 border-red/20",
  ouvert: "text-red bg-red/10 border-red/20",
  en_cours: "text-amber bg-amber/10 border-amber/20",
  resolu: "text-green bg-green/10 border-green/20",
  ferme: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  payee: "text-green bg-green/10 border-green/20",
  impayee: "text-red bg-red/10 border-red/20",
  accepte: "text-green bg-green/10 border-green/20",
  refuse: "text-red bg-red/10 border-red/20",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente", confirmee: "Confirmée", livree: "Livrée", annulee: "Annulée",
  ouvert: "Ouvert", en_cours: "En cours", resolu: "Résolu", ferme: "Fermé",
  payee: "Payée", impayee: "Impayée", accepte: "Accepté", refuse: "Refusé",
};

interface PortalData {
  tickets: { id: string; subject: string; status: string; priority: string; category: string; createdAt: string; messages: { content: string }[] }[];
  invoices: { id: string; reference: string; amount: number; status: string; dueDate: string; createdAt: string }[];
  orders: { id: string; reference: string; total: number; status: string; firstName: string; lastName: string; createdAt: string }[];
  devis: { id: string; reference: string; service: string; status: string; description: string; createdAt: string }[];
  contacts: { id: string; subject: string; message: string; read: boolean; createdAt: string }[];
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Client");
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    try {
      const token = authHeaders().Authorization?.replace("Bearer ", "");
      if (token) {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder("utf-8").decode(bytes));
        if (!cancelled && payload.name) setUserName(payload.name.split(" ")[0]);
      }
    } catch {}

    fetch("/api/portail/data", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const totalTicketsOuverts = data?.tickets.filter((t) => t.status === "ouvert" || t.status === "en_cours").length || 0;
  const totalFacturesImpayees = data?.invoices.filter((i) => i.status === "impayee").length || 0;
  const totalDevis = data?.devis.length || 0;
  const totalMessages = data?.contacts.length || 0;
  const montantImpaye = data?.invoices.filter((i) => i.status === "impayee").reduce((s, i) => s + i.amount, 0) || 0;

  const stats = [
    { label: "Tickets Ouverts", value: String(totalTicketsOuverts), icon: Ticket, gradient: "from-amber-500/20 to-orange-600/10", border: "border-amber-500/20", iconBg: "bg-amber-500/20", iconColor: "text-amber" },
    { label: "Factures Impayées", value: String(totalFacturesImpayees), icon: FileText, gradient: "from-red-500/20 to-pink-600/10", border: "border-red-500/20", iconBg: "bg-red-500/20", iconColor: "text-red" },
    { label: "Devis Envoyés", value: String(totalDevis), icon: FolderKanban, gradient: "from-cyan-500/20 to-blue-600/10", border: "border-cyan-500/20", iconBg: "bg-cyan-500/20", iconColor: "text-cyan" },
    { label: "Messages", value: String(totalMessages), icon: MessageSquare, gradient: "from-violet-500/20 to-purple-600/10", border: "border-violet-500/20", iconBg: "bg-violet-500/20", iconColor: "text-violet-light" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PortalPageHeader title="Tableau de bord" subtitle="Vue d'ensemble de votre espace" image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80" />
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1525] to-[#0B1120] border border-white/[0.04] p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">Bonjour, {userName}</h1>
              <Sparkles className="w-5 h-5 text-cyan" />
            </div>
            <p className="text-gray-400 text-sm">{dateStr}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/portail/tickets" className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan/10 border border-cyan/20 rounded-xl text-sm font-medium text-cyan hover:bg-cyan/15 transition-all">
              <MessageSquare className="w-4 h-4" /> Ouvrir un ticket
            </Link>
            <Link href="/portail/factures" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] transition-all">
              Factures <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.border} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="font-display text-2xl font-bold text-white mb-0.5">{loading ? "..." : stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-cyan" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Devis */}
            <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-white">Mes Devis</h2>
                    <p className="text-xs text-gray-500">{data?.devis.length || 0} devis au total</p>
                  </div>
                </div>
              </div>
              {data?.devis.length ? (
                <div className="space-y-3">
                  {data.devis.slice(0, 5).map((d) => (
                    <div key={d.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan/20 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-mono">{d.reference}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[d.status] || ""}`}>{statusLabels[d.status] || d.status}</span>
                      </div>
                      <p className="font-medium text-sm text-white">{d.service}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{d.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">Aucun devis pour le moment</p>
              )}
            </div>

            {/* Orders */}
            <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-light" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-white">Commandes Récentes</h2>
                    <p className="text-xs text-gray-500">{data?.orders.length || 0} commandes</p>
                  </div>
                </div>
              </div>
              {data?.orders.length ? (
                <div className="space-y-3">
                  {data.orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan/20 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-mono">{o.reference}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[o.status] || ""}`}>{statusLabels[o.status] || o.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-white">{o.firstName} {o.lastName}</p>
                        <p className="font-bold text-cyan text-sm">{formatPrice(o.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">Aucune commande</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Tickets */}
            <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white">Tickets</h3>
                    <p className="text-[11px] text-gray-500">{totalTicketsOuverts} nécessitent attention</p>
                  </div>
                </div>
              </div>
              {data?.tickets.length ? (
                <div className="space-y-2.5">
                  {data.tickets.slice(0, 4).map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan/20 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[t.status] || ""}`}>{statusLabels[t.status] || t.status}</span>
                        <span className="text-[11px] text-gray-500">{t.priority}</span>
                      </div>
                      <p className="font-medium text-sm text-white/90">{t.subject}</p>
                      <p className="text-[11px] text-gray-500 mt-1">{new Date(t.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Aucun ticket</p>
              )}
              <Link href="/portail/tickets" className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/[0.06] rounded-xl text-xs text-gray-500 hover:border-cyan/30 hover:text-cyan transition-all">
                <Plus className="w-3.5 h-3.5" /> Nouveau ticket
              </Link>
            </div>

            {/* Invoices */}
            <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white">Factures</h3>
                    <p className="text-[11px] text-gray-500">{data?.invoices.length || 0} factures</p>
                  </div>
                </div>
                <Link href="/portail/factures" className="text-[11px] text-cyan/60 hover:text-cyan flex items-center gap-1 transition-colors">
                  Voir tout <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {data?.invoices.length ? (
                <div className="space-y-2.5">
                  {data.invoices.slice(0, 4).map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan/20 transition-all cursor-pointer">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] text-gray-500 font-mono">{inv.reference}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[inv.status] || ""}`}>{statusLabels[inv.status] || inv.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Échéance : {new Date(inv.dueDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <p className="text-sm font-bold text-cyan ml-4">{formatPrice(inv.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Aucune facture</p>
              )}
            </div>

            {/* Messages */}
            <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-violet-light" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white">Messages envoyés</h3>
                    <p className="text-[11px] text-gray-500">{data?.contacts.length || 0} message(s)</p>
                  </div>
                </div>
                <Link href="/portail/messages" className="text-[11px] text-cyan/60 hover:text-cyan flex items-center gap-1 transition-colors">
                  Voir tout <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {data?.contacts.length ? (
                <div className="space-y-2.5">
                  {data.contacts.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan/20 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${c.read ? "text-gray-400 bg-gray-400/10 border-gray-400/20" : "text-cyan bg-cyan/10 border-cyan/20"}`}>
                          {c.subject}
                        </span>
                        <span className="text-[11px] text-gray-500">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <p className="text-sm text-white/90 line-clamp-1">{c.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Aucun message</p>
              )}
            </div>

            {/* Calendar */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan/5 to-blue-500/5 border border-cyan/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-cyan" />
                <h3 className="font-display font-semibold text-sm text-white">Cette semaine</h3>
              </div>
              <div className="flex items-center justify-between">
                {weekDays.map((day, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - d.getDay() + i + 1);
                  const isToday = d.toDateString() === today.toDateString();
                  return (
                    <div key={day} className={`flex flex-col items-center gap-1.5 ${isToday ? "text-cyan" : "text-gray-500"}`}>
                      <span className="text-[10px] font-medium">{day}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isToday ? "bg-cyan/20 text-cyan shadow-sm shadow-cyan/20" : "bg-white/[0.03] text-gray-400"}`}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
