import { Metadata } from "next";
import PortfolioContent from "./PortfolioContent";
export const metadata: Metadata = { title: "Notre Portfolio", description: "Découvrez nos réalisations : sites web, applications, designs et solutions technologiques pour nos clients." };
export default function PortfolioPage() { return <PortfolioContent />; }
