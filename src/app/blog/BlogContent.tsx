"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthActionLink from "@/components/AuthActionLink";
import { Search, Clock, User, Grid, List, ArrowRight, Newspaper } from "lucide-react";

const pageColor = "#F59E0B";

export default function BlogPage() {
  const [blogArticles, setBlogArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const fetchArticles = () => {
    setLoading(true);
    setError(false);
    fetch("/api/blog")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setBlogArticles(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { fetchArticles(); }, []);

  const categories = ["all", ...new Set(blogArticles.map((a: any) => a.category))];
  const filtered = blogArticles.filter((a: any) => {
    const matchCat = category === "all" || a.category === category;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const paginated = filtered.slice(0, page * PER_PAGE);

  if (loading) return (
    <section className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
              <div className="aspect-[16/10] skeleton" />
              <div className="p-6">
                <div className="h-5 skeleton rounded w-3/4 mb-3" />
                <div className="h-4 skeleton rounded w-full mb-2" />
                <div className="h-4 skeleton rounded w-2/3 mb-4" />
                <div className="flex gap-4">
                  <div className="h-3 skeleton rounded w-20" />
                  <div className="h-3 skeleton rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-lg text-[var(--foreground)]/60 mb-6">Erreur de chargement</p>
        <button onClick={fetchArticles} className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
          Réessayer
        </button>
      </div>
    </section>
  );

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0"><Image src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=2400&q=100" alt="" fill className="object-cover" priority sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" /><div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/95 via-[#0B0F1A]/85 to-[#0B0F1A]/90" /><div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/70 to-transparent" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${pageColor}33, ${pageColor}66)` }}>
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: pageColor }}>BLOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>Blog <span className="gradient-text">Technologique</span></h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">Leadership d&apos;opinion, tutoriels et actualités tech par nos experts.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="max-w-lg relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un article..." className="w-full pl-12 pr-4 py-4 rounded-xl glass text-white placeholder:text-white/30 outline-none focus:ring-2 ring-cyan/50" />
            </div>
            <AuthActionLink href="/contact" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
              Proposer un Sujet <ArrowRight className="w-5 h-5" />
            </AuthActionLink>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 text-sm rounded-lg transition-all ${category === c ? "bg-gradient-to-r from-cyan to-violet text-white" : "border border-[var(--card-border)] text-[var(--foreground)]/60"}`}>
                  {c === "all" ? "Tous" : c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg ${view === "grid" ? "bg-cyan/10 text-cyan" : "text-[var(--foreground)]/40"}`}><Grid className="w-5 h-5" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-cyan/10 text-cyan" : "text-[var(--foreground)]/40"}`}><List className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Featured article */}
          {filtered.find((a) => a.featured) && view === "grid" && (
            <Link href={`/blog/${filtered.find((a) => a.featured)!.slug}`} className="group block mb-10">
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
                <Image src={filtered.find((a) => a.featured)!.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-medium mb-3 inline-block">{filtered.find((a) => a.featured)!.category}</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">{filtered.find((a) => a.featured)!.title}</h2>
                  <p className="text-white/60 text-sm max-w-2xl">{filtered.find((a) => a.featured)!.excerpt}</p>
                </div>
              </div>
            </Link>
          )}

          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {paginated.filter((a) => view === "list" || !a.featured).map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                <div className={`rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl transition-all hover:-translate-y-1 ${view === "list" ? "flex" : ""}`}>
                  <div className={`relative overflow-hidden ${view === "list" ? "w-64 flex-shrink-0" : "aspect-[16/10]"}`}>
                    <Image src={article.image} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium text-white">{article.category}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan transition-colors">{article.title}</h3>
                    <p className="text-sm text-[var(--foreground)]/60 line-clamp-2 mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--foreground)]/40">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {paginated.length < filtered.length && (
            <div className="text-center mt-12">
              <button onClick={() => setPage((p) => p + 1)} className="px-8 py-4 rounded-xl text-white font-semibold hover:shadow-lg transition-all active:scale-95 bg-gradient-to-r from-cyan to-violet">
                Voir plus d&apos;articles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
