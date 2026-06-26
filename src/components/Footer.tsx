"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AuthActionLink from "@/components/AuthActionLink";

import { Zap, Globe, MessageCircle, Code2, Play, Heart, Send, Mail, Phone, MapPin } from "lucide-react";

interface Service {
  slug: string;
  shortTitle: string;
  color: string;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [footerServices, setFooterServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => setFooterServices(Array.isArray(data) ? data : []))
      .catch(() => setFooterServices([]));
  }, []);

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* CTA Banner */}
        <div className="py-16 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à transformer votre vision en réalité ?</h2>
            <p className="text-white/60 mb-8">Rejoignez les 89+ entreprises qui font confiance à Innov&apos;Yed Solutions pour leur transformation numérique.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthActionLink href="/devis" className="px-8 py-3.5 font-semibold rounded-xl bg-gradient-to-r from-cyan to-violet text-white hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95 text-center">
                Démarrer un Projet
              </AuthActionLink>
              <Link href="/contact" className="px-8 py-3.5 font-semibold rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all text-center">
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Innov&apos;Yed <span className="text-cyan">Solutions</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              L&apos;intelligence au cœur de l&apos;avenir numérique. 10 domaines d&apos;excellence pour transformer votre ambition en succès technologique.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Code2, Play, Heart].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-5">Services</h3>
            <ul className="space-y-3">
              {footerServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-white/60 hover:text-cyan transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100" style={{ backgroundColor: s.color }} />
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-5">Ressources</h3>
            <ul className="space-y-3">
              {[
                { href: "/blog", label: "Blog Technologique" },
                { href: "/academie", label: "Académie" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/boutique", label: "Boutique" },
                { href: "/a-propos", label: "À Propos" },
                { href: "/equipe", label: "Notre Équipe" },
                { href: "/mentions-legales", label: "Mentions Légales" },
                { href: "/confidentialite", label: "Politique RGPD" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-cyan transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-5">Contact</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-cyan flex-shrink-0" />
                Cotonou, Bénin
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-cyan flex-shrink-0" />
                <a href="mailto:innovyedsolutions@gmail.com" className="hover:text-cyan transition-colors">innovyedsolutions@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-cyan flex-shrink-0" />
                <a href="tel:+2290192728364" className="hover:text-cyan transition-colors">+229 01 92 72 83 64</a>
              </li>
            </ul>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-3">Newsletter</h3>
            <form className="flex gap-2" onSubmit={async (e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).querySelector("input[type=email]") as HTMLInputElement;
              if (!input?.value) return;
              setNewsletterStatus("loading");
              try {
                const res = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: input.value }),
                });
                if (res.ok) {
                  setNewsletterStatus("success");
                  input.value = "";
                  setTimeout(() => setNewsletterStatus("idle"), 3000);
                } else {
                  setNewsletterStatus("error");
                  setTimeout(() => setNewsletterStatus("idle"), 3000);
                }
              } catch {
                setNewsletterStatus("error");
                setTimeout(() => setNewsletterStatus("idle"), 3000);
              }
            }}>
              <input type="email" placeholder={newsletterStatus === "success" ? "Inscrit !" : "Votre email"} className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-cyan transition-colors" />
              <button type="submit" disabled={newsletterStatus === "loading"} className="px-4 py-2.5 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan/30 transition-all disabled:opacity-50">
                {newsletterStatus === "loading" ? <span className="w-4 h-4 block animate-spin rounded-full border-2 border-cyan border-t-transparent" /> : <Send className="w-4 h-4" />}
              </button>
              {newsletterStatus === "success" && <p className="text-green text-xs mt-1">Inscrit avec succès !</p>}
              {newsletterStatus === "error" && <p className="text-red text-xs mt-1">Erreur d&apos;inscription.</p>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">© {year} Innov&apos;Yed Solutions. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => { window.localStorage.removeItem("innovyed-cookies"); window.localStorage.removeItem("innovyed-cookies-never"); window.dispatchEvent(new CustomEvent("innovyed-show-cookies")); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-xs text-white/40 hover:text-cyan transition-colors">
              Paramètres des cookies
            </button>
            <Link href="/mentions-legales" className="text-xs text-white/40 hover:text-cyan transition-colors">Mentions Légales</Link>
            <Link href="/confidentialite" className="text-xs text-white/40 hover:text-cyan transition-colors">Confidentialité</Link>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
              Tous les services opérationnels
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
