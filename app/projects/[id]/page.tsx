import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Code,
  Database,
  ExternalLink,
  Globe,
  Layers,
  Server,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import Reveal from "@/components/Reveal";
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
  frontend: <Globe className="w-4 h-4" />,
  backend: <Server className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  ai: <Star className="w-4 h-4" />,
  realtime: <Zap className="w-4 h-4" />,
  deployment: <Layers className="w-4 h-4" />,
  integration: <Shield className="w-4 h-4" />,
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  const { profile } = await getSiteContent();

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${project.color}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <Link
            href="/projects"
            className="animate-fade-in inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-300 transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>

          {/* Hero */}
          <div className="mb-14">
            <div className="animate-slide-down flex flex-wrap items-center gap-3 mb-5">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                {project.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === "Live"
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-400/30"
                    : "bg-blue-950/60 text-blue-300 border border-blue-400/30"
                }`}
              >
                {project.status}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar size={13} />
                {project.duration}
              </span>
            </div>

            <h1
              className="animate-slide-up text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
              style={{ animationDelay: "100ms" }}
            >
              {project.title}
            </h1>

            <p
              className="animate-slide-up mt-6 text-lg text-zinc-400 max-w-3xl leading-relaxed"
              style={{ animationDelay: "220ms" }}
            >
              {project.description}
            </p>

            <div
              className="animate-slide-up flex flex-wrap gap-4 mt-9"
              style={{ animationDelay: "340ms" }}
            >
              {project.liveUrl !== "#" && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-400 text-zinc-950 font-semibold hover:bg-emerald-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.35)]"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-zinc-200 font-medium hover:bg-white/10 transition-all duration-300"
              >
                Build something like this
              </Link>
            </div>
          </div>

          {/* Cover */}
          <Reveal>
            <div className="relative aspect-video rounded-3xl overflow-hidden glass mb-20">
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
                <div className="absolute inset-0 bg-grid bg-[#101018] flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${project.color}, transparent 70%)`,
                    }}
                  />
                  <span
                    className="relative font-mono text-6xl font-bold"
                    style={{ color: project.color }}
                  >
                    {"</>"}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Content grid */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <div className="space-y-16">
              {/* Features */}
              <Reveal>
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-7 flex items-center gap-3">
                    <Star size={24} style={{ color: project.color }} />
                    Key Features
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.keyFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 p-4 glass rounded-2xl"
                      >
                        <CheckCircle
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: project.color }}
                        />
                        <span className="text-sm text-zinc-300 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Challenges & Solutions */}
              {project.challenges && project.solutions && (
                <Reveal>
                  <section>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-7">
                      Challenges & Solutions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-mono text-sm text-red-400 mb-4">
                          The challenges
                        </h3>
                        <ul className="space-y-3">
                          {project.challenges.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-sm text-zinc-400 leading-relaxed"
                            >
                              <span className="text-red-400/70 mt-0.5">✕</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-mono text-sm text-emerald-400 mb-4">
                          How I solved them
                        </h3>
                        <ul className="space-y-3">
                          {project.solutions.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-sm text-zinc-400 leading-relaxed"
                            >
                              <span className="text-emerald-400/70 mt-0.5">
                                ✓
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Learnings */}
              {project.learnings && (
                <Reveal>
                  <section>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-7">
                      What I learned
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {project.learnings.map((learning) => (
                        <span
                          key={learning}
                          className="px-4 py-2 rounded-full glass text-sm text-zinc-300"
                        >
                          {learning}
                        </span>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28 self-start">
              <Reveal>
                <section className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                    <Code size={18} style={{ color: project.color }} />
                    Tech Stack
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(project.techStack).map(
                      ([category, technologies]) => (
                        <div key={category}>
                          <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                            {techIcons[category] ?? <Code className="w-4 h-4" />}
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {technologies.map((tech: string) => (
                              <span
                                key={tech}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </section>
              </Reveal>

              <Reveal delay={100}>
                <section className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Zap size={18} style={{ color: project.color }} />
                    Highlights
                  </h3>
                  <ul className="space-y-2.5">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2.5 text-sm text-zinc-400"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>

      <Footer config={profile} />
    </main>
  );
}
