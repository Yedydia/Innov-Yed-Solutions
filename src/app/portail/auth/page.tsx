"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { setAuthToken } from "@/lib/auth-helpers";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone,
  Building2, Shield, CheckCircle, ArrowLeft, Sparkles,
  Briefcase, TrendingUp, Users, Globe, Ticket, FileText,
  GraduationCap,
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [passError, setPassError] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  const [btnPos, setBtnPos] = useState({ x: 50, y: 50 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setBtnPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const passwordReq = [
    { label: "Au moins 8 caractères", check: (p: string) => p.length >= 8 },
    { label: "Une majuscule et une minuscule", check: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
    { label: "Un chiffre et un caractère spécial", check: (p: string) => /\d/.test(p) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ];

  const features = [
    { icon: Briefcase, text: "Suivi de projets en temps réel", desc: "Visualisez l'avancement de chaque mission" },
    { icon: Ticket, text: "Système de tickets prioritaire", desc: "Support technique réactif et organisé" },
    { icon: FileText, text: "Historique des factures", desc: "Téléchargez et gérez vos paiements" },
    { icon: GraduationCap, text: "Accès aux formations", desc: "Continuez votre apprentissage à tout moment" },
  ];

  return (
    <div className="min-h-screen bg-navy flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/3 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-cyan/30 blur-[1px]" />
        <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-blue-400/20 blur-sm" />
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-cyan/20 blur-[1px]" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/80 via-[#0B1120]/60 to-[#0B1120]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/70 via-transparent to-[#0B1120]/40" />

        <div className="relative z-10 w-full flex flex-col justify-center px-12 py-10 gap-10">
          {/* Header */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-3 leading-tight">
              Espace<br />
              <span className="bg-gradient-to-r from-cyan to-blue-400 bg-clip-text text-transparent">Client</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Accédez à tous vos services Innov&apos;Yed Solutions depuis un tableau de bord centralisé, sécurisé et intuitif.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.text} className="group rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] p-4 hover:bg-white/[0.1] hover:border-cyan/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center mb-3 group-hover:bg-cyan/25 transition-all duration-300">
                  <f.icon className="w-5 h-5 text-cyan" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{f.text}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "127+", label: "Clients", icon: Users },
              { value: "89%", label: "Satisfaction", icon: TrendingUp },
              { value: "7/7", label: "Support", icon: Globe },
            ].map((s) => (
              <div key={s.label} className="text-center rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] p-4">
                <div className="w-8 h-8 rounded-lg bg-cyan/15 flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-4 h-4 text-cyan" />
                </div>
                <p className="font-display text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Nebula Design */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="nebula-card w-full max-w-[440px] relative"
          style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Holographic border glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-cyan via-violet to-blue-500 opacity-60 blur-sm" />
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-cyan via-violet to-blue-500 opacity-40" />

          {/* Card content */}
          <div className="relative rounded-3xl bg-[#0B1120]/90 backdrop-blur-xl p-8 sm:p-10 overflow-hidden">
            {/* Glare effect */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)` }}
            />

            {/* Floating dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan/30 floating-dot" style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%`, animationDelay: `${i * 0.8}s` }} />
              ))}
            </div>

            <div className="relative z-10">
              {/* Back link */}
              <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-cyan text-xs font-medium mb-8 transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Retour à l&apos;accueil
              </Link>

              {/* Title with glow */}
              <div className="mb-8">
                <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-2">
                  {mode === "login" ? (
                    <span className="inline-block">Bon retour <span className="text-glow">!</span></span>
                  ) : step === 1 ? "Créer un compte" : "Finaliser"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {mode === "login" ? "Connectez-vous à votre espace" : step === 1 ? "Rejoignez Innov'Yed" : "Dernière étape"}
                </p>
              </div>

              {/* Nebula Toggle */}
              <div className="relative flex items-center mb-8 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className={`absolute top-1 bottom-1 w-1/2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${mode === "register" ? "translate-x-full" : "translate-x-0"}`}>
                  <div className="w-full h-full rounded-xl bg-gradient-to-r from-cyan to-violet shadow-lg shadow-cyan/30" />
                </div>
                <button onClick={() => { setMode("login"); setError(""); }} className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${mode === "login" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  Connexion
                </button>
                <button onClick={() => { setMode("register"); setError(""); }} className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${mode === "register" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  Inscription
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-shake">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              {/* Login form */}
              {mode === "login" && (
                <form className="space-y-5" onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target as HTMLFormElement);
                  try {
                    const res = await fetch("/api/auth/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
                    });
                    const data = await res.json();
                    if (!res.ok) { setError(data.error || "Erreur"); return; }
                    setAuthToken(data.token);
                    window.location.href = "/portail/dashboard";
                  } catch { setError("Erreur réseau."); }
                }}>
                  <NebulaInput icon={Mail} name="email" type="email" placeholder="votre@email.com" label="Email" required />
                  <NebulaInput icon={Lock} name="password" type={showPass ? "text" : "password"} placeholder="••••••••" label="Mot de passe" required suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  } />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                      <input type="checkbox" className="accent-cyan rounded w-3.5 h-3.5" /> Se souvenir
                    </label>
                    <a href="#" className="text-xs text-cyan/60 hover:text-cyan transition-colors">Mot de passe oublié ?</a>
                  </div>
                  <button ref={btnRef} onMouseMove={handleBtnMouseMove} className="nebula-btn w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]" style={{ background: `radial-gradient(circle at ${btnPos.x}% ${btnPos.y}%, #22d3ee, #4F46E5 60%, #7C3AED)` }}>
                    Se connecter <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Register form */}
              {mode === "register" && (
                <div>
                  {registered ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center mx-auto mb-6 border border-green-400/20 animate-pulse-glow">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-white mb-2">Compte Créé !</h2>
                      <p className="text-gray-400 text-sm mb-8">Bienvenue, {form.name || "cher client"}.</p>
                      <button onClick={() => { setMode("login"); setRegistered(false); setStep(1); }} className="nebula-btn inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white" style={{ background: "radial-gradient(circle at 50% 50%, #22d3ee, #4F46E5 60%, #7C3AED)" }}>
                        Se connecter <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Step indicator */}
                      <div className="flex items-center gap-3 mb-6">
                        {[1, 2].map((s) => (
                          <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? "bg-gradient-to-br from-cyan to-violet text-white shadow-lg shadow-cyan/30" : "bg-white/[0.05] border border-white/[0.08] text-gray-600"}`}>
                              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                            </div>
                            <span className={`text-[11px] font-medium ${step === s ? "text-cyan" : "text-gray-600"}`}>
                              {s === 1 ? "Infos" : "Sécurité"}
                            </span>
                            {s === 1 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-700 ${step > 1 ? "bg-gradient-to-r from-cyan to-violet" : "bg-white/[0.06]"}`} />}
                          </div>
                        ))}
                      </div>

                      <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        setError(""); setPassError("");
                        if (step === 1) { setStep(2); return; }
                        if (form.password !== form.confirm) { setPassError("Les mots de passe ne correspondent pas."); return; }
                        try {
                          const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
                          if (res.ok) setRegistered(true);
                          else setError("Erreur lors de l'inscription.");
                        } catch { setError("Erreur réseau."); }
                      }}>
                        {step === 1 && (
                          <>
                            <NebulaInput icon={User} value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="Votre nom" label="Nom complet" required />
                            <NebulaInput icon={Mail} type="email" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} placeholder="exemple@entreprise.com" label="Email" required />
                            <div className="grid grid-cols-2 gap-3">
                              <NebulaInput icon={Phone} type="tel" value={form.phone} onChange={(v: string) => setForm({ ...form, phone: v })} placeholder="+229 XX XX XX XX" label="Téléphone" />
                              <NebulaInput icon={Building2} value={form.company} onChange={(v: string) => setForm({ ...form, company: v })} placeholder="Entreprise" label="Entreprise" />
                            </div>
                            <button ref={btnRef} onMouseMove={handleBtnMouseMove} className="nebula-btn w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98]" style={{ background: `radial-gradient(circle at ${btnPos.x}% ${btnPos.y}%, #22d3ee, #4F46E5 60%, #7C3AED)` }}>
                              Suivant <ArrowRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {step === 2 && (
                          <>
                            <NebulaInput icon={Lock} type="password" placeholder="8+ caractères" value={form.password} onChange={(v: string) => setForm({ ...form, password: v })} label="Mot de passe" required />
                            <NebulaInput icon={Lock} type="password" placeholder="Confirmez" value={form.confirm} onChange={(v: string) => setForm({ ...form, confirm: v })} label="Confirmer" required />
                            {passError && <p className="text-red-400 text-xs flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400" />{passError}</p>}

                            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
                              <p className="text-xs font-semibold text-gray-300 mb-2.5">Exigences :</p>
                              <div className="space-y-1.5">
                                {passwordReq.map((req) => {
                                  const met = req.check(form.password);
                                  return (
                                    <div key={req.label} className={`flex items-center gap-2 text-[11px] ${met ? "text-green-400" : "text-gray-500"}`}>
                                      <span className={`text-xs font-bold ${met ? "text-green-400" : "text-gray-600"}`}>{met ? "\u2713" : "\u2717"}</span>
                                      {req.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                              <input type="checkbox" className="accent-cyan mt-0.5 rounded w-3.5 h-3.5" />
                              <span>J&apos;accepte les <a href="#" className="text-cyan/60 hover:text-cyan">conditions</a></span>
                            </label>

                            <div className="flex gap-3 pt-1">
                              <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.08] transition-all active:scale-[0.98]">
                                Retour
                              </button>
                              <button ref={btnRef} onMouseMove={handleBtnMouseMove} className="flex-1 nebula-btn py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98]" style={{ background: `radial-gradient(circle at ${btnPos.x}% ${btnPos.y}%, #22d3ee, #4F46E5 60%, #7C3AED)` }}>
                                Créer <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Security note */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-600">
                <Shield className="w-3 h-3" />
                Sécurisé & crypté
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NebulaInput({ icon: Icon, type = "text", name, value, onChange, placeholder, label, required, suffix }: {
  icon: any; type?: string; name?: string; value?: string; onChange?: (v: string) => void; placeholder: string; label: string; required?: boolean; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="group relative">
      <label className="text-[11px] text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focused ? "text-cyan" : "text-gray-600"}`} />
        <input
          name={name} type={type} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} placeholder={placeholder} required={required}
          title={`Veuillez remplir ce champ`}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }}
          onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }}
          className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-white outline-none placeholder:text-gray-600 transition-all"
        />
        {suffix && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      <div className={`h-[2px] rounded-full transition-all duration-500 ${focused ? "bg-gradient-to-r from-cyan via-violet to-blue-500 shadow-lg shadow-cyan/30" : "bg-white/[0.06]"}`} />
    </div>
  );
}
