import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { getProjects } from "@/lib/projectService";

const FeaturedProjects = async () => {
  const { projects } = await getProjects();
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="works" className="scroll-mt-16 relative bg-[#0a0a0f] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-mono text-sm text-emerald-400 mb-3">
                03 — Work
              </p>
              <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
                Selected projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-emerald-300 transition-colors"
            >
              View all projects
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={(i % 2) * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
