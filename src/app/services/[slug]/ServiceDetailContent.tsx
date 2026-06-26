"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthActionLink from "@/components/AuthActionLink";
import { ArrowRight, CheckCircle, ChevronDown, Code2, Wrench, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2, Home } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ElementType> = { Code2, Wrench, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2 };

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [services, setServices] = useState([]);
  const [service, setService] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
      fetch("/api/projects").then((res) => { if (!res.ok) throw new Error(); return res.json(); })
    ])
      .then(([servicesData, projectsData]) => {
        setServices(servicesData);
        const found = servicesData.find((s: any) => s.slug === slug);
        setService(found);
        setRelatedProjects(projectsData.filter((p: any) => p.domain === slug));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 skeleton rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-4 w-48 mb-8" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl skeleton" />
            <div className="skeleton rounded-lg h-4 w-32" />
          </div>
          <div className="skeleton rounded-lg h-12 w-3/4 mb-4" />
          <div className="skeleton rounded-lg h-5 w-full mb-2" />
          <div className="skeleton rounded-lg h-5 w-4/5 mb-8" />
          <div className="skeleton rounded-lg h-14 w-56" />
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-8 w-48 mb-10" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton rounded-lg h-16 w-full" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  if (error || !service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Service introuvable</h1>
        <Link href="/services" className="text-cyan hover:underline">Retour aux services</Link>
      </div>
    </div>
  );

  const Icon = iconMap[service.icon] || Code2;
  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={service.heroImage} alt={`${service.title} - ${service.shortTitle}`} fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-cyan"><Home className="w-4 h-4" /></Link>
            <span>/</span>
            <Link href="/services" className="hover:text-cyan">Services</Link>
            <span>/</span>
            <span className="text-white">{service.shortTitle}</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${service.color}33, ${service.color}66)` }}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: service.color }}>SERVICE 0{services.indexOf(service) + 1}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
            {service.title}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">{service.longDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AuthActionLink href="/devis" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95 flex items-center gap-2">
              Demander ce Service <ArrowRight className="w-5 h-5" />
            </AuthActionLink>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>Nos prestations</h2>
          <div className="grid gap-4">
            {service.subServices.map((sub, i) => (
              <div key={sub.title} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                <button onClick={() => setOpenSub(openSub === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--card-border)]/20 transition-all">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5" style={{ color: service.color }} />
                    <h3 className="text-lg font-semibold">{sub.title}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openSub === i ? "rotate-180" : ""}`} />
                </button>
                {openSub === i && (
                  <div className="px-6 pb-6 pt-0 ml-9">
                    <p className="text-[var(--foreground)]/60 leading-relaxed">{sub.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] text-[var(--foreground)]/50">{tech}</span>
                      ))}
                    </div>
                    <AuthActionLink href="/devis" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold hover:gap-3 transition-all" style={{ color: service.color }}>
                      Commencer ce projet <ArrowRight className="w-4 h-4" />
                    </AuthActionLink>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>Questions Fréquentes</h2>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-[var(--foreground)]/60 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>Réalisations liées</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow-xl transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-1">{p.title}</h3>
                    <p className="text-sm text-[var(--foreground)]/50">{p.client} · {p.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--foreground)]/60 mb-8">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green" /> Devis gratuit sous 24h</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green" /> Sans engagement</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green" /> Expertise certifiée</span>
          </div>
          <Link href="/devis" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
            Demander un Devis Gratuit <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
