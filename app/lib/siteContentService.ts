import { cache } from "react";
import { defaultSiteContent, type SiteContent } from "./data";
import { apiUrl, REVALIDATE_SECONDS } from "./api";

async function loadSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(apiUrl("/api/content"), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    const data = (await res.json()) as { content?: SiteContent };
    return data.content ?? defaultSiteContent;
  } catch (error) {
    console.error("getSiteContent: backend unreachable, using defaults —", error);
    return defaultSiteContent;
  }
}

// Cached per-request so multiple components in one render share a single read.
export const getSiteContent = cache(loadSiteContent);
