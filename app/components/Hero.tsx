import Image from "next/image";
import Link from "next/link";
import {
  siteConfig,
  heroIntro,
  stats as defaultStats,
  type SiteConfig,
  type Stat,
} from "@/lib/data";

// Light, airy banner: greeting + role on the left, the banner image
// (uploaded from the dashboard) in the middle, and a glass stats card
// on the right. All text comes from the editable site content.
const Hero = ({
  config = siteConfig,
  intro = heroIntro,
  stats = defaultStats,
}: {
  config?: SiteConfig;
  intro?: string[];
  stats?: Stat[];
}) => {
  const image = config.heroImage || config.photo;
  // "Frontend Developer · MERN Stack" → "Frontend Developer"
  const title = config.role.split("·")[0].trim();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-[#d4d6de] via-[#e2e3e9] to-[#eceef2]"
    >
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pt-24 pb-12 lg:grid-cols-[1.1fr_1fr_0.8fr] lg:gap-4 lg:pb-0">
        {/* Text */}
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="animate-slide-up text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Hello I&apos;m <span className="text-slate-600">{config.firstName}</span>
          </h1>
          <p
            className="animate-slide-up mt-4 text-3xl font-bold text-white sm:text-4xl [text-shadow:0_2px_12px_rgba(71,85,105,0.35)]"
            style={{ animationDelay: "100ms" }}
          >
            {title}
          </p>
          <p
            className="animate-slide-up mx-auto mt-6 max-w-md text-lg leading-relaxed text-slate-700 lg:mx-0"
            style={{ animationDelay: "200ms" }}
          >
            {intro[0]}
          </p>
          <div
            className="animate-slide-up mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/projects"
              className="rounded-md bg-slate-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-md border-2 border-white bg-white/10 px-6 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/60"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Banner image */}
        <div
          className="animate-scale-in relative mx-auto h-[300px] w-full max-w-[360px] self-end sm:h-[360px] lg:h-[460px] lg:max-w-none"
          style={{ animationDelay: "200ms" }}
        >
          {/* Floor shadow */}
          <div className="absolute bottom-2 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-slate-500/25 blur-xl" />
          <Image
            src={image}
            alt={config.name}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 420px"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(15,23,42,0.18)]"
          />
        </div>

        {/* Stats card */}
        <div
          className="animate-slide-in-right relative z-10 mx-auto w-full max-w-sm lg:mb-16"
          style={{ animationDelay: "400ms" }}
        >
          <div className="rounded-2xl border-2 border-white/80 bg-white/15 p-6 shadow-xl shadow-slate-500/10 backdrop-blur-md">
            <ul className="space-y-5">
              {stats.slice(0, 3).map((stat) => (
                <li key={stat.label} className="flex items-center justify-between gap-4">
                  <span className="text-[15px] text-slate-600">{stat.label}</span>
                  <span className="text-xl font-bold text-white [text-shadow:0_1px_8px_rgba(71,85,105,0.4)]">
                    {stat.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/70 pt-5 text-sm">
              <span className="whitespace-nowrap text-slate-500">Availability :</span>
              <span className="text-right font-medium text-green-600">
                {config.availability}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
