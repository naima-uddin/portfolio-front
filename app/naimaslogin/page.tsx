"use client";

import { useState } from "react";
import { Loader2, Lock, LogIn } from "lucide-react";
import { apiFetch } from "@/lib/api";

const inputClasses =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300";

export default function NaimasLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed.");
      }
      // Full navigation so middleware sees the freshly-set session cookie.
      window.location.assign("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden noise">
      <div className="aurora-blob aurora-1 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="aurora-blob aurora-2 w-[350px] h-[350px] bottom-0 right-0" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 space-y-5"
        >
          <div className="text-center mb-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Dashboard Login</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Sign in to manage your portfolio
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-zinc-400 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-400 text-zinc-950 font-semibold hover:bg-emerald-300 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-400 text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
