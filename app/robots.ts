import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/naimaslogin"],
    },
    sitemap: "https://naimauddin.dev/sitemap.xml",
  };
}
