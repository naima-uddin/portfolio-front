"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, CodeXml, Github, Linkedin, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig, type SiteConfig } from "@/lib/data";

// Section links point at the one-page home overview.
const navItems = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#works", label: "Works" },
  { href: "/#contact", label: "Contact" },
];

const Header = ({ config = siteConfig }: { config?: SiteConfig }) => {
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

  // The admin area has its own sidebar layout.
  if (pathname.startsWith("/admin")) return null;

  // Transparent over the light home banner; a frosted light bar elsewhere
  // so the dark text stays readable over the dark sections and pages.
  const solid = scrolled || pathname !== "/";

  const socials = [
    { href: config.github, label: "GitHub", icon: Github },
    { href: config.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${config.email}`, label: "Email", icon: Mail },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-[#e6e7ec]/85 backdrop-blur-xl shadow-sm shadow-slate-900/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-900 font-semibold text-lg group"
          >
            <CodeXml
              size={22}
              strokeWidth={2.25}
              className="transition-transform duration-300 group-hover:-rotate-6"
            />
            Portfolio
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-zinc-950 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="hidden md:flex items-center gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-1 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:text-zinc-950"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2.5 rounded-full bg-white/50 text-zinc-900 active:scale-90 transition-transform"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[#e6e7ec]/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-2 px-8">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="animate-slide-up w-full max-w-xs text-center py-4 rounded-2xl text-2xl font-bold text-slate-700 hover:text-zinc-950 transition-colors"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <div
              className="animate-slide-up mt-6 flex items-center gap-5"
              style={{ animationDelay: "450ms" }}
            >
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 text-slate-700 hover:text-zinc-950"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
