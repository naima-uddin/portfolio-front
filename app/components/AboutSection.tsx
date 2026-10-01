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
import { stagger } from "@/lib/utils";
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
  index,
  icon,
  label,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="reveal-item relative pl-11" style={stagger(index)}>
    <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-600 ring-1 ring-brand-200">
      {icon}
    </span>
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
      {label}
    </p>
    <div className="mt-0.5 text-sm text-zinc-800">{children}</div>
  </div>
);

const WHAT_I_DO: { key: keyof Skills; title: string; icon: React.ReactNode }[] = [
  { key: "frontend", title: "Frontend", icon: <Monitor size={18} /> },
  { key: "backend", title: "Backend", icon: <Server size={18} /> },
  { key: "database", title: "Database", icon: <Database size={18} /> },
  { key: "tools", title: "Tools", icon: <Wrench size={18} /> },
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
          <div className="grid overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/5 shadow-sm lg:grid-cols-[280px_1fr]">
            {/* Left: education panel */}
            <aside className="relative bg-[#f1f8f3] border-b lg:border-b-0 lg:border-r border-brand-100 px-6 py-8">
              <h3 className="reveal-item text-lg font-bold text-zinc-900" style={stagger(0)}>
                Education
              </h3>

              {/* Dotted timeline */}
              <div className="relative mt-5 space-y-5">
                <div className="absolute left-[15px] top-2 bottom-2 border-l-2 border-dotted border-brand-200" />
                <PanelItem index={1} icon={<GraduationCap size={15} />} label={education.period}>
                  <p className="font-semibold leading-snug">{education.degree}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{education.institution}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-200">
                    {education.result}
                  </span>
                </PanelItem>
                <PanelItem index={2} icon={<Briefcase size={15} />} label="Currently">
                  <p className="font-semibold leading-snug">
                    {title} @ {config.company}
                  </p>
                </PanelItem>
                <PanelItem index={3} icon={<MapPin size={15} />} label="Based in">
                  <p className="font-semibold leading-snug">{config.location}</p>
                </PanelItem>
              </div>
            </aside>

            {/* Right: about content */}
            <div className="px-6 py-8 sm:px-8">
              <div className="reveal-item flex flex-wrap items-end justify-between gap-3" style={stagger(1)}>
                <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
                  About <span className="heading-accent text-brand-600">Me</span>
                </h2>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  More about me
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <p className="reveal-item mt-3 text-base text-slate-600" style={stagger(2)}>
                I&apos;m <span className="font-semibold text-zinc-900">{config.name},</span>{" "}
                {title}
                {rest.length > 0 && ` / ${rest.join(" / ")}`}
              </p>
              <p className="reveal-item mt-2 text-sm leading-relaxed text-slate-500" style={stagger(3)}>
                {config.summary}
              </p>

              {/* Stats strip */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 rounded-xl bg-[#f8f9fb] ring-1 ring-slate-900/5">
                {stats.slice(0, 4).map((stat, i) => (
                  <div
                    key={stat.label}
                    style={stagger(4 + i)}
                    className={`reveal-item px-3 py-4 text-center border-dotted border-slate-300 ${
                      i > 0 ? "sm:border-l-2" : ""
                    } ${i % 2 === 1 ? "border-l-2" : ""} ${i < 2 ? "border-b-2 sm:border-b-0" : ""}`}
                  >
                    <p className="text-2xl lg:text-3xl font-extrabold text-brand-600">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* What I do */}
              <h3 className="reveal-item mt-6 text-base font-bold text-zinc-900" style={stagger(8)}>
                What I Do?
              </h3>
              <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                {WHAT_I_DO.filter(({ key }) => skills[key]?.length).map(
                  ({ key, title: heading, icon }, i) => (
                    <li key={key} className="reveal-item flex items-start gap-3" style={stagger(9 + i)}>
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        {icon}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-900">
                          {heading}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-slate-500">
                          {skills[key].join(" · ")}
                        </p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
export { SectionHeading };
