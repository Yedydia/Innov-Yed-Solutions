import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartContext";
import Script from "next/script";
import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const dmSerif = DM_Serif_Display({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Innov'Yed Solutions — L'Intelligence au Cœur de l'Avenir Numérique",
    template: "%s | Innov'Yed Solutions",
  },
  description: "Experts en informatique, cybersécurité, création web, maintenance et solutions numériques sur mesure. 10 domaines d'excellence pour transformer votre ambition en succès technologique.",
  keywords: "développement web, cybersécurité, intelligence artificielle, cloud, Bénin, Afrique, Innov'Yed Solutions, maintenance informatique, formation, e-commerce",
  authors: [{ name: "Innov'Yed Solutions", url: "https://www.innovyed.solutions" }],
  creator: "Innov'Yed Solutions",
  publisher: "Innov'Yed Solutions",
  metadataBase: new URL("https://www.innovyed.solutions"),
  openGraph: {
    title: "Innov'Yed Solutions — L'Intelligence au Cœur de l'Avenir Numérique",
    description: "10 domaines d'excellence pour transformer votre ambition en succès technologique. Cotonou, Bénin.",
    type: "website",
    locale: "fr_FR",
    siteName: "Innov'Yed Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Innov'Yed Solutions — L'Intelligence au Cœur de l'Avenir Numérique",
    description: "10 domaines d'excellence pour transformer votre ambition en succès technologique.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${dmSerif.variable} ${jetbrains.variable} antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a27" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <noscript>
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e27", color: "white", fontFamily: "sans-serif", textAlign: "center", padding: "2rem", zIndex: 9999 }}>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>JavaScript est requis</h1>
              <p style={{ color: "#8892b0" }}>Veuillez activer JavaScript pour profiter pleinement du site Innov&apos;Yed Solutions.</p>
            </div>
          </div>
        </noscript>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme");if(!t&&window.matchMedia("(prefers-color-scheme: light)").matches)t="light";if(t==="light")document.documentElement.classList.remove("dark");else document.documentElement.classList.add("dark")}catch(e){}})()`}
        </Script>
        <Script id="pwa-register" strategy="afterInteractive">
          {`if ("serviceWorker" in navigator) { window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js")); }`}
        </Script>
        <ThemeProvider>
          <CartProvider>
          <ToastProvider>
          <AppShell>{children}</AppShell>
          </ToastProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
