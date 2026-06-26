"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("Tous");

  const domains = ["Tous", ...Array.from(new Set(teamMembers.flatMap((m) => m.specialties || [])))];

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

  if (loading) {
    return (
      <div>
        <section className="relative py-32 overflow-hidden bg-navy/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="h-12 w-64 bg-navy/50 rounded mx-auto mb-4" />
            <div className="h-6 w-80 bg-navy/50 rounded mx-auto" />
          </div>
        </section>
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {domains.map(d => <div key={d} className="h-10 w-24 rounded-lg bg-navy/50 animate-pulse" />)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse">
                  <div className="aspect-[3/4] bg-navy/50" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-navy/50" />
                    <div className="h-4 w-1/2 rounded bg-navy/50" />
                    <div className="h-4 w-full rounded bg-navy/50" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-navy/50" />
                      <div className="h-6 w-20 rounded-full bg-navy/50" />
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
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="h-12 w-64 bg-navy/50 rounded mx-auto mb-4" />
            <div className="h-6 w-80 bg-navy/50 rounded mx-auto" />
          </div>
        </section>
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-10 rounded-2xl bg-[var(--card-bg)] border border-red/20">
              <h3 className="text-xl font-bold text-red mb-2">Erreur de chargement</h3>
              <p className="text-[var(--foreground)]/60 mb-6">Impossible de charger l&apos;équipe. Vérifiez votre connexion et réessayez.</p>
              <button onClick={fetchTeam} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg transition-all">Réessayer</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const filteredMembers = filter === "Tous" ? teamMembers : teamMembers.filter((m) => m.specialties?.includes(filter));

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=100" alt="" fill sizes="100vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMjciIC8+PC9zdmc+" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Notre <span className="gradient-text">Équipe</span></h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">Des experts passionnés qui donnent vie à vos projets technologiques.</p>
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {domains.map((d) => (
              <button key={d} onClick={() => setFilter(d)} className={`px-4 py-2 text-sm rounded-lg transition-all ${filter === d ? "bg-gradient-to-r from-cyan to-violet text-white" : "border border-[var(--card-border)] text-[var(--foreground)]/60"}`}>{d}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((m) => (
              <div key={m.name} className="group rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={m.image} alt={m.name} fill sizes="320px" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhM2IiIC8+PC9zdmc+" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <p className="text-cyan text-sm">{m.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[var(--foreground)]/60 mb-4">{m.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {m.specialties.map((s: string) => (<span key={s} className="px-2.5 py-1 text-xs rounded-full bg-cyan/10 text-cyan">{s}</span>))}
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
