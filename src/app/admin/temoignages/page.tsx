"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Search, Star, Trash2, Plus, Loader2, Quote, Edit, X, Save, LayoutGrid, List, Rows3 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { authHeaders } from "@/lib/auth-helpers";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  orderIndex: number;
  createdAt: string;
}

const emptyForm = { name: "", role: "", text: "", rating: 5, avatar: "", orderIndex: 0 };

export default function TemoignagesAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/testimonials", { headers: authHeaders() });
      setTestimonials(await res.json());
    } catch {
      addToast("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      addToast("Témoignage supprimé", "success");
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.text) { addToast("Nom et texte requis", "error"); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/testimonials?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        addToast("Témoignage mis à jour", "success");
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ ...form, orderIndex: testimonials.length }),
        });
        if (!res.ok) throw new Error();
        addToast("Témoignage créé", "success");
      }
      await fetchData();
      setModal(null);
      setEditId(null);
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, avatar: t.avatar, orderIndex: t.orderIndex });
    setEditId(t.id);
    setModal("edit");
  };

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.text.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Témoignages" subtitle={`${testimonials.length} témoignages`} image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { setForm(emptyForm); setEditId(null); setModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un témoignage..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="glass rounded-2xl p-5 relative group">
              <Quote className="w-8 h-8 text-violet/20 absolute top-4 right-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm shrink-0">{t.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber fill-amber" : "text-gray-500"}`} />))}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)] transition-colors" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red/10 transition-colors" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Rôle</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Témoignage</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Note</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-xs shrink-0">{t.name.charAt(0)}</div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{t.role}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{t.text}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber fill-amber" : "text-gray-500"}`} />))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red/10"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((t) => (
            <div key={t.id} className="glass rounded-xl p-3 relative group">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm shrink-0 mb-2">{t.name.charAt(0)}</div>
                <p className="font-medium text-sm truncate w-full">{t.name}</p>
                <p className="text-xs text-gray-400 truncate w-full">{t.role}</p>
                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < t.rating ? "text-amber fill-amber" : "text-gray-500"}`} />))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <button onClick={() => openEdit(t)} className="p-1 rounded-lg hover:bg-[var(--card-border)] transition-colors" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                <button onClick={() => setDeleteId(t.id)} className="p-1 rounded-lg hover:bg-red/10 transition-colors" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{editId ? "Modifier" : "Ajouter"} un témoignage</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Rôle / Entreprise</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Témoignage *</label><textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light resize-none" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Note (1-5)</label><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setForm({ ...form, rating: n })} className={`p-1 ${n <= form.rating ? "text-amber" : "text-gray-500"}`}><Star className="w-5 h-5" /></button>)}</div></div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "..." : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Supprimer le témoignage" message="Cette action est irréversible." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
