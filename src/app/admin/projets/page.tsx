"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Search, FolderKanban, Plus, Edit, Trash2, Calendar, Loader2, X, Save, Image as ImageIcon, LayoutGrid, List, Rows3 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { authHeaders } from "@/lib/auth-helpers";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  domain: string;
  year: number;
  technologies: string[];
  results: string[];
  description: string;
  image: string;
  createdAt: string;
}

const emptyForm = { title: "", client: "", domain: "", year: new Date().getFullYear(), technologies: "", results: "", description: "", slug: "", image: "/images/placeholder.jpg" };

export default function ProjetsAdminPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects", { headers: authHeaders() });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      addToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      addToast("Projet supprimé", "success");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.client) {
      addToast("Titre et client requis", "error");
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const data = {
        ...form,
        slug,
        year: parseInt(String(form.year)) || new Date().getFullYear(),
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        results: form.results.split(",").map((r) => r.trim()).filter(Boolean),
      };
      if (editId) {
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ projectId: editId, ...data }),
        });
        if (!res.ok) throw new Error();
        addToast("Projet mis à jour", "success");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        addToast("Projet créé", "success");
      }
      await fetchProjects();
      setModal(null);
      setEditId(null);
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title, client: p.client, domain: p.domain, year: p.year,
      technologies: p.technologies?.join(", ") || "", results: p.results?.join(", ") || "",
      description: p.description || "", slug: p.slug, image: p.image || "",
    });
    setEditId(p.id);
    setModal("edit");
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Gestion des Projets" subtitle={`${projects.length} projets réalisés`} image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { setForm(emptyForm); setEditId(null); setModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un projet..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="glass rounded-2xl overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center overflow-hidden">
                {project.image && project.image !== "/images/placeholder.jpg" ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <FolderKanban className="w-12 h-12 text-violet/40" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{project.domain}</span>
                  <span className="text-xs text-gray-400">{project.year}</span>
                </div>
                <h3 className="font-semibold mb-1">{project.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{project.client}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-gray-400">{tech}</span>
                  ))}
                  {project.technologies?.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-gray-400">+{project.technologies.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)]">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button onClick={() => setDeleteId(project.id)} className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
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
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Titre</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Client</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Domaine</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Année</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Technologies</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Date</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.id} className="border-b border-[var(--card-border)] last:border-b-0 hover:bg-[var(--card-bg)]/50 transition-colors">
                    <td className="px-5 py-3 font-medium">{project.title}</td>
                    <td className="px-5 py-3 text-gray-400">{project.client}</td>
                    <td className="px-5 py-3 text-gray-400">{project.domain}</td>
                    <td className="px-5 py-3 text-gray-400">{project.year}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-gray-400">{tech}</span>
                        ))}
                        {project.technologies?.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-gray-400">+{project.technologies.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{new Date(project.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                        <button onClick={() => setDeleteId(project.id)} className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
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
          {filtered.map((project) => (
            <div key={project.id} className="glass rounded-xl p-3 group">
              <div className="h-24 bg-gradient-to-br from-violet/20 to-cyan/20 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                {project.image && project.image !== "/images/placeholder.jpg" ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <FolderKanban className="w-8 h-8 text-violet/40" />
                )}
              </div>
              <h4 className="font-medium text-xs mb-0.5 truncate">{project.title}</h4>
              <p className="text-[10px] text-gray-400 truncate">{project.client}</p>
              <p className="text-[10px] text-gray-400">{project.year}</p>
              <div className="flex items-center justify-end gap-0.5 mt-2">
                <button onClick={() => openEdit(project)} className="p-1 rounded hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => setDeleteId(project.id)} className="p-1 rounded hover:bg-red/10" title="Supprimer"><Trash2 className="w-3 h-3 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{editId ? "Modifier" : "Ajouter"} un projet</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Titre *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Client *</label><input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Domaine</label><input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Année</label><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Technologies (séparées par virgule)</label><input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image du projet (URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                {form.image && form.image !== "/images/placeholder.jpg" && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[var(--card-border)] h-32">
                    <img key={form.image} src={form.image} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light resize-none" /></div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Supprimer le projet" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
