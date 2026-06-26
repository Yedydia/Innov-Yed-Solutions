"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Search, Loader2, MessageSquare, User, Clock, Trash2, ChevronDown, Send, X, LayoutGrid, List, Rows3 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { authHeaders } from "@/lib/auth-helpers";
import ConfirmDialog from "@/components/ConfirmDialog";

interface TicketMessage {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  messages: TicketMessage[];
}

const priorityColors: Record<string, string> = {
  basse: "text-gray-400 bg-gray-500/10",
  moyenne: "text-cyan bg-cyan/10",
  haute: "text-amber bg-amber/10",
  critique: "text-red bg-red/10",
};

const statusColors: Record<string, string> = {
  ouvert: "text-cyan bg-cyan/10",
  en_cours: "text-amber bg-amber/10",
  resolu: "text-green bg-green/10",
  ferme: "text-gray-400 bg-gray-500/10",
};

const statusOptions = [
  { value: "ouvert", label: "Ouvert" },
  { value: "en_cours", label: "En cours" },
  { value: "resolu", label: "Résolu" },
  { value: "ferme", label: "Fermé" },
];

export default function TicketsAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/admin/tickets", { headers: authHeaders() });
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch {
        addToast("Erreur lors du chargement des tickets", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setUpdatingStatus(ticketId);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: newStatus } : t));
      if (selected?.id === ticketId) setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
      addToast(`Statut passé à "${statusOptions.find((s) => s.value === newStatus)?.label || newStatus}"`, "success");
    } catch {
      addToast("Erreur lors de la mise à jour", "error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ticketId: selected.id, status: selected.status, response: replyText.trim() }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => t.id === selected.id ? updated : t));
      setSelected(updated);
      setReplyText("");
      addToast("Réponse envoyée", "success");
    } catch {
      addToast("Erreur lors de l'envoi", "error");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tickets?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setTickets((prev) => prev.filter((t) => t.id !== deleteId));
      if (selected?.id === deleteId) setSelected(null);
      addToast("Ticket supprimé", "success");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Support Tickets" subtitle={`${tickets.length} tickets · ${tickets.filter((t) => t.status === "ouvert").length} ouverts`} image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un ticket..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
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
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Sujet</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Priorité</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors cursor-pointer" onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-medium text-sm">{ticket.subject}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[10px] shrink-0">{ticket.user.name.charAt(0)}</div>
                        <span className="text-sm">{ticket.user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority] || ""}`}>{ticket.priority}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative group" onClick={(e) => e.stopPropagation()}>
                        <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer inline-flex items-center gap-1 ${statusColors[ticket.status] || ""}`}>
                          {ticket.status.replace("_", " ")}
                          <ChevronDown className="w-3 h-3" />
                        </span>
                        <div className="absolute top-full left-0 mt-1 glass rounded-xl p-1 min-w-[130px] hidden group-hover:block z-10">
                          {statusOptions.filter((s) => s.value !== ticket.status).map((s) => (
                            <button key={s.value} onClick={() => handleStatusChange(ticket.id, s.value)} disabled={updatingStatus === ticket.id} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50">
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(ticket.id); }} className="p-2 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-4 h-4 text-gray-400" /></button>
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
          {filtered.map((ticket) => (
            <div key={ticket.id} className="glass rounded-2xl p-5 cursor-pointer hover:bg-[var(--card-bg)] transition-colors" onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-sm truncate">{ticket.subject}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(ticket.id); }} className="p-1.5 rounded-lg hover:bg-red/10 shrink-0" title="Supprimer"><Trash2 className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[9px] shrink-0">{ticket.user.name.charAt(0)}</div>
                <span className="text-xs text-gray-400 truncate">{ticket.user.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority] || ""}`}>{ticket.priority}</span>
                <div className="relative group" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer inline-flex items-center gap-1 ${statusColors[ticket.status] || ""}`}>
                    {ticket.status.replace("_", " ")}
                    <ChevronDown className="w-3 h-3" />
                  </span>
                  <div className="absolute top-full left-0 mt-1 glass rounded-xl p-1 min-w-[130px] hidden group-hover:block z-10">
                    {statusOptions.filter((s) => s.value !== ticket.status).map((s) => (
                      <button key={s.value} onClick={() => handleStatusChange(ticket.id, s.value)} disabled={updatingStatus === ticket.id} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50">
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((ticket) => (
            <div key={ticket.id} className="glass rounded-xl p-3 cursor-pointer hover:bg-[var(--card-bg)] transition-colors" onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-xs truncate pr-2">{ticket.subject}</span>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(ticket.id); }} className="shrink-0" title="Supprimer"><Trash2 className="w-3 h-3 text-gray-500 hover:text-red" /></button>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityColors[ticket.priority] || ""}`}>{ticket.priority}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[ticket.status] || ""}`}>{ticket.status.replace("_", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[selected.priority]}`}>{selected.priority}</span>
              <div className="relative group" onClick={(e) => e.stopPropagation()}>
                <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer inline-flex items-center gap-1 ${statusColors[selected.status]}`}>
                  {selected.status.replace("_", " ")} <ChevronDown className="w-3 h-3" />
                </span>
                <div className="absolute top-full left-0 mt-1 glass rounded-xl p-1 min-w-[130px] hidden group-hover:block z-10">
                  {statusOptions.filter((s) => s.value !== selected.status).map((s) => (
                    <button key={s.value} onClick={() => handleStatusChange(selected.id, s.value)} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)]">{s.label}</button>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400">{selected.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4"><User className="w-4 h-4" /> {selected.user.name} ({selected.user.email})</div>
            <div className="space-y-3 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Messages</p>
              {selected.messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString("fr-FR")} · {msg.authorId === selected.user.id ? selected.user.name : "Admin"}</p>
                </div>
              ))}
              {selected.messages.length === 0 && <p className="text-sm text-gray-500">Aucun message</p>}
            </div>
            <div className="flex gap-2">
              <input value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleReply()} placeholder="Écrire une réponse..." className="flex-1 px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
              <button onClick={handleReply} disabled={!replyText.trim() || sendingReply} className="p-2.5 rounded-xl bg-violet text-white hover:bg-violet/90 disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Supprimer le ticket" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
