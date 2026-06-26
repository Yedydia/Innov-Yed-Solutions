"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Search, Plus, Edit, Trash2, Loader2, Briefcase, Code, X, Save, LayoutGrid, List, Rows3 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { authHeaders } from "@/lib/auth-helpers";
import ConfirmDialog from "@/components/ConfirmDialog";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  orderIndex: number;
  createdAt: string;
}

const emptyForm = { name: "", role: "", bio: "", image: "", specialties: "" };

export default function EquipeAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
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
      const res = await fetch("/api/admin/team", { headers: authHeaders() });
      setMembers(await res.json());
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
      const res = await fetch(`/api/admin/team?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      addToast("Membre supprimé", "success");
      setMembers((prev) => prev.filter((m) => m.id !== deleteId));
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { addToast("Nom et rôle requis", "error"); return; }
    setSaving(true);
    try {
      const data = { ...form, specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editId) {
        const res = await fetch("/api/admin/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ memberId: editId, ...data }),
        });
        if (!res.ok) throw new Error();
        addToast("Membre mis à jour", "success");
      } else {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ ...data, orderIndex: members.length }),
        });
        if (!res.ok) throw new Error();
        addToast("Membre ajouté", "success");
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

  const openEdit = (m: TeamMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio, image: m.image, specialties: m.specialties?.join(", ") || "" });
    setEditId(m.id);
    setModal("edit");
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Équipe" subtitle={`${members.length} membres`} image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { setForm(emptyForm); setEditId(null); setModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
          <Plus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un membre..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <div key={member.id} className="glass rounded-2xl p-5 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center text-2xl font-bold text-violet-light shrink-0">{member.name.charAt(0)}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Briefcase className="w-3 h-3" /> {member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2 mb-3">{member.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {member.specialties?.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet-light flex items-center gap-1"><Code className="w-2.5 h-2.5" /> {s}</span>
                ))}
              </div>
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-[var(--card-border)]">
                <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                <button onClick={() => setDeleteId(member.id)} className="p-1.5 rounded-lg hover:bg-red/10"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
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
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nom</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Rôle</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Bio</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Spécialités</th>
                <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="border-b border-[var(--card-border)] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-medium">{member.name}</td>
                  <td className="px-5 py-3 text-gray-400">{member.role}</td>
                  <td className="px-5 py-3 text-gray-300 max-w-[200px] truncate">{member.bio || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {member.specialties?.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet-light">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setDeleteId(member.id)} className="p-1.5 rounded-lg hover:bg-red/10"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
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
          {filtered.map((member) => (
            <div key={member.id} className="glass rounded-xl p-3 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center text-sm font-bold text-violet-light shrink-0">{member.name.charAt(0)}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs truncate">{member.name}</h3>
                  <p className="text-[10px] text-gray-400 truncate">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => openEdit(member)} className="p-1 rounded hover:bg-[var(--card-border)]"><Edit className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => setDeleteId(member.id)} className="p-1 rounded hover:bg-red/10"><Trash2 className="w-3 h-3 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{editId ? "Modifier" : "Ajouter"} un membre</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Rôle *</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light resize-none" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Spécialités (séparées par virgule)</label><input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="React, Node.js, Sécurité" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "..." : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Supprimer le membre" message="Cette action est irréversible." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
