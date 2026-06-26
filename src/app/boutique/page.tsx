import { Metadata } from "next";
import BoutiqueContent from "./BoutiqueContent";
export const metadata: Metadata = { title: "Boutique", description: "Services et produits numériques Innov'Yed : formations, outils, templates et solutions clés en main." };
export default function BoutiquePage() { return <BoutiqueContent />; }
