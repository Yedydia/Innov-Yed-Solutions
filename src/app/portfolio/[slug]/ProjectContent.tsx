"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Home } from "lucide-react";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) throw new Error("Not found");
      setProject(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] animate-pulse">
        <section className="relative py-32 overflow-hidden bg-navy/50">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm mb-8">
              <div className="w-4 h-4 rounded bg-navy/50" />
              <div className="w-16 h-4 rounded bg-navy/50" />
              <div className="w-20 h-4 rounded bg-navy/50" />
              <div className="w-32 h-4 rounded bg-navy/50" />
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 rounded-full bg-navy/50" />
              <div className="h-6 w-24 rounded-full bg-navy/50" />
            </div>
            <div className="h-12 w-2/3 rounded bg-navy/50 mb-6" />
            <div className="h-6 w-1/2 rounded bg-navy/50" />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="aspect-[16/9] rounded-2xl bg-navy/50" />
              {[1,2,3,4].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-40 rounded bg-navy/50" />
                  <div className="h-4 w-full rounded bg-navy/50" />
                  <div className="h-4 w-3/4 rounded bg-navy/50" />
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <div className="h-5 w-16 rounded bg-navy/50 mb-4" />
                  <div className="h-4 w-24 rounded bg-navy/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Projet introuvable</h1>
          <p className="text-[var(--foreground)]/60 mb-6">Le projet que vous recherchez n&apos;existe pas ou a été retiré.</p>
          <Link href="/portfolio" className="text-cyan hover:underline">Retour au portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0"><Image src={project.image} alt={project.title} fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/95 via-[#0B0F1A]/85 to-[#0B0F1A]/90" /><div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/70 to-transparent" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8"><Link href="/" className="hover:text-cyan"><Home className="w-4 h-4" /></Link><span>/</span><Link href="/portfolio" className="hover:text-cyan">Portfolio</Link><span>/</span><span className="text-white">{project.title}</span></nav>
          <div className="flex gap-2 mb-4"><span className="px-3 py-1 rounded-full glass text-white text-xs">{project.year}</span><span className="px-3 py-1 rounded-full glass text-white text-xs">{project.client}</span></div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>{project.title}</h1>
          <p className="text-lg text-white/60 max-w-2xl">{project.description}</p>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] relative"><Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" /></div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Le Contexte</h2>
                <p className="text-[var(--foreground)]/60 leading-relaxed">Notre client, {project.client}, avait besoin d&apos;une solution technologique de pointe pour répondre à des défis métier complexes. Le projet devait être livré dans des délais serrés avec des exigences de qualité élevées.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Le Défi</h2>
                <p className="text-[var(--foreground)]/60 leading-relaxed">Les principaux obstacles incluaient la scalabilité du système, l&apos;intégration avec des systèmes existants, et la nécessité de performances optimales dans un environnement à fort trafic.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Notre Approche</h2>
                <p className="text-[var(--foreground)]/60 leading-relaxed">Nous avons adopté une méthodologie agile avec des sprints de 2 semaines, des revues régulières avec le client, et une architecture microservices pour garantir la scalabilité et la maintenabilité.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">La Solution</h2>
                <p className="text-[var(--foreground)]/60 leading-relaxed">La solution finale intègre parfaitement les technologies choisies et offre une expérience utilisateur fluide. Le système est déployé sur une infrastructure cloud avec monitoring 24/7.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <h3 className="font-bold mb-4">Client</h3>
                <p className="text-[var(--foreground)]/60">{project.client}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <h3 className="font-bold mb-4">Année</h3>
                <p className="text-[var(--foreground)]/60">{project.year}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <h3 className="font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">{project.technologies.map((t: string) => (<span key={t} className="px-3 py-1 text-xs rounded-full bg-cyan/10 text-cyan">{t}</span>))}</div>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <h3 className="font-bold mb-4">Résultats</h3>
                <ul className="space-y-2">{project.results.map((r: string) => (<li key={r} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green" />{r}</li>))}</ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">Lancez un projet similaire</h2>
          <Link href="/devis" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg transition-all">Demander un Devis <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>
    </div>
  );
}
