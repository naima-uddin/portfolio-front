import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Code,
  Database,
  ExternalLink,
  Folder,
  Github,
  Globe,
  GraduationCap,
  Images,
  Layers,
  Lightbulb,
  Server,
  Shield,
  Sparkles,
  Star,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { stagger } from "@/lib/utils";
import Footer from "@/components/Footer";
import { getProjectById, getProjects } from "@/lib/projectService";
import { getSiteContent } from "@/lib/siteContentService";

// Cached static HTML; revalidated on-demand when the admin saves, hourly otherwise.
export const revalidate = 3600;

// Prebuild a static page for every known project so detail pages load
// instantly. Projects added later render on-demand, then cache (ISR).
export async function generateStaticParams() {
  const { projects } = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};
  return {
    title: `${project.title} — Naima Uddin`,
    description: project.shortDesc,
  };
}

const techIcons: Record<string, React.ReactNode> = {
  frontend: <Globe className="w-3.5 h-3.5" />,
  backend: <Server className="w-3.5 h-3.5" />,
  database: <Database className="w-3.5 h-3.5" />,
  ai: <Star className="w-3.5 h-3.5" />,
  realtime: <Zap className="w-3.5 h-3.5" />,
  deployment: <Layers className="w-3.5 h-3.5" />,
  integration: <Shield className="w-3.5 h-3.5" />,
};

// Soft tint of the project's accent color (works with any CSS color value).
const tint = (color: string, amount: number) =>
  `color-mix(in srgb, ${color} ${amount}%, transparent)`;

// Shared type scale so every section on the page reads the same.
const h2Class =
  "reveal-item flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-5 sm:mb-6";
const h3Class = "flex items-center gap-2.5 text-base font-semibold text-zinc-900";
const bodyClass = "text-sm sm:text-[15px] text-slate-600 leading-relaxed";
const eyebrowClass = "font-mono text-xs uppercase tracking-wider text-slate-500";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-white text-sm sm:text-base font-semibold whitespace-nowrap hover:bg-brand-700 hover:shadow-lg shadow-brand-600/25 transition-all duration-300";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full surface text-zinc-800 text-sm sm:text-base font-medium whitespace-nowrap hover:bg-brand-700/10 hover:text-brand-700 transition-all duration-300";

function IconBadge({
  color,
  children,
  size = "md",
}: {
  color: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${
        size === "md" ? "w-10 h-10" : "w-8 h-8 rounded-lg"
      }`}
      style={{ backgroundColor: tint(color, 12), color }}
    >
      {children}
    </span>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, { profile }, { projects }] = await Promise.all([
    getProjectById(id),
    getSiteContent(),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const accent = project.color || "#1a7f37";

  // Repo buttons: explicit repo links, else the single GitHub URL.
  const repos = project.repoLinks?.length
    ? project.repoLinks
    : project.githubUrl && project.githubUrl !== "#"
    ? [{ label: "GitHub", url: project.githubUrl }]
    : [];
  const gallery = project.gallery ?? [];
  const hasLive = Boolean(project.liveUrl) && project.liveUrl !== "#";
  const techEntries = Object.entries(project.techStack).filter(
    ([, list]) => list && list.length > 0
  );

  // Next project in the list (wraps around).
  const index = projects.findIndex((p) => p.id === project.id);
  const nextProject =
    projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  return (
    <main className="bg-[#eceef2] min-h-screen overflow-x-hidden">
      <div className="relative pt-28 pb-16 sm:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-[200vw] h-[400px] opacity-20"
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${accent}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eceef2]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/projects"
            className="animate-fade-in group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors mb-6 sm:mb-10"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Back to projects
          </Link>

          {/* Hero */}
          <header className="mb-8 sm:mb-12">
            <div className="animate-slide-down flex flex-wrap items-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider font-semibold"
                style={{ backgroundColor: tint(accent, 12), color: accent }}
              >
                <Folder size={12} />
                {project.category}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider font-semibold border ${
                  project.status === "Live"
                    ? "bg-green-50 text-green-700 border-green-600/20"
                    : "bg-blue-50 text-blue-700 border-blue-600/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    project.status === "Live"
                      ? "bg-green-500 animate-blink"
                      : "bg-blue-500"
                  }`}
                />
                {project.status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider font-semibold bg-white/70 border border-slate-900/10 text-slate-600">
                <Calendar size={12} />
                {project.duration}
              </span>
            </div>

            <h1
              className="animate-slide-up max-w-4xl text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.15] text-balance"
              style={{ animationDelay: "100ms" }}
            >
              {project.title}
            </h1>

            <p
              className="animate-slide-up mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed"
              style={{ animationDelay: "220ms" }}
            >
              {project.description}
            </p>

            <div
              className="animate-slide-up flex flex-wrap gap-3 mt-7 sm:mt-9"
              style={{ animationDelay: "340ms" }}
            >
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primaryBtn} w-full sm:w-auto`}
                >
                  <ExternalLink size={17} />
                  Live Demo
                </a>
              )}
              {repos.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${secondaryBtn} flex-1 basis-[130px] sm:flex-none sm:basis-auto`}
                >
                  <Github size={17} />
                  {repo.label}
                </a>
              ))}
            </div>
          </header>

          {/* Cover */}
          <Reveal>
            <div className="relative aspect-[16/10] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden surface mb-12 sm:mb-16 lg:mb-20">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 1100px"
                />
              ) : (
                <div className="absolute inset-0 bg-grid bg-[#e2e4ea] flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${accent}, transparent 70%)`,
                    }}
                  />
                  <span
                    className="relative font-mono text-4xl sm:text-6xl font-bold"
                    style={{ color: accent }}
                  >
                    {"</>"}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Content grid */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-12">
            <div className="min-w-0 space-y-12 sm:space-y-16">
              {/* Features */}
              {project.keyFeatures.length > 0 && (
                <Reveal>
                  <section>
                    <h2 style={stagger(0)} className={h2Class}>
                      <IconBadge color={accent}>
                        <Sparkles size={18} />
                      </IconBadge>
                      Key Features
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {project.keyFeatures.map((feature, i) => (
                        <div
                          key={feature}
                          style={stagger(1 + i)}
                          className="reveal-item flex items-start gap-3 p-4 sm:p-5 surface rounded-2xl h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <span
                            className="mt-0.5 inline-flex w-5 h-5 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: tint(accent, 15), color: accent }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className={bodyClass}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Challenges & Solutions */}
              {project.challenges?.length && project.solutions?.length ? (
                <Reveal>
                  <section>
                    <h2 style={stagger(0)} className={h2Class}>
                      <IconBadge color={accent}>
                        <Lightbulb size={18} />
                      </IconBadge>
                      Challenges & Solutions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                      <div
                        className="reveal-item surface rounded-2xl p-5 sm:p-6"
                        style={stagger(1)}
                      >
                        <h3 className={`${h3Class} mb-4 pb-4 border-b border-slate-900/10`}>
                          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <TriangleAlert size={16} />
                          </span>
                          The challenges
                        </h3>
                        <ul className="space-y-3">
                          {project.challenges.map((item) => (
                            <li key={item} className={`flex gap-3 ${bodyClass}`}>
                              <span className="mt-1 inline-flex w-4 h-4 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                <X size={10} strokeWidth={3} />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        className="reveal-item surface rounded-2xl p-5 sm:p-6"
                        style={stagger(2)}
                      >
                        <h3 className={`${h3Class} mb-4 pb-4 border-b border-slate-900/10`}>
                          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                            <Lightbulb size={16} />
                          </span>
                          How I solved them
                        </h3>
                        <ul className="space-y-3">
                          {project.solutions.map((item) => (
                            <li key={item} className={`flex gap-3 ${bodyClass}`}>
                              <span className="mt-1 inline-flex w-4 h-4 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                <Check size={10} strokeWidth={3} />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                </Reveal>
              ) : null}

              {/* Learnings */}
              {project.learnings?.length ? (
                <Reveal>
                  <section>
                    <h2 style={stagger(0)} className={h2Class}>
                      <IconBadge color={accent}>
                        <GraduationCap size={18} />
                      </IconBadge>
                      What I learned
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {project.learnings.map((learning, i) => (
                        <div
                          key={learning}
                          style={stagger(1 + i)}
                          className="reveal-item flex items-start gap-3 p-4 sm:p-5 surface rounded-2xl h-full"
                        >
                          <span
                            className="font-mono text-xs font-semibold mt-0.5 sm:mt-1"
                            style={{ color: accent }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={bodyClass}>{learning}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ) : null}

              {/* Gallery */}
              {gallery.length > 0 && (
                <Reveal>
                  <section>
                    <h2 style={stagger(0)} className={h2Class}>
                      <IconBadge color={accent}>
                        <Images size={18} />
                      </IconBadge>
                      Screenshots
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {gallery.map((src, i) => (
                        <a
                          key={src}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={stagger(1 + i)}
                          className="reveal-item group relative aspect-video rounded-2xl overflow-hidden surface block"
                        >
                          <Image
                            src={src}
                            alt={`${project.title} screenshot ${i + 1}`}
                            fill
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 400px"
                          />
                        </a>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <aside className="min-w-0 space-y-4 sm:space-y-5 lg:sticky lg:top-28 self-start">
              {techEntries.length > 0 && (
                <Reveal>
                  <section className="surface rounded-2xl p-5 sm:p-6">
                    <h3 className={`${h3Class} mb-5`}>
                      <IconBadge color={accent} size="sm">
                        <Code size={16} />
                      </IconBadge>
                      Tech Stack
                    </h3>
                    <div className="space-y-4">
                      {techEntries.map(([category, technologies]) => (
                        <div key={category}>
                          <h4 className={`${eyebrowClass} mb-2 flex items-center gap-1.5`}>
                            {techIcons[category] ?? <Code className="w-3.5 h-3.5" />}
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {technologies!.map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-medium text-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {project.highlights.length > 0 && (
                <Reveal delay={100}>
                  <section className="surface rounded-2xl p-5 sm:p-6">
                    <h3 className={`${h3Class} mb-4`}>
                      <IconBadge color={accent} size="sm">
                        <Zap size={16} />
                      </IconBadge>
                      Highlights
                    </h3>
                    <ul className="space-y-3">
                      {project.highlights.map((highlight, i) => (
                        <li
                          key={highlight}
                          style={stagger(1 + i)}
                          className="reveal-item flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                        >
                          <span
                            className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}

              <Reveal delay={150}>
                <section className="surface rounded-2xl p-5 sm:p-6">
                  <h3 className={`${h3Class} mb-2`}>Have a similar idea?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    I can help you design and build it — from first sketch to
                    production.
                  </p>
                  <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 hover:shadow-lg shadow-brand-600/25 transition-all duration-300">
                    Let&apos;s talk
                    <ArrowUpRight size={16} />
                  </Link>
                </section>
              </Reveal>
            </aside>
          </div>

          {/* Next project */}
          {nextProject && (
            <Reveal>
              <Link
                href={`/projects/${nextProject.id}`}
                className="group mt-16 sm:mt-20 flex items-center justify-between gap-4 surface rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="min-w-0">
                  <p className={`${eyebrowClass} mb-2`}>Next project</p>
                  <p className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {nextProject.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                    {nextProject.shortDesc}
                  </p>
                </div>
                <span
                  className="inline-flex w-11 h-11 sm:w-14 sm:h-14 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    backgroundColor: tint(nextProject.color || accent, 14),
                    color: nextProject.color || accent,
                  }}
                >
                  <ArrowRight size={20} />
                </span>
              </Link>
            </Reveal>
          )}
        </div>
      </div>

      <Footer config={profile} />
    </main>
  );
}
