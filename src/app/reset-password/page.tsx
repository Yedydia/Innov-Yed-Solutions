"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Shield, Loader2 } from "lucide-react";

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = use(searchParams);
  const token = params.token || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError("");
    if (!password || password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur"); setLoading(false); return; }
      setSuccess(true);
    } catch { setError("Erreur réseau."); }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red/20 flex items-center justify-center mx-auto mb-6"><Shield className="w-8 h-8 text-red" /></div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Lien invalide</h1>
          <p className="text-gray-400 text-sm mb-6">Ce lien de réinitialisation n&apos;est pas valide. Veuillez demander un nouveau lien.</p>
          <Link href="/portail/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-cyan/20 border border-cyan/30 hover:bg-cyan/30 transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green" /></div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Mot de passe réinitialisé !</h1>
          <p className="text-gray-400 text-sm mb-6">Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.</p>
          <Link href="/portail/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan/20" style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}>
            Se connecter <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-400 text-sm">Choisissez un mot de passe sécurisé pour votre compte.</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ caractères" className="w-full pl-10 pr-10 py-3 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input type={showPass ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmez" className="w-full pl-10 pr-4 py-3 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-cyan/40 transition-all placeholder:text-gray-600" />
            </div>
          </div>
          <button onClick={handleReset} disabled={loading || !password || !confirm} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/portail/auth" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
