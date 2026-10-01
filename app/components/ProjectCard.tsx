import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import TiltCard from "./TiltCard";
import type { Project } from "@/lib/data";

// Shared project card used on the home page and /projects grid.
// Image-first tile: the artwork fills the card and project details
// slide in as a centered overlay on hover/focus (cvit-style gallery).
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <TiltCard className="h-full">
      <div className="group relative aspect-[4/3] gradient-border glass rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Media */}
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Styled fallback for projects without screenshots
          <div className="absolute inset-0 bg-grid bg-[#101018] flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${project.color}, transparent 70%)`,
              }}
            />
            <span
              className="relative font-mono text-4xl font-bold opacity-90"
              style={{ color: project.color }}
            >
              {"</>"}
            </span>
          </div>
        )}

        {/* Always-visible bottom caption (fades out when overlay opens) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0a0f]/95 via-[#0a0a0f]/50 to-transparent px-5 pt-14 pb-4 transition-opacity duration-300 group-hover:opacity-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
            {project.category}
          </p>
          <h3 className="text-base font-bold text-white uppercase tracking-wide mt-1 line-clamp-1">
            {project.title}
          </h3>
        </div>

        {/* Case-study ribbon for featured projects */}
        {project.featured && (
          <span className="absolute top-6 -left-11 -rotate-45 z-20 bg-emerald-400 text-zinc-950 text-[10px] font-bold tracking-[0.2em] px-12 py-1 shadow-lg">
            CASE STUDY
          </span>
        )}

        {/* Status */}
        <span
          className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            project.status === "Live"
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-400/30"
              : "bg-blue-950/60 text-blue-300 border border-blue-400/30"
          }`}
        >
          {project.status}
        </span>

        {/* Hover overlay with centered details */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-[#0a0a0f]/85 backdrop-blur-[3px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-400">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
            {project.category}
          </p>
          <h3 className="text-xl font-bold text-white uppercase tracking-wide mt-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-3 line-clamp-2 max-w-xs translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-75">
            {project.shortDesc}
          </p>
          <div className="flex items-center gap-3 mt-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-100">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-emerald-400/60 text-sm font-medium text-emerald-300 hover:bg-emerald-400 hover:text-zinc-950 transition-all duration-300"
            >
              View Project
              <ArrowUpRight size={15} />
            </Link>
            {project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/15 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                title="Live Demo"
                aria-label={`${project.title} live demo`}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Full-card tap target for touch devices (below overlay buttons) */}
        <Link
          href={`/projects/${project.id}`}
          className="absolute inset-0 z-[5]"
          aria-label={`${project.title} details`}
        />
      </div>
    </TiltCard>
  );
};

export default ProjectCard;
