import type { MetadataRoute } from "next";
import { DEV_TOOLS } from "@/lib/dev-tools";

// Static pages in public/apps/standup (English at the root, Polish under /pl).
// lastModified is the date the page content last changed (EN and PL are edited together), not the build
// time, so search engines can trust it. Update it when you edit the page.
const STANDUP_PAGES = [
  { en: "", priority: 0.9, lastModified: "2026-11-12" },
  { en: "/support", priority: 0.6, lastModified: "2026-10-02" },
  { en: "/privacy", priority: 0.4, lastModified: "2026-10-02" },
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
      lastModified: page.lastModified,
      changeFrequency: "monthly" as const,
      priority: page.priority,
      alternates: {
        languages: {
          en: `https://sagan.dev/apps/standup${page.en}`,
          pl: `https://sagan.dev/apps/standup/pl${page.en}`,
          "x-default": `https://sagan.dev/apps/standup${page.en}`,
        },
      },
    })),
    ...STANDUP_PAGES.map((page) => ({
      url: `https://sagan.dev/apps/standup/pl${page.en}`,
      lastModified: page.lastModified,
      changeFrequency: "monthly" as const,
      priority: page.priority * 0.9,
      alternates: {
        languages: {
          en: `https://sagan.dev/apps/standup${page.en}`,
          pl: `https://sagan.dev/apps/standup/pl${page.en}`,
          "x-default": `https://sagan.dev/apps/standup${page.en}`,
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
