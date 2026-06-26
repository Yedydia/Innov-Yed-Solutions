"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Star, Clock, Users, BookOpen, Award, Play, CheckCircle, Home } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/courses/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { if (d) { setCourse(d); setLoading(false); } })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-navy/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 animate-pulse space-y-4">
          <div className="h-4 bg-[var(--card-border)] rounded w-1/4" />
          <div className="h-8 bg-[var(--card-border)] rounded w-1/6" />
          <div className="h-12 bg-[var(--card-border)] rounded w-3/4" />
          <div className="h-4 bg-[var(--card-border)] rounded w-1/2" />
          <div className="h-4 bg-[var(--card-border)] rounded w-1/4" />
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12 animate-pulse">
              <div className="aspect-video rounded-2xl bg-[var(--card-border)]" />
              <div className="space-y-4">
                <div className="h-6 bg-[var(--card-border)] rounded w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-[var(--card-border)] rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-[var(--card-border)] rounded w-1/3" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--card-border)] rounded-xl" />
                ))}
              </div>
            </div>
            <div className="animate-pulse">
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
                <div className="h-8 bg-[var(--card-border)] rounded w-1/2" />
                <div className="h-4 bg-[var(--card-border)] rounded w-1/3" />
                <div className="h-12 bg-[var(--card-border)] rounded-xl" />
                <div className="h-4 bg-[var(--card-border)] rounded w-3/4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-5 bg-[var(--card-border)] rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Formation introuvable</h1>
        <Link href="/academie" className="text-cyan hover:underline">Retour à l&apos;académie</Link>
      </div>
    </div>
  );

  if (!course) return null;

  return (
    <div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} title="Connectez-vous pour vous inscrire" />
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0"><Image src={course.image} alt={course.title} fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8"><Link href="/" className="hover:text-cyan"><Home className="w-4 h-4" /></Link><span>/</span><Link href="/academie" className="hover:text-cyan">Académie</Link><span>/</span><span className="text-white">{course.title}</span></nav>
          {course.badge && <span className="inline-block px-3 py-1 rounded-full bg-amber text-white text-xs font-bold mb-4">{course.badge}</span>}
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>{course.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm mb-8">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber text-amber" />{course.rating} ({course.students} apprenants)</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.modules} modules</span>
            <span>{course.level}</span>
          </div>
          <p className="text-white/50 text-xs">Par {course.instructor}</p>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Trailer */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy">
                <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center"><button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all"><Play className="w-8 h-8 text-white ml-1" /></button></div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Ce que vous apprendrez</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Maîtriser les concepts fondamentaux", "Construire des projets concrets", "Comprendre les bonnes pratiques", "Obtenir une certification vérifiable", "Développer un portfolio professionnel", "Rejoindre une communauté d'experts"].map((item) => (
                    <div key={item} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green flex-shrink-0 mt-0.5" /><span className="text-sm">{item}</span></div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Programme</h2>
                <div className="space-y-3">
                  {Array.from({ length: Math.min(course.modules, 8) }).map((_, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center text-sm font-bold">{i + 1}</span>
                        <div><h3 className="font-medium">Module {i + 1}: {["Introduction et installation", "Les fondamentaux", "Concepts avancés", "Projets pratiques", "Architecture et patterns", "Performance et optimisation", "Tests et qualité", "Déploiement et monitoring"][i]}</h3><p className="text-xs text-[var(--foreground)]/50">3-5 leçons · 2-4h</p></div>
                      </div>
                      <BookOpen className="w-5 h-5 text-[var(--foreground)]/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl">
                <div className="text-3xl font-bold mb-2">{formatPrice(course.price)}</div>
                <div className="text-sm text-[var(--foreground)]/40 line-through mb-6">{formatPrice(course.price * 1.4)}</div>
                <Link href={token ? `/academie/${course.slug}/cours` : "#"} onClick={(e) => { if (!token) { e.preventDefault(); setShowAuth(true); } }} className="block w-full py-4 text-center rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all mb-4">
                  S&apos;inscrire maintenant
                </Link>
                <p className="text-xs text-center text-[var(--foreground)]/50 mb-6">Garantie satisfait-ou-remboursé 7 jours</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-cyan" /><span>{course.duration} de contenu</span></div>
                  <div className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-cyan" /><span>{course.modules} modules structurés</span></div>
                  <div className="flex items-center gap-3"><Award className="w-4 h-4 text-cyan" /><span>Certificat de complétion</span></div>
                  <div className="flex items-center gap-3"><Users className="w-4 h-4 text-cyan" /><span>Communauté d&apos;apprenants</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
