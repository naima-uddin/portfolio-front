import { projects as fallbackProjects, type Project } from "./data";
import { apiUrl, REVALIDATE_SECONDS } from "./api";

export interface ProjectsResult {
  projects: Project[];
  source: "db" | "fallback";
  dbConfigured: boolean;
  dbCount: number;
}

// Fetches the project list from the backend. Falls back to the built-in
// static list if the backend is unreachable, so the site always renders.
export async function getProjects(): Promise<ProjectsResult> {
  try {
    const res = await fetch(apiUrl("/api/projects"), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    return (await res.json()) as ProjectsResult;
  } catch (error) {
    console.error("getProjects: backend unreachable, using static fallback —", error);
    return {
      projects: fallbackProjects,
      source: "fallback",
      dbConfigured: false,
      dbCount: 0,
    };
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const res = await fetch(apiUrl(`/api/projects/${encodeURIComponent(id)}`), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    const data = (await res.json()) as { project: Project };
    return data.project;
  } catch (error) {
    console.error("getProjectById: backend unreachable, using static fallback —", error);
    return fallbackProjects.find((p) => p.id === id) ?? null;
  }
}
