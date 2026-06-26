"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet blur-3xl" />
      </div>
      <div className="relative z-10 glass rounded-2xl p-10 sm:p-14 max-w-lg w-full text-center border border-[var(--glass-border)]">
        <div className="w-16 h-16 rounded-2xl bg-red/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Une erreur est survenue
        </h1>
        <p className="text-[var(--foreground)]/60 mb-8 max-w-sm mx-auto">
          Nous nous excusons pour la gêne occasionnée. Veuillez réessayer ou nous contacter si le problème persiste.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-white font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--card-border)] text-[var(--foreground)] font-semibold hover:bg-[var(--card-bg)] transition-all active:scale-95"
          >
            Retour à l&apos;Accueil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
