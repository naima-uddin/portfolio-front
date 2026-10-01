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
// on the right. On mobile the image leads, then the text, then the stats.
// All text comes from the editable site content.
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
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-6 pt-20 pb-10 sm:gap-8 sm:pt-24 sm:pb-12 lg:grid-cols-[1.1fr_1fr_0.8fr] lg:gap-4 lg:pb-0">
        {/* Text */}
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="animate-slide-up text-[2.5rem] leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Hello I&apos;m <span className="heading-accent heading-accent-load text-brand-600">{config.firstName}</span>
          </h1>
          <p
            className="animate-slide-up mt-2 text-2xl font-bold text-white sm:mt-4 sm:text-4xl [text-shadow:0_2px_12px_rgba(71,85,105,0.35)]"
            style={{ animationDelay: "100ms" }}
          >
            {title}
          </p>
          <p
            className="animate-slide-up mx-auto mt-4 max-w-md text-base leading-relaxed sm:mt-6 sm:text-lg text-slate-700 lg:mx-0"
            style={{ animationDelay: "200ms" }}
          >
            {intro[0]}
          </p>
          <div
            className="animate-slide-up mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4 lg:justify-start"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/projects"
              className="flex-1 rounded-md bg-brand-600 px-5 py-3 text-center sm:flex-none sm:px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="flex-1 rounded-md border-2 border-white bg-white/10 px-5 py-2.5 text-center sm:flex-none sm:px-6 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/60"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Banner image */}
        <div
          className="animate-scale-in relative order-first mx-auto h-[280px] w-full max-w-[320px] self-end sm:h-[360px] sm:max-w-[360px] lg:order-none lg:h-[460px] lg:max-w-none"
          style={{ animationDelay: "200ms" }}
        >
          {/* Mobile: soft disc behind the portrait */}
          <div className="absolute bottom-0 left-1/2 aspect-square w-[250px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/80 via-white/40 to-brand-100/50 ring-1 ring-white/80 sm:w-[300px] lg:hidden" />
          {/* Floor shadow */}
          <div className="absolute bottom-2 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-slate-500/25 blur-xl" />
          <Image
            src={image}
            alt={config.name}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 420px"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(15,23,42,0.18)] [mask-image:linear-gradient(to_bottom,black_82%,transparent)] lg:[mask-image:none]"
          />
        </div>

        {/* Stats card */}
        <div
          className="animate-slide-in-right relative z-10 mx-auto w-full max-w-sm lg:mb-16"
          style={{ animationDelay: "400ms" }}
        >
          <div className="rounded-2xl border-2 border-white/80 bg-white/15 p-4 sm:p-6 shadow-xl shadow-slate-500/10 backdrop-blur-md">
            {/* Mobile: three compact columns; desktop: a label/value list */}
            <ul className="grid grid-cols-3 divide-x divide-white/80 lg:block lg:space-y-5 lg:divide-x-0">
              {stats.slice(0, 3).map((stat) => (
                <li
                  key={stat.label}
                  className="flex flex-col-reverse items-center gap-0.5 px-1 text-center lg:flex-row lg:justify-between lg:gap-4 lg:px-0 lg:text-left"
                >
                  <span className="text-[11px] leading-tight text-slate-600 lg:text-[15px]">{stat.label}</span>
                  <span className="text-2xl font-extrabold text-brand-600 lg:text-xl lg:font-bold lg:text-white lg:[text-shadow:0_1px_8px_rgba(71,85,105,0.4)]">
                    {stat.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col items-center gap-1 border-t border-white/70 pt-4 text-center text-sm sm:mt-6 sm:pt-5 lg:flex-row lg:justify-between lg:gap-4 lg:text-left">
              <span className="whitespace-nowrap text-slate-500">Availability :</span>
              <span className="font-medium text-green-600 lg:text-right">
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
