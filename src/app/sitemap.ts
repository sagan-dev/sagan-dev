import type { MetadataRoute } from "next";
import { DEV_TOOLS } from "@/lib/dev-tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://sagan.dev",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...DEV_TOOLS.map((tool) => ({
      url: `https://sagan.dev/dev-tool/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
