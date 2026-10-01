import { Github, Linkedin, Facebook, Instagram } from "lucide-react";
import { siteConfig, type SiteConfig } from "@/lib/data";

const Footer = ({ config = siteConfig }: { config?: SiteConfig }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0d1117] border-t border-[#30363d] overflow-hidden">
      {/* Bottom bar */}
      <div>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-center text-sm text-[#8b949e] sm:text-left">
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
