"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartContext";
import {
  ShoppingCart, Heart, Star, ChevronRight, Shield, Truck,
  RotateCcw, Check, Minus, Plus, Tag, ArrowLeft,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const inCart = items.some((i) => i.slug === slug);

  useEffect(() => { params.then((p) => setSlug(p.slug)); }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    Promise.all([
      fetch(`/api/products/${slug}`).then((r) => {
        if (r.status === 404) return { _missing: true };
        if (!r.ok) throw new Error();
        return r.json();
      }),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/testimonials").then((r) => r.json()).catch(() => []),
    ]).then(([prod, prods, testims]) => {
      if ((prod as any)._missing) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);
      setAllProducts(prods);
      setTestimonials(Array.isArray(testims) ? testims : []);
      setLoading(false);
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div>
            <div className="aspect-square rounded-2xl bg-[var(--card-border)] mb-4" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-[var(--card-border)]" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-[var(--card-border)] rounded w-1/4" />
            <div className="h-8 bg-[var(--card-border)] rounded w-3/4" />
            <div className="h-4 bg-[var(--card-border)] rounded w-1/3" />
            <div className="h-10 bg-[var(--card-border)] rounded w-1/4" />
            <div className="h-20 bg-[var(--card-border)] rounded w-full" />
            <div className="h-12 bg-[var(--card-border)] rounded w-full" />
            <div className="h-24 bg-[var(--card-border)] rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Produit introuvable</h1>
        <Link href="/boutique" className="text-cyan hover:underline">Retour à la boutique</Link>
      </div>
    </div>
  );

  if (!product) return null;

  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/boutique" className="hover:text-cyan flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Boutique</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--foreground)] truncate">{product.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-[var(--card-bg)]">
              <img src={images[activeImg]} alt={product.name} className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all relative ${activeImg === idx ? "border-cyan" : "border-[var(--card-border)]"}`}>
                  <img src={img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-cyan/20 text-cyan px-3 py-1 rounded-full flex items-center gap-1"><Tag className="w-3 h-3" /> {product.category}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs bg-red/20 text-red px-3 py-1 rounded-full font-semibold">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber text-amber" : "text-gray-400"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-400">{product.rating} ({product.reviews} avis)</span>
              <span className="text-sm text-gray-400">|</span>
              <span className={`text-sm ${product.stock > 0 ? "text-green" : "text-red"}`}>
                {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-cyan">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[var(--card-border)] rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-[var(--card-border)] transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 font-semibold min-w-[48px] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2.5 hover:bg-[var(--card-border)] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image, quantity: qty })}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan text-navy py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors"
              >
                {inCart ? <><Check className="w-5 h-5" /> Ajouté au panier</> : <><ShoppingCart className="w-5 h-5" /> Ajouter au panier</>}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${wishlisted ? "bg-red/10 border-red/30" : "border-[var(--card-border)] hover:border-red/30"}`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red text-red" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Truck, label: "Livraison rapide", desc: "24-48h Cotonou" },
                { icon: Shield, label: "Garantie", desc: "12 mois minimum" },
                { icon: RotateCcw, label: "Retour gratuit", desc: "Sous 14 jours" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="glass rounded-xl p-3 text-center">
                  <Icon className="w-5 h-5 text-cyan mx-auto mb-1" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              ))}
            </div>

            {/* Specs */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-lg mb-4">Caractéristiques</h3>
              <div className="space-y-3">
                {[
                  ["Catégorie", product.category],
                  ["Disponibilité", product.stock > 0 ? `En stock (${product.stock})` : "Rupture"],
                  ["Garantie", "12 mois"],
                  ["Livraison", "Cotonou & environs"],
                  ["Support", "Inclus"],
                ].map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                    <span className="text-sm text-gray-400">{key}</span>
                    <span className="text-sm font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">Avis Clients</h2>
          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(0, 6).map((review: any) => (
                <div key={review.id} className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-white font-bold text-sm">
                        {review.name?.[0] || "C"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.role || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? "fill-amber text-amber" : "text-gray-400"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">&ldquo;{review.text}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <Star className="w-8 h-8 text-amber mx-auto mb-3 opacity-40" />
              <p className="text-gray-400 text-sm">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">Produits Similaires</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.slug} href={`/boutique/${p.slug}`} className="group glass rounded-2xl overflow-hidden hover:border-cyan/30 transition-all">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-cyan transition-colors">{p.name}</h3>
                    <p className="font-display font-bold text-cyan mt-2">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
