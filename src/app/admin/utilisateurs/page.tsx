"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import {
  Users, Search, Plus, ShieldCheck, ShieldAlert, Edit, Trash2, Eye,
  Calendar, CheckCircle, XCircle, Loader2, Settings, X, Save, LayoutGrid, List, Rows3,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { authHeaders } from "@/lib/auth-helpers";
import ConfirmDialog from "@/components/ConfirmDialog";

interface User {
  id: string; name: string; email: string; role: string; status: string; phone: string | null; company: string | null; createdAt: string;
  _count: { devis: number; orders: number; tickets: number; invoices: number };
}

interface Role {
  id: string; name: string; label: string; description: string; color: string; isDefault: boolean;
}

const emptyUserForm = { name: "", email: "", phone: "", company: "", role: "client", password: "" };

export default function UtilisateursPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", label: "", description: "", color: "#8B5CF6" });
  const [creatingRole, setCreatingRole] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [deletingRole, setDeletingRole] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [userModal, setUserModal] = useState<"add" | "view" | "edit" | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: authHeaders() });
      setUsers(await res.json());
    } catch { addToast("Erreur de chargement", "error"); }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles", { headers: authHeaders() });
      setRoles(await res.json());
    } catch { addToast("Erreur de chargement des rôles", "error"); }
  };

  useEffect(() => { Promise.all([fetchUsers(), fetchRoles()]).finally(() => setLoading(false)); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      addToast("Utilisateur supprimé", "success");
    } catch { addToast("Erreur lors de la suppression", "error"); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      const res = await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ userId, role: newRole }) });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      addToast("Rôle mis à jour", "success");
    } catch { addToast("Erreur de mise à jour", "error"); }
    finally { setUpdatingRole(null); }
  };

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) { addToast("Nom et email requis", "error"); return; }
    setSavingUser(true);
    try {
      if (selectedUser) {
        const res = await fetch("/api/admin/users", {
          method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ userId: selectedUser.id, name: userForm.name, phone: userForm.phone, company: userForm.company, role: userForm.role }),
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || ""); }
        addToast("Utilisateur mis à jour", "success");
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(userForm),
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || ""); }
        addToast("Utilisateur créé", "success");
      }
      await fetchUsers();
      setUserModal(null);
      setSelectedUser(null);
      setUserForm(emptyUserForm);
    } catch (err: any) { addToast(err.message || "Erreur lors de la sauvegarde", "error"); }
    finally { setSavingUser(false); }
  };

  const openView = (u: User) => { setSelectedUser(u); setUserModal("view"); };
  const openEdit = (u: User) => {
    setSelectedUser(u);
    setUserForm({ name: u.name, email: u.email, phone: u.phone || "", company: u.company || "", role: u.role, password: "" });
    setUserModal("edit");
  };

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.label) { addToast("Nom et label requis", "error"); return; }
    setCreatingRole(true);
    try {
      const res = await fetch("/api/admin/roles", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(newRole) });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setRoles((prev) => [...prev, created]);
      setNewRole({ name: "", label: "", description: "", color: "#8B5CF6" });
      addToast("Rôle créé", "success");
    } catch { addToast("Erreur de création", "error"); }
    finally { setCreatingRole(false); }
  };

  const handleDeleteRole = async () => {
    if (!deleteRoleId) return;
    setDeletingRole(true);
    try {
      const res = await fetch(`/api/admin/roles?id=${deleteRoleId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || ""); }
      setRoles((prev) => prev.filter((r) => r.id !== deleteRoleId));
      addToast("Rôle supprimé", "success");
    } catch (err: any) { addToast(err.message || "Erreur de suppression", "error"); }
    finally { setDeletingRole(false); setDeleteRoleId(null); }
  };

  const roleColor = (roleName: string) => roles.find((r) => r.name === roleName)?.color || "#9CA3AF";
  const roleLabel = (roleName: string) => roles.find((r) => r.name === roleName)?.label || roleName;

  const usersWithCounts = users.map((u) => ({
    ...u, projects: u._count.devis + u._count.orders,
    joined: new Date(u.createdAt).toLocaleDateString("fr-FR"),
    avatar: u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
  }));

  const filtered = usersWithCounts.filter((u) =>
    (roleFilter === "Tous" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const roleFilters = ["Tous", ...roles.map((r) => r.name)];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Gestion des Utilisateurs" subtitle={`${users.length} utilisateurs · ${roles.length} rôles`} image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <button onClick={() => setShowRolesModal(true)} className="flex items-center gap-2 border border-[var(--card-border)] text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--card-bg)]">
            <Settings className="w-4 h-4" /> Gérer les rôles
          </button>
          <button onClick={() => { setUserForm(emptyUserForm); setSelectedUser(null); setUserModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
        </div>
        <div className="flex gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1 flex-wrap">
          {roleFilters.map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${roleFilter === r ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`}>
              {r === "Tous" ? "Tous" : roleLabel(r)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Utilisateur</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Rôle</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden lg:table-cell">Inscrit</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden lg:table-cell">Projets</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.email} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-xs shrink-0">{user.avatar}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative group">
                        <span className="text-xs px-2 py-1 rounded-full cursor-pointer inline-flex items-center gap-1" style={{ backgroundColor: `${roleColor(user.role)}20`, color: roleColor(user.role) }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor(user.role) }} />
                          {roleLabel(user.role)}
                        </span>
                        <div className="absolute top-full left-0 mt-1 glass rounded-xl p-1 min-w-[140px] hidden group-hover:block z-10">
                          {roles.filter((r) => r.name !== user.role).map((r) => (
                            <button key={r.id} onClick={() => handleRoleChange(user.id, r.name)} disabled={updatingRole === user.id} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />{r.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`flex items-center gap-1 text-xs ${user.status === "actif" ? "text-green" : "text-gray-400"}`}>
                        {user.status === "actif" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}{user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell"><span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {user.joined}</span></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><span className="text-sm font-medium">{user.projects}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openView(user)} className="p-2 rounded-lg hover:bg-[var(--card-border)]" title="Voir"><Eye className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={() => openEdit(user)} className="p-2 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={() => setDeleteId(user.id)} className="p-2 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user) => (
            <div key={user.email} className="glass rounded-2xl p-5 hover:bg-[var(--card-bg)] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm shrink-0">{user.avatar}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="relative group">
                  <span className="text-xs px-2 py-1 rounded-full cursor-pointer inline-flex items-center gap-1" style={{ backgroundColor: `${roleColor(user.role)}20`, color: roleColor(user.role) }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor(user.role) }} />
                    {roleLabel(user.role)}
                  </span>
                  <div className="absolute top-full right-0 mt-1 glass rounded-xl p-1 min-w-[140px] hidden group-hover:block z-10">
                    {roles.filter((r) => r.name !== user.role).map((r) => (
                      <button key={r.id} onClick={() => handleRoleChange(user.id, r.name)} disabled={updatingRole === user.id} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />{r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`flex items-center gap-1 text-xs ${user.status === "actif" ? "text-green" : "text-gray-400"}`}>
                  {user.status === "actif" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}{user.status}
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {user.joined}</span>
                <span className="text-gray-600">·</span>
                <span className="text-xs text-gray-400">{user.projects} projets</span>
              </div>
              <div className="flex items-center gap-1 border-t border-[var(--card-border)] pt-3">
                <button onClick={() => openView(user)} className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-[var(--card-border)] text-xs text-gray-400 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /> Voir</button>
                <button onClick={() => openEdit(user)} className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-[var(--card-border)] text-xs text-gray-400 hover:text-white transition-colors"><Edit className="w-3.5 h-3.5" /> Modifier</button>
                <button onClick={() => setDeleteId(user.id)} className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-red/10 text-xs text-gray-400 hover:text-red transition-colors"><Trash2 className="w-3.5 h-3.5" /> Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((user) => (
            <div key={user.email} className="glass rounded-xl p-3 hover:bg-[var(--card-bg)] transition-colors flex flex-col items-center text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[10px] shrink-0">{user.avatar}</div>
              <div className="min-w-0 w-full">
                <p className="font-semibold text-xs truncate">{user.name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1" style={{ backgroundColor: `${roleColor(user.role)}20`, color: roleColor(user.role) }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: roleColor(user.role) }} />
                  {roleLabel(user.role)}
                </span>
              </div>
              <div className="flex items-center gap-0.5 w-full justify-center border-t border-[var(--card-border)] pt-2">
                <button onClick={() => openView(user)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Voir"><Eye className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => setDeleteId(user.id)} className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-3 h-3 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: ShieldAlert, label: "Admins", filter: "admin", color: "text-red" },
          { icon: ShieldCheck, label: "Équipe", filter: "all-staff", color: "text-cyan" },
          { icon: Users, label: "Clients", filter: "client", color: "text-green" },
        ].map((role) => (
          <div key={role.label} className="glass rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center`}><role.icon className={`w-6 h-6 ${role.color}`} /></div>
            <div>
              <p className="font-display text-2xl font-bold">
                {role.filter === "all-staff" ? users.filter((u) => u.role !== "admin" && u.role !== "client").length : users.filter((u) => u.role === role.filter).length}
              </p>
              <p className="text-xs text-gray-400">{role.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} title="Supprimer l'utilisateur" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />

      {(userModal === "add" || userModal === "edit") && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setUserModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{selectedUser ? "Modifier" : "Ajouter"} un utilisateur</h2>
              <button onClick={() => setUserModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Email *</label><input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} disabled={!!selectedUser} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light disabled:opacity-50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Téléphone</label><input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Société</label><input value={userForm.company} onChange={(e) => setUserForm({ ...userForm, company: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Rôle</label>
                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light">
                  {roles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
                </select>
              </div>
              {!selectedUser && <div><label className="block text-xs text-gray-400 mb-1">Mot de passe (défaut: Temp1234!)</label><input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>}
              <button onClick={handleSaveUser} disabled={savingUser} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50"><Save className="w-4 h-4" /> {savingUser ? "..." : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      {userModal === "view" && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setUserModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">Détail utilisateur</h2>
              <button onClick={() => setUserModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-xl">{selectedUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
              <div>
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: `${roleColor(selectedUser.role)}20`, color: roleColor(selectedUser.role) }}>{roleLabel(selectedUser.role)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"><p className="text-xs text-gray-400">Téléphone</p><p className="text-sm font-medium">{selectedUser.phone || "—"}</p></div>
              <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"><p className="text-xs text-gray-400">Société</p><p className="text-sm font-medium">{selectedUser.company || "—"}</p></div>
              <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"><p className="text-xs text-gray-400">Statut</p><p className={`text-sm font-medium ${selectedUser.status === "actif" ? "text-green" : "text-red"}`}>{selectedUser.status}</p></div>
              <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"><p className="text-xs text-gray-400">Inscrit le</p><p className="text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}</p></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[["Devis", selectedUser._count.devis], ["Commandes", selectedUser._count.orders], ["Tickets", selectedUser._count.tickets], ["Factures", selectedUser._count.invoices]].map(([label, count]) => (
                <div key={label} className="text-center p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"><p className="font-display text-xl font-bold">{count as number}</p><p className="text-[10px] text-gray-400">{label as string}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRolesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRolesModal(false)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">Gestion des Rôles</h2>
              <button onClick={() => setShowRolesModal(false)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-6">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <div><p className="text-sm font-medium">{role.label}</p><p className="text-xs text-gray-400">{role.description}</p></div>
                  </div>
                  {!role.isDefault && <button onClick={() => setDeleteRoleId(role.id)} className="p-1.5 rounded-lg hover:bg-red/10"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>}
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--card-border)] pt-4">
              <h3 className="text-sm font-semibold mb-3">Ajouter un rôle</h3>
              <div className="space-y-3">
                <input value={newRole.name} onChange={(e) => setNewRole((p) => ({ ...p, name: e.target.value }))} placeholder="Identifiant (ex: chef-projet)" className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                <input value={newRole.label} onChange={(e) => setNewRole((p) => ({ ...p, label: e.target.value }))} placeholder="Libellé (ex: Chef de Projet)" className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                <input value={newRole.description} onChange={(e) => setNewRole((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                <div className="flex items-center gap-3"><input type="color" value={newRole.color} onChange={(e) => setNewRole((p) => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-xl border border-[var(--card-border)] cursor-pointer" /><span className="text-xs text-gray-400">Couleur</span></div>
                <button onClick={handleCreateRole} disabled={creatingRole} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50">
                  {creatingRole ? "..." : <><Plus className="w-4 h-4" /> Ajouter le rôle</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteRoleId} title="Supprimer le rôle" message="Les utilisateurs avec ce rôle ne seront pas supprimés." onConfirm={handleDeleteRole} onCancel={() => setDeleteRoleId(null)} loading={deletingRole} />
    </div>
  );
}
