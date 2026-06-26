"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet blur-3xl" />
      </div>
      <div className="relative z-10 glass rounded-2xl p-10 sm:p-14 max-w-lg w-full text-center border border-[var(--glass-border)]">
        <div className="text-8xl sm:text-9xl font-bold gradient-text leading-none mb-4" style={{ fontFamily: "var(--font-display)" }}>
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Page non trouvée
        </h1>
        <p className="text-[var(--foreground)]/60 mb-8 max-w-sm mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95"
        >
          Retour à l&apos;Accueil
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
