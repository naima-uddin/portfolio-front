import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { siteConfig, heroIntro, type SiteConfig } from "@/lib/data";

// Minimal conversational hero: greeting, short intro,
// a single résumé CTA, and a small square photo on the right.
const Hero = ({
  config = siteConfig,
  intro = heroIntro,
}: {
  config?: SiteConfig;
  intro?: string[];
}) => {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0f]">
      <div className="mx-auto w-full max-w-4xl px-6 pt-28 pb-20">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12">
          {/* Text */}
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="animate-slide-up text-3xl sm:text-4xl font-bold text-white mb-8">
              Hey there, I&apos;m {config.firstName}!{" "}
              <span className="inline-block origin-[70%_70%] hover:animate-[wave_0.6s_ease-in-out_2]">
                👋
              </span>
            </h1>

            <div
              className="animate-slide-up mb-8 text-lg text-zinc-400 tracking-wide leading-relaxed space-y-3"
              style={{ animationDelay: "150ms" }}
            >
              {intro.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div
              className="animate-slide-up flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href={config.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-emerald-400 px-5 py-2.5 text-base font-semibold text-zinc-950 transition-colors duration-200 hover:bg-emerald-300"
              >
                View Résumé
              </a>
              <div className="flex items-center gap-1">
                <a
                  href={config.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 rounded-lg text-zinc-500 hover:text-emerald-300 hover:bg-white/5 transition-all duration-200"
                >
                  <Github size={19} />
                </a>
                <a
                  href={config.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-lg text-zinc-500 hover:text-emerald-300 hover:bg-white/5 transition-all duration-200"
                >
                  <Linkedin size={19} />
                </a>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div
            className="animate-scale-in flex-shrink-0"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden">
              <Image
                src={config.photo}
                alt={config.name}
                fill
                className="object-cover"
                priority
                sizes="208px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
