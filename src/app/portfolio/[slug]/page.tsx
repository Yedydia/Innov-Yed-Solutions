import { Metadata } from "next";
import ProjectContent from "./ProjectContent";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/projects/${slug}`);
    if (!res.ok) return { title: "Projet non trouvé" };
    const project = await res.json();
    return { title: project.title, description: project.description };
  } catch { return { title: "Projet non trouvé" }; }
}
export default function ProjectDetailPage() { return <ProjectContent />; }
