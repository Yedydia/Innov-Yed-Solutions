import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Innov'Yed Solutions — Experts en informatique, cybersécurité, création web, maintenance et solutions numériques sur mesure. 10 domaines d'excellence pour transformer votre ambition en succès technologique.",
  openGraph: {
    title: "Innov'Yed Solutions — L'Intelligence au Cœur de l'Avenir Numérique",
    description: "10 domaines d'excellence pour transformer votre ambition en succès technologique. Cotonou, Bénin.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
