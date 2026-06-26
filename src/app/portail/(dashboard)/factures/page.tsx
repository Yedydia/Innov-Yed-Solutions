"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import { FileText, Download, Search, Loader2 } from "lucide-react";
import PortalPageHeader from "@/components/PortalPageHeader";

const statusStyles: Record<string, string> = {
  payee: "text-green bg-green/10 border-green/20",
  impayee: "text-red bg-red/10 border-red/20",
  annulee: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const statusLabels: Record<string, string> = {
  payee: "Payée", impayee: "Impayée", annulee: "Annulée",
};

interface Invoice {
  id: string;
  reference: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portail/data", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setInvoices(d.invoices || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchSearch = !search || inv.reference.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const totalImpaye = invoices.filter((i) => i.status === "impayee").reduce((s, i) => s + i.amount, 0);
  const totalPaye = invoices.filter((i) => i.status === "payee").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PortalPageHeader title="Factures" subtitle="Gérez vos paiements et factures" image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80" />
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Factures</h1>
        <p className="text-gray-400 text-sm mt-1">{invoices.length} factures au total</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-red/5 border border-red/10 p-4">
          <p className="text-xs text-gray-400 mb-1">Total impayé</p>
          <p className="font-display text-xl font-bold text-red">{totalImpaye > 0 ? formatPrice(totalImpaye) : "0 FCFA"}</p>
        </div>
        <div className="rounded-xl bg-green/5 border border-green/10 p-4">
          <p className="text-xs text-gray-400 mb-1">Total payé</p>
          <p className="font-display text-xl font-bold text-green">{totalPaye > 0 ? formatPrice(totalPaye) : "0 FCFA"}</p>
        </div>
        <div className="rounded-xl bg-cyan/5 border border-cyan/10 p-4">
          <p className="text-xs text-gray-400 mb-1">Nombre de factures</p>
          <p className="font-display text-xl font-bold text-cyan">{invoices.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une facture..." className="w-full pl-10 pr-4 py-2.5 bg-[#0D1525] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
        </div>
        <div className="flex gap-2">
          {["tous", "impayee", "payee", "annulee"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-cyan/15 text-cyan border border-cyan/20" : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white"}`}>
              {f === "tous" ? "Toutes" : statusLabels[f] || f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucune facture trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-5 hover:border-cyan/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">{inv.reference}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[inv.status] || ""}`}>{statusLabels[inv.status] || inv.status}</span>
                  </div>
                  <p className="text-sm text-gray-400">Échéance : {new Date(inv.dueDate).toLocaleDateString("fr-FR")}</p>
                  {inv.paidAt && <p className="text-xs text-green mt-1">Payée le {new Date(inv.paidAt).toLocaleDateString("fr-FR")}</p>}
                </div>
                <div className="text-right ml-4">
                  <p className="font-display text-lg font-bold text-cyan">{formatPrice(inv.amount)}</p>
                  <button className="text-[11px] text-gray-500 hover:text-cyan flex items-center gap-0.5 transition-colors mt-1">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
