"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  MapPin, Phone, Mail, Clock, Send, MessageCircle,
  CheckCircle, Calendar, ArrowRight, MessageSquare,
} from "lucide-react";

const defaultContactMethods = [
  { icon: Phone, label: "Téléphone", value: "+229 01 92 72 83 64", desc: "Lun-Ven 8h-18h", action: "tel:+22901927283" },
  { icon: Mail, label: "Email", value: "innoyedsolutions@gmail.com", desc: "Réponse sous 24h", action: "mailto:innoyedsolutions@gmail.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "+229 92 72 83 64", desc: "Réponse immédiate", action: "https://wa.me/22992728364" },
  { icon: MapPin, label: "Adresse", value: "Cotonou, Bénin", desc: "Quartier Godomey", action: "#" },
];

const defaultFaqItems = [
  { q: "Quel est le délai pour obtenir un devis ?", a: "Nous envoyons un devis détaillé sous 24 à 48h ouvrées après réception de votre demande." },
  { q: "Proposez-vous des consultations gratuites ?", a: "Oui, la première consultation d'analyse de vos besoins est entièrement gratuite et sans engagement." },
  { q: "Comment se déroule un projet type ?", a: "Analyse → Conception → Développement → Tests → Livraison. Chaque phase est validée avec vous avant de passer à la suivante." },
  { q: "Intervenez-vous en dehors de Cotonou ?", a: "Oui, nous intervenons dans tout le Bénin et proposons des services à distance pour l'Afrique de l'Ouest." },
];

export default function ContactPage() {
  const [contactMethods, setContactMethods] = useState(defaultContactMethods);
  const [faqItems, setFaqItems] = useState(defaultFaqItems);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        setContactMethods([
          { icon: Phone, label: "Téléphone", value: data.phone || defaultContactMethods[0].value, desc: "Lun-Ven 8h-18h", action: `tel:${data.phone?.replace(/\s/g, "") || defaultContactMethods[0].action.slice(4)}` },
          { icon: Mail, label: "Email", value: data.email || defaultContactMethods[1].value, desc: "Réponse sous 24h", action: `mailto:${data.email || defaultContactMethods[1].action.slice(7)}` },
          { icon: MessageCircle, label: "WhatsApp", value: data.whatsapp || defaultContactMethods[2].value, desc: "Réponse immédiate", action: `https://wa.me/${data.whatsapp?.replace(/\D/g, "") || "22992728364"}` },
          { icon: MapPin, label: "Adresse", value: data.address || defaultContactMethods[3].value, desc: "Quartier Godomey", action: "#" },
        ]);
      })
      .catch(() => {});

    fetch("/api/site-content?type=faqs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqItems(data.map((item: { question: string; answer: string }) => ({ q: item.question, a: item.answer })));
        }
      })
      .catch(() => {});
  }, []);
  const { user, token } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) errs.email = "Format d'email invalide";
    if (form.message.trim().length < 10) errs.message = "Le message doit contenir au moins 10 caractères";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setShowAuth(true); return; }
    if (!validate()) { setSending(false); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, name: form.name || user?.name, email: form.email || user?.email }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} title="Connectez-vous pour envoyer un message" />
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=2400&q=100" alt="Contact" fill className="object-cover" priority sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, #06B6D433, #06B6D466)` }}>
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: "#06B6D4" }}>CONTACT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Parlons de votre <span className="gradient-text">Projet</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            Une question, un projet, une collaboration ? Notre équipe est à votre écoute. Choisissez le canal qui vous convient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://wa.me/22992728364" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl text-white font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2" style={{ background: `linear-gradient(135deg, #06B6D4, #06B6D4CC)` }}>
              WhatsApp <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.action}
              className="glass rounded-2xl p-6 text-center hover:border-cyan/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan/20 transition-colors">
                <method.icon className="w-6 h-6 text-cyan" />
              </div>
              <p className="font-semibold text-sm">{method.label}</p>
              <p className="text-cyan text-sm mt-1">{method.value}</p>
              <p className="text-xs text-gray-400 mt-1">{method.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            {sent ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Message Envoyé !</h3>
                <p className="text-gray-400 text-sm">Merci pour votre message. Notre équipe vous répondra dans les 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Nom complet *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      title="Veuillez remplir ce champ"
                      onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }}
                      onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                      placeholder="votre@email.com"
                      title="Veuillez remplir ce champ"
                      onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }}
                      onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                    {errors.email && <p className="text-red text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Téléphone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+229 XX XX XX XX"
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Sujet *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      title="Veuillez remplir ce champ"
                      onInvalid={(e) => { e.preventDefault(); (e.target as HTMLSelectElement).setCustomValidity("Veuillez remplir ce champ"); }}
                      onInput={(e) => { (e.target as HTMLSelectElement).setCustomValidity(""); }}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="devis">Demande de devis</option>
                      <option value="support">Support technique</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="formation">Formation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                    placeholder="Décrivez votre projet ou votre question..."
                    title="Veuillez remplir ce champ"
                    onInvalid={(e) => { e.preventDefault(); (e.target as HTMLTextAreaElement).setCustomValidity("Veuillez remplir ce champ"); }}
                    onInput={(e) => { (e.target as HTMLTextAreaElement).setCustomValidity(""); }}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan resize-none"
                  />
                  {errors.message && <p className="text-red text-xs mt-1">{errors.message}</p>}
                </div>
                {error && <p className="text-red text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-cyan text-navy px-8 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {sending ? "Envoi..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="glass rounded-2xl overflow-hidden aspect-[4/3]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.33%2C6.34%2C2.39%2C6.38&layer=mapnik&marker=6.36%2C2.36"
                className="w-full h-full border-0"
                title="Carte Cotonou"
                loading="lazy"
              />
            </div>

            {/* Horaires */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan" /> Horaires d&apos;ouverture
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Lundi - Vendredi", "08:00 - 18:00"],
                  ["Samedi", "09:00 - 13:00"],
                  ["Dimanche", "Fermé"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                    <span className="text-gray-400">{day}</span>
                    <span className={`font-medium ${hours === "Fermé" ? "text-red" : ""}`}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RDV */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-cyan/5 to-violet/5">
              <Calendar className="w-8 h-8 text-cyan mb-3" />
              <h3 className="font-display font-semibold mb-2">Prendre Rendez-vous</h3>
              <p className="text-sm text-gray-400 mb-4">Réservez un créneau de 30 min pour discuter de votre projet avec un expert.</p>
              <button className="flex items-center gap-2 bg-cyan text-navy px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-cyan/90 transition-colors">
                Réserver <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="font-display text-2xl font-bold mb-8 text-center">Questions Fréquentes</h2>
        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div key={idx} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-sm pr-4">{item.q}</span>
                <ArrowRight className={`w-4 h-4 text-cyan shrink-0 transition-transform ${openFaq === idx ? "rotate-90" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-400">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
