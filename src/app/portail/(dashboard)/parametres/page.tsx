"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import { User, Mail, Phone, Building2, Lock, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import PortalPageHeader from "@/components/PortalPageHeader";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ParametresPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portail/profile", { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.user) {
          setUser(data.user);
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            company: data.user.company || "",
          });
        }
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/portail/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Erreur" }); setSaving(false); return; }
      setUser(data.user);
      setMsg({ type: "success", text: "Profil mis à jour avec succès" });
    } catch {
      setMsg({ type: "error", text: "Erreur réseau" });
    }
    setSaving(false);
  };

  const handlePasswordSave = async () => {
    setMsg(null);
    if (passForm.newPassword !== passForm.confirmPassword) {
      setMsg({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/portail/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Erreur" }); setSaving(false); return; }
      setMsg({ type: "success", text: "Mot de passe mis à jour" });
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMsg({ type: "error", text: "Erreur réseau" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PortalPageHeader title="Paramètres" subtitle="Configurez votre espace client" image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80" />
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 text-sm mt-1">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {msg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {/* Profile */}
      <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white">Informations personnelles</h2>
            <p className="text-xs text-gray-500">Mettez à jour vos données</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Entreprise</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
          <span>Rôle : <span className="text-cyan font-medium">{user?.role}</span></span>
          <span>•</span>
          <span>Compte {user?.status}</span>
        </div>

        <button onClick={handleProfileSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-cyan/20 transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
      </div>

      {/* Password */}
      <div className="rounded-2xl bg-[#0D1525] border border-white/[0.04] p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white">Changer le mot de passe</h2>
            <p className="text-xs text-gray-500">Assurez-vous d&apos;utiliser un mot de passe fort</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mot de passe actuel</label>
            <input type="password" value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} placeholder="••••••••" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Nouveau mot de passe</label>
              <input type="password" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="••••••••" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Confirmer</label>
              <input type="password" value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} placeholder="••••••••" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
            </div>
          </div>
        </div>

        <button onClick={handlePasswordSave} disabled={saving || !passForm.currentPassword || !passForm.newPassword} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl text-sm font-semibold hover:bg-white/[0.08] transition-all disabled:opacity-50">
          <Lock className="w-4 h-4" />
          Modifier le mot de passe
        </button>
      </div>
    </div>
  );
}
