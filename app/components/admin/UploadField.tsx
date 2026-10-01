"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

const inputClasses =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all";

// A file-upload field that posts to /api/upload and returns the stored URL.
// The URL is also editable by hand, so pasting an external link still works.
export default function UploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  preview = "image",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  preview?: "image" | "file";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetch("/api/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Upload failed.");
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {value && preview === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="preview"
            className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
          />
        )}
        <input
          className={inputClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... or paste a URL"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-sm font-medium hover:bg-emerald-400/25 transition-all disabled:opacity-60 flex-shrink-0"
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          Upload
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
            title="Clear"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {value && preview === "file" && (
        <p className="mt-1.5 text-xs text-emerald-300 font-mono break-all">
          {value}
        </p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
