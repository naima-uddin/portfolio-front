import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { getProjects } from "@/lib/projectService";

const FeaturedProjects = async () => {
  const { projects } = await getProjects();
  // Featured first, then the rest — up to two rows of four.
  const shown = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ].slice(0, 8);

  return (
    <section id="works" className="scroll-mt-16 relative bg-[#eceef2] py-8 lg:py-10">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="font-mono text-xs font-semibold text-brand-600 mb-1">
                03 — Work
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
                Selected <span className="text-brand-600">projects</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              View all projects
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {shown.map((project, i) => (
            <Reveal key={project.id} delay={(i % 4) * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
