// Base URL of the backend API. Set NEXT_PUBLIC_API_URL in .env.local.
// Works both server-side (RSC/ISR) and client-side.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

// How long (seconds) server-rendered pages cache backend reads before
// revalidating. Keep modest so dashboard edits appear quickly.
export const REVALIDATE_SECONDS = 60;

// Client-side fetch to the backend. Uses a same-origin path that next.config
// rewrites to the backend, so the session cookie lives on this domain.
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const p = path.startsWith("/") ? path : `/${path}`;
  return fetch(p, { credentials: "include", ...init });
}
