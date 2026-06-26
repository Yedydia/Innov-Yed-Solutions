"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth-helpers";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Settings, Save, Shield, Bell, Palette, Globe, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function ParametresAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Administrateur");
  const [email, setEmail] = useState("admin@innovyed.com");
  const [notifDevis, setNotifDevis] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifCommandes, setNotifCommandes] = useState(true);
  const [notifInscrits, setNotifInscrits] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("admin_settings");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.name) setName(s.name);
        if (s.email) setEmail(s.email);
        if (s.notifDevis !== undefined) setNotifDevis(s.notifDevis);
        if (s.notifMessages !== undefined) setNotifMessages(s.notifMessages);
        if (s.notifCommandes !== undefined) setNotifCommandes(s.notifCommandes);
        if (s.notifInscrits !== undefined) setNotifInscrits(s.notifInscrits);
      } catch {}
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        addToast("Profil mis à jour", "success");
      } else {
        addToast("Profil sauvegardé localement", "success");
      }
    } catch {
      addToast("Paramètres sauvegardés localement", "success");
    }
    localStorage.setItem("admin_settings", JSON.stringify({ name, email, notifDevis, notifMessages, notifCommandes, notifInscrits }));
    setTimeout(() => setSaving(false), 500);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;

  return (
    <div>
      <AdminPageHeader title="Paramètres" subtitle="Configuration de l'administration" image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80" />

      <div className="space-y-6 max-w-2xl">
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center"><Shield className="w-5 h-5 text-violet-light" /></div>
            <div><h2 className="font-display font-semibold text-lg">Profil Administrateur</h2><p className="text-xs text-gray-400">Informations de connexion</p></div>
          </div>
          <div className="space-y-4">
            <div><label className="block text-xs text-gray-400 mb-1.5">Nom complet</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} defaultValue="••••••••" disabled className="w-full px-4 py-2.5 pr-10 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light disabled:opacity-50" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center"><Bell className="w-5 h-5 text-amber" /></div>
            <div><h2 className="font-display font-semibold text-lg">Notifications</h2><p className="text-xs text-gray-400">Gestion des alertes</p></div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nouveaux devis", desc: "Recevoir une alerte pour chaque nouveau devis", value: notifDevis, onChange: setNotifDevis },
              { label: "Nouveaux messages", desc: "Recevoir une alerte pour chaque message", value: notifMessages, onChange: setNotifMessages },
              { label: "Nouvelles commandes", desc: "Recevoir une alerte pour chaque commande", value: notifCommandes, onChange: setNotifCommandes },
              { label: "Nouveaux inscrits", desc: "Recevoir une alerte pour chaque inscription", value: notifInscrits, onChange: setNotifInscrits },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={item.value} onChange={(e) => item.onChange(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[var(--card-border)] rounded-full peer peer-checked:bg-violet peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center"><Palette className="w-5 h-5 text-cyan" /></div>
            <div><h2 className="font-display font-semibold text-lg">Apparence</h2><p className="text-xs text-gray-400">Personnalisation de l&apos;interface</p></div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium">Mode sombre</p><p className="text-xs text-gray-400">Toujours activé</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked disabled className="sr-only peer" />
              <div className="w-9 h-5 bg-[var(--card-border)] rounded-full peer peer-checked:bg-violet peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center"><Globe className="w-5 h-5 text-green" /></div>
            <div><h2 className="font-display font-semibold text-lg">Langue</h2><p className="text-xs text-gray-400">Langue de l&apos;interface</p></div>
          </div>
          <select className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light">
            <option>Français</option>
            <option>English</option>
          </select>
        </section>

        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-violet text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-violet/90 transition-all disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer les modifications</>}
        </button>
      </div>
    </div>
  );
}
