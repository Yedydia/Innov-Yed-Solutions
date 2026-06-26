import { Metadata } from "next";
import LessonContent from "./LessonContent";
export const metadata: Metadata = { title: "Cours | Académie Innov'Yed" };
export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) { return <LessonContent params={params} />; }
