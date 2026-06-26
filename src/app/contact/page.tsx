import { Metadata } from "next";
import ContactContent from "./ContactContent";
export const metadata: Metadata = { title: "Contactez-Nous", description: "Contactez Innov'Yed Solutions pour vos projets web, design, sécurité ou formation. Réponse sous 24h." };
export default function ContactPage() { return <ContactContent />; }
