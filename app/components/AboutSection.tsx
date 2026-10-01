import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Briefcase,
  Monitor,
  Server,
  Database,
  Wrench,
} from "lucide-react";
import Reveal from "./Reveal";
import {
  siteConfig,
  education as defaultEducation,
  skills as defaultSkills,
  stats as defaultStats,
  type SiteConfig,
  type Education,
  type Skills,
  type Stat,
} from "@/lib/data";

const SectionHeading = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => (
  <div className="mb-8 lg:mb-10">
    <p className="font-mono text-sm font-semibold text-brand-600 mb-3">{eyebrow}</p>
    <h2 className="text-3xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
      {title}
    </h2>
  </div>
);

// One stop on the left panel's dotted timeline.
const PanelItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="relative pl-12">
    <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 ring-1 ring-brand-200 shadow-sm">
      {icon}
    </span>
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">
      {label}
    </p>
    <div className="mt-1 text-zinc-800">{children}</div>
  </div>
);

const WHAT_I_DO: { key: keyof Skills; title: string; icon: React.ReactNode }[] = [
  { key: "frontend", title: "Frontend", icon: <Monitor size={22} /> },
  { key: "backend", title: "Backend", icon: <Server size={22} /> },
  { key: "database", title: "Database", icon: <Database size={22} /> },
  { key: "tools", title: "Tools", icon: <Wrench size={22} /> },
];

const AboutSection = ({
  config = siteConfig,
  education = defaultEducation,
  skills = defaultSkills,
  stats = defaultStats,
}: {
  config?: SiteConfig;
  education?: Education;
  skills?: Skills;
  stats?: Stat[];
}) => {
  const [title, ...rest] = config.role.split("·").map((s) => s.trim());

  return (
    <section id="about" className="scroll-mt-16 relative bg-[#eceef2] py-14 lg:py-16">
      {/* Same content width as the hero banner */}
      <div className="mx-auto w-full max-w-7xl px-6">
      <Reveal>
          <div className="grid overflow-hidden rounded-3xl bg-[#f8f9fb] ring-1 ring-slate-900/5 shadow-lg shadow-slate-900/5 lg:grid-cols-[320px_1fr]">
            {/* Left: education panel */}
            <aside className="relative bg-gradient-to-b from-[#eef8f1] to-[#f4faf5] border-r border-brand-100 px-6 py-12 sm:px-10 lg:px-8 lg:py-14 lg:flex lg:flex-col lg:justify-center">
              <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(26,127,55,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="relative">
                <p className="font-mono text-sm font-semibold text-brand-600">01 — About</p>
                <h3 className="mt-2 text-2xl font-bold text-zinc-900">Education</h3>

                {/* Dotted timeline */}
                <div className="relative mt-8 space-y-8">
                  <div className="absolute left-[17px] top-2 bottom-2 border-l-2 border-dotted border-brand-300" />
                  <PanelItem icon={<GraduationCap size={18} />} label={education.period}>
                    <p className="font-semibold leading-snug">{education.degree}</p>
                    <p className="mt-1 text-sm text-slate-600">{education.institution}</p>
                    <span className="mt-2 inline-block rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                      {education.result}
                    </span>
                  </PanelItem>
                  <PanelItem icon={<Briefcase size={18} />} label="Currently">
                    <p className="font-semibold leading-snug">
                      {title} @ {config.company}
                    </p>
                  </PanelItem>
                  <PanelItem icon={<MapPin size={18} />} label="Based in">
                    <p className="font-semibold leading-snug">{config.location}</p>
                  </PanelItem>
                </div>
              </div>
            </aside>

            {/* Right: about content */}
            <div className="px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
              <div className="border-2 border-dashed border-brand-200 rounded-2xl py-5 text-center">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.08em] text-zinc-900">
                  About <span className="text-brand-600">Me</span>
                </h2>
              </div>

              <p className="mt-8 text-xl sm:text-2xl text-slate-600">
                I&apos;m <span className="font-bold text-zinc-900">{config.name},</span>{" "}
                {title}
                {rest.length > 0 && ` / ${rest.join(" / ")}`}
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {config.summary}
              </p>

              <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_1fr]">
                {/* Stats block */}
                <div className="grid grid-cols-2 rounded-2xl bg-white text-center ring-1 ring-slate-900/5 shadow-lg shadow-slate-900/5">
                  {stats.slice(0, 4).map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`flex flex-col items-center justify-center px-4 py-7 border-dotted border-slate-300 ${
                        i % 2 === 0 ? "border-r-2" : ""
                      } ${i < 2 ? "border-b-2" : ""}`}
                    >
                      <span className="text-4xl sm:text-5xl font-extrabold text-brand-600">
                        {stat.value}
                      </span>
                      <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* What I do */}
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">What I Do?</h3>
                  <ul className="mt-4 space-y-4">
                    {WHAT_I_DO.filter(({ key }) => skills[key]?.length).map(
                      ({ key, title: heading, icon }) => (
                        <li key={key} className="flex items-start gap-4">
                          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                            {icon}
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-900">
                              {heading}
                            </p>
                            <p className="mt-1 text-sm leading-snug text-slate-500">
                              {skills[key].join(" · ")}
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                More about me
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
      </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
export { SectionHeading };
