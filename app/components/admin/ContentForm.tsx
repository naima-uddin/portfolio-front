"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { SiteContent, Experience, Stat, LanguageFact } from "@/lib/data";
import { apiFetch } from "@/lib/api";
import UploadField from "./UploadField";

const input =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all";
const label = "block text-sm text-zinc-400 mb-1.5";
const card = "glass rounded-2xl p-6 space-y-4";
const heading = "font-mono text-sm text-emerald-400";

const linesToArray = (v: string) =>
  v.split("\n").map((l) => l.trim()).filter(Boolean);
const commaToArray = (v: string) =>
  v.split(",").map((l) => l.trim()).filter(Boolean);

// Small labelled text input bound to a value/onChange pair.
function Field({
  label: lbl,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label}>{lbl}</label>
      <input
        className={input}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

// Text input/textarea bound to a string[]. Keeps the raw text locally so
// newlines, trailing spaces and commas aren't stripped while typing.
function ListInput({
  value,
  onChange,
  mode,
  rows,
}: {
  value: string[] | undefined;
  onChange: (v: string[]) => void;
  mode: "lines" | "comma";
  rows?: number;
}) {
  const list = value ?? [];
  const parse = mode === "lines" ? linesToArray : commaToArray;
  const joiner = mode === "lines" ? "\n" : ", ";
  const [text, setText] = useState(() => list.join(joiner));

  // Resync only when the value changed from outside (e.g. initial load).
  useEffect(() => {
    setText((t) => (sameList(parse(t), list) ? t : list.join(joiner)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handle = (v: string) => {
    setText(v);
    onChange(parse(v));
  };

  return mode === "lines" ? (
    <textarea
      className={`${input} resize-none`}
      rows={rows ?? 3}
      value={text}
      onChange={(e) => handle(e.target.value)}
    />
  ) : (
    <input
      className={input}
      value={text}
      onChange={(e) => handle(e.target.value)}
    />
  );
}

export default function ContentForm() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [dbConfigured, setDbConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/content", { cache: "no-store" });
        const body = await res.json();
        setContent(body.content);
        setDbConfigured(body.dbConfigured);
      } catch {
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Merge a partial patch into the top-level content object.
  const patch = useCallback((p: Partial<SiteContent>) => {
    setContent((c) => (c ? { ...c, ...p } : c));
  }, []);
  const patchProfile = useCallback(
    (p: Partial<SiteContent["profile"]>) => {
      setContent((c) => (c ? { ...c, profile: { ...c.profile, ...p } } : c));
    },
    []
  );

  const handleSave = async () => {
    if (!content) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await apiFetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Save failed.");
      setMessage("Saved! Your portfolio has been updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">
        <Loader2 size={24} className="animate-spin mr-3" />
        Loading content...
      </div>
    );
  }

  if (!content) {
    return (
      <p className="text-red-400 text-center py-24">
        {error || "Content could not be loaded."}
      </p>
    );
  }

  const p = content.profile;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Site Content</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Everything on your portfolio except projects — edit and save.
        </p>
      </div>

      {!dbConfigured && (
        <div className="glass rounded-2xl p-5 text-sm text-amber-300 border-amber-400/30">
          MongoDB is not connected — changes cannot be saved yet. Add{" "}
          <code className="text-emerald-300">MONGODB_URI</code> to{" "}
          <code className="text-emerald-300">.env.local</code>.
        </div>
      )}

      {/* Profile */}
      <section className={card}>
        <h2 className={heading}>Profile & Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name" value={p.name} onChange={(v) => patchProfile({ name: v })} />
          <Field label="First name (hero greeting)" value={p.firstName} onChange={(v) => patchProfile({ firstName: v })} />
          <Field label="Role / title" value={p.role} onChange={(v) => patchProfile({ role: v })} />
          <Field label="Company" value={p.company} onChange={(v) => patchProfile({ company: v })} />
          <Field label="Email" value={p.email} onChange={(v) => patchProfile({ email: v })} />
          <Field label="Phone (for tel: link)" value={p.phone} onChange={(v) => patchProfile({ phone: v })} />
          <Field label="Phone (display)" value={p.phoneDisplay} onChange={(v) => patchProfile({ phoneDisplay: v })} />
          <Field label="Location" value={p.location} onChange={(v) => patchProfile({ location: v })} />
          <Field label="Site URL" value={p.url} onChange={(v) => patchProfile({ url: v })} />
          <Field label="Availability text" value={p.availability} onChange={(v) => patchProfile({ availability: v })} />
        </div>
        <div>
          <label className={label}>Summary (About intro)</label>
          <textarea
            className={`${input} resize-none`}
            rows={3}
            value={p.summary}
            onChange={(e) => patchProfile({ summary: e.target.value })}
          />
        </div>
      </section>

      {/* Social links */}
      <section className={card}>
        <h2 className={heading}>Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="GitHub" value={p.github} onChange={(v) => patchProfile({ github: v })} />
          <Field label="LinkedIn" value={p.linkedin} onChange={(v) => patchProfile({ linkedin: v })} />
          <Field label="Facebook" value={p.facebook} onChange={(v) => patchProfile({ facebook: v })} />
          <Field label="Instagram" value={p.instagram} onChange={(v) => patchProfile({ instagram: v })} />
        </div>
      </section>

      {/* Media */}
      <section className={card}>
        <h2 className={heading}>Photo & Résumé</h2>
        <UploadField
          label="Profile photo"
          value={p.photo}
          onChange={(v) => patchProfile({ photo: v })}
          accept="image/*"
          preview="image"
        />
        <UploadField
          label="Home banner image (transparent PNG works best)"
          value={p.heroImage}
          onChange={(v) => patchProfile({ heroImage: v })}
          accept="image/*"
          preview="image"
        />
        <UploadField
          label="Experience ID card photo (portrait works best)"
          value={p.idCardImage}
          onChange={(v) => patchProfile({ idCardImage: v })}
          accept="image/*"
          preview="image"
        />
        <UploadField
          label="Résumé (PDF)"
          value={p.resumeUrl}
          onChange={(v) => patchProfile({ resumeUrl: v })}
          accept="application/pdf"
          preview="file"
        />
      </section>

      {/* Hero intro */}
      <section className={card}>
        <h2 className={heading}>Hero Intro (one paragraph per line)</h2>
        <ListInput
          mode="lines"
          rows={4}
          value={content.heroIntro}
          onChange={(v) => patch({ heroIntro: v })}
        />
      </section>

      {/* About bio */}
      <section className={card}>
        <h2 className={heading}>About Page Bio (one paragraph per line)</h2>
        <ListInput
          mode="lines"
          rows={5}
          value={content.aboutBio}
          onChange={(v) => patch({ aboutBio: v })}
        />
      </section>

      {/* Skills */}
      <section className={card}>
        <h2 className={heading}>Skills (comma separated)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(["frontend", "backend", "database", "tools"] as const).map((group) => (
            <div key={group}>
              <label className={`${label} capitalize`}>{group}</label>
              <ListInput
                mode="comma"
                value={content.skills[group]}
                onChange={(v) =>
                  setContent((c) =>
                    c ? { ...c, skills: { ...c.skills, [group]: v } } : c
                  )
                }
              />
            </div>
          ))}
        </div>
        <div>
          <label className={label}>"My Skills" bubbles (comma separated)</label>
          <ListInput
            mode="comma"
            value={content.marqueeSkills}
            onChange={(v) => patch({ marqueeSkills: v })}
          />
        </div>
      </section>

      {/* Experience */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={heading}>Experience</h2>
          <button
            type="button"
            onClick={() =>
              patch({
                experiences: [
                  ...content.experiences,
                  {
                    role: "",
                    company: "",
                    period: "",
                    location: "",
                    type: "",
                    points: [],
                    current: false,
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-xs font-medium hover:bg-emerald-400/25 transition-all"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {content.experiences.map((exp, i) => {
          const setExp = (patchExp: Partial<Experience>) => {
            const next = [...content.experiences];
            next[i] = { ...next[i], ...patchExp };
            patch({ experiences: next });
          };
          return (
            <div key={i} className="rounded-2xl border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">#{i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      experiences: content.experiences.filter((_, j) => j !== i),
                    })
                  }
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Role" value={exp.role} onChange={(v) => setExp({ role: v })} />
                <Field label="Company" value={exp.company} onChange={(v) => setExp({ company: v })} />
                <Field label="Period" value={exp.period} onChange={(v) => setExp({ period: v })} placeholder="Jan 2025 — Present" />
                <Field label="Location" value={exp.location} onChange={(v) => setExp({ location: v })} />
                <Field label="Type" value={exp.type} onChange={(v) => setExp({ type: v })} placeholder="On-site · Full-time" />
              </div>
              <div>
                <label className={label}>Points (one per line)</label>
                <ListInput
                  mode="lines"
                  value={exp.points}
                  onChange={(v) => setExp({ points: v })}
                />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => setExp({ current: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400"
                />
                Current role (shows the “Current” badge)
              </label>
            </div>
          );
        })}
      </section>

      {/* Education */}
      <section className={card}>
        <h2 className={heading}>Education</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Degree" value={content.education.degree} onChange={(v) => patch({ education: { ...content.education, degree: v } })} />
          <Field label="Institution" value={content.education.institution} onChange={(v) => patch({ education: { ...content.education, institution: v } })} />
          <Field label="Period" value={content.education.period} onChange={(v) => patch({ education: { ...content.education, period: v } })} />
          <Field label="Result" value={content.education.result} onChange={(v) => patch({ education: { ...content.education, result: v } })} />
        </div>
      </section>

      {/* Languages */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={heading}>Languages</h2>
          <button
            type="button"
            onClick={() =>
              patch({ languages: [...content.languages, { name: "", level: "" }] })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-xs font-medium hover:bg-emerald-400/25 transition-all"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {content.languages.map((lang: LanguageFact, i) => {
          const setLang = (patchLang: Partial<LanguageFact>) => {
            const next = [...content.languages];
            next[i] = { ...next[i], ...patchLang };
            patch({ languages: next });
          };
          return (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Language" value={lang.name} onChange={(v) => setLang({ name: v })} />
              </div>
              <div className="flex-1">
                <Field label="Level" value={lang.level} onChange={(v) => setLang({ level: v })} />
              </div>
              <button
                type="button"
                onClick={() =>
                  patch({ languages: content.languages.filter((_, j) => j !== i) })
                }
                className="p-2.5 mb-0.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </section>

      {/* Stats */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={heading}>Stats (About page counters)</h2>
          <button
            type="button"
            onClick={() =>
              patch({ stats: [...content.stats, { value: "", label: "" }] })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-xs font-medium hover:bg-emerald-400/25 transition-all"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {content.stats.map((stat: Stat, i) => {
          const setStat = (patchStat: Partial<Stat>) => {
            const next = [...content.stats];
            next[i] = { ...next[i], ...patchStat };
            patch({ stats: next });
          };
          return (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Value" value={stat.value} onChange={(v) => setStat({ value: v })} placeholder="3+" />
              </div>
              <div className="flex-[2]">
                <Field label="Label" value={stat.label} onChange={(v) => setStat({ label: v })} placeholder="Years Experience" />
              </div>
              <button
                type="button"
                onClick={() =>
                  patch({ stats: content.stats.filter((_, j) => j !== i) })
                }
                className="p-2.5 mb-0.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </section>

      {/* Save bar */}
      <div className="sticky bottom-6 z-10">
        <div className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            {message && <span className="text-emerald-300">{message}</span>}
            {error && <span className="text-red-400">{error}</span>}
            {!message && !error && (
              <span className="text-zinc-500">
                Changes apply to the live site after saving.
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dbConfigured}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-400 text-zinc-950 font-semibold hover:bg-emerald-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
