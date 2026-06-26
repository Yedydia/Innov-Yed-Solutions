"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import { MessageSquare, Search, Loader2, Mail, Clock } from "lucide-react";
import PortalPageHeader from "@/components/PortalPageHeader";

const subjectLabels: Record<string, string> = {
  devis: "Demande de devis",
  support: "Support technique",
  partenariat: "Partenariat",
  formation: "Formation",
  autre: "Autre",
};

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portail/data", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setMessages(d.contacts || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = messages.filter((m) => {
    return !search || m.subject.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase());
  });

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          ← Retour aux messages
        </button>
        <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg text-white">{subjectLabels[selected.subject] || selected.subject}</h2>
              <p className="text-xs text-gray-500 mt-1">{new Date(selected.createdAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${selected.read ? "text-gray-400 bg-gray-400/10 border-gray-400/20" : "text-cyan bg-cyan/10 border-cyan/20"}`}>
              {selected.read ? "Lu" : "Non lu"}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-sm text-white/90 whitespace-pre-wrap">{selected.message}</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</span>
            {selected.phone && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selected.phone}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PortalPageHeader title="Messages" subtitle="Vos échanges avec l'équipe" image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80" />
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">{messages.length} message(s) envoyé(s) depuis le site</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un message..." className="w-full pl-10 pr-4 py-2.5 bg-[#0D1525] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucun message</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id} onClick={() => setSelected(m)} className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-5 hover:border-cyan/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${m.read ? "text-gray-400 bg-gray-400/10 border-gray-400/20" : "text-cyan bg-cyan/10 border-cyan/20"}`}>
                    {subjectLabels[m.subject] || m.subject}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="text-sm text-white/90 line-clamp-2">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
