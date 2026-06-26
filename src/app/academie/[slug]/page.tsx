import { Metadata } from "next";
import CourseContent from "./CourseContent";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/courses/${slug}`);
    if (!res.ok) return { title: "Formation non trouvée" };
    const course = await res.json();
    return { title: course.title, description: course.description };
  } catch { return { title: "Formation non trouvée" }; }
}
export default function CourseDetailPage() { return <CourseContent />; }
