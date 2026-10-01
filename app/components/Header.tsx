"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Image
                width={36}
                height={36}
                src="/assets/logo/Logo.svg"
                alt="Naima logo"
                priority
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="font-mono text-sm text-zinc-300">
              naima<span className="text-emerald-400">.dev</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-emerald-300 bg-emerald-400/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-emerald-300 transition-all duration-300"
          >
            Hire Me
            <ArrowUpRight size={15} />
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2.5 rounded-full glass text-zinc-200 active:scale-90 transition-transform"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-2 px-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`animate-slide-up w-full max-w-xs text-center py-4 rounded-2xl text-2xl font-bold transition-colors ${
                    isActive
                      ? "text-emerald-300"
                      : "text-zinc-300 hover:text-white"
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="animate-slide-up mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-400 text-zinc-950 font-semibold"
              style={{ animationDelay: "350ms" }}
            >
              Hire Me
              <ArrowUpRight size={18} />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
