"use client";

import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import AdminPageHeader from "@/components/AdminPageHeader";
import { MessageSquare, Search, Mail, Phone, User, Calendar, Eye, Trash2, Loader2, Check, X, LayoutGrid, List, Rows3 } from "lucide-react";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRead, setUpdatingRead] = useState<string | null>(null);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contacts", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      addToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    setUpdatingRead(id);
    try {
      await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: !currentRead } : m));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, read: !currentRead } : null);
      addToast(currentRead ? "Marqué comme non lu" : "Marqué comme lu", "success");
    } catch {
      addToast("Erreur", "error");
    } finally {
      setUpdatingRead(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts?id=${deleteId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      addToast("Message supprimé", "success");
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      if (selected?.id === deleteId) setSelected(null);
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Messages" subtitle={`${messages.length} messages · ${unreadCount} non lus`} image="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1920&q=80" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un message..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
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
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Expéditeur</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Sujet</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((msg) => (
                  <tr key={msg.id} className={`border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors cursor-pointer ${!msg.read ? "bg-violet/[0.03]" : ""}`} onClick={() => { setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-xs shrink-0">{msg.name.charAt(0)}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{msg.name}</p>
                          <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><p className="text-sm truncate max-w-[200px]">{msg.subject}</p></td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.read); }} disabled={updatingRead === msg.id} className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${msg.read ? "text-gray-400 bg-gray-500/10" : "text-cyan bg-cyan/10"}`}>
                        {msg.read ? <><Check className="w-3 h-3" /> Lu</> : <><X className="w-3 h-3" /> Non lu</>}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-[var(--card-border)]" title="Voir" onClick={(e) => { e.stopPropagation(); setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}><Eye className="w-4 h-4 text-gray-400" /></button>
                        <button className="p-2 rounded-lg hover:bg-red/10" title="Supprimer" onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}><Trash2 className="w-4 h-4 text-gray-400" /></button>
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
          {filtered.map((msg) => (
            <div key={msg.id} className={`glass rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:bg-[var(--card-bg)] transition-colors ${!msg.read ? "bg-violet/[0.05]" : ""}`} onClick={() => { setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-sm shrink-0">{msg.name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{msg.name}</p>
                  <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                </div>
              </div>
              <p className="text-sm font-medium truncate">{msg.subject}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString("fr-FR")}</p>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--card-border)]">
                <span className={`text-xs px-2 py-0.5 rounded-full ${msg.read ? "text-gray-400 bg-gray-500/10" : "text-cyan bg-cyan/10"}`}>{msg.read ? "Lu" : "Non lu"}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[var(--card-border)]" title="Voir" onClick={(e) => { e.stopPropagation(); setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}><Eye className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red/10" title="Supprimer" onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}><Trash2 className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={`glass rounded-xl p-3 flex flex-col gap-1.5 cursor-pointer hover:bg-[var(--card-bg)] transition-colors ${!msg.read ? "bg-violet/[0.05]" : ""}`} onClick={() => { setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[10px] shrink-0">{msg.name.charAt(0)}</div>
                <p className="font-semibold text-xs truncate">{msg.name}</p>
              </div>
              <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className={`w-2 h-2 rounded-full ${msg.read ? "bg-gray-500/30" : "bg-cyan"}`} />
                <div className="flex items-center gap-0.5">
                  <button className="p-1 rounded hover:bg-[var(--card-border)]" title="Voir" onClick={(e) => { e.stopPropagation(); setSelected(selected?.id === msg.id ? null : msg); if (!msg.read) toggleRead(msg.id, false); }}><Eye className="w-3 h-3 text-gray-400" /></button>
                  <button className="p-1 rounded hover:bg-red/10" title="Supprimer" onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}><Trash2 className="w-3 h-3 text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">Détail du message</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400"><User className="w-4 h-4" /> {selected.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><Mail className="w-4 h-4" /> {selected.email}</div>
              {selected.phone && <div className="flex items-center gap-2 text-sm text-gray-400"><Phone className="w-4 h-4" /> {selected.phone}</div>}
            </div>
            <div className="mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sujet</p>
              <p className="font-semibold">{selected.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Supprimer le message" message="Cette action est irréversible." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
