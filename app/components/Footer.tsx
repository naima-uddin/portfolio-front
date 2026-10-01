import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Facebook, Instagram } from "lucide-react";
import Reveal from "./Reveal";
import { siteConfig, type SiteConfig } from "@/lib/data";

const Footer = ({ config = siteConfig }: { config?: SiteConfig }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0d1117] border-t border-[#30363d] overflow-hidden">
      {/* Big CTA */}
      <div className="relative max-w-6xl mx-auto px-6 py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] glow-navy" />
        <Reveal>
          <div className="relative text-center">
            <p className="font-mono text-sm font-semibold text-brand-400 mb-4">
              04 — Contact
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Have a project in mind?
              <br />
              <span className="text-brand-300">Let&apos;s build it together.</span>
            </h2>
            <p className="mt-6 text-lg text-[#8b949e] max-w-xl mx-auto">
              I&apos;m always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-all duration-300 hover:shadow-lg shadow-brand-500/30"
              >
                Get in touch
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <a
                href={`mailto:${config.email}`}
                className="inline-flex items-center px-8 py-4 rounded-full gh-card text-[#c9d1d9] font-medium hover:bg-white/10 transition-all duration-300 font-mono text-sm"
              >
                {config.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#30363d]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-sm text-[#8b949e]">
            © {year} {config.name}. Built with Next.js & Tailwind CSS.
          </p>
          <div className="flex items-center gap-1">
            {[
              { href: config.github, icon: <Github size={17} />, label: "GitHub" },
              { href: config.linkedin, icon: <Linkedin size={17} />, label: "LinkedIn" },
              { href: config.facebook, icon: <Facebook size={17} />, label: "Facebook" },
              { href: config.instagram, icon: <Instagram size={17} />, label: "Instagram" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2.5 rounded-full text-[#8b949e] hover:text-brand-400 hover:bg-white/5 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
