"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-red/10 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Erreur de chargement
        </h2>
        <p className="text-sm text-[var(--foreground)]/60 mb-6">
          Une erreur est survenue lors du chargement de cette page. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-violet text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    </div>
  );
}
