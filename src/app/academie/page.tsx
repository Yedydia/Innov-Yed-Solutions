import { Metadata } from "next";
import AcademieContent from "./AcademieContent";
export const metadata: Metadata = { title: "Académie Innov'Yed", description: "Formez-vous aux métiers du numérique avec nos formations certifiantes : développement web, cybersécurité, IA et plus." };
export default function AcademiePage() { return <AcademieContent />; }
