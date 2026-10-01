import Footer from "@/components/Footer";
import { getProjects } from "@/lib/projectService";
import { getSiteContent } from "@/lib/siteContentService";
import ProjectsGrid from "./ProjectsGrid";

// Cached static HTML; revalidated on-demand when the admin saves, hourly otherwise.
export const revalidate = 3600;

export default async function ProjectsPage() {
  const { projects } = await getProjects();
  const { profile } = await getSiteContent();

  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] glow-emerald" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Heading */}
          <div className="mb-14">
            <p className="animate-slide-down font-mono text-sm text-emerald-400 mb-4">
              Work
            </p>
            <h1
              className="animate-slide-up text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
              style={{ animationDelay: "100ms" }}
            >
              Projects I&apos;ve <span className="text-gradient">built.</span>
            </h1>
            <p
              className="animate-slide-up mt-5 text-lg text-zinc-400 max-w-2xl"
              style={{ animationDelay: "220ms" }}
            >
              From government approval systems to trading platforms and AI —
              each project is a real problem solved for real users.
            </p>
          </div>

          <ProjectsGrid projects={projects} />
        </div>
      </section>

      <Footer config={profile} />
    </main>
  );
}
