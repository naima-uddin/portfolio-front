"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  DatabaseZap,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import type { Project } from "@/lib/data";
import { apiFetch } from "@/lib/api";

interface ApiResult {
  projects: Project[];
  source: "db" | "fallback";
  dbConfigured: boolean;
  dbCount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/projects", { cache: "no-store" });
      setData(await res.json());
    } catch {
      setMessage("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(id);
    try {
      const res = await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Delete failed.");
      setMessage(`Deleted "${title}".`);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  };

  const handleSeed = async () => {
    setBusy("seed");
    try {
      const res = await apiFetch("/api/projects/seed", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Seed failed.");
      setMessage(`Imported ${body.inserted} default projects into MongoDB.`);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Seed failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage the projects shown on your portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400 text-zinc-950 text-sm font-semibold hover:bg-emerald-300 transition-all"
            >
              <Plus size={16} />
              New Project
            </Link>
          </div>
        </div>

        {/* DB status banners */}
        {data && !data.dbConfigured && (
          <div className="glass rounded-2xl p-5 mb-8 flex items-start gap-4 border-amber-400/30">
            <AlertTriangle
              size={20}
              className="text-amber-400 flex-shrink-0 mt-0.5"
            />
            <div className="text-sm text-zinc-300">
              <p className="font-semibold text-amber-300 mb-1">
                MongoDB is not connected
              </p>
              <p className="text-zinc-400">
                The site is showing the built-in static projects (read-only).
                Add your <code className="text-emerald-300">MONGODB_URI</code>{" "}
                to <code className="text-emerald-300">.env.local</code> and
                restart the server to enable editing.
              </p>
            </div>
          </div>
        )}

        {data && data.dbConfigured && data.dbCount === 0 && (
          <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <DatabaseZap
                size={20}
                className="text-emerald-300 flex-shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-semibold text-white mb-1">
                  Database connected — but empty
                </p>
                <p className="text-zinc-400">
                  Import the 5 built-in projects to get started, or create new
                  ones from scratch.
                </p>
              </div>
            </div>
            <button
              onClick={handleSeed}
              disabled={busy === "seed"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-sm font-medium hover:bg-emerald-400/25 transition-all disabled:opacity-60"
            >
              {busy === "seed" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <DatabaseZap size={16} />
              )}
              Import defaults
            </button>
          </div>
        )}

        {message && (
          <div className="glass rounded-2xl px-5 py-3.5 mb-8 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-zinc-500">
            <Loader2 size={24} className="animate-spin mr-3" />
            Loading projects...
          </div>
        ) : (
          <div className="space-y-3">
            {data?.projects.map((project) => (
              <div
                key={project.id}
                className="glass rounded-2xl p-5 flex flex-wrap items-center gap-4 hover:border-emerald-400/25 transition-colors"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <Star
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                    /{project.id} · {project.category} · {project.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    target="_blank"
                    className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                    title="View on site"
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2.5 rounded-xl text-zinc-400 hover:text-emerald-300 hover:bg-white/10 transition-all"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={busy === project.id || data.source === "fallback"}
                    className="p-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    title={
                      data.source === "fallback"
                        ? "Connect MongoDB to edit"
                        : "Delete"
                    }
                  >
                    {busy === project.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
