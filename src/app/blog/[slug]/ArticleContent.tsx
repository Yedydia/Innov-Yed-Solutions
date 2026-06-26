"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Clock, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({ useful: 12, brilliant: 8, practical: 15, inspiring: 6, wow: 3 });
  const [reacted, setReacted] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/blog/${slug}`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
      fetch("/api/blog").then((res) => { if (!res.ok) throw new Error(); return res.json(); })
    ])
      .then(([articleData, allArticles]) => {
        setArticle(articleData);
        setRelated(allArticles.filter((a: any) => a.slug !== slug).slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div>
      <div className="relative aspect-[21/9] max-h-[500px] skeleton rounded-none" />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="skeleton rounded-lg h-4 w-16" />
          <div className="skeleton rounded-lg h-4 w-4" />
          <div className="skeleton rounded-lg h-4 w-12" />
          <div className="skeleton rounded-lg h-4 w-4" />
          <div className="skeleton rounded-lg h-4 w-20" />
        </div>
        <div className="skeleton rounded-lg h-6 w-24 mb-4" />
        <div className="skeleton rounded-lg h-10 w-full mb-2" />
        <div className="skeleton rounded-lg h-10 w-4/5 mb-6" />
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div>
              <div className="skeleton rounded-lg h-4 w-28 mb-1" />
              <div className="skeleton rounded-lg h-3 w-12" />
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-16">
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-4/5" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-3/5" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-5/6" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-2/3" />
          <div className="skeleton rounded-lg h-5 w-full" />
        </div>
      </article>
    </div>
  );

  if (error || !article) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Article introuvable</h1>
        <Link href="/blog" className="text-cyan hover:underline">Retour au blog</Link>
      </div>
    </div>
  );

  return (
    <div>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-cyan to-violet" style={{ width: "60%" }} />

      {/* Hero */}
      <div className="relative aspect-[21/9] max-h-[500px] overflow-hidden">
        <Image src={article.image} alt={article.title} fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground)]/50 mb-6">
          <Link href="/" className="hover:text-cyan"><Home className="w-4 h-4" /></Link><span>/</span>
          <Link href="/blog" className="hover:text-cyan">Blog</Link><span>/</span>
          <span className="text-[var(--foreground)]">{article.category}</span>
        </nav>

        <span className="px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-medium mb-4 inline-block">{article.category}</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>{article.title}</h1>

        <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet" />
            <div><p className="font-medium text-sm">{article.author}</p><p className="text-xs text-[var(--foreground)]/50">Auteur</p></div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--foreground)]/50">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime} min de lecture</span>
            <span>{new Date(article.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-lg border border-[var(--card-border)] hover:bg-[var(--card-bg)]"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg border border-[var(--card-border)] hover:bg-[var(--card-bg)]"><Bookmark className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-xl text-[var(--foreground)]/80 leading-relaxed mb-8">{article.excerpt}</p>
          <p className="text-[var(--foreground)]/60 leading-relaxed mb-6">
            Dans un paysage technologique en constante évolution, il est essentiel de rester à la pointe des dernières innovations. Cet article explore en profondeur les concepts clés et les meilleures pratiques pour tirer le meilleur parti des technologies modernes.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-4">Les Fondamentaux</h2>
          <p className="text-[var(--foreground)]/60 leading-relaxed mb-6">
            Avant de plonger dans les détails techniques, il est important de comprendre les principes de base qui sous-tendent cette technologie. Chaque concept s&apos;appuie sur des fondations solides qui garantissent la pérennité de vos solutions.
          </p>
          <div className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] my-8">
            <p className="font-mono text-sm text-cyan">{`// Exemple de code`}</p>
            <p className="font-mono text-sm text-[var(--foreground)]/80 mt-2">{`const solution = await innovate({`}</p>
            <p className="font-mono text-sm text-[var(--foreground)]/80">{`  technology: 'next-js',`}</p>
            <p className="font-mono text-sm text-[var(--foreground)]/80">{`  quality: 'premium',`}</p>
            <p className="font-mono text-sm text-[var(--foreground)]/80">{`});`}</p>
          </div>
          <h2 className="text-2xl font-bold mt-12 mb-4">Mise en Pratique</h2>
          <p className="text-[var(--foreground)]/60 leading-relaxed mb-6">
            La théorie ne vaut rien sans la pratique. Voici comment appliquer ces concepts dans vos projets quotidiens, avec des exemples concrets et des cas d&apos;usage réels issus de notre expérience chez Innov&apos;Yed Solutions.
          </p>
          <div className="p-6 rounded-xl border-l-4 border-cyan bg-cyan/5 my-8">
            <p className="font-semibold mb-1">💡 Astuce Pro</p>
            <p className="text-[var(--foreground)]/60">Commencez toujours par un prototype minimal avant de vous lancer dans l&apos;implémentation complète. Cela vous permet de valider vos hypothèses rapidement.</p>
          </div>
          <h2 className="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
          <p className="text-[var(--foreground)]/60 leading-relaxed">
            En maîtrisant ces concepts et en les appliquant de manière rigoureuse, vous serez en mesure de construire des solutions robustes et performantes. N&apos;hésitez pas à contacter notre équipe pour toute question ou pour discuter de votre prochain projet.
          </p>
        </div>

        {/* Reactions */}
        <div className="flex flex-wrap gap-3 mb-12 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <span className="text-sm text-[var(--foreground)]/50 mr-2 self-center">Cet article vous a plu ?</span>
          {[{ key: "useful", emoji: "👍", label: "Utile" }, { key: "brilliant", emoji: "🧠", label: "Brillant" }, { key: "practical", emoji: "🔧", label: "Pratique" }, { key: "inspiring", emoji: "✨", label: "Inspirant" }, { key: "wow", emoji: "🤯", label: "WOW" }].map((r) => (
            <button key={r.key} onClick={() => { setReacted(r.key); setReactions({ ...reactions, [r.key]: reactions[r.key] + (reacted === r.key ? -1 : 1) }); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${reacted === r.key ? "bg-cyan/10 text-cyan" : "border border-[var(--card-border)] hover:border-cyan/30"}`}>
              <span>{r.emoji}</span> <span>{reactions[r.key]}</span>
            </button>
          ))}
        </div>

        {/* Author */}
        <div className="flex gap-6 p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan to-violet flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">{article.author}</h3>
            <p className="text-sm text-cyan mb-3">Expert chez Innov&apos;Yed Solutions</p>
            <p className="text-sm text-[var(--foreground)]/60">Passionné par la technologie et le partage de connaissances, {article.author} contribue régulièrement au blog avec des articles de fond et des tutoriels pratiques.</p>
          </div>
        </div>
      </article>

      {/* Related articles */}
      <section className="py-20 bg-[var(--section-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-10">Articles Similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl transition-all">
                <div className="relative aspect-[16/10] overflow-hidden"><Image src={a.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-5"><h3 className="font-bold group-hover:text-cyan transition-colors">{a.title}</h3><p className="text-xs text-[var(--foreground)]/40 mt-2">{a.readTime} min · {a.author}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
