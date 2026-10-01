import Image from "next/image";
import Link from "next/link";
import { Eye, Github } from "lucide-react";
import type { Project } from "@/lib/data";

// Shared project tile used on the home page and /projects grid.
// At rest only the artwork is visible; on hover/focus a dark overlay shows
// the project details with GitHub + view icons in the middle.
const ProjectCard = ({ project }: { project: Project }) => {
  const repoUrl = [project.githubUrl, project.clientUrl, project.serverUrl].find(
    (url) => url && url !== "#"
  );

  return (
    <div className="group relative aspect-[4/3] overflow-hidden bg-[#e2e4ea] ring-1 ring-slate-900/10">
      {/* Media */}
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        // Styled fallback for projects without screenshots
        <div className="absolute inset-0 flex items-center justify-center bg-grid">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${project.color}, transparent 70%)`,
            }}
          />
          <span
            className="relative font-mono text-2xl font-bold"
            style={{ color: project.color }}
          >
            {"</>"}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 px-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="translate-y-2 font-mono text-[10px] uppercase tracking-widest text-brand-400 transition-transform duration-300 group-hover:translate-y-0">
          {project.category}
        </p>
        <h3 className="mt-1 line-clamp-2 translate-y-2 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-base">
          {project.title}
        </h3>

        <div className="mt-4 flex translate-y-2 items-center gap-3 transition-transform delay-75 duration-300 group-hover:translate-y-0">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Source code"
              aria-label={`${project.title} source code on GitHub`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-brand-500 hover:bg-brand-600"
            >
              <Github size={17} />
            </a>
          )}
          <Link
            href={`/projects/${project.id}`}
            title="View details"
            aria-label={`View ${project.title} details`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-brand-500 hover:bg-brand-600"
          >
            <Eye size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
