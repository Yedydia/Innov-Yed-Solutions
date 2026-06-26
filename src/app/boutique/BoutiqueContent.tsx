"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartContext";
import {
  Search, ShoppingCart, Star, Heart, Check,
  Grid3X3, List, Tag, ArrowRight, Eye, ShoppingBag,
} from "lucide-react";

const categories = ["Tous", "Licences", "Matériel", "Formations"];

export default function BoutiquePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addItem, items } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setAllProducts(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const filtered = allProducts
    .filter((p) => category === "Tous" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return (b.reviews) - (a.reviews);
    });

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const addToCart = (slug: string) => {
    const product = allProducts.find((p) => p.slug === slug);
    if (product) addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image });
  };

  const inCart = (slug: string) => items.some((i) => i.slug === slug);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2400&q=100" alt="Boutique" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/95 via-[#0B0F1A]/85 to-[#0B0F1A]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, #F59E0B33, #F59E0B66)` }}>
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: "#F59E0B" }}>BOUTIQUE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Équipements & <span className="gradient-text">Solutions</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            Licences logicielles, matériel informatique, formations en ligne — tout ce dont vous avez besoin pour réussir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/boutique/checkout" className="px-8 py-4 rounded-xl text-white font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2" style={{ background: `linear-gradient(135deg, #F59E0B, #F59E0BCC)` }}>
              Commander <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-11 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? "bg-cyan text-navy"
                      : "text-gray-400 hover:text-[var(--foreground)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            >
              <option value="popular">Populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
            <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg ${view === "grid" ? "bg-cyan/20 text-cyan" : "text-gray-400"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-cyan/20 text-cyan" : "text-gray-400"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            {items.length > 0 && (
              <Link href="/boutique/checkout" className="flex items-center gap-2 bg-cyan text-navy px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-cyan/90 transition-colors">
                <ShoppingCart className="w-4 h-4" /> Panier ({items.reduce((s, i) => s + i.quantity, 0)})
              </Link>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6">{filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[var(--card-border)]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[var(--card-border)] rounded w-1/3" />
                  <div className="h-4 bg-[var(--card-border)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--card-border)] rounded w-full" />
                  <div className="flex justify-between">
                    <div className="h-5 bg-[var(--card-border)] rounded w-1/4" />
                    <div className="h-3 bg-[var(--card-border)] rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-red" />
            </div>
            <p className="text-lg font-semibold mb-2">Erreur de chargement</p>
            <p className="text-sm text-gray-400 mb-6">Impossible de charger les produits. Veuillez réessayer.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-cyan text-navy rounded-xl font-semibold hover:bg-cyan/90 transition-colors">
              Réessayer
            </button>
          </div>
        ) : (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filtered.map((product) => (
            view === "grid" ? (
              <div key={product.slug} className="group glass rounded-2xl overflow-hidden hover:border-cyan/30 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.originalPrice > product.price && (
                      <span className="bg-red text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                    <span className="bg-navy/80 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {product.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.slug)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy/80 flex items-center justify-center hover:bg-navy transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.slug) ? "fill-red text-red" : "text-white"}`} />
                  </button>
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link href={`/boutique/${product.slug}`} className="w-10 h-10 rounded-full bg-cyan flex items-center justify-center hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5 text-navy" />
                    </Link>
                    <button
                      onClick={() => addToCart(product.slug)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${inCart(product.slug) ? "bg-cyan" : "bg-green"}`}
                    >
                      {inCart(product.slug) ? <Check className="w-5 h-5 text-navy" /> : <ShoppingCart className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-amber text-amber" : "text-gray-400"}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                  <Link href={`/boutique/${product.slug}`}>
                    <h3 className="font-display font-semibold text-sm mb-2 group-hover:text-cyan transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-bold text-lg text-cyan">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <span className={`text-xs ${product.stock > 0 ? "text-green" : "text-red"}`}>
                      {product.stock > 0 ? `En stock (${product.stock})` : "Rupture"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={product.slug} className="glass rounded-xl p-4 flex gap-4 hover:border-cyan/30 transition-all">
                <Link href={`/boutique/${product.slug}`} className="w-40 h-28 rounded-lg overflow-hidden shrink-0 relative">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-0.5 rounded-full">{product.category}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-amber text-amber" : "text-gray-400"}`} />
                      ))}
                    </div>
                  </div>
                  <Link href={`/boutique/${product.slug}`}>
                    <h3 className="font-semibold text-sm hover:text-cyan transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-cyan">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleWishlist(product.slug)} className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-red/50">
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.slug) ? "fill-red text-red" : "text-gray-400"}`} />
                      </button>
                      <button onClick={() => addToCart(product.slug)} className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 ${inCart(product.slug) ? "bg-green/20 text-green" : "bg-cyan text-navy hover:bg-cyan/90"}`}>
                        {inCart(product.slug) ? <><Check className="w-3 h-3" /> Ajouté</> : <><ShoppingCart className="w-3 h-3" /> Ajouter</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 glass rounded-2xl p-8 md:p-12 text-center bg-gradient-to-r from-cyan/5 to-violet/5">
          <h2 className="font-display text-2xl font-bold mb-3">Besoin d&apos;un devis personnalisé ?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">Pour les commandes en série ou les solutions sur mesure, notre équipe commerciale est à votre disposition.</p>
          <Link href="/devis" className="inline-flex items-center gap-2 bg-cyan text-navy px-6 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors">
            Demander un devis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
