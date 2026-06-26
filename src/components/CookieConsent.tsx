"use client";
import { useState, useEffect } from "react";
import { Cookie, Settings, X } from "lucide-react";

const COOKIE_KEY = "innovyed-cookies";
const NEVER_KEY = "innovyed-cookies-never";
const SHOW_EVENT = "innovyed-show-cookies";

type Prefs = { analytics: boolean; functional: boolean; marketing: boolean };

const INITIAL: Prefs = { analytics: false, functional: true, marketing: false };

export default function CookieConsent() {
  const [state, setState] = useState<"banner" | "preferences" | "accepted">("accepted");
  const [prefs, setPrefs] = useState<Prefs>(INITIAL);
  const [neverAgain, setNeverAgain] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    const never = localStorage.getItem(NEVER_KEY);
    if (!stored && !never) setState("banner");
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!localStorage.getItem(COOKIE_KEY)) setState("banner");
    };
    window.addEventListener(SHOW_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(SHOW_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const save = (p: Prefs) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    if (neverAgain) localStorage.setItem(NEVER_KEY, "true");
    setState("accepted");
  };

  if (state === "accepted") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 flex justify-center pointer-events-none">
      <div className="max-w-lg w-full glass rounded-2xl shadow-2xl p-6 border border-[var(--card-border)] pointer-events-auto">
        {state === "banner" ? (
          <>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">Respect de votre vie privée</h3>
                <p className="text-xs text-[var(--foreground)]/60 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => save({ analytics: true, functional: true, marketing: true })}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan to-violet text-white hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
                Tout Accepter
              </button>
              <button onClick={() => save({ analytics: false, functional: true, marketing: false })}
                className="px-5 py-2 text-sm font-medium rounded-lg text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-all">
                Refuser
              </button>
              <button onClick={() => setState("preferences")}
                className="px-3 py-2 text-sm text-cyan hover:underline flex items-center gap-1">
                <Settings className="w-3.5 h-3.5" /> Personnaliser
              </button>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-[var(--foreground)]/50 cursor-pointer">
              <input type="checkbox" checked={neverAgain} onChange={(e) => setNeverAgain(e.target.checked)} className="accent-cyan" />
              Ne plus afficher
            </label>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Personnaliser les cookies</h3>
              <button onClick={() => setState("banner")} className="text-[var(--foreground)]/50 hover:text-[var(--foreground)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: "functional" as const, label: "Cookies Fonctionnels", desc: "Nécessaires au fonctionnement du site (non désactivables)", required: true },
                { key: "analytics" as const, label: "Cookies Analytiques", desc: "Nous aident à comprendre l'utilisation du site" },
                { key: "marketing" as const, label: "Cookies Marketing", desc: "Permettent de personnaliser les publicités et le contenu" },
              ].map((c) => (
                <label key={c.key} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={prefs[c.key]} disabled={c.required}
                    onChange={(e) => setPrefs({ ...prefs, [c.key]: e.target.checked })}
                    className="mt-1 accent-cyan" />
                  <div>
                    <span className="text-sm font-medium">{c.label}</span>
                    <p className="text-xs text-[var(--foreground)]/50">{c.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => save(prefs)}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan to-violet text-white hover:shadow-lg hover:shadow-cyan/25 transition-all active:scale-95">
                Enregistrer mes préférences
              </button>
              <button onClick={() => setState("banner")}
                className="px-5 py-2 text-sm font-medium rounded-lg border border-[var(--card-border)] hover:bg-white/5 transition-all text-[var(--foreground)]">
                Retour
              </button>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-[var(--foreground)]/50 cursor-pointer">
              <input type="checkbox" checked={neverAgain} onChange={(e) => setNeverAgain(e.target.checked)} className="accent-cyan" />
              Ne plus afficher
            </label>
          </>
        )}
      </div>
    </div>
  );
}
