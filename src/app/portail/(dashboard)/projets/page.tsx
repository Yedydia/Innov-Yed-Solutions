"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import { Search, FolderKanban, Clock, ArrowRight, Loader2 } from "lucide-react";
import PortalPageHeader from "@/components/PortalPageHeader";

const statusStyles: Record<string, string> = {
  en_attente: "text-amber bg-amber/10 border-amber/20",
  en_cours: "text-cyan bg-cyan/10 border-cyan/20",
  termine: "text-green bg-green/10 border-green/20",
  annule: "text-red bg-red/10 border-red/20",
  accepte: "text-green bg-green/10 border-green/20",
  refuse: "text-red bg-red/10 border-red/20",
  gagne: "text-green bg-green/10 border-green/20",
  perdu: "text-red bg-red/10 border-red/20",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente", en_cours: "En cours", termine: "Terminé", annule: "Annulé",
  accepte: "Accepté", refuse: "Refusé", gagne: "Gagné", perdu: "Perdu",
};

interface Devis {
  id: string;
  reference: string;
  service: string;
  status: string;
  description: string;
  budget: string | null;
  createdAt: string;
}

export default function ProjetsPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portail/data", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setDevis(d.devis || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = devis.filter((d) => {
    const matchSearch = !search || d.service.toLowerCase().includes(search.toLowerCase()) || d.reference.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PortalPageHeader title="Mes Projets" subtitle="Suivez l'avancement de vos projets" image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Mes Projets</h1>
          <p className="text-gray-400 text-sm mt-1">{devis.length} projets au total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un projet..." className="w-full pl-10 pr-4 py-2.5 bg-[#0D1525] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
        </div>
        <div className="flex gap-2">
          {["tous", "en_attente", "en_cours", "accepte", "termine"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-cyan/15 text-cyan border border-cyan/20" : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white"}`}>
              {f === "tous" ? "Tous" : statusLabels[f] || f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucun projet trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <div key={d.id} className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6 hover:border-cyan/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">{d.reference}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[d.status] || ""}`}>{statusLabels[d.status] || d.status}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{d.service}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{d.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(d.createdAt).toLocaleDateString("fr-FR")}</span>
                {d.budget && <span>Budget : <span className="text-cyan font-medium">{d.budget}</span></span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
