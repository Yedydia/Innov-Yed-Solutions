"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { BookOpen, Search, Plus, Edit, Trash2, Users, Clock, Loader2, X, Save, Image as ImageIcon, LayoutGrid, List, Rows3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  modules: number;
  price: number;
  rating: number;
  students: number;
  slug: string;
  domain: string;
  badge: string | null;
  description: string;
  image: string;
  createdAt: string;
}

const emptyForm = { title: "", instructor: "", level: "Débutant", duration: "", modules: 1, price: 0, slug: "", domain: "", badge: "", description: "", image: "/images/placeholder.jpg" };
const levelColors: Record<string, string> = { "Débutant": "text-green bg-green/10", "Intermédiaire": "text-amber bg-amber/10", "Avancé": "text-red bg-red/10" };

export default function FormationsAdminPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses", { headers: authHeaders() });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      addToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      addToast("Formation supprimée", "success");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.instructor || !form.price) { addToast("Champs obligatoires manquants", "error"); return; }
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (editId) {
        const res = await fetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ courseId: editId, ...form, slug }),
        });
        if (!res.ok) throw new Error();
        addToast("Formation mise à jour", "success");
      } else {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ ...form, slug, students: 0, rating: 0 }),
        });
        if (!res.ok) throw new Error();
        addToast("Formation créée", "success");
      }
      await fetchCourses();
      setModal(null);
      setEditId(null);
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (c: Course) => {
    setForm({ title: c.title, instructor: c.instructor, level: c.level, duration: c.duration, modules: c.modules, price: c.price, slug: c.slug, domain: c.domain, badge: c.badge || "", description: c.description || "", image: c.image || "" });
    setEditId(c.id);
    setModal("edit");
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Gestion des Formations" subtitle={`${courses.length} formations`} image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { setForm(emptyForm); setEditId(null); setModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
          <Plus className="w-4 h-4" /> Nouvelle formation
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une formation..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <div key={course.id} className="glass rounded-2xl overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center relative overflow-hidden">
                {course.image && course.image !== "/images/placeholder.jpg" ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookOpen className="w-10 h-10 text-violet/40" />
                )}
                <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full ${levelColors[course.level] || "bg-gray-500/10 text-gray-400"}`}>{course.level}</span>
                {course.badge && <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan">{course.badge}</span>}
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{course.instructor}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)]">
                  <span className="font-bold text-sm text-violet-light">{formatPrice(course.price)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(course)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button onClick={() => setDeleteId(course.id)} className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Titre</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Formateur</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Niveau</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Étudiants</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium">{course.title}</td>
                    <td className="px-5 py-3 text-gray-400">{course.instructor}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[course.level] || "bg-gray-500/10 text-gray-400"}`}>{course.level}</span>
                    </td>
                    <td className="px-5 py-3 text-violet-light font-semibold">{formatPrice(course.price)}</td>
                    <td className="px-5 py-3 text-gray-400">{course.duration}</td>
                    <td className="px-5 py-3 text-gray-400">{course.students}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(course)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                        <button onClick={() => setDeleteId(course.id)} className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((course) => (
            <div key={course.id} className="glass rounded-xl p-3 group hover:border-violet/30 transition-colors">
              <div className="h-20 bg-gradient-to-br from-violet/20 to-cyan/20 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                {course.image && course.image !== "/images/placeholder.jpg" ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookOpen className="w-6 h-6 text-violet/40" />
                )}
              </div>
              <h3 className="font-medium text-xs line-clamp-1 mb-1">{course.title}</h3>
              <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full ${levelColors[course.level] || "bg-gray-500/10 text-gray-400"}`}>{course.level}</span>
              <p className="text-xs font-bold text-violet-light mt-1.5">{formatPrice(course.price)}</p>
              <div className="flex items-center justify-end gap-0.5 mt-2">
                <button onClick={() => openEdit(course)} className="p-1 rounded hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => setDeleteId(course.id)} className="p-1 rounded hover:bg-red/10" title="Supprimer"><Trash2 className="w-3 h-3 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{editId ? "Modifier" : "Ajouter"} une formation</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Titre *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Formateur *</label><input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Niveau</label><select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Prix (FCFA) *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Durée</label><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="8 semaines" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Modules</label><input type="number" value={form.modules} onChange={(e) => setForm({ ...form, modules: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Domaine</label><input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image de la formation (URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                {form.image && form.image !== "/images/placeholder.jpg" && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[var(--card-border)] h-32">
                    <img key={form.image} src={form.image} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "..." : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Supprimer la formation" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
