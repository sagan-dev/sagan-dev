import type { SiteContent, SiteLanguage } from "./default-site-content";

type ProjectItem = SiteContent["translations"]["en"]["projects"]["items"][number] & {
  url?: string;
  urlLabel?: string;
};

const STANDUP_URL: Record<SiteLanguage, string> = {
  en: "/apps/standup",
  pl: "/apps/standup/pl",
};

const standupProject: Record<SiteLanguage, ProjectItem> = {
  en: {
    title: "Standup — Desk Remote Control",
    company: "Personal product",
    period: "2026 - Present",
    description:
      "Native macOS menu bar app for Bluetooth sit/stand desks (IKEA IDÅSEN, Linak controller). Designed and built end to end: the desk protocol over Bluetooth LE, a movement engine that stops on the saved heights, calendar-driven automation and the Mac App Store release.",
    technologies: ["Swift", "AppKit", "CoreBluetooth", "EventKit", "Bluetooth LE"],
    impact: [
      "Raises the desk before online meetings from Apple Calendar and Outlook",
      "Notices when a call ends and offers to lower the desk",
      "Free open-source edition on GitHub",
    ],
    url: STANDUP_URL.en,
    urlLabel: "Visit the Standup page",
  },
  pl: {
    title: "Standup — Desk Remote Control",
    company: "Własny produkt",
    period: "2026 - Obecnie",
    description:
      "Natywna aplikacja macOS w pasku menu do biurek z regulacją wysokości na Bluetooth (IKEA IDÅSEN, kontroler Linak). Zaprojektowana i zbudowana od początku do końca: protokół biurka przez Bluetooth LE, silnik ruchu zatrzymujący się na zapisanych wysokościach, automatyzacja oparta na kalendarzu i publikacja w Mac App Store.",
    technologies: ["Swift", "AppKit", "CoreBluetooth", "EventKit", "Bluetooth LE"],
    impact: [
      "Podnosi biurko przed spotkaniami online z Kalendarza Apple i Outlooka",
      "Wykrywa koniec rozmowy i proponuje opuszczenie biurka",
      "Darmowa wersja open source na GitHubie",
    ],
    url: STANDUP_URL.pl,
    urlLabel: "Zobacz stronę Standup",
  },
};

/** Adds the Standup card to the projects list, whether the content comes from the CMS or from the local defaults */
export function withStandupProject(content: SiteContent): SiteContent {
  const translations = { ...content.translations };
  for (const language of ["en", "pl"] as SiteLanguage[]) {
    const projects = translations[language].projects;
    const items = projects.items as ProjectItem[];
    if (items.some((item) => item.url === STANDUP_URL[language])) continue;
    translations[language] = {
      ...translations[language],
      projects: { ...projects, items: [standupProject[language], ...items] },
    };
  }
  return { ...content, translations };
}
