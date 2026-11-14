import type { MetadataRoute } from "next";
import { DEV_TOOLS } from "@/lib/dev-tools";

// Static pages in public/apps/standup (English at the root, every other language under its own
// lowercase prefix — keep STANDUP_LANGS in sync with next.config.ts and the generated page set).
const STANDUP_PAGES = [
  { en: "", priority: 0.9 },
  { en: "/support", priority: 0.6 },
  { en: "/privacy", priority: 0.4 },
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
  const prefixes = ["", ...STANDUP_LANGS.map((l) => `/${l}`)];

  const standupEntries = prefixes.flatMap((prefix) =>
    STANDUP_PAGES.map((page) => ({
      url: `https://sagan.dev/apps/standup${prefix}${page.en}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: prefix === "" ? page.priority : page.priority * 0.9,
      alternates: {
        languages: Object.fromEntries(
          ["", ...STANDUP_LANGS].map((l) => [
            l === "" ? "en" : toHreflang(l),
            `https://sagan.dev/apps/standup${l === "" ? "" : `/${l}`}${page.en}`,
          ]),
        ),
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
    ...standupEntries,
    ...DEV_TOOLS.map((tool) => ({
      url: `https://sagan.dev/dev-tool/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
