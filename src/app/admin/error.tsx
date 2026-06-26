"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 sm:p-14 max-w-lg w-full text-center border border-[var(--glass-border)]">
        <div className="w-16 h-16 rounded-2xl bg-red/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Une erreur est survenue dans l&apos;administration
        </h1>
        <p className="text-[var(--foreground)]/60 mb-8 max-w-sm mx-auto">
          Nous nous excusons pour la gêne occasionnée. Veuillez réessayer ou nous contacter si le problème persiste.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-cyan text-white font-semibold hover:shadow-lg hover:shadow-violet/25 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-violet/30 text-violet-light font-semibold hover:bg-violet/5 transition-all active:scale-95"
          >
            Retour à l&apos;Administration
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
