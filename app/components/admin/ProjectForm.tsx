"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { Project } from "@/lib/data";
import { apiFetch } from "@/lib/api";

const inputClasses =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all";

const labelClasses = "block text-sm text-zinc-400 mb-1.5";

const techGroups = [
  "frontend",
  "backend",
  "database",
  "integration",
  "deployment",
  "ai",
  "realtime",
] as const;

const linesToArray = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const commaToArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

interface FormState {
  id: string;
  title: string;
  category: string;
  status: "Live" | "Completed";
  duration: string;
  color: string;
  image: string;
  liveUrl: string;
  shortDesc: string;
  description: string;
  tags: string;
  featured: boolean;
  keyFeatures: string;
  highlights: string;
  challenges: string;
  solutions: string;
  learnings: string;
  techStack: Record<(typeof techGroups)[number], string>;
}

const toFormState = (p?: Project): FormState => ({
  id: p?.id ?? "",
  title: p?.title ?? "",
  category: p?.category ?? "",
  status: p?.status ?? "Live",
  duration: p?.duration ?? "",
  color: p?.color ?? "#34d399",
  image: p?.image ?? "",
  liveUrl: p?.liveUrl ?? "",
  shortDesc: p?.shortDesc ?? "",
  description: p?.description ?? "",
  tags: p?.tags.join(", ") ?? "",
  featured: p?.featured ?? false,
  keyFeatures: p?.keyFeatures.join("\n") ?? "",
  highlights: p?.highlights.join("\n") ?? "",
  challenges: p?.challenges?.join("\n") ?? "",
  solutions: p?.solutions?.join("\n") ?? "",
  learnings: p?.learnings?.join("\n") ?? "",
  techStack: techGroups.reduce(
    (acc, group) => ({
      ...acc,
      [group]: p?.techStack[group]?.join(", ") ?? "",
    }),
    {} as FormState["techStack"]
  ),
});

const ProjectForm = ({ initial }: { initial?: Project }) => {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const techStack: Record<string, string[]> = {};
    for (const group of techGroups) {
      const list = commaToArray(form.techStack[group]);
      if (list.length > 0) techStack[group] = list;
    }

    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      category: form.category.trim() || "Web App",
      status: form.status,
      duration: form.duration.trim(),
      color: form.color,
      image: form.image.trim() || undefined,
      liveUrl: form.liveUrl.trim() || "#",
      shortDesc: form.shortDesc.trim(),
      description: form.description.trim(),
      tags: commaToArray(form.tags),
      featured: form.featured,
      keyFeatures: linesToArray(form.keyFeatures),
      highlights: linesToArray(form.highlights),
      challenges: linesToArray(form.challenges),
      solutions: linesToArray(form.solutions),
      learnings: linesToArray(form.learnings),
      techStack,
    };

    try {
      const res = await apiFetch(
        isEdit ? `/api/projects/${initial!.id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Save failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  };

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">
          {isEdit ? `Edit: ${initial!.title}` : "New Project"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basics */}
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-mono text-sm text-emerald-400">Basics</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClasses}>Title *</label>
                <input
                  className={inputClasses}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Slug (URL) {!isEdit && "— auto from title if empty"}
                </label>
                <input
                  className={inputClasses}
                  value={form.id}
                  onChange={(e) => set("id", e.target.value)}
                  placeholder="my-awesome-project"
                />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <input
                  className={inputClasses}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="EdTech / FinTech / Web App"
                />
              </div>
              <div>
                <label className={labelClasses}>Status</label>
                <select
                  className={inputClasses}
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as FormState["status"])
                  }
                >
                  <option value="Live">Live</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Duration</label>
                <input
                  className={inputClasses}
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="3 months"
                />
              </div>
              <div>
                <label className={labelClasses}>Accent color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                    className="h-10 w-14 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                  />
                  <input
                    className={inputClasses}
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="w-4 h-4 accent-emerald-400"
                />
                <label htmlFor="featured" className="text-sm text-zinc-300">
                  Featured (show on home page)
                </label>
              </div>
            </div>
          </section>

          {/* Links & media */}
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-mono text-sm text-emerald-400">
              Links & Media
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Live URL</label>
                <input
                  className={inputClasses}
                  value={form.liveUrl}
                  onChange={(e) => set("liveUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Image URL (e.g. /assets/projectImage/x.png)
                </label>
                <input
                  className={inputClasses}
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="Leave empty for stylish placeholder"
                />
              </div>
            </div>
          </section>

          {/* Descriptions */}
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-mono text-sm text-emerald-400">Content</h2>
            <div>
              <label className={labelClasses}>Short description (cards)</label>
              <input
                className={inputClasses}
                value={form.shortDesc}
                onChange={(e) => set("shortDesc", e.target.value)}
                placeholder="One-liner shown on project cards"
              />
            </div>
            <div>
              <label className={labelClasses}>Full description</label>
              <textarea
                className={`${inputClasses} resize-none`}
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClasses}>Tags (comma separated)</label>
              <input
                className={inputClasses}
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Next.js, MongoDB, Tailwind CSS"
              />
            </div>
          </section>

          {/* Lists */}
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-mono text-sm text-emerald-400">
              Details (one item per line)
            </h2>
            {(
              [
                ["keyFeatures", "Key features"],
                ["highlights", "Highlights"],
                ["challenges", "Challenges"],
                ["solutions", "Solutions"],
                ["learnings", "Learnings"],
              ] as [keyof FormState, string][]
            ).map(([key, label]) => (
              <div key={key}>
                <label className={labelClasses}>{label}</label>
                <textarea
                  className={`${inputClasses} resize-none`}
                  rows={3}
                  value={form[key] as string}
                  onChange={(e) =>
                    set(key, e.target.value as FormState[typeof key])
                  }
                />
              </div>
            ))}
          </section>

          {/* Tech stack */}
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-mono text-sm text-emerald-400">
              Tech stack (comma separated, leave empty to hide group)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {techGroups.map((group) => (
                <div key={group}>
                  <label className={`${labelClasses} capitalize`}>
                    {group}
                  </label>
                  <input
                    className={inputClasses}
                    value={form.techStack[group]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        techStack: { ...f.techStack, [group]: e.target.value },
                      }))
                    }
                    placeholder="React, Tailwind CSS"
                  />
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-400 text-zinc-950 font-semibold hover:bg-emerald-300 transition-all disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
