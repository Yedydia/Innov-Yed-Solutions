"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import AdminPageHeader from "@/components/AdminPageHeader";
import {
  Users, FileText, FolderKanban, TrendingUp, TrendingDown,
  ArrowRight, DollarSign, Clock, Loader2, MessageSquare, ShoppingBag, UserPlus,
} from "lucide-react";

interface KPI {
  label: string;
  value: string;
  icon: any;
  change: string;
  up: boolean;
  color: "green" | "cyan" | "violet" | "amber";
}

interface Devis {
  id: string;
  reference: string;
  name: string;
  email: string;
  service: string;
  budget: string | null;
  status: string;
  createdAt: string;
}

interface TopService {
  name: string;
  revenue: number;
  percentage: number;
}

interface Activity {
  type: string;
  text: string;
  time: string;
}

interface ChartBar {
  label: string;
  revenue: number;
  height: number;
}

const kpiBgColors: Record<string, string> = { green: "bg-green/10", cyan: "bg-cyan/10", violet: "bg-violet/10", amber: "bg-amber/10" };
const kpiTextColors: Record<string, string> = { green: "text-green", cyan: "text-cyan", violet: "text-violet-light", amber: "text-amber" };

const quoteStatusColors: Record<string, string> = {
  "en_attente": "text-cyan bg-cyan/10",
  "accepte": "text-green bg-green/10",
  "refuse": "text-red bg-red/10",
  "gagne": "text-green bg-green/10",
  "perdu": "text-red bg-red/10",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  accepte: "Accepté",
  refuse: "Refusé",
  gagne: "Gagné",
  perdu: "Perdu",
};

const activityIcons: Record<string, any> = {
  user: UserPlus,
  devis: FileText,
  contact: MessageSquare,
};
const activityColors: Record<string, string> = {
  user: "text-cyan",
  devis: "text-green",
  contact: "text-violet-light",
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Devis[]>([]);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartBar[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, statsRes] = await Promise.all([
          fetch("/api/admin/dashboard", { headers: authHeaders() }),
          fetch("/api/admin/dashboard-stats", { headers: authHeaders() }),
        ]);

        const [dashboardData, statsData] = await Promise.all([
          dashboardRes.json(),
          statsRes.json(),
        ]);

        if (dashboardData.recentDevis) {
          setRecentQuotes(dashboardData.recentDevis);
        }

        if (statsData) {
          setKpis([
            { label: "Revenus", value: formatPrice(statsData.confirmedRevenue || 0), icon: DollarSign, change: statsData.growthRate ? `+${Math.round(statsData.growthRate)}%` : "0%", up: true, color: "green" },
            { label: "Nouveaux Clients", value: statsData.newUsers.toString(), icon: Users, change: `+${statsData.newUsers}`, up: true, color: "cyan" },
            { label: "Utilisateurs Actifs", value: statsData.activeUsers.toString(), icon: Users, change: `+${Math.max(0, statsData.activeUsers - (statsData.totalUsers - statsData.newUsers))}`, up: true, color: "violet" },
            { label: "Commandes", value: statsData.totalOrders?.toString() || "0", icon: ShoppingBag, change: `Total`, up: true, color: "amber" },
          ]);
          setChartData(statsData.chartData || []);
        }

        setTopServices(dashboardData.topServices || []);
        setRecentActivity(dashboardData.activity || []);

      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Dashboard Admin" subtitle="Vue d'ensemble de l'activité" image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${kpiBgColors[kpi.color]} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpiTextColors[kpi.color]}`} />
              </div>
              <span className={`text-xs flex items-center gap-0.5 ${kpi.up ? "text-green" : "text-red"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {kpi.change}
              </span>
            </div>
            <p className="font-display text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg">Revenus Mensuels</h2>
          </div>
          <div className="flex items-end gap-3 h-48">
            {chartData.length > 0 ? chartData.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-violet to-cyan rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[10px] text-gray-500">{bar.label}</span>
              </div>
            )) : (
              <div className="w-full flex items-center justify-center text-gray-500 text-sm">
                Aucune donnée de revenus pour les 6 derniers mois
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-5">Top Services</h2>
          {topServices.length > 0 ? (
            <div className="space-y-4">
              {topServices.map((svc) => (
                <div key={svc.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">{svc.name}</span>
                    <span className="font-medium">{svc.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet to-cyan rounded-full" style={{ width: `${svc.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun service pour le moment</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg">Devis Récents</h2>
            <Link href="/admin/devis" className="text-xs text-violet-light hover:underline flex items-center gap-1">Pipeline <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recentQuotes.map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-violet/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{q.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${quoteStatusColors[q.status] || ""}`}>
                    {statusLabels[q.status] || q.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{q.service}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-violet-light">{q.budget || "Non spécifié"}</span>
                  <span className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            ))}
            {recentQuotes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucun devis récent</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-5">Activité Récente</h2>
          <div className="space-y-4">
            {recentActivity.map((act, idx) => {
              const Icon = activityIcons[act.type] || FileText;
              const color = activityColors[act.type] || "text-gray-400";
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--card-bg)] flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{act.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {act.time}</p>
                  </div>
                </div>
              );
            })}
            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
