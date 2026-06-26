"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  ArrowRight, ArrowLeft, Check, Code2, Shield, Brain, Cpu,
  Palette, GraduationCap, Gamepad2, Wrench, Sigma,
  Send, Clock, DollarSign, FileText, User,
  Mail, Phone, Building2, ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Shield, Brain, Cpu, Palette, GraduationCap, Gamepad2, Wrench, Sigma,
};

const defaultServiceOptions = [
  { id: "dev", icon: "Code2", label: "Développement", desc: "Web, mobile, logiciel" },
  { id: "maint", icon: "Wrench", label: "Maintenance", desc: "Support & réparation" },
  { id: "reseau", icon: "Shield", label: "Réseaux & Sécurité", desc: "Infra & cyber" },
  { id: "auto", icon: "Cpu", label: "Systèmes Automatisés", desc: "Domotique, IoT" },
  { id: "data", icon: "Brain", label: "Data & IA", desc: "ML, NLP, analytics" },
  { id: "design", icon: "Palette", label: "Graphisme", desc: "Branding, print" },
  { id: "bureau", icon: "GraduationCap", label: "Bureautique", desc: "Formation, docs" },
  { id: "theorie", icon: "Sigma", label: "Informatique Théorique", desc: "Crypto, algo" },
  { id: "gaming", icon: "Gamepad2", label: "Gaming", desc: "Jeux, VR/AR" },
];

const defaultBudgetRanges = [
  { label: "< 500 000 FCFA", value: "small" },
  { label: "500 000 — 2 000 000 FCFA", value: "medium" },
  { label: "2 000 000 — 5 000 000 FCFA", value: "large" },
  { label: "5 000 000 — 10 000 000 FCFA", value: "xlarge" },
  { label: "> 10 000 000 FCFA", value: "enterprise" },
];

const defaultTimelines = [
  { label: "Urgent (< 1 mois)", value: "urgent" },
  { label: "1-3 mois", value: "normal" },
  { label: "3-6 mois", value: "relaxed" },
  { label: "6+ mois", value: "long" },
  { label: "Pas de deadline", value: "flexible" },
];

const defaultFeatureOptions = ["Site web responsive", "Application mobile", "Paiement en ligne", "Dashboard admin", "API externe", "Multilingue", "Analytics", "Chat en direct", "Authentification avancée", "Intégration IA"];

export default function DevisPage() {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", role: "" });
  const [showAuth, setShowAuth] = useState(false);

  const [serviceOptions, setServiceOptions] = useState(defaultServiceOptions);
  const [budgetRanges, setBudgetRanges] = useState(defaultBudgetRanges);
  const [timelines, setTimelines] = useState(defaultTimelines);
  const [featureOptions, setFeatureOptions] = useState(defaultFeatureOptions);

  useEffect(() => {
    fetch("/api/site-content?type=devisServices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServiceOptions(data.map((s: { name: string; icon: string }) => ({ id: s.name.toLowerCase().replace(/\s+/g, ""), icon: s.icon, label: s.name, desc: "" })));
        }
      })
      .catch(() => {});

    fetch("/api/site-content?type=devisBudgets")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBudgetRanges(data.map((b: { label: string; value: string }) => ({ label: b.label, value: b.value })));
        }
      })
      .catch(() => {});

    fetch("/api/site-content?type=devisTimelines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTimelines(data.map((t: { label: string; value: string }) => ({ label: t.label, value: t.value })));
        }
      })
      .catch(() => {});
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const addCustomFeature = () => {
    if (customFeature.trim()) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const score = Math.min(100, selectedServices.length * 15 + (budget ? 15 : 0) + (timeline ? 10 : 0) + (description.length > 50 ? 15 : 0) + features.length * 3);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Demande Envoyée !</h1>
          <p className="text-gray-400 mb-6">Votre demande de devis a bien été enregistrée. Notre équipe commerciale vous contactera sous 24h avec une proposition détaillée.</p>
          <div className="glass rounded-xl p-6 text-left mb-6">
            <h3 className="font-semibold mb-3">Récapitulatif :</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Services : {selectedServices.map((s) => serviceOptions.find((o) => o.id === s)?.label).join(", ")}</p>
              <p>Budget : {budgetRanges.find((b) => b.value === budget)?.label}</p>
              <p>Délai : {timelines.find((t) => t.value === timeline)?.label}</p>
              <p>Fonctionnalités : {features.length} sélectionnée(s)</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Référence : {refNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} title="Connectez-vous pour demander un devis" />
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=100" alt="Devis" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Demandez votre <span className="gradient-text">Devis Gratuit</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Décrivez votre projet en quelques étapes et recevez une proposition personnalisée sous 24h.</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-cyan">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--foreground)]">Devis</span>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {["Services", "Détails", "Contact"].map((label, idx) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > idx + 1 ? "bg-green text-white" : step === idx + 1 ? "bg-cyan text-navy" : "bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-400"
              }`}>
                {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === idx + 1 ? "text-cyan" : "text-gray-400"}`}>{label}</span>
              {idx < 2 && <div className={`flex-1 h-0.5 mx-4 ${step > idx + 1 ? "bg-green" : "bg-[var(--card-border)]"}`} />}
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="glass rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--card-border)" strokeWidth="4" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="url(#scoreGrad)" strokeWidth="4" strokeDasharray={`${score * 1.5} 151`} strokeLinecap="round" />
              <defs><linearGradient id="scoreGrad"><stop stopColor="#4F46E5" /><stop offset="1" stopColor="#14B8A6" /></linearGradient></defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{score}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Complétude du formulaire</p>
            <p className="text-xs text-gray-400">Plus vous donnez de détails, plus le devis sera précis</p>
          </div>
        </div>

        {/* Step 1: Services */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">Quels services vous intéressent ?</h2>
            <p className="text-gray-400 text-sm mb-6">Sélectionnez un ou plusieurs domaines</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {serviceOptions.map((svc) => {
                const IconComp = iconMap[svc.icon] || Code2;
                return (
                  <button
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className={`glass rounded-xl p-5 text-left transition-all hover:border-cyan/30 ${
                      selectedServices.includes(svc.id) ? "border-cyan bg-cyan/5" : ""
                    }`}
                  >
                    <IconComp className={`w-8 h-8 mb-3 ${selectedServices.includes(svc.id) ? "text-cyan" : "text-gray-400"}`} />
                    <p className="font-semibold text-sm">{svc.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{svc.desc}</p>
                    {selectedServices.includes(svc.id) && <Check className="absolute top-3 right-3 w-5 h-5 text-cyan" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">Détails du projet</h2>
            <p className="text-gray-400 text-sm mb-6">Plus de détails = devis plus précis</p>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Description du projet</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez votre projet, vos objectifs, vos contraintes..."
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{description.length} caractères {description.length < 50 && "(minimum 50 recommandés)"}</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block">Fonctionnalités souhaitées</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {featureOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        features.includes(f) ? "bg-cyan text-navy" : "bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-400 hover:border-cyan/30"
                      }`}
                    >
                      {features.includes(f) && <Check className="w-3 h-3 inline mr-1" />}{f}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomFeature()}
                    placeholder="Ajouter une fonctionnalité..."
                    className="flex-1 px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                  />
                  <button onClick={addCustomFeature} className="px-4 py-2 bg-cyan text-navy rounded-xl text-sm font-semibold hover:bg-cyan/90">Ajouter</button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Budget estimé</label>
                  <div className="space-y-2">
                    {budgetRanges.map((b) => (
                      <button
                        key={b.value}
                        onClick={() => setBudget(b.value)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                          budget === b.value ? "bg-cyan text-navy font-semibold" : "bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-400 hover:border-cyan/30"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Délai souhaité</label>
                  <div className="space-y-2">
                    {timelines.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTimeline(t.value)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                          timeline === t.value ? "bg-cyan text-navy font-semibold" : "bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-400 hover:border-cyan/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">Vos Coordonnées</h2>
            <p className="text-gray-400 text-sm mb-6">Nous vous contactons sous 24h avec votre devis</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="devis-name" className="text-sm font-semibold mb-2 block">Nom complet *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input id="devis-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="devis-email" className="text-sm font-semibold mb-2 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input id="devis-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan" />
                  </div>
                </div>
                <div>
                  <label htmlFor="devis-phone" className="text-sm font-semibold mb-2 block">Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input id="devis-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+229 XX XX XX XX" required title="Veuillez remplir ce champ" onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }} onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }} className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan" />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="devis-company" className="text-sm font-semibold mb-2 block">Entreprise</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input id="devis-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Votre entreprise" className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan" />
                  </div>
                </div>
                <div>
                  <label htmlFor="devis-role" className="text-sm font-semibold mb-2 block">Fonction</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input id="devis-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Votre fonction" className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass rounded-xl p-6 mt-8">
              <h3 className="font-display font-semibold text-lg mb-4">Récapitulatif de votre demande</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Services</span>
                  <span>{selectedServices.map((s) => serviceOptions.find((o) => o.id === s)?.label).join(", ") || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget</span>
                  <span>{budgetRanges.find((b) => b.value === budget)?.label || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Délai</span>
                  <span>{timelines.find((t) => t.value === timeline)?.label || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fonctionnalités</span>
                  <span>{features.length} sélectionnée(s)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {apiError && <p className="text-red text-sm text-center mt-6">{apiError}</p>}

        {/* Nav Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-400 hover:text-cyan text-sm">
              <ArrowLeft className="w-4 h-4" /> Précédent
            </button>
          )}
          <button
          onClick={async () => {
            if (step < 3) { setStep(step + 1); return; }
            if (!token) { setShowAuth(true); return; }
            setSubmitting(true);
            setApiError("");
            try {
              const res = await fetch("/api/devis", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, services: selectedServices, budget, timeline, description, features }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error();
              setRefNumber(data.reference || "");
              setSubmitted(true);
            } catch {
              setApiError("Erreur lors de l'envoi. Veuillez réessayer.");
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={step === 1 && selectedServices.length === 0 || submitting}
            className="ml-auto flex items-center gap-2 bg-cyan text-navy px-8 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? <><Send className="w-4 h-4" /> {submitting ? "Envoi..." : "Envoyer la demande"}</> : <span>Suivant</span>} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
