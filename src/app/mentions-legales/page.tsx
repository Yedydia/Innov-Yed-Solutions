import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales d'Innov'Yed Solutions — informations juridiques et conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-cyan" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-gray-400">Dernière mise à jour : Juin 2025</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-10 text-sm leading-relaxed text-gray-300">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">1. Édition du Site</h2>
            <p className="mb-2">Le site web Innov&apos;Yed Solutions est édité par :</p>
            <ul className="space-y-1 ml-4">
              <li><strong>Raison sociale :</strong> Innov&apos;Yed Solutions</li>
              <li><strong>Siège social :</strong> Cotonou, Bénin</li>
              <li><strong>Email :</strong> innovyedsolutions@gmail.com</li>
              <li><strong>Téléphone :</strong> +229 01 92 72 83 64</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">2. Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">3. Propriété Intellectuelle</h2>
            <p>Tous les contenus présents sur ce site (textes, images, logos, vidéos) sont la propriété exclusive d&apos;Innov&apos;Yed Solutions, sauf mention contraire. Toute reproduction, distribution ou modification sans autorisation écrite préalable est interdite.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">4. Responsabilité</h2>
            <p>Innov&apos;Yed Solutions s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées sur ce site. Nous ne saurions être tenus responsables des erreurs, omissions ou dommages résultant de l&apos;utilisation du site.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">5. Données Personnelles</h2>
            <p>Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour l&apos;exercer, contactez-nous à innovyedsolutions@gmail.com.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">6. Cookies</h2>
            <p>Ce site utilise des cookies strictement nécessaires à son fonctionnement. Les cookies analytics sont optionnels et soumis à votre consentement via notre bannière de gestion des cookies.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">7. Contact</h2>
            <p>Pour toute question relative aux mentions légales, vous pouvez nous contacter à : innovyedsolutions@gmail.com ou au +229 01 92 72 83 64.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
