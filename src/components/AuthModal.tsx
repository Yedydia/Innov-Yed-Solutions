"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { X, Mail, Lock, User, Phone, Building2, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
};

export default function AuthModal({ open, onClose, onSuccess, title }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "", confirm: "" });

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    onSuccess?.();
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (form.password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères"); return; }
    setSubmitting(true);
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined, company: form.company || undefined });
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0D1525] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold text-white">{title || (mode === "login" ? "Connexion requise" : "Créer un compte")}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login" ? "Connectez-vous pour continuer" : "Rejoignez Innov'Yed Solutions"}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-6">
          <button onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-gradient-to-r from-cyan to-blue-500 text-navy" : "text-gray-400 hover:text-white"}`}>
            Connexion
          </button>
          <button onClick={() => { setMode("register"); setError(""); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "register" ? "bg-gradient-to-r from-cyan to-blue-500 text-navy" : "text-gray-400 hover:text-white"}`}>
            Inscription
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-cyan to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? "Connexion..." : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Nom complet *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+229 XX XX XX XX" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Entreprise</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Entreprise" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPass ? "text" : "password"} required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="8 caractères minimum" className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Confirmer *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Répétez le mot de passe" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-cyan to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? "Création..." : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
