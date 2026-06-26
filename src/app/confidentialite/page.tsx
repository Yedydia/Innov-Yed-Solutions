import type { Metadata } from "next";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité d'Innov'Yed Solutions — protection de vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-violet-light" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-gray-400">Dernière mise à jour : Juin 2025</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-10 text-sm leading-relaxed text-gray-300">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">1. Collecte des Données</h2>
            <p className="mb-2">Nous collectons les données suivantes lorsque vous utilisez notre site :</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Données d&apos;identification (nom, email, téléphone, entreprise)</li>
              <li>Données de navigation (pages visitées, durée, navigateur)</li>
              <li>Données de formulaire (messages, demandes de devis)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">2. Utilisation des Données</h2>
            <p className="mb-2">Vos données sont utilisées pour :</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Répondre à vos demandes de devis et messages</li>
              <li>Gérer votre espace client et vos projets</li>
              <li>Améliorer notre site et nos services</li>
              <li>Vous envoyer des communications liées à nos services (avec votre consentement)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">3. Partage des Données</h2>
            <p>Nous ne partageons vos données personnelles avec aucun tiers, sauf obligation légale. Les données de paiement sont traitées directement par nos partenaires de paiement sécurisés (Stripe, CinetPay).</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">4. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données : chiffrement TLS 1.3, accès restreint aux données, audits réguliers.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">5. Vos Droits</h2>
            <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">6. Cookies</h2>
            <p>Nous utilisons des cookies essentiels au fonctionnement du site. Les cookies analytics et de préférences sont optionnels et gérés via notre bannière de consentement. Vous pouvez modifier vos préférences à tout moment.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">7. Contact DPO</h2>
            <p>Pour toute question concernant vos données personnelles, contactez notre Délégué à la Protection des Données : innovyedsolutions@gmail.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
