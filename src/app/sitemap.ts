import type { MetadataRoute } from "next";
import { DEV_TOOLS } from "@/lib/dev-tools";

// Static pages in public/apps/standup. The home page is EN/PL only; support and privacy are
// translated into the full STANDUP_LANGS set (keep it in sync with next.config.ts and the
// generated page set). lastModified is the date the page content last changed, not the build
// time, so search engines can trust it — update it when you edit the page.
const STANDUP_PAGES = [
  { en: "", priority: 0.9, lastModified: "2026-11-12" },
  { en: "/support", priority: 0.6, lastModified: "2026-10-02" },
  { en: "/privacy", priority: 0.4, lastModified: "2026-10-02" },
];

const STANDUP_LANGS = [
  "pl", "ar", "ca", "cs", "da", "de", "el", "es", "es-mx", "fi", "fr", "fr-ca", "he", "hi", "hr",
  "hu", "id", "it", "ja", "ko", "ms", "nb", "nl", "pt-br", "pt-pt", "ro", "ru", "sk", "sv", "th",
  "tr", "uk", "vi", "zh-hans", "zh-hant",
];

// hreflang wants proper BCP47 casing (e.g. "pt-BR", "zh-Hans"), while the URL path segment is
// lowercase — only the handful of codes with a region/script subtag differ from their path form.
const HREFLANG: Record<string, string> = {
  "es-mx": "es-MX", "fr-ca": "fr-CA", "pt-br": "pt-BR", "pt-pt": "pt-PT",
  "zh-hans": "zh-Hans", "zh-hant": "zh-Hant",
};
const toHreflang = (l: string) => HREFLANG[l] ?? l;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Home page: EN + PL only, with the real per-page lastModified dates.
  const homeEntries = [
    {
      url: "https://sagan.dev/apps/standup",
      lastModified: STANDUP_PAGES[0].lastModified,
      changeFrequency: "monthly" as const,
      priority: STANDUP_PAGES[0].priority,
      alternates: {
        languages: {
          en: "https://sagan.dev/apps/standup",
          pl: "https://sagan.dev/apps/standup/pl",
          "x-default": "https://sagan.dev/apps/standup",
        },
      },
    },
    {
      url: "https://sagan.dev/apps/standup/pl",
      lastModified: STANDUP_PAGES[0].lastModified,
      changeFrequency: "monthly" as const,
      priority: STANDUP_PAGES[0].priority * 0.9,
      alternates: {
        languages: {
          en: "https://sagan.dev/apps/standup",
          pl: "https://sagan.dev/apps/standup/pl",
          "x-default": "https://sagan.dev/apps/standup",
        },
      },
    },
  ];

  // Support and privacy: every language in STANDUP_LANGS, plus English at the root.
  const prefixes = ["", ...STANDUP_LANGS.map((l) => `/${l}`)];
  const subEntries = prefixes.flatMap((prefix) =>
    STANDUP_PAGES.slice(1).map((page) => ({
      url: `https://sagan.dev/apps/standup${prefix}${page.en}`,
      lastModified: page.lastModified,
      changeFrequency: "monthly" as const,
      priority: prefix === "" ? page.priority : page.priority * 0.9,
      alternates: {
        languages: Object.fromEntries([
          ["en", `https://sagan.dev/apps/standup${page.en}`],
          ...STANDUP_LANGS.map((l) => [toHreflang(l), `https://sagan.dev/apps/standup/${l}${page.en}`]),
          ["x-default", `https://sagan.dev/apps/standup${page.en}`],
        ]),
      },
    })),
  );

  return [
    {
      url: "https://sagan.dev",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...homeEntries,
    ...subEntries,
    ...DEV_TOOLS.map((tool) => ({
      url: `https://sagan.dev/dev-tool/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
