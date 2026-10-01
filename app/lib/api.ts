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

// Client-side fetch to the backend. Always sends credentials so the session
// cookie (set by the backend on login) travels with protected requests.
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), { credentials: "include", ...init });
}
