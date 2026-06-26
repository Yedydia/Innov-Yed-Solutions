"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import AdminPageHeader from "@/components/AdminPageHeader";
import {
  FileText, Plus, DollarSign, CheckCircle, User, Phone, X, Save, Trash2, Loader2, LayoutGrid, List, Rows3,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Devis {
  id: string; reference: string; name: string; email: string; phone: string | null; company: string | null;
  service: string; budget: string | null; description: string; status: string; createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

interface Column { id: string; title: string; color: string; statuses: string[]; cards: Devis[]; }

const statusLabels: Record<string, string> = { en_attente: "En attente", accepte: "Accepté", refuse: "Refusé", gagne: "Gagné", perdu: "Perdu" };
const emptyForm = { name: "", email: "", phone: "", company: "", service: "", budget: "", description: "", status: "en_attente" };

export default function DevisAdminPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [layout, setLayout] = useState<"kanban" | "table" | "grid">("kanban");
  const { addToast } = useToast();

  async function fetchDevis() {
    try {
      const res = await fetch("/api/admin/devis", { headers: authHeaders() });
      const data = await res.json();
      setDevis(Array.isArray(data) ? data : []);
    } catch { addToast("Erreur de chargement", "error"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchDevis(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/devis?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setDevis((prev) => prev.filter((d) => d.id !== deleteId));
      addToast("Devis supprimé", "success");
    } catch { addToast("Erreur lors de la suppression", "error"); }
    finally { setDeleting(false); setDeleteId(null); }
  }

  async function handleStatusChange(devisId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/devis", {
        method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ devisId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setDevis((prev) => prev.map((d) => d.id === devisId ? { ...d, status: newStatus } : d));
      addToast(`Devis déplacé vers "${statusLabels[newStatus] || newStatus}"`, "success");
    } catch { addToast("Erreur de mise à jour", "error"); }
  }

  async function handleCreateDevis() {
    if (!form.name || !form.email || !form.service) { addToast("Nom, email et service requis", "error"); return; }
    setSaving(true);
    try {
      const ref = `DEV-${Date.now().toString(36).toUpperCase()}`;
      const res = await fetch("/api/admin/devis", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ reference: ref, ...form, description: form.description || "Devis créé par l'admin" }),
      });
      if (!res.ok) throw new Error();
      addToast("Devis créé", "success");
      await fetchDevis();
      setModal(false);
      setForm(emptyForm);
    } catch { addToast("Erreur lors de la création", "error"); }
    finally { setSaving(false); }
  }

  const columns: Column[] = [
    { id: "en_attente", title: "En Attente", color: "cyan", statuses: ["en_attente"], cards: [] },
    { id: "accepte", title: "Acceptés", color: "violet", statuses: ["accepte"], cards: [] },
    { id: "refuse", title: "Refusés", color: "red", statuses: ["refuse"], cards: [] },
    { id: "gagne", title: "Gagnés ✓", color: "green", statuses: ["gagne"], cards: [] },
    { id: "perdu", title: "Perdus ✗", color: "amber", statuses: ["perdu"], cards: [] },
  ];

  columns.forEach((col) => { col.cards = devis.filter((d) => col.statuses.includes(d.status)); });

  const totalPipeline = devis.reduce((sum, d) => sum + (parseInt(d.budget || "0") || 0), 0);
  const totalWon = devis.filter((d) => d.status === "gagne").reduce((sum, d) => sum + (parseInt(d.budget || "0") || 0), 0);
  const winCount = devis.filter((d) => d.status === "gagne").length;
  const totalClosed = devis.filter((d) => d.status === "gagne" || d.status === "perdu").length;
  const conversionRate = totalClosed > 0 ? Math.round((winCount / totalClosed) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Pipeline Commercial" subtitle={`Gestion des devis et prospects — ${devis.length} devis`} image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
            <button onClick={() => setLayout("kanban")} className={`p-2 rounded-lg transition-colors ${layout === "kanban" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Kanban"><Rows3 className="w-4 h-4" /></button>
            <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
            <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
            <Plus className="w-4 h-4" /> Nouveau devis
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-cyan" /></div><span className="text-sm text-gray-400">Pipeline Total</span></div>
          <p className="font-display text-2xl font-bold text-cyan">{formatPrice(totalPipeline)}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green" /></div><span className="text-sm text-gray-400">Gagnés</span></div>
          <p className="font-display text-2xl font-bold text-green">{formatPrice(totalWon)}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center"><FileText className="w-5 h-5 text-violet" /></div><span className="text-sm text-gray-400">Taux Conversion</span></div>
          <p className="font-display text-2xl font-bold text-violet-light">{conversionRate}%</p>
        </div>
      </div>

      {layout === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[280px] w-[280px] shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${column.color}`} />
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                  <span className="text-xs text-gray-400 bg-[var(--card-bg)] px-2 py-0.5 rounded-full">{column.cards.length}</span>
                </div>
                <span className="text-xs text-gray-400">{formatPrice(column.cards.reduce((s, c) => s + (parseInt(c.budget || "0") || 0), 0))}</span>
              </div>

              <div className="space-y-3">
                {column.cards.map((card) => (
                  <div key={card.id} onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)} className={`group glass rounded-xl p-4 cursor-pointer transition-all ${selectedCard === card.id ? `border-${column.color}/50` : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">{card.reference}</span>
                      <div className="flex items-center gap-2">
                        {new Date(card.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && <span className="text-[10px] text-cyan px-1.5 py-0.5 rounded-full bg-cyan/10">Nouveau</span>}
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(card.id); }} className="p-1 rounded-lg hover:bg-red/10 transition-colors" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red" /></button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{card.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{card.service}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-violet-light">{card.budget ? formatPrice(parseInt(card.budget) || 0) : "—"}</span>
                    </div>
                    {selectedCard === card.id && (
                      <div className="mt-3 pt-3 border-t border-[var(--card-border)] space-y-2">
                        <div className="text-xs text-gray-300 bg-white/[0.03] rounded-lg p-2.5 whitespace-pre-wrap">{card.description || "Aucune description"}</div>
                        {card.company && <div className="text-xs text-gray-400">Société : {card.company}</div>}
                        <div className="flex items-center gap-2 text-xs text-gray-400"><User className="w-3 h-3" /> {card.email}</div>
                        {card.phone && <div className="flex items-center gap-2 text-xs text-gray-400"><Phone className="w-3 h-3" /> {card.phone}</div>}
                        <div className="text-xs text-gray-500">Créé le {new Date(card.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(statusLabels).filter(([k]) => k !== card.status).map(([key, label]) => (
                            <button key={key} onClick={(e) => { e.stopPropagation(); handleStatusChange(card.id, key); }} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 hover:bg-violet/10 hover:text-violet-light transition-colors">{label}</button>
                          ))}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(card.id); }} className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red/10 text-red text-[11px] font-medium hover:bg-red/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Supprimer ce devis
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {column.cards.length === 0 && <div className="text-center text-xs text-gray-500 py-8 bg-[var(--card-bg)] rounded-xl border border-dashed border-[var(--card-border)]">Aucun devis</div>}

              <button onClick={() => { setForm({ ...emptyForm, status: column.statuses[0] }); setModal(true); }} className="mt-3 w-full flex items-center justify-center gap-1 py-2.5 border border-dashed border-[var(--card-border)] rounded-xl text-xs text-gray-400 hover:border-cyan hover:text-cyan transition-colors">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
          ))}
        </div>
      )}

      {layout === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Référence</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Budget</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devis.map((d) => (
                  <tr key={d.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors cursor-pointer" onClick={() => setSelectedCard(selectedCard === d.id ? null : d.id)}>
                    <td className="px-5 py-4"><span className="font-mono text-sm">{d.reference}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[10px] shrink-0">{d.name.charAt(0)}</div>
                        <div><p className="text-sm">{d.name}</p><p className="text-xs text-gray-400">{d.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{d.service}</td>
                    <td className="px-5 py-4 font-semibold text-sm text-violet-light">{d.budget ? formatPrice(parseInt(d.budget) || 0) : "—"}</td>
                    <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "gagne" ? "text-green bg-green/10" : d.status === "perdu" ? "text-red bg-red/10" : d.status === "accepte" ? "text-violet bg-violet/10" : d.status === "refuse" ? "text-red bg-red/10" : "text-cyan bg-cyan/10"}`}>{statusLabels[d.status] || d.status}</span></td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString("fr-FR")}</span></td>
                    <td className="px-5 py-4 text-right"><button onClick={(e) => { e.stopPropagation(); setDeleteId(d.id); }} className="p-2 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-4 h-4 text-gray-400" /></button></td>
                  </tr>
                  {selectedCard === d.id && (
                    <tr key={d.id + "-detail"} className="bg-white/[0.02]">
                      <td colSpan={7} className="px-5 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div><span className="text-gray-500">Description</span><p className="text-gray-300 mt-1 whitespace-pre-wrap">{d.description || "—"}</p></div>
                          {d.company && <div><span className="text-gray-500">Société</span><p className="text-gray-300 mt-1">{d.company}</p></div>}
                          <div><span className="text-gray-500">Téléphone</span><p className="text-gray-300 mt-1">{d.phone || "—"}</p></div>
                          <div><span className="text-gray-500">Date</span><p className="text-gray-300 mt-1">{new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {Object.entries(statusLabels).filter(([k]) => k !== d.status).map(([key, label]) => (
                            <button key={key} onClick={(e) => { e.stopPropagation(); handleStatusChange(d.id, key); }} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 hover:bg-violet/10 hover:text-violet-light transition-colors">{label}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devis.map((d) => (
            <div key={d.id} className="glass rounded-2xl p-5 group cursor-pointer" onClick={() => setSelectedCard(selectedCard === d.id ? null : d.id)}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-mono">{d.reference}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status === "gagne" ? "text-green bg-green/10" : d.status === "perdu" ? "text-red bg-red/10" : d.status === "accepte" ? "text-violet bg-violet/10" : d.status === "refuse" ? "text-red bg-red/10" : "text-cyan bg-cyan/10"}`}>{statusLabels[d.status]}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{d.service}</p>
              {selectedCard === d.id && (
                <div className="text-xs text-gray-300 bg-white/[0.03] rounded-lg p-2.5 mb-2 whitespace-pre-wrap">{d.description || "Aucune description"}</div>
              )}
              {d.company && <p className="text-xs text-gray-400 mb-2">Société : {d.company}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><User className="w-3 h-3" /> {d.email}</div>
              {selectedCard === d.id && d.phone && <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><Phone className="w-3 h-3" /> {d.phone}</div>}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)]">
                <span className="font-bold text-sm text-violet-light">{d.budget ? formatPrice(parseInt(d.budget) || 0) : "—"}</span>
                <div className="flex gap-1">
                  {Object.entries(statusLabels).filter(([k]) => k !== d.status).slice(0, 2).map(([key, label]) => (
                    <button key={key} onClick={(e) => { e.stopPropagation(); handleStatusChange(d.id, key); }} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 hover:bg-violet/10 hover:text-violet-light transition-colors">{label}</button>
                  ))}
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(d.id); }} className="p-1 rounded-lg hover:bg-red/10 transition-colors"><Trash2 className="w-3 h-3 text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">Nouveau Devis</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Téléphone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Société</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Service *</label><input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Ex: Création site web" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Budget (FCFA)</label><input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="Ex: 500000" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light">
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light resize-none" /></div>
              <button onClick={handleCreateDevis} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "..." : "Créer le devis"}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Supprimer le devis" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
