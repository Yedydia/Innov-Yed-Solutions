"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InnovBot from "@/components/InnovBot";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/components/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortail = pathname.startsWith("/portail");
  const isAdmin = pathname.startsWith("/admin");

  if (isPortail || isAdmin) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1 pt-20"><div className="animate-fadeIn">{children}</div></main>
      <Footer />
      <InnovBot />
      <CookieConsent />
    </AuthProvider>
  );
}
