"use client";

import { useState } from "react";
import Link from "next/link";
import PortalPageHeader from "@/components/PortalPageHeader";
import {
  HelpCircle, Search, ChevronDown, ChevronRight,
  MessageSquare, Mail, Phone, Clock,
  BookOpen, Ticket, FileText, FolderKanban,
  Shield, CreditCard, Settings, Lightbulb,
} from "lucide-react";

const faqCategories = [
  {
    title: "Général",
    icon: HelpCircle,
    questions: [
      {
        q: "Comment créer un compte ?",
        a: "Rendez-vous sur la page d'inscription depuis notre site. Remplissez vos informations personnelles (nom, email, mot de passe). Un email de confirmation vous sera envoyé pour activer votre compte.",
      },
      {
        q: "Comment modifier mes informations personnelles ?",
        a: "Connectez-vous à votre espace client, allez dans 'Paramètres' depuis le menu latéral. Vous pourrez y modifier votre nom, email, téléphone et photo de profil.",
      },
      {
        q: "Comment réinitialiser mon mot de passe ?",
        a: "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Entrez votre adresse email et suivez les instructions envoyées par email pour définir un nouveau mot de passe.",
      },
    ],
  },
  {
    title: "Projets",
    icon: FolderKanban,
    questions: [
      {
        q: "Comment suivre l'avancement de mon projet ?",
        a: "Dans votre espace client, cliquez sur 'Mes Projets'. Chaque projet affiche son statut en temps réel (En cours, En revue, Terminé). Vous pouvez aussi consulter les livrables et documents associés.",
      },
      {
        q: "Comment communiquer avec l'équipe sur un projet ?",
        a: "Ouvrez le projet concerné et utilisez la section Commentaires. Vous pouvez y déposer des fichiers, poser des questions et recevoir des notifications à chaque réponse.",
      },
      {
        q: "Que faire si mon projet est en retard ?",
        a: "Contactez directement votre chef de projet via les tickets support ou par email. Nous nous engageons à vous informer de tout retard et à proposer un plan de rattrapage.",
      },
    ],
  },
  {
    title: "Tickets Support",
    icon: Ticket,
    questions: [
      {
        q: "Comment créer un ticket ?",
        a: "Dans votre espace client, allez dans 'Tickets Support' puis cliquez sur 'Nouveau Ticket'. Choisissez la catégorie, décrivez votre problème en détail et joignez des captures d'écran si nécessaire.",
      },
      {
        q: "Quels sont les délais de réponse ?",
        a: "Nous garantissons une première réponse sous 24h pour les tickets urgents, 48h pour les tickets normaux. Nos horaires d'ouverture sont du lundi au vendredi, de 8h à 18h.",
      },
      {
        q: "Comment modifier ou fermer un ticket ?",
        a: "Vous pouvez ajouter un commentaire à tout moment. Pour fermer un ticket, cliquez sur 'Résoudre' une fois que votre problème est traité. Vous pouvez le rouvrir si besoin.",
      },
    ],
  },
  {
    title: "Facturation",
    icon: CreditCard,
    questions: [
      {
        q: "Où trouver mes factures ?",
        a: "Allez dans 'Factures' depuis votre espace client. Toutes vos factures sont classées par date avec leur statut (Payée, En attente, En retard). Vous pouvez les télécharger en PDF.",
      },
      {
        q: "Comment régler une facture ?",
        a: "Cliquez sur la facture concernée puis sur 'Payer'. Nous acceptons les virements bancaires, Mobile Money (Moov, MTN) et les paiements par carte. Un reçu vous sera envoyé par email.",
      },
      {
        q: "Demander un devis pour un nouveau projet ?",
        a: "Utilisez le bouton 'Demander un devis' en haut à droite de la page d'accueil ou rendez-vous sur /devis. Décrivez votre projet et recevez un devis détaillé sous 48h.",
      },
    ],
  },
  {
    title: "Sécurité & Confidentialité",
    icon: Shield,
    questions: [
      {
        q: "Comment sécuriser mon compte ?",
        a: "Utilisez un mot de passe fort (min 8 caractères, majuscules, chiffres, symboles). Activez l'authentification à deux facteurs depuis les Paramètres si disponible.",
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Oui. Nous utilisons un chiffrement SSL/TLS pour toutes les données sensibles. Vos données ne sont jamais partagées avec des tiers sans votre consentement explicite.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Contactez-nous par email à innovyedsolutions@gmail.com ou via un ticket support. La suppression de votre compte sera effectuée sous 30 jours avec conservation des données légales.",
      },
    ],
  },
];

const contactMethods = [
  { icon: Mail, label: "Email", value: "innovyedsolutions@gmail.com", desc: "Réponse sous 24h", color: "cyan" },
  { icon: Phone, label: "Téléphone", value: "+229 01 92 72 83 64", desc: "Lun-Ven 8h-18h", color: "violet" },
  { icon: MessageSquare, label: "Ticket", value: "Espace client → Tickets", desc: "Suivi en temps réel", color: "amber" },
];

const guides = [
  { icon: BookOpen, title: "Premiers pas", desc: "Découvrez comment utiliser votre espace client et ses fonctionnalités principales.", href: "#", color: "cyan" },
  { icon: Settings, title: "Gestion de projet", desc: "Apprenez à suivre l'avancement de vos projets et à communiquer avec l'équipe.", href: "#", color: "violet" },
  { icon: FileText, title: "Facturation", desc: "Comprenez vos factures, moyens de paiement et délais de réglement.", href: "#", color: "amber" },
  { icon: Lightbulb, title: "Conseils & Astuces", desc: "Optimisez votre utilisation de l'espace client avec nos conseils pratiques.", href: "#", color: "green" },
];

export default function AidePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div>
      <PortalPageHeader title="Centre d'Aide" subtitle="Trouvez rapidement les réponses à vos questions" image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80" />

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans la FAQ..."
            className="w-full pl-12 pr-4 py-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan/50 transition-colors"
          />
        </div>
      </div>

      {/* Guides */}
      <div className="mb-16">
        <h2 className="font-display text-xl font-bold text-white mb-6">Guides rapides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((g) => (
            <Link key={g.title} href={g.href} className="glass rounded-2xl p-5 hover:border-white/10 transition-all group">
              <div className={`w-10 h-10 rounded-xl bg-${g.color}/10 flex items-center justify-center mb-3`}>
                <g.icon className={`w-5 h-5 text-${g.color}`} />
              </div>
              <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-cyan transition-colors">{g.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-xl font-bold text-white mb-6">Questions fréquentes</h2>
        <div className="space-y-4">
          {filteredCategories.map((cat) => (
            <div key={cat.title} className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--card-border)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <cat.icon className="w-4 h-4 text-cyan" />
                </div>
                <h3 className="font-semibold text-sm text-white">{cat.title}</h3>
              </div>
              {cat.questions.map((item) => {
                const key = `${cat.title}-${item.q}`;
                const isOpen = openFaq === key;
                return (
                  <div key={key} className="border-b border-[var(--card-border)] last:border-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-sm text-gray-300 pr-4">{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aucun résultat pour votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-16">
        <h2 className="font-display text-xl font-bold text-white mb-6">Besoin d&apos;aide ?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {contactMethods.map((c) => (
            <div key={c.label} className="glass rounded-2xl p-6 text-center">
              <div className={`w-12 h-12 rounded-xl bg-${c.color}/10 flex items-center justify-center mx-auto mb-4`}>
                <c.icon className={`w-6 h-6 text-${c.color}`} />
              </div>
              <h3 className="font-semibold text-sm text-white mb-1">{c.label}</h3>
              <p className="text-sm text-cyan font-medium mb-1">{c.value}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass rounded-2xl p-8 text-center">
        <h3 className="font-display text-lg font-bold text-white mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
        <p className="text-sm text-gray-400 mb-6">Notre équipe support est disponible pour vous aider personnellement.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/portail/tickets" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan/20 transition-all">
            Créer un ticket
          </Link>
          <Link href="/contact" className="px-6 py-3 rounded-xl border border-white/10 text-white/70 font-medium text-sm hover:bg-white/[0.04] transition-all">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
