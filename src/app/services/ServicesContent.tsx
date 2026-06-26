"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthActionLink from "@/components/AuthActionLink";
import { ArrowRight, CheckCircle, Code2, Wrench, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2, FileText, Headphones, Zap, BatteryCharging } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Code2, Wrench, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2, FileText, Headphones, Zap, BatteryCharging };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    setError(false);
    fetch("/api/services")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
              <div className="w-20 h-20 rounded-full skeleton mb-4" />
              <div className="h-6 skeleton rounded w-3/4 mb-3" />
              <div className="h-4 skeleton rounded w-full mb-2" />
              <div className="h-4 skeleton rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-lg text-[var(--foreground)]/60 mb-6">Erreur de chargement</p>
        <button onClick={fetchServices} className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
          Réessayer
        </button>
      </div>
    </section>
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/70 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" /> 10 Domaines d&apos;Excellence
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Nos <span className="gradient-text">Services</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Un écosystème complet de solutions numériques. Chaque domaine est maîtrisé avec une expertise approfondie pour vous offrir des résultats exceptionnels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devis" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
              Demander un Devis
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
              Nous Consulter
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <div key={service.slug} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-stretch rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow-xl hover:shadow-cyan/5 transition-all`}>
                  <div className="relative lg:w-2/5 aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <Image src={service.image} alt={service.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)]/60 to-transparent lg:bg-gradient-to-r" />
                  </div>
                  <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${service.color}22, ${service.color}44)` }}>
                        <Icon className="w-6 h-6" style={{ color: service.color }} />
                      </div>
                      <span className="text-sm font-bold tracking-wider" style={{ color: service.color }}>0{i + 1}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-[var(--foreground)]/60 mb-6 leading-relaxed">{service.longDescription}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {service.subServices.map((sub) => (
                        <div key={sub.title} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: service.color }} />
                          <div>
                            <span className="text-sm font-medium">{sub.title}</span>
                            <p className="text-xs text-[var(--foreground)]/50">{sub.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] text-[var(--foreground)]/60">{tech}</span>
                      ))}
                    </div>
                    <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: service.color }}>
                      Découvrir ce service <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous ne savez pas quel service vous convient ?</h2>
          <p className="text-[var(--foreground)]/60 mb-8">Notre assistant Innov&apos;Bot peut vous aider à identifier le meilleur service pour votre projet.</p>
          <AuthActionLink href="/devis" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
            Obtenir une recommandation <ArrowRight className="w-5 h-5" />
          </AuthActionLink>
        </div>
      </section>
    </div>
  );
}
