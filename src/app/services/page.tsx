import { Metadata } from "next";
import ServicesContent from "./ServicesContent";
export const metadata: Metadata = { title: "Nos Services", description: "Découvrez nos 10 domaines d'excellence : développement web, intelligence artificielle, cybersécurité, design et plus encore." };
export default function ServicesPage() { return <ServicesContent />; }
