import { Metadata } from "next";
import ArticleContent from "./ArticleContent";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/blog/${slug}`);
    if (!res.ok) return { title: "Article non trouvé" };
    const article = await res.json();
    return { title: article.title, description: article.excerpt, openGraph: { title: article.title, description: article.excerpt, images: [{ url: article.image }] } };
  } catch { return { title: "Article non trouvé" }; }
}
export default function ArticlePage() { return <ArticleContent />; }
