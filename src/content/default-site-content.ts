import { en, pl } from "@/i18n";
import type { Translations } from "@/i18n";

export type SiteLanguage = "en" | "pl";

export type SiteTranslations = Record<SiteLanguage, Translations>;

export interface SiteSeo {
  metadataBase: string;
  canonical: string;
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  authorName: string;
  authorUrl: string;
  creator: string;
  siteName: string;
  locale: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
}

export interface SiteContactSettings {
  email: string;
  phone: string;
}

export interface SiteContent {
  siteKey: string;
  slug: string;
  translations: SiteTranslations;
  seo: SiteSeo;
  contact: SiteContactSettings;
  schemaJson: Record<string, unknown>;
}

export const defaultSiteContent: SiteContent = {
  siteKey: "sagan-dev",
  slug: "home",
  translations: { en, pl },
  seo: {
    metadataBase: "https://sagan.dev",
    canonical: "https://sagan.dev",
    titleDefault: "Michał Sagan — Product Architect",
    titleTemplate: "%s | Michał Sagan",
    description:
      "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems. Based in Poland.",
    keywords: [
      "Product Architect",
      "GraphQL Federation",
      "Cloud Native",
      "API Design",
      "Michał Sagan",
      "Software Architecture",
      "Integration Platforms",
      "API Ecosystems",
    ],
    authorName: "Michał Sagan",
    authorUrl: "https://sagan.dev",
    creator: "Michał Sagan",
    siteName: "sagan.dev",
    locale: "en_US",
    image: "/hero_banner.png",
    imageWidth: 448,
    imageHeight: 600,
    imageAlt: "Michał Sagan — Product Architect",
  },
  contact: {
    email: "michal@sagan.dev",
    phone: "+48 600 341 211",
  },
  schemaJson: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michał Sagan",
    url: "https://sagan.dev",
    jobTitle: "Product Architect",
    description:
      "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems.",
    sameAs: ["https://www.linkedin.com/in/michal-sagan"],
    image: "https://sagan.dev/hero_banner.png",
  },
};
