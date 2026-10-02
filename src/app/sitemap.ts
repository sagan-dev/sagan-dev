import type { MetadataRoute } from "next";
import { DEV_TOOLS } from "@/lib/dev-tools";

// Static pages in public/apps/standup (English at the root, Polish under /pl)
const STANDUP_PAGES = [
  { en: "", priority: 0.9 },
  { en: "/support", priority: 0.6 },
  { en: "/privacy", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://sagan.dev",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...STANDUP_PAGES.map((page) => ({
      url: `https://sagan.dev/apps/standup${page.en}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
      alternates: {
        languages: {
          en: `https://sagan.dev/apps/standup${page.en}`,
          pl: `https://sagan.dev/apps/standup/pl${page.en}`,
        },
      },
    })),
    ...STANDUP_PAGES.map((page) => ({
      url: `https://sagan.dev/apps/standup/pl${page.en}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority * 0.9,
      alternates: {
        languages: {
          en: `https://sagan.dev/apps/standup${page.en}`,
          pl: `https://sagan.dev/apps/standup/pl${page.en}`,
        },
      },
    })),
    ...DEV_TOOLS.map((tool) => ({
      url: `https://sagan.dev/dev-tool/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
