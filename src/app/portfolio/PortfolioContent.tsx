"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthActionLink from "@/components/AuthActionLink";
import { ArrowRight, Briefcase } from "lucide-react";

const pageColor = "#06B6D4";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [projRes, servRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/services"),
      ]);
      if (!projRes.ok || !servRes.ok) throw new Error("Failed to fetch");
      setProjects(await projRes.json());
      setServices(await servRes.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.domain === filter);

  if (loading) {
    return (
      <div>
        <section className="relative py-32 overflow-hidden bg-navy/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="w-14 h-14 rounded-2xl bg-navy/50 mb-6" />
            <div className="h-12 w-96 bg-navy/50 rounded mb-4" />
            <div className="h-6 w-64 bg-navy/50 rounded mb-8" />
            <div className="h-14 w-48 rounded-xl bg-navy/50" />
          </div>
        </section>
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-10 w-20 rounded-lg bg-navy/50 animate-pulse" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse">
                  <div className="aspect-[16/10] bg-navy/50" />
                  <div className="p-6 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-full bg-navy/50" />
                      <div className="h-5 w-20 rounded-full bg-navy/50" />
                    </div>
                    <div className="h-6 w-3/4 rounded bg-navy/50" />
                    <div className="h-4 w-full rounded bg-navy/50" />
                    <div className="h-4 w-2/3 rounded bg-navy/50" />
                    <div className="flex gap-1.5">
                      <div className="h-5 w-14 rounded-full bg-navy/50" />
                      <div className="h-5 w-16 rounded-full bg-navy/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <section className="relative py-32 overflow-hidden bg-navy/50">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="w-14 h-14 rounded-2xl bg-navy/50 mb-6" />
            <div className="h-12 w-96 bg-navy/50 rounded mb-4" />
            <div className="h-6 w-64 bg-navy/50 rounded mb-8" />
          </div>
        </section>
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-10 rounded-2xl bg-[var(--card-bg)] border border-red/20">
              <Briefcase className="w-12 h-12 text-red/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red mb-2">Erreur de chargement</h3>
              <p className="text-[var(--foreground)]/60 mb-6">Impossible de charger les projets. Vérifiez votre connexion et réessayez.</p>
              <button onClick={fetchData} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg transition-all">Réessayer</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=2400&q=100" alt="" fill className="object-cover" priority sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${pageColor}33, ${pageColor}66)` }}>
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: pageColor }}>PORTFOLIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Portfolio & <span className="gradient-text">Réalisations</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">La preuve par l&apos;exemple. Découvrez comment nous transformons les visions de nos clients en réalités technologiques.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AuthActionLink href="/devis" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95 flex items-center gap-2">
              Demander un Projet <ArrowRight className="w-5 h-5" />
            </AuthActionLink>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 text-sm rounded-lg transition-all ${filter === "all" ? "bg-gradient-to-r from-cyan to-violet text-white" : "border border-[var(--card-border)] text-[var(--foreground)]/60"}`}>Tous</button>
            {services.map((s) => (
              <button key={s.slug} onClick={() => setFilter(s.slug)} className={`px-4 py-2 text-sm rounded-lg transition-all ${filter === s.slug ? "bg-gradient-to-r from-cyan to-violet text-white" : "border border-[var(--card-border)] text-[var(--foreground)]/60"}`}>{s.shortTitle}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-2xl hover:shadow-cyan/10 transition-all hover:-translate-y-2">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={project.image} alt={project.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="flex gap-3">
                        <span className="px-3 py-1 rounded-full glass text-white text-xs">Voir le projet</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 text-xs rounded-full bg-cyan/10 text-cyan">{project.year}</span>
                      <span className="px-2.5 py-0.5 text-xs rounded-full bg-violet/10 text-violet">{project.client}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyan transition-colors">{project.title}</h3>
                    <p className="text-sm text-[var(--foreground)]/60 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] rounded-full border border-[var(--card-border)] text-[var(--foreground)]/50">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8" onClick={() => setLightbox(null)}>
          <Image src={lightbox} alt="" width={1200} height={800} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
