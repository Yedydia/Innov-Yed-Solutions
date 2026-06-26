import { Metadata } from "next";
import ServiceDetailContent from "./ServiceDetailContent";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/services/${slug}`);
    if (!res.ok) return { title: "Service non trouvé" };
    const service = await res.json();
    return { title: service.title, description: service.description };
  } catch { return { title: "Service non trouvé" }; }
}
export default function ServiceDetailPage() { return <ServiceDetailContent />; }
