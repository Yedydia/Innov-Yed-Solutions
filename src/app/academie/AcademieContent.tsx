"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthActionLink from "@/components/AuthActionLink";
import { Star, Clock, Users, BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const pageColor = "#F59E0B";

export default function AcademiePage() {
  const [level, setLevel] = useState("all");
  const [domain, setDomain] = useState("all");
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setAllCourses(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const domains = ["all", ...new Set(allCourses.map((c: any) => c.domain))];
  const levels = ["all", "Débutant", "Intermédiaire", "Avancé"];
  const filtered = allCourses.filter((c: any) => (level === "all" || c.level === level) && (domain === "all" || c.domain === domain));

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0"><Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2400&q=100" alt="" fill className="object-cover" priority sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" /><div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/95 via-[#0B0F1A]/85 to-[#0B0F1A]/90" /><div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/70 to-transparent" /></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${pageColor}33, ${pageColor}66)` }}>
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-bold tracking-wider" style={{ color: pageColor }}>ACADÉMIE</span>
            </div>
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-6 shadow-lg">Experts en Formations</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl drop-shadow-2xl drop-shadow-black/60" style={{ fontFamily: "var(--font-display)" }}>Académie <span className="gradient-text">Innov&apos;Yed</span></h1>
            <p className="text-lg text-white/90 max-w-2xl mb-8 drop-shadow-lg drop-shadow-black/40">Nous transformons votre ambition technologique en succès concret. Du développement logiciel à l&apos;intelligence artificielle, nous sommes le partenaire de confiance de votre transformation numérique.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AuthActionLink href="/devis" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95 flex items-center gap-2">
              Demander une Formation <ArrowRight className="w-5 h-5" />
            </AuthActionLink>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-4 mb-10">
            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-sm outline-none"><option value="all">Tous les domaines</option>{domains.filter((d) => d !== "all").map((d) => <option key={d} value={d}>{d}</option>)}</select>
            <div className="flex gap-2">{levels.map((l) => (<button key={l} onClick={() => setLevel(l)} className={`px-4 py-2 text-sm rounded-lg transition-all ${level === l ? "bg-gradient-to-r from-cyan to-violet text-white" : "border border-[var(--card-border)] text-[var(--foreground)]/60"}`}>{l === "all" ? "Tous niveaux" : l}</button>))}</div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse">
                  <div className="aspect-[16/10] bg-[var(--card-border)]" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-[var(--card-border)] rounded w-3/4" />
                    <div className="flex gap-3">
                      <div className="h-3 bg-[var(--card-border)] rounded w-1/4" />
                      <div className="h-3 bg-[var(--card-border)] rounded w-1/4" />
                      <div className="h-3 bg-[var(--card-border)] rounded w-1/4" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-[var(--card-border)] rounded w-1/6" />
                      <div className="h-5 bg-[var(--card-border)] rounded w-1/5" />
                    </div>
                    <div className="h-3 bg-[var(--card-border)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-red" />
              </div>
              <p className="text-lg font-semibold mb-2">Erreur de chargement</p>
              <p className="text-sm text-gray-400 mb-6">Impossible de charger les formations. Veuillez réessayer.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-cyan text-navy rounded-xl font-semibold hover:bg-cyan/90 transition-colors">
                Réessayer
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <Link key={course.slug} href={`/academie/${course.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={course.image} alt={course.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {course.badge && <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber text-white text-xs font-bold">{course.badge}</div>}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full glass text-xs text-white">{course.domain}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-cyan transition-colors">{course.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground)]/50 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules} modules</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber text-amber" /><span className="text-sm font-bold">{course.rating}</span></div>
                      <span className="font-bold text-cyan">{formatPrice(course.price)}</span>
                    </div>
                    <div className="mt-2 text-xs text-[var(--foreground)]/40">Par {course.instructor} · {course.level}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
