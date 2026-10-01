"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/data";
import { apiFetch } from "@/lib/api";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiFetch(`/api/projects/${id}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProject(data.project))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-zinc-400">
        Project not found.
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-zinc-500">
        <Loader2 size={24} className="animate-spin mr-3" />
        Loading project...
      </main>
    );
  }

  return <ProjectForm initial={project} />;
}
