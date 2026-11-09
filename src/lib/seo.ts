import type { Metadata } from "next";
import { siteContent } from "@/content/site-content";

/**
 * SEO defaults shared by the pages. The root layout deliberately sets no canonical, og:url or robots: those are
 * per page, so a page that does not set them (e.g. the 404) never inherits the home page's canonical or
 * "index, follow". Canonical paths are relative and resolved against metadataBase (https://sagan.dev).
 */
const { seo } = siteContent;

/**
 * Open Graph for a page; `path` (when given) becomes og:url. A page that sets openGraph replaces the layout's object
 * entirely, so it should start from this helper.
 */
export function openGraph(path?: string, overrides: Metadata["openGraph"] = {}): Metadata["openGraph"] {
  return {
    title: seo.titleDefault,
    description: seo.description,
    ...(path ? { url: path } : {}),
    siteName: seo.siteName,
    type: "website",
    locale: seo.locale,
    images: [{ url: seo.image, width: seo.imageWidth, height: seo.imageHeight, alt: seo.imageAlt }],
    ...overrides,
  };
}

/** The one robots meta of an indexable page. */
export const indexable: Metadata["robots"] = {
  index: true,
  follow: true,
  "max-image-preview": "large",
  "max-snippet": -1,
};
