"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import { Ticket, Plus, Search, Clock, MessageSquare, Send, X, Loader2 } from "lucide-react";
import PortalPageHeader from "@/components/PortalPageHeader";

const statusStyles: Record<string, string> = {
  ouvert: "text-red bg-red/10 border-red/20",
  en_cours: "text-amber bg-amber/10 border-amber/20",
  resolu: "text-green bg-green/10 border-green/20",
  ferme: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const statusLabels: Record<string, string> = {
  ouvert: "Ouvert", en_cours: "En cours", resolu: "Résolu", ferme: "Fermé",
};

const priorityColors: Record<string, string> = {
  basse: "text-gray-400", moyenne: "text-amber", haute: "text-red", critique: "text-red font-bold",
};

interface TicketMessage {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

interface TicketData {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  messages: TicketMessage[];
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState<TicketData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "general", priority: "moyenne", message: "" });

  const fetchTickets = () => {
    fetch("/api/portail/tickets", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setTickets(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendMessage = async () => {
    if (!selected || !newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/portail/tickets/${selected.id}`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setSelected({
          ...selected,
          messages: [...selected.messages, data.message],
        });
        setNewMessage("");
      }
    } finally {
      setSending(false);
    }
  };

  const handleCreate = async () => {
    if (!form.subject || !form.message || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/portail/tickets", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTickets([data.ticket, ...tickets]);
        setShowCreate(false);
        setForm({ subject: "", category: "general", priority: "moyenne", message: "" });
      }
    } finally {
      setCreating(false);
    }
  };

  const filtered = tickets.filter((t) => {
    const matchSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || t.status === filter;
    return matchSearch && matchFilter;
  });

  if (showCreate) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setShowCreate(false)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" /> Annuler
        </button>
        <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-white">Nouveau Ticket</h2>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sujet *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} placeholder="Ex: Problème de connexion" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all">
                <option value="general">Général</option>
                <option value="technique">Technique</option>
                <option value="facturation">Facturation</option>
                <option value="projet">Projet</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Priorité</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all">
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="critique">Critique</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Message *</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLTextAreaElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLTextAreaElement).setCustomValidity(""); }} rows={4} placeholder="Décrivez votre problème..." className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600 resize-none" />
          </div>
          <button onClick={handleCreate} disabled={!form.subject || !form.message || creating} className="px-6 py-2.5 bg-cyan text-navy rounded-xl text-sm font-semibold hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center gap-2">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Créer le ticket
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" /> Retour aux tickets
        </button>
        <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg text-white">{selected.subject}</h2>
              <p className="text-xs text-gray-500 mt-1">{selected.category} • {new Date(selected.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[selected.status] || ""}`}>{statusLabels[selected.status] || selected.status}</span>
          </div>
          <div className="space-y-3 mb-6">
            {selected.messages.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-sm text-white/90">{m.content}</p>
                <p className="text-[11px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString("fr-FR")}</p>
              </div>
            ))}
            {selected.messages.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Aucun message</p>}
          </div>
          <div className="flex gap-2">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Écrire un message..." className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
            <button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="px-4 py-2.5 bg-cyan text-navy rounded-xl text-sm font-semibold hover:bg-cyan/90 transition-all disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PortalPageHeader title="Tickets Support" subtitle="Assistance et demandes d'aide" image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Tickets Support</h1>
          <p className="text-gray-400 text-sm mt-1">{tickets.length} tickets au total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 bg-cyan text-navy rounded-xl text-sm font-semibold hover:bg-cyan/90 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un ticket..." className="w-full pl-10 pr-4 py-2.5 bg-[#0D1525] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
        </div>
        <div className="flex gap-2">
          {["tous", "ouvert", "en_cours", "resolu", "ferme"].map((f) => (
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
          <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucun ticket trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} onClick={() => setSelected(t)} className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-5 hover:border-cyan/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyles[t.status] || ""}`}>{statusLabels[t.status] || t.status}</span>
                  <span className="text-xs text-gray-500">{t.category}</span>
                </div>
                <span className={`text-xs ${priorityColors[t.priority] || ""}`}>{t.priority}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">{t.subject}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.createdAt).toLocaleDateString("fr-FR")}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {t.messages.length} message(s)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
