"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import { Search, FolderKanban, Clock, ArrowRight, Loader2, Plus, X, Send } from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newRef, setNewRef] = useState("");
  const [form, setForm] = useState({ service: "", description: "", budget: "" });

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

  const handleSubmit = async () => {
    if (!form.service.trim() || !form.description.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/portail/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setNewRef(data.reference);
        setSubmitted(true);
        setForm({ service: "", description: "", budget: "" });
        setDevis((prev) => [{ id: data.id, reference: data.reference, service: form.service, status: "en_attente", description: form.description, budget: form.budget || null, createdAt: new Date().toISOString() }, ...prev]);
      }
    } catch {}
    setSubmitting(false);
  };

  const openModal = () => { setShowModal(true); setSubmitted(false); setNewRef(""); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PortalPageHeader title="Mes Projets" subtitle="Suivez l'avancement de vos projets" image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Mes Projets</h1>
          <p className="text-gray-400 text-sm mt-1">{devis.length} projets au total</p>
        </div>
        <button onClick={openModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:shadow-lg hover:shadow-cyan/20 active:scale-95" style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}>
          <Plus className="w-4 h-4" /> Nouveau Projet
        </button>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-[#0D1525] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <button onClick={() => !submitting && setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green/20 flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-green" /></div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Demande Envoyée !</h3>
                <p className="text-gray-400 text-sm mb-4">Votre demande de devis a bien été enregistrée. Notre équipe vous contactera sous 24h.</p>
                <p className="text-xs text-gray-500">Référence : <span className="text-cyan font-mono">{newRef}</span></p>
                <button onClick={() => setShowModal(false)} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-cyan/20 border border-cyan/30 hover:bg-cyan/30 transition-all">Fermer</button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold text-white mb-1">Nouveau Projet</h3>
                <p className="text-gray-400 text-sm mb-5">Décrivez votre projet pour obtenir un devis.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Service *</label>
                    <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Ex: Développement web, Maintenance..." className="w-full px-4 py-2.5 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Budget estimé</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full px-4 py-2.5 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all">
                      <option value="">Non précisé</option>
                      <option value="< 500 000 FCFA">&lt; 500 000 FCFA</option>
                      <option value="500 000 — 2 000 000 FCFA">500 000 — 2 000 000 FCFA</option>
                      <option value="2 000 000 — 5 000 000 FCFA">2 000 000 — 5 000 000 FCFA</option>
                      <option value="5 000 000 — 10 000 000 FCFA">5 000 000 — 10 000 000 FCFA</option>
                      <option value="> 10 000 000 FCFA">&gt; 10 000 000 FCFA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Description *</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Décrivez votre projet en détail..." className="w-full px-4 py-2.5 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600 resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all">Annuler</button>
                  <button onClick={handleSubmit} disabled={submitting || !form.service.trim() || !form.description.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Envoi..." : "Envoyer la demande"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
