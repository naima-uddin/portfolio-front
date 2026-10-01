"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/data";

// Client-side category filter + grid; receives projects from the server page
// so the list always reflects the database (with static fallback).
const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [filter, setFilter] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {/* One swipeable row on phones (bleeds to the screen edges), wrapping from sm up */}
      <div
        className="animate-slide-up -mx-6 mb-6 flex gap-2 overflow-x-auto px-6 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
        style={{ animationDelay: "320ms" }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`shrink-0 whitespace-nowrap px-4 py-2 sm:px-5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold border transition-all duration-300 ${
              filter === category
                ? "bg-brand-600 border-brand-600 text-white"
                : "border-slate-900/15 text-slate-600 hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all hover:text-brand-600"
            }`}
          >
            {category === "all" ? "All Projects" : category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((project, index) => (
          <div
            key={project.id}
            className="animate-slide-up"
            style={{ animationDelay: `${350 + index * 80}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-16">
          No projects in this category yet.
        </p>
      )}
    </>
  );
};

export default ProjectsGrid;
