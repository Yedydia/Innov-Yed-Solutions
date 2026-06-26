import { Metadata } from "next";
import ProductContent from "./ProductContent";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/products/${slug}`);
    if (!res.ok) return { title: "Produit non trouvé" };
    const product = await res.json();
    return { title: product.name, description: product.description };
  } catch { return { title: "Produit non trouvé" }; }
}
export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) { return <ProductContent params={params} />; }
