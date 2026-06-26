import type { Metadata } from "next";
import CheckoutContent from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Panier & Paiement",
  description: "Finalisez votre commande sur la boutique Innov'Yed Solutions. Paiement sécurisé et livraison rapide.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
