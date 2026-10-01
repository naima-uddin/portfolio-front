import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { stagger } from "@/lib/utils";
import { getProjects } from "@/lib/projectService";

const ViewAllLink = ({ count, className = "" }: { count: number; className?: string }) => (
  <Link
    href="/projects"
    className={`group items-center justify-center gap-2 border border-zinc-900 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors duration-300 hover:border-brand-600 hover:bg-brand-600 hover:text-white ${className}`}
  >
    View all projects
    <span className="text-xs font-medium opacity-60">({count})</span>
    <ArrowRight
      size={16}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>
);

const FeaturedProjects = async () => {
  const { projects } = await getProjects();
  // Featured first, then the rest. Two rows by default: 4 per row on
  // desktop (8 tiles), 2 per row on mobile (4 tiles). The rest live on /projects.
  const ordered = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ];
  const shown = ordered.slice(0, 8);

  return (
    <section id="works" className="scroll-mt-16 relative bg-[#eceef2] py-8 lg:py-10">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div className="reveal-item" style={stagger(0)}>
              <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
                Selected <span className="heading-accent text-brand-600">projects</span>
              </h2>
            </div>
            <div className="reveal-item hidden sm:block" style={stagger(1)}>
              <ViewAllLink count={ordered.length} className="inline-flex" />
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {shown.map((project, i) => (
            <Reveal
              key={project.id}
              delay={(i % 4) * 80}
              className={i >= 4 ? "hidden lg:block" : ""}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {/* Phones: full-width button after the tiles */}
        <Reveal className="mt-5 sm:hidden">
          <ViewAllLink count={ordered.length} className="flex w-full" />
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedProjects;
