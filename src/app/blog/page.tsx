import { Metadata } from "next";
import BlogContent from "./BlogContent";
export const metadata: Metadata = { title: "Blog Technologique", description: "Articles, tutoriels et actualités sur le développement web, l'IA, la cybersécurité et les technologies émergentes." };
export default function BlogPage() { return <BlogContent />; }
