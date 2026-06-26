"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

import { Menu, X, Search, Zap, ShoppingCart, User } from "lucide-react";

function CartIcon() {
  const { itemCount } = useCart();
  return (
    <Link href="/boutique/checkout" className="relative group">
      <div className="p-2 rounded-xl transition-all duration-300 group-hover:bg-white/[0.06] group-hover:shadow-lg group-hover:shadow-cyan/5">
        <ShoppingCart className="w-[18px] h-[18px] text-white/60 group-hover:text-cyan transition-colors duration-300" />
      </div>
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-cyan to-violet text-navy text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-[#0B1120]">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

function AuroraNavLink({ href, label, isActive, scrolled }: { href: string; label: string; isActive: boolean; scrolled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.12, y: y * 0.12 });
  }, []);

  const handleLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      className="relative" style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <Link href={href}
        className={`aurora-link relative px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 inline-flex items-center gap-1.5 whitespace-nowrap
          ${isActive
            ? "text-white bg-gradient-to-r from-cyan/20 via-violet/15 to-blue-500/20 shadow-lg shadow-cyan/10 border border-cyan/20"
            : scrolled
              ? "text-white/60 hover:text-white hover:bg-white/[0.05]"
              : "text-white/70 hover:text-white hover:bg-white/[0.06]"
          }`}>
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />}
        {label}
      </Link>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchServices, setSearchServices] = useState<typeof services>([]);
  const [ctaPos, setCtaPos] = useState({ x: 50, y: 50 });
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setSearchServices).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/academie", label: "Académie" },
    { href: "/boutique", label: "Boutique" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/contact", label: "Contact" },
  ];

  const handleCtaMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    setCtaPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${scrolled ? "h-[60px]" : "h-[80px]"}`}>
        {/* Aurora border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
          <div className="aurora-border-line" />
        </div>

        {/* Background */}
        <div className={`absolute inset-0 transition-all duration-700 ease-out ${scrolled ? "bg-[#0B1120]/85 backdrop-blur-2xl shadow-xl shadow-black/10" : "bg-gradient-to-b from-[#0B1120]/40 to-transparent"}`} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 rounded-2xl aurora-logo-bg flex items-center justify-center overflow-hidden shadow-lg shadow-cyan/15 group-hover:shadow-cyan/25 transition-shadow duration-500">
              <Zap className="w-5 h-5 text-white relative z-10" />
              <div className="aurora-logo-glow" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`font-bold text-[17px] tracking-tight leading-tight transition-colors duration-500 ${scrolled ? "text-[var(--foreground)]" : "text-white"}`}>
                Innov&apos;Yed
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] aurora-text-gradient leading-tight">
                Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1 shrink-0 flex-nowrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return <AuroraNavLink key={link.href} href={link.href} label={link.label} isActive={isActive} scrolled={scrolled} />;
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            <button aria-label="Rechercher" onClick={() => setCmdOpen(true)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${scrolled ? "text-white/50 hover:text-white hover:bg-white/[0.06]" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}>
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Cart */}
            <CartIcon />

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/[0.08] mx-1" />

            {/* CTA Devis */}
            <Link ref={ctaRef} href="/devis" onMouseMove={handleCtaMouse}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full text-white relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-cyan/20 active:scale-95 whitespace-nowrap"
              style={{ background: `radial-gradient(circle at ${ctaPos.x}% ${ctaPos.y}%, #22d3ee, #4F46E5 50%, #7C3AED)` }}>
              <Zap className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Devis Gratuit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/[0.08] mx-1" />

            {/* Espace Client */}
            <Link href={user ? "/portail/dashboard" : "/portail/auth"}
              className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-full border transition-all duration-300 whitespace-nowrap
                ${user
                  ? "border-cyan/30 text-cyan bg-cyan/[0.06] hover:bg-cyan/10 hover:shadow-lg hover:shadow-cyan/10"
                  : "border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.05] hover:border-white/20"
                }`}>
              {user ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  Mon Espace
                </>
              ) : (
                "Espace Client"
              )}
            </Link>

            {/* Mobile Menu */}
            <button aria-label={mobileOpen ? "Fermer" : "Menu"} onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2.5 rounded-xl transition-all duration-300 hover:bg-white/[0.06]">
              <div className="w-5 h-5 relative flex flex-col justify-center items-center gap-1.5">
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 xl:hidden transition-all duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-[#0B1120]/95 backdrop-blur-3xl shadow-2xl overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-l border-white/[0.04] ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl aurora-logo-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-white">Innov&apos;Yed</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Links */}
          <div className="px-4 py-2">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`aurora-mobile-link flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium rounded-2xl transition-all duration-300 mb-0.5
                    ${isActive
                      ? "text-white bg-gradient-to-r from-cyan/15 to-violet/10 border border-cyan/20"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="px-4 pb-8 pt-4 border-t border-white/[0.04] mt-2 space-y-3">
            <Link href="/devis" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-white text-[15px] transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #22d3ee, #4F46E5, #7C3AED)" }}>
              <Zap className="w-4 h-4" />
              Devis Gratuit
            </Link>
            <Link href={user ? "/portail/dashboard" : "/portail/auth"} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-medium text-white/70 text-[15px] border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all">
              {user ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  Mon Espace
                </>
              ) : (
                "Espace Client"
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" onClick={() => setCmdOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl glass rounded-3xl shadow-2xl overflow-hidden border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-cyan/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-cyan" />
              </div>
              <input autoFocus placeholder="Rechercher services, articles..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-[15px]"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-mono rounded-lg bg-white/[0.06] text-white/40 border border-white/[0.06]">ESC</kbd>
            </div>
            <div className="p-3 max-h-[320px] overflow-y-auto">
              {(() => {
                const q = searchQuery.toLowerCase();
                const filteredServices = q ? searchServices.filter((s) => s.shortTitle.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) : searchServices.slice(0, 5);
                const navItems = [{h:"/blog",l:"Blog"},{h:"/academie",l:"Académie"},{h:"/boutique",l:"Boutique"},{h:"/portfolio",l:"Portfolio"},{h:"/contact",l:"Contact"}];
                const filteredNav = q ? navItems.filter((n) => n.l.toLowerCase().includes(q)) : navItems;
                return (<>
                  {filteredServices.length > 0 && <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-3">Services</p>}
                  {filteredServices.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setCmdOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{s.shortTitle}</span>
                    </Link>
                  ))}
                  {filteredNav.length > 0 && <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mt-3 mb-2 px-3">Navigation</p>}
                  {filteredNav.map((n) => (
                    <Link key={n.h} href={n.h} onClick={() => setCmdOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                        <span className="text-[11px] text-white/30">{n.l.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{n.l}</span>
                    </Link>
                  ))}
                  {filteredServices.length === 0 && filteredNav.length === 0 && (
                    <p className="text-sm text-white/30 text-center py-8">Aucun résultat</p>
                  )}
                </>);
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
