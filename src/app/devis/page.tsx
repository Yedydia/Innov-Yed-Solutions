import type { Metadata } from "next";
import DevisContent from "./DevisContent";

export const metadata: Metadata = {
  title: "Demander un devis gratuit",
  description: "Obtenez un devis personnalisé pour votre projet informatique. Innov'Yed Solutions vous accompagne dans la réalisation de vos projets numériques au Bénin et en Afrique.",
  openGraph: {
    title: "Demander un devis gratuit — Innov'Yed Solutions",
    description: "Obtenez un devis personnalisé pour votre projet informatique.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function DevisPage() {
  return <DevisContent />;
}
