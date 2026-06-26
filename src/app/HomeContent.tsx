"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, CheckCircle, Quote, Code2, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2, Wrench, Zap, FileText, Headphones, BatteryCharging } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Code2, Wrench, Shield, Cpu, Brain, Palette, GraduationCap, Sigma, Gamepad2, FileText, Headphones, Zap, BatteryCharging,
};

const heroParticlesData = Array.from({ length: 20 }, (_, i) => ({
  left: `${((i * 37 + 13) % 100)}%`,
  top: `${((i * 73 + 7) % 100)}%`,
  duration: 3 + ((i * 17) % 40) / 10,
  delay: ((i * 29) % 50) / 10,
}));

const ctaParticlesData = Array.from({ length: 10 }, (_, i) => ({
  left: `${((i * 47 + 23) % 100)}%`,
  top: `${((i * 83 + 11) % 100)}%`,
  duration: 4 + ((i * 19) % 30) / 10,
  delay: ((i * 31) % 30) / 10,
}));

// Scroll reveal hook
function useReveal(threshold = 0.1): React.RefCallback<HTMLDivElement> {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.classList.add("opacity-0", "translate-y-4");
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { node.classList.remove("opacity-0", "translate-y-4"); node.classList.add("opacity-100", "translate-y-0"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// Animated counter hook
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.2): [React.RefCallback<HTMLDivElement>, boolean] {
  const [inView, setInView] = useState(false);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// Rotating text hook
function useRotatingText(texts: string[], interval = 3000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % texts.length), interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);
  return texts[index];
}

export default function LandingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogArticles, setBlogArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [metrics, setMetrics] = useState({ projectsDelivered: 127, satisfiedClients: 89, yearsExperience: 4, satisfactionRate: 98 });
  const [badgeText, setBadgeText] = useState("10 Domaines · 127+ Projets Livrés · Bénin & International");
  const [processSteps, setProcessSteps] = useState([
    { title: "Analyse", desc: "Compréhension approfondie de vos besoins et objectifs", duration: "1-2 semaines", icon: "Search" },
    { title: "Conception", desc: "Design des maquettes et architecture technique", duration: "2-3 semaines", icon: "PenTool" },
    { title: "Développement", desc: "Implémentation agile avec sprints de 2 semaines", duration: "4-8 semaines", icon: "Code" },
    { title: "Tests", desc: "Tests unitaires, E2E, audit performance et sécurité", duration: "1-2 semaines", icon: "CheckCircle" },
    { title: "Livraison", desc: "Déploiement, formation et support hypercare 30 jours", duration: "1 semaine", icon: "Rocket" },
  ]);
  const [techLogos, setTechLogos] = useState(["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "Tailwind CSS", "Figma", "Git", "Redis", "GraphQL", "Prisma", "Supabase", "Stripe", "Vercel", "Linux"]);
  const [heroImagesData, setHeroImagesData] = useState([
    { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&q=100", alt: "Équipe Innov'Yed Solutions au travail", sector: "Technologie & Innovation" },
    { src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=100", alt: "Développement Web & Applications sur mesure", sector: "Développement" },
    { src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&q=100", alt: "Développement Mobile & Frontend moderne", sector: "Applications Mobiles" },
    { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=100", alt: "Data Science & Analyse de données", sector: "Data & IA" },
    { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=100", alt: "Intelligence Artificielle & Machine Learning", sector: "Intelligence Artificielle" },
    { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=100", alt: "Cybersécurité & Protection des données", sector: "Sécurité" },
    { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=100", alt: "Solutions Solaires & Énergie renouvelable", sector: "Énergie" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=100", alt: "Formation & Académie Innov'Yed", sector: "Académie" },
    { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=100", alt: "Design Graphique & Identité Visuelle", sector: "Design" },
    { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=100", alt: "Gaming & Multimédia immersif", sector: "Gaming & Multimédia" },
    { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=100", alt: "Infrastructure Serveurs & Cloud", sector: "Infrastructure" },
    { src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1920&q=100", alt: "Maintenance & Réparation Électronique", sector: "Maintenance" },
    { src: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=100", alt: "Services Bureautiques & Administration", sector: "Bureau" },
    { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=100", alt: "Conseil & Accompagnement stratégique", sector: "Conseil" },
    { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=100", alt: "E-commerce & Boutique en ligne", sector: "E-commerce" },
    { src: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1920&q=100", alt: "Domotique & Systèmes Intelligents", sector: "Domotique" },
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=100", alt: "Réseaux & Télécommunications", sector: "Réseaux" },
    { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=100", alt: "Support Technique & Assistance à distance", sector: "Support" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=100", alt: "Transformation Digitale des entreprises", sector: "Transformation Digitale" },
    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=100", alt: "Collaboration & Management de projet", sector: "Collaboration" },
  ]);
  const [advantages, setAdvantages] = useState([
    { title: "Excellence Technique", desc: "Notre équipe maîtrise les technologies les plus avancées : Next.js, TypeScript, Kubernetes, IA. Chaque ligne de code est écrite avec rigueur et chaque architecture est pensée pour durer.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=100", icon: "Code2" },
    { title: "Approche Holistique", desc: "Avec 10 domaines interconnectés, nous offrons une couverture complète de vos besoins numériques. Plus besoin de multiplier les prestataires — un seul partenaire, toutes les solutions.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=100", icon: "Users" },
    { title: "Impact Local & Global", desc: "Fiers de nos racines béninoises, nous visons l'excellence internationale. Nos solutions sont pensées pour le marché africain tout en respectant les standards mondiaux les plus exigeants.", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=100", icon: "Globe" },
    { title: "Partenariat Durable", desc: "Nous ne livrons pas un projet pour disparaître ensuite. Notre engagement inclut le support, la maintenance, la formation et l'évolution continue de vos solutions.", image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=100", icon: "Award" },
  ]);
  const [metricsRef, metricsInView] = useInView();
  const [heroMounted, setHeroMounted] = useState(false);
  useEffect(() => { setHeroMounted(true); }, []);
  const projectsCount = useCounter(metrics.projectsDelivered, 2000, heroMounted);
  const clientsCount = useCounter(metrics.satisfiedClients, 2000, heroMounted);
  const yearsCount = useCounter(metrics.yearsExperience, 1500, heroMounted);
  const satCount = useCounter(metrics.satisfactionRate, 2000, heroMounted);
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const rotatingDomain = useRotatingText(services.length > 0 ? services.map((s) => s.shortTitle) : [""]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [svcRes, tstRes, blogRes, settingsRes, processRes, techRes, heroRes, advRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/testimonials"),
        fetch("/api/blog"),
        fetch("/api/site-settings"),
        fetch("/api/site-content?type=processSteps"),
        fetch("/api/site-content?type=techStack"),
        fetch("/api/site-content?type=heroImages"),
        fetch("/api/site-content?type=advantages"),
      ]);
      if (!svcRes.ok || !tstRes.ok || !blogRes.ok) throw new Error("Failed to fetch");
      setServices(await svcRes.json());
      setTestimonials(await tstRes.json());
      setBlogArticles(await blogRes.json());
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setMetrics({ projectsDelivered: s.projectsDelivered, satisfiedClients: s.satisfiedClients, yearsExperience: s.yearsExperience, satisfactionRate: s.satisfactionRate });
        if (s.badgeText) setBadgeText(s.badgeText);
      }
      if (processRes.ok) {
        const steps = await processRes.json();
        if (Array.isArray(steps) && steps.length > 0) setProcessSteps(steps.map((s: any) => ({ title: s.title, desc: s.description, duration: s.duration, icon: s.icon })));
      }
      if (techRes.ok) {
        const techs = await techRes.json();
        if (Array.isArray(techs) && techs.length > 0) setTechLogos(techs.map((t: any) => t.name));
      }
      if (heroRes.ok) {
        const imgs = await heroRes.json();
        if (Array.isArray(imgs) && imgs.length > 0) {
          setHeroImagesData(imgs.map((img: any) => ({ src: img.url, alt: img.alt || "", sector: img.sector || "" })));
        }
      }
      if (advRes.ok) {
        const advs = await advRes.json();
        if (Array.isArray(advs) && advs.length > 0) {
          const imageMap: Record<string, string> = {
            "Excellence Technique": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=100",
            "Approche Holistique": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=100",
            "Impact Local & Global": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=100",
            "Partenariat Durable": "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=100",
          };
          const fallbackImages = Object.values(imageMap);
          setAdvantages(advs.map((a: any, i: number) => ({
            title: a.title,
            desc: a.description,
            image: imageMap[a.title] || fallbackImages[i % fallbackImages.length],
            icon: a.icon,
          })));
        }
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const heroRef = useReveal();
  const pillarsRef = useReveal();
  const whyRef = useReveal();
  const testimonialsRef = useReveal();
  const processRef = useReveal();
  const techRef = useReveal();
  const blogRef = useReveal();
  const ctaRef = useReveal();

  const [heroIdx, setHeroIdx] = useState(() => {
    if (typeof window === "undefined") return 0;
    const KEY = "herostarts";
    const t = sessionStorage.getItem(KEY);
    if (t) {
      return Math.floor((Date.now() - Number(t)) / 15000) % 22;
    }
    sessionStorage.setItem(KEY, String(Date.now()));
    return 0;
  });

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroImagesData.length), 15000);
    return () => clearInterval(timer);
  }, [heroImagesData.length]);

  const filters = ["Tout", "Bureau", "Infra", "Création", "Tech"];
  const filterMap: Record<string, string[]> = {
    Tout: services.map((s) => s.slug),
    Bureau: ["service-bureau", "support-technique", "formations-mises-a-jour"],
    Infra: ["reseaux-securite", "optimisation-recuperation", "maintenance-reparation", "energie-accessoires", "systemes-automatises"],
    Création: ["creation-web-graphisme", "gaming-logiciels-multimedia"],
    Tech: ["systemes-automatises", "reseaux-securite", "optimisation-recuperation"],
  };

  const filteredServices = services.filter((s) => filterMap[activeFilter]?.includes(s.slug));

  return (
    <div className="overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="reveal relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Rotating background images */}
        <div className="absolute inset-0">
          {heroImagesData.map((img, i) => (
            <div key={img.src} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? "opacity-100" : "opacity-0"}`}>
              <Image src={img.src} alt={img.alt} fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" priority={i < 2} loading={i < 2 ? "eager" : "lazy"} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-violet/5" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroParticlesData.map((p, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan/30"
              style={{
                left: p.left,
                top: p.top,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <Zap className="w-4 h-4 text-amber" />
            <span className="text-white/80">{badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
            Le Pilier Numérique
            <br />
            <span className="gradient-text">de Demain, Aujourd&apos;hui</span>
          </h1>

          {/* Rotating subtitle */}
          <p className="text-xl sm:text-2xl text-white/70 mb-4 h-10">
            Experts en <span className="text-cyan font-semibold typewriter-cursor">{rotatingDomain}</span>
          </p>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10">
            Nous transformons votre ambition technologique en succès concret. Du développement logiciel à l&apos;intelligence artificielle, nous sommes le partenaire de confiance de votre transformation numérique.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link href="/services"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold text-lg hover:shadow-2xl hover:shadow-cyan/30 transition-all active:scale-95 pulse-glow flex items-center justify-center gap-2">
              Découvrir Nos Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/devis"
              className="px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/40 transition-all active:scale-95 flex items-center justify-center gap-2">
              Obtenir un Devis Gratuit
            </Link>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Projets Livrés", value: projectsCount, suffix: "+" },
              { label: "Clients Satisfaits", value: clientsCount, suffix: "+" },
              { label: "Années d'Expertise", value: yearsCount, suffix: "" },
              { label: "Taux Satisfaction", value: satCount, suffix: "%" },
            ].map((m) => (
              <div key={m.label} className="glass rounded-xl px-4 py-5">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {m.value}{m.suffix}
                </div>
                <div className="text-xs text-white/50">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center text-white/30 pt-4 pb-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs">Scroll</span>
            <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== NOS 10 PILIERS D'EXCELLENCE ========== */}
      <section ref={pillarsRef} className="reveal relative py-24 bg-[var(--section-bg)] overflow-hidden" id="services">
        <div className="absolute inset-0 opacity-[0.04]">
          <Image src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyan uppercase tracking-wider">Notre Expertise</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Nos 10 Piliers d&apos;Excellence
            </h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Un spectre complet de compétences informatiques pour répondre à tous vos besoins technologiques.
            </p>
          </div>

          {/* Filters */}
          {loading ? (
            <div className="flex justify-center gap-3 mb-12">
              {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 rounded-lg bg-navy/50 animate-pulse" />)}
            </div>
          ) : error ? (
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-red/10 border border-red/20 text-red">
                <span>Erreur de chargement des services</span>
                <button onClick={fetchData} className="px-4 py-1.5 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red/80 transition-all">Réessayer</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-3 mb-12">
              {filters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeFilter === f ? "bg-gradient-to-r from-cyan to-violet text-white shadow-lg shadow-cyan/25" : "border border-[var(--card-border)] text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:border-cyan/30"}`}>
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* 3D Flip Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse">
                  <div className="h-full flex flex-col items-center justify-center p-5">
                    <div className="w-12 h-12 rounded-xl bg-navy/50 mb-3" />
                    <div className="h-4 w-16 bg-navy/50 rounded mb-2" />
                    <div className="h-5 w-28 bg-navy/50 rounded mb-2" />
                    <div className="h-4 w-32 bg-navy/50 rounded mb-2" />
                    <div className="h-5 w-20 rounded-full bg-navy/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? null : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {filteredServices.map((service, i) => {
                const Icon = iconMap[service.icon] || Code2;
                return (
                  <div key={service.slug} className="flip-card h-64 group cursor-pointer">
                    <div className="flip-card-inner relative w-full h-full">
                      {/* Front */}
                      <div className="flip-card-front absolute inset-0 rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)]">
                        <div className="absolute inset-0 opacity-15">
                          <Image src={service.image} alt={service.shortTitle} fill placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/85 to-transparent" />
                        <div className="relative h-full flex flex-col items-center justify-center p-5 text-center">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${service.color}22, ${service.color}44)` }}>
                            <Icon className="w-6 h-6" style={{ color: service.color }} />
                          </div>
                          <span className="text-xs font-bold tracking-wider mb-1.5" style={{ color: service.color }}>{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="text-base font-bold mb-1.5 leading-tight">{service.shortTitle}</h3>
                          <p className="text-xs text-[var(--foreground)]/60 line-clamp-2">{service.description}</p>
                          <span className="mt-2 text-xs px-2 py-0.5 rounded-full border border-[var(--card-border)] text-[var(--foreground)]/50">
                            {service.subServices.length} services
                          </span>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="flip-card-back absolute inset-0 rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] p-5 flex flex-col justify-center">
                        <h3 className="text-sm font-bold mb-3">{service.shortTitle}</h3>
                        <ul className="space-y-2 mb-4">
                          {service.subServices.map((sub: any) => (
                            <li key={sub.title} className="flex items-start gap-1.5 text-xs">
                              <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: service.color }} />
                              <span className="text-[var(--foreground)]/80">{sub.title}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold hover:gap-2.5 transition-all" style={{ color: service.color }}>
                          Explorer <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========== POURQUOI INNOV'YED ========== */}
      <section ref={whyRef} className="reveal relative py-24 bg-[var(--background)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-violet uppercase tracking-wider">Nos Avantages</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3" style={{ fontFamily: "var(--font-display)" }}>
              Pourquoi Innov&apos;Yed Solutions ?
            </h2>
          </div>

          {advantages.map((item, i) => (
            <div key={item.title} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center mb-20 last:mb-0`}>
              <div className="flex-1 relative">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 blur-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-cyan">0{i + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                </div>
                <p className="text-[var(--foreground)]/60 leading-relaxed text-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== METRICS SECTION ========== */}
      <section ref={metricsRef} className="reveal relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
          <div className="absolute inset-0 bg-navy/90" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: projectsCount, suffix: "+", label: "Projets Livrés", desc: "Applications, sites et solutions déployés avec succès" },
              { value: clientsCount, suffix: "+", label: "Clients Satisfaits", desc: "Entreprises et startups nous font confiance" },
              { value: yearsCount, suffix: "", label: "Années d'Expertise", desc: "D'expérience cumulée en technologie" },
              { value: satCount, suffix: "%", label: "Taux de Satisfaction", desc: "Mesuré par enquête NPS post-projet" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-5xl sm:text-6xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {m.value}{m.suffix}
                </div>
                <div className="text-cyan font-semibold text-lg mb-2">{m.label}</div>
                <p className="text-white/40 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-white/50 italic text-lg max-w-xl mx-auto">
              &ldquo;{testimonials.length > 0 ? testimonials[0].text : "Innov'Yed Solutions a transformé notre vision en réalité. Leur expertise technique est sans égale."}&rdquo;
            </p>
            <p className="text-cyan mt-3 text-sm">— {testimonials.length > 0 ? `${testimonials[0].name}, ${testimonials[0].role}` : "Marc TOGNON, CEO PayExpress"}</p>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section ref={testimonialsRef} className="reveal relative py-24 bg-[var(--section-bg)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green uppercase tracking-wider">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3" style={{ fontFamily: "var(--font-display)" }}>
              Ce que disent nos clients
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className={`transition-all duration-500 ${i === testimonialIdx ? "opacity-100 block" : "opacity-0 hidden"}`}>
                <div className="bg-[var(--card-bg)] rounded-2xl p-8 sm:p-12 border border-[var(--card-border)] shadow-xl text-center">
                  <Quote className="w-10 h-10 text-cyan/30 mx-auto mb-6" />
                  <p className="text-lg sm:text-xl leading-relaxed mb-8 text-[var(--foreground)]/80">{t.text}</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <Image src={t.avatar} alt={t.name} fill sizes="64px" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhM2IiIC8+PC9zdmc+" className="object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-[var(--foreground)]/50">{t.role}</div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-amber text-amber" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === testimonialIdx ? "bg-cyan w-8" : "bg-[var(--card-border)]"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section ref={processRef} className="reveal relative py-24 bg-[var(--background)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <Image src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-amber uppercase tracking-wider">Notre Méthodologie</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3" style={{ fontFamily: "var(--font-display)" }}>
              Comment nous travaillons
            </h2>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan via-violet to-cyan z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {processSteps.map((step, i) => (
                <div key={step.title} className="relative text-center group">
                  <div className="relative z-10 w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[var(--card-bg)] border-2 border-[var(--card-border)] group-hover:border-cyan transition-all shadow-lg">
                    <span className="text-2xl font-bold text-cyan">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--foreground)]/60 mb-2">{step.desc}</p>
                  <span className="text-xs text-cyan font-medium">{step.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TECHNOLOGIES ========== */}
      <section ref={techRef} className="reveal relative py-20 bg-[var(--section-bg)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-10 text-center">
          <span className="text-sm font-semibold text-cyan uppercase tracking-wider">Stack Technique</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Technologies Maîtrisées</h2>
        </div>
        <div className="ticker-wrap">
          <div className="ticker">
            {[...techLogos, ...techLogos].map((tech, i) => (
              <div key={i} className="flex-shrink-0 mx-4 px-8 py-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center gap-3 hover:border-cyan/30 transition-all">
                <Zap className="w-5 h-5 text-cyan" />
                <span className="font-semibold text-sm whitespace-nowrap">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG PREVIEW ========== */}
      <section ref={blogRef} className="reveal relative py-24 bg-[var(--background)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <Image src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-violet uppercase tracking-wider">Blog</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ fontFamily: "var(--font-display)" }}>Dernières Publications</h2>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-cyan font-semibold hover:gap-3 transition-all">
              Tout le Blog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.slice(0, 3).map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow-xl hover:shadow-cyan/5 transition-all group-hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={article.image} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium">{article.category}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan transition-colors">{article.title}</h3>
                    <p className="text-sm text-[var(--foreground)]/60 line-clamp-2 mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--foreground)]/40">
                      <span>{article.author}</span>
                      <span>{article.readTime} min de lecture</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section ref={ctaRef} className="reveal relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan/80 to-violet/70" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ctaParticlesData.map((p, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-white/10"
              style={{
                left: p.left,
                top: p.top,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }} />
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Prêt à construire l&apos;avenir ensemble ?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Chaque grand projet commence par une conversation. Contactez-nous aujourd&apos;hui et découvrez comment Innov&apos;Yed Solutions peut transformer votre vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"
              className="px-8 py-4 rounded-xl bg-white text-navy font-semibold text-lg hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
              Contactez-nous <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/portfolio"
              className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2">
              Voir nos Réalisations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
