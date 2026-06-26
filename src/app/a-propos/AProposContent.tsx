"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Target, Eye, Heart, Lightbulb, Shield, Users, Award, Globe, TrendingUp, Info } from "lucide-react";

const pageColor = "#06B6D4";

interface SiteValue {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface TimelineStep {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

interface Certification {
  name: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to fetch");
      setTeamMembers(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const iconComponents: Record<string, React.ComponentType<any>> = {
    Lightbulb, Shield, TrendingUp, Heart, Users, Globe, Award, Target, Eye,
  };
  const getIcon = (name: string) => iconComponents[name] || Award;

  const defaultValues: SiteValue[] = [
    { icon: "Lightbulb", title: "Innovation Radicale", description: "Nous repoussons constamment les limites du possible. Chaque solution est pensée pour être à la pointe de la technologie.", color: "#4F46E5" },
    { icon: "Shield", title: "Rigueur Technique", description: "La qualité de notre code, de nos architectures et de nos processus est non-négociable. Chaque livraison est testée et auditée.", color: "#EF4444" },
    { icon: "TrendingUp", title: "Excellence Opérationnelle", description: "Nous optimisons chaque processus pour livrer dans les délais, respecter les budgets et dépasser les attentes.", color: "#10B981" },
    { icon: "Heart", title: "Impact Social", description: "Nous croyons que la technologie doit servir le progrès humain. Nous formons les talents de demain et soutenons l'écosystème local.", color: "#F59E0B" },
    { icon: "Users", title: "Intégrité & Transparence", description: "Communication honnête, devis clairs, rapports détaillés. Notre relation client est fondée sur la confiance absolue.", color: "#14B8A6" },
    { icon: "Globe", title: "Engagement Client", description: "Chaque client est un partenaire. Nous investissons dans la compréhension profonde de ses besoins pour des solutions sur mesure.", color: "#4F46E5" },
  ];

  const defaultTimeline: TimelineStep[] = [
    { year: "2022", title: "La Naissance", description: "Fondation d'Innov'Yed Solutions à Cotonou, Quartier Godomey, avec une vision ambitieuse : démocratiser l'excellence technologique au Bénin et en Afrique." },
    { year: "2022", title: "Premiers Services", description: "Lancement des services de support technique, maintenance informatique et création web. Premiers clients satisfaits et bouche-à-oreille qui démarre." },
    { year: "2023", title: "Expansion des Services", description: "Ajout des pôles Réseaux & Sécurité, Systèmes Automatisés et Énergie Solaire. L'équipe s'agrandit avec des experts spécialisés." },
    { year: "2024", title: "Académie & Formation", description: "Lancement de l'Académie Innov'Yed pour former les talents numériques de demain. Premières formations certifiantes en informatique et développement web." },
    { year: "2025", title: "Plateforme Web & E-Commerce", description: "Lancement de la plateforme web complète avec boutique en ligne, portail client et système de devis intelligent. Cap vers le leadership numérique." },
    { year: "2025", title: "Vision Continentale", description: "Objectif : devenir la référence IT au Bénin et s'étendre en Afrique de l'Ouest. 10 domaines d'excellence, une seule ambition : l'innovation au service de tous." },
    { year: "2026", title: "Consolidation & Innovation", description: "Renforcement de l'écosystème numérique, intégration de solutions IA avancées et expansion des services à l'international. Innov'Yed Solutions affirme son leadership au Bénin." },
  ];

  const defaultCertifications: Certification[] = [
    { name: "AWS Certified", icon: "Award" },
    { name: "ISO 27001", icon: "Shield" },
    { name: "Google Partner", icon: "Globe" },
    { name: "Microsoft Partner", icon: "Award" },
    { name: "Cisco", icon: "Award" },
    { name: "CompTIA", icon: "Award" },
  ];

  const [values, setValues] = useState<SiteValue[]>(defaultValues);
  const [timeline, setTimeline] = useState<TimelineStep[]>(defaultTimeline);
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);

  const fetchSiteContent = async () => {
    try {
      const [valuesRes, timelineRes, certsRes] = await Promise.all([
        fetch("/api/site-content?type=values"),
        fetch("/api/site-content?type=timeline"),
        fetch("/api/site-content?type=certifications"),
      ]);
      if (valuesRes.ok) {
        const data = await valuesRes.json();
        if (Array.isArray(data) && data.length > 0) setValues(data);
      }
      if (timelineRes.ok) {
        const data = await timelineRes.json();
        if (Array.isArray(data) && data.length > 0) setTimeline(data);
      }
      if (certsRes.ok) {
        const data = await certsRes.json();
        if (Array.isArray(data) && data.length > 0) setCertifications(data);
      }
    } catch {
      // Keep default values on error
    }
  };

  useEffect(() => { fetchSiteContent(); }, []);

  if (loading) {
    return (
      <div>
        <section className="relative py-32 overflow-hidden bg-navy/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="w-14 h-14 rounded-2xl bg-navy/50 mb-6" />
            <div className="h-12 w-80 bg-navy/50 rounded mb-4" />
            <div className="h-6 w-96 bg-navy/50 rounded mb-8" />
            <div className="h-14 w-48 rounded-xl bg-navy/50" />
          </div>
        </section>
        <section className="py-24 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {[1,2].map(i => (
                <div key={i} className="p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <div className="w-10 h-10 rounded bg-navy/50 mb-6" />
                  <div className="h-6 w-40 rounded bg-navy/50 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-navy/50" />
                    <div className="h-4 w-3/4 rounded bg-navy/50" />
                    <div className="h-4 w-5/6 rounded bg-navy/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 bg-[var(--section-bg)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-8 w-40 rounded bg-navy/50 mx-auto mb-16" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <div className="w-8 h-8 rounded bg-navy/50 mb-4" />
                  <div className="h-5 w-32 rounded bg-navy/50 mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-navy/50" />
                    <div className="h-4 w-4/5 rounded bg-navy/50" />
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
          </div>
        </section>
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-10 rounded-2xl bg-[var(--card-bg)] border border-red/20">
              <Info className="w-12 h-12 text-red/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red mb-2">Erreur de chargement</h3>
              <p className="text-[var(--foreground)]/60 mb-6">Impossible de charger l&apos;équipe. Vérifiez votre connexion et réessayez.</p>
              <button onClick={fetchTeam} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg transition-all">Réessayer</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2400&q=100" alt="" fill className="object-cover" priority sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${pageColor}33, ${pageColor}66)` }}>
              <Info className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider" style={{ color: pageColor }}>À PROPOS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
            L&apos;Âme d&apos;<span className="gradient-text">Innov&apos;Yed</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            Nous ne construisons pas seulement des technologies — nous bâtissons l&apos;avenir numérique de l&apos;Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="px-8 py-4 rounded-xl text-white font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${pageColor}, ${pageColor}CC)` }}>
              Nous Contacter <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Target className="w-10 h-10 text-cyan mb-6" />
              <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
              <p className="text-[var(--foreground)]/60 leading-relaxed text-lg">
                Démocratiser l&apos;excellence technologique : rendre accessibles au plus grand nombre des solutions informatiques de pointe, du développement logiciel à l&apos;intelligence artificielle, en passant par la cybersécurité et l&apos;électronique embarquée.
              </p>
            </div>
            <div className="p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Eye className="w-10 h-10 text-violet mb-6" />
              <h2 className="text-2xl font-bold mb-4">Notre Vision</h2>
              <p className="text-[var(--foreground)]/60 leading-relaxed text-lg">
                Devenir d&apos;ici 2030 la firme informatique de référence en Afrique de l&apos;Ouest, reconnue mondialement pour l&apos;innovation, la qualité et l&apos;impact de ses solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>Nos Valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v) => {
              const Icon = getIcon(v.icon);
              return (
                <div key={v.title} className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl hover:shadow-cyan/5 transition-all group hover:-translate-y-1">
                  <Icon className="w-8 h-8 mb-4" style={{ color: v.color }} />
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="text-[var(--foreground)]/60 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>Notre Histoire</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-violet to-cyan" />
            {timeline.map((step, i) => (
              <div key={`${step.year}-${i}`} className="relative flex gap-8 mb-12 last:mb-0">
                <div className="relative z-10 w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-cyan flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-cyan">{step.year}</span>
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--foreground)]/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>Notre Équipe</h2>
          <p className="text-center text-[var(--foreground)]/60 mb-16">Les talents derrière l&apos;excellence Innov&apos;Yed</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={member.image} alt={member.name} fill sizes="320px" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhM2IiIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />
                </div>
                <div className="p-6 -mt-16 relative">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-cyan font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-[var(--foreground)]/60 mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-cyan/10 text-cyan">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/equipe" className="inline-flex items-center gap-2 text-cyan font-semibold hover:gap-3 transition-all">
              Voir toute l&apos;équipe <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-10">Certifications & Partenariats</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {certifications.map((cert) => {
              const CertIcon = getIcon(cert.icon);
              return (
                <div key={cert.name} className="px-6 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <CertIcon className="w-8 h-8 mx-auto mb-2 text-amber" />
                  <span className="text-sm font-medium">{cert.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
