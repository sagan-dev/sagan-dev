import {
  defaultSiteContent,
  type SiteContent,
  type SiteLanguage,
  type SiteTranslations,
} from "@/content/default-site-content";
import type { Translations } from "@/i18n";

interface DirectusSitePage {
  site_key?: string | null;
  slug?: string | null;
  content?: Partial<SiteTranslations> | null;
  seo?: Partial<SiteContent["seo"]> | null;
  contact?: Partial<SiteContent["contact"]> | null;
  schema_json?: Record<string, unknown> | null;
}

interface DirectusResponse {
  data?: DirectusSitePage[];
}

interface DirectusListResponse<T> {
  data?: T[];
}

interface SaganPageRecord {
  [key: string]: unknown;
  site_key?: string;
  slug?: string;
  seo?: Partial<SiteContent["seo"]>;
  schema_json?: Record<string, unknown>;
}

interface SaganProfileRecord {
  title_en?: string;
  title_pl?: string;
  bio_en?: string;
  bio_pl?: string;
}

interface SaganProfileHighlightRecord {
  icon_key?: string;
  title_en?: string;
  title_pl?: string;
  description_en?: string;
  description_pl?: string;
}

interface SaganExperienceRecord {
  id: string;
  role?: string;
  company?: string;
  period_en?: string;
  period_pl?: string;
  description_en?: string;
  description_pl?: string;
}

interface SaganExperienceHighlightRecord {
  experience?: string;
  text_en?: string;
  text_pl?: string;
}

interface SaganExperienceTechnologyRecord {
  experience?: string;
  name?: string;
}

interface SaganProjectRecord {
  id: string;
  title_en?: string;
  title_pl?: string;
  company?: string;
  period_en?: string;
  period_pl?: string;
  description_en?: string;
  description_pl?: string;
}

interface SaganProjectImpactRecord {
  project?: string;
  text_en?: string;
  text_pl?: string;
}

interface SaganProjectTechnologyRecord {
  project?: string;
  name?: string;
}

interface SaganSkillCategoryRecord {
  id: string;
  name_en?: string;
  name_pl?: string;
}

interface SaganSkillRecord {
  category?: string;
  name?: string;
  level?: number;
}

interface SaganLanguageRecord {
  name_en?: string;
  name_pl?: string;
  level?: number;
}

interface SaganHobbyRecord {
  name_en?: string;
  name_pl?: string;
}

interface SaganAwardRecord {
  title_en?: string;
  title_pl?: string;
  issuer?: string;
  date_label?: string;
  description_en?: string;
  description_pl?: string;
}

interface SaganRecommendationRecord {
  name?: string;
  role?: string;
  company?: string;
  image?: string;
  text_en?: string;
  text_pl?: string;
  date_label?: string;
}

interface StructuredDirectusContent {
  page: SaganPageRecord;
  profile: SaganProfileRecord;
  profileHighlights: SaganProfileHighlightRecord[];
  experiences: SaganExperienceRecord[];
  experienceHighlights: SaganExperienceHighlightRecord[];
  experienceTechnologies: SaganExperienceTechnologyRecord[];
  projects: SaganProjectRecord[];
  projectImpacts: SaganProjectImpactRecord[];
  projectTechnologies: SaganProjectTechnologyRecord[];
  skillCategories: SaganSkillCategoryRecord[];
  skills: SaganSkillRecord[];
  languages: SaganLanguageRecord[];
  hobbies: SaganHobbyRecord[];
  awards: SaganAwardRecord[];
  recommendations: SaganRecommendationRecord[];
}

const languages: SiteLanguage[] = ["en", "pl"];

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) {
    return override === undefined || override === null ? base : (override as T);
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = mergeDeep(result[key], value);
  }

  return result as T;
}

function getDirectusBaseUrl() {
  return process.env.DIRECTUS_URL?.replace(/\/$/, "");
}

function getDirectusHeaders() {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (process.env.DIRECTUS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.DIRECTUS_TOKEN}`;
  }

  return headers;
}

function getCacheSeconds() {
  const value = Number(process.env.DIRECTUS_REVALIDATE_SECONDS ?? "60");
  return Number.isFinite(value) && value >= 0 ? value : 60;
}

function getCollectionName(name: string) {
  const prefix = process.env.DIRECTUS_COLLECTION_PREFIX ?? "dev_sagan";
  return `${prefix}_${name}`;
}

async function fetchDirectusItems<T>(
  directusUrl: string,
  collection: string,
  query: Record<string, string>
): Promise<T[]> {
  const params = new URLSearchParams(query);
  const response = await fetch(`${directusUrl}/items/${collection}?${params}`, {
    headers: getDirectusHeaders(),
    next: { revalidate: getCacheSeconds() },
  });

  if (!response.ok) {
    throw new Error(`Directus ${collection} returned ${response.status}`);
  }

  const payload = (await response.json()) as DirectusListResponse<T>;
  return payload.data ?? [];
}

function mergeContent(record: DirectusSitePage): SiteContent {
  const cmsTranslations = record.content ?? {};
  const translations = languages.reduce((acc, lang) => {
    acc[lang] = mergeDeep(defaultSiteContent.translations[lang], cmsTranslations[lang]);
    return acc;
  }, {} as SiteTranslations);

  return {
    siteKey: record.site_key ?? defaultSiteContent.siteKey,
    slug: record.slug ?? defaultSiteContent.slug,
    translations,
    seo: mergeDeep(defaultSiteContent.seo, record.seo),
    contact: mergeDeep(defaultSiteContent.contact, record.contact),
    schemaJson: mergeDeep(defaultSiteContent.schemaJson, record.schema_json),
  };
}

function byParent<T extends object>(items: T[], field: keyof T, id: string) {
  return items.filter((item) => item[field] === id);
}

function translatedValue(
  record: object | undefined,
  key: string,
  language: SiteLanguage,
  fallback: string
) {
  const value = (record as Record<string, unknown> | undefined)?.[`${key}_${language}`];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function pageValue(
  page: SaganPageRecord,
  key: string,
  language: SiteLanguage,
  fallback: string
) {
  return translatedValue(page, key, language, fallback);
}

function buildTranslations(data: StructuredDirectusContent): SiteTranslations {
  const buildLanguage = (language: SiteLanguage): Translations => {
    const fallback = defaultSiteContent.translations[language];
    const page = data.page;
    const profile = data.profile;

    return {
      ...fallback,
      hero: {
        ...fallback.hero,
        name: typeof page.hero_name === "string" ? page.hero_name : fallback.hero.name,
        title: pageValue(page, "hero_title", language, fallback.hero.title),
        description: pageValue(page, "hero_description", language, fallback.hero.description),
        contactBtn: pageValue(page, "hero_contact_btn", language, fallback.hero.contactBtn),
        callBtn: pageValue(page, "hero_call_btn", language, fallback.hero.callBtn),
        linkedInLabel: pageValue(
          page,
          "hero_linkedin_label",
          language,
          fallback.hero.linkedInLabel
        ),
        imageAlt: pageValue(page, "hero_image_alt", language, fallback.hero.imageAlt),
      },
      profile: {
        ...fallback.profile,
        title: translatedValue(profile, "title", language, fallback.profile.title),
        bio: translatedValue(profile, "bio", language, fallback.profile.bio),
        highlights: data.profileHighlights.map((item, index) => ({
          title: translatedValue(item, "title", language, fallback.profile.highlights[index]?.title ?? ""),
          description: translatedValue(
            item,
            "description",
            language,
            fallback.profile.highlights[index]?.description ?? ""
          ),
        })),
      },
      experience: {
        ...fallback.experience,
        title: pageValue(page, "experience_title", language, fallback.experience.title),
        highlightsTitle: pageValue(
          page,
          "experience_highlights_title",
          language,
          fallback.experience.highlightsTitle
        ),
        technologiesTitle: pageValue(
          page,
          "experience_technologies_title",
          language,
          fallback.experience.technologiesTitle
        ),
        items: data.experiences.map((item) => ({
          role: item.role ?? "",
          company: item.company ?? "",
          period: language === "pl" ? item.period_pl ?? item.period_en ?? "" : item.period_en ?? "",
          description:
            language === "pl"
              ? item.description_pl ?? item.description_en ?? ""
              : item.description_en ?? "",
          technologies: byParent(data.experienceTechnologies, "experience", item.id)
            .map((technology) => technology.name)
            .filter((name): name is string => Boolean(name)),
          highlights: byParent(data.experienceHighlights, "experience", item.id).map((highlight) =>
            language === "pl"
              ? highlight.text_pl ?? highlight.text_en ?? ""
              : highlight.text_en ?? ""
          ),
        })),
      },
      projects: {
        ...fallback.projects,
        title: pageValue(page, "projects_title", language, fallback.projects.title),
        impactTitle: pageValue(page, "projects_impact_title", language, fallback.projects.impactTitle),
        items: data.projects.map((item) => ({
          title: language === "pl" ? item.title_pl ?? item.title_en ?? "" : item.title_en ?? "",
          company: item.company ?? "",
          period: language === "pl" ? item.period_pl ?? item.period_en ?? "" : item.period_en ?? "",
          description:
            language === "pl"
              ? item.description_pl ?? item.description_en ?? ""
              : item.description_en ?? "",
          technologies: byParent(data.projectTechnologies, "project", item.id)
            .map((technology) => technology.name)
            .filter((name): name is string => Boolean(name)),
          impact: byParent(data.projectImpacts, "project", item.id).map((impact) =>
            language === "pl" ? impact.text_pl ?? impact.text_en ?? "" : impact.text_en ?? ""
          ),
        })),
      },
      skills: {
        ...fallback.skills,
        title: pageValue(page, "skills_title", language, fallback.skills.title),
        categories: data.skillCategories.map((category) => ({
          category:
            language === "pl" ? category.name_pl ?? category.name_en ?? "" : category.name_en ?? "",
          skills: byParent(data.skills, "category", category.id).map((skill) => ({
            name: skill.name ?? "",
            level: Number(skill.level ?? 0),
          })),
        })),
        languagesTitle: pageValue(page, "skills_languages_title", language, fallback.skills.languagesTitle),
        languages: data.languages.map((item) => ({
          name: language === "pl" ? item.name_pl ?? item.name_en ?? "" : item.name_en ?? "",
          level: Number(item.level ?? 0),
        })),
        hobbiesTitle: pageValue(page, "skills_hobbies_title", language, fallback.skills.hobbiesTitle),
        hobbies: data.hobbies.map((item) =>
          language === "pl" ? item.name_pl ?? item.name_en ?? "" : item.name_en ?? ""
        ),
        bio: pageValue(page, "skills_bio", language, fallback.skills.bio),
      },
      awards: {
        ...fallback.awards,
        title: pageValue(page, "awards_title", language, fallback.awards.title),
        items: data.awards.map((item) => ({
          title: language === "pl" ? item.title_pl ?? item.title_en ?? "" : item.title_en ?? "",
          issuer: item.issuer ?? "",
          date: item.date_label ?? "",
          description:
            language === "pl"
              ? item.description_pl ?? item.description_en ?? ""
              : item.description_en ?? "",
        })),
      },
      recommendations: {
        ...fallback.recommendations,
        title: pageValue(page, "recommendations_title", language, fallback.recommendations.title),
        items: data.recommendations.map((item) => ({
          name: item.name ?? "",
          role: item.role ?? "",
          company: item.company ?? "",
          image: item.image ?? "",
          text: language === "pl" ? item.text_pl ?? item.text_en ?? "" : item.text_en ?? "",
          date: item.date_label ?? "",
        })),
      },
      contact: {
        ...fallback.contact,
        title: pageValue(page, "contact_title", language, fallback.contact.title),
        description: pageValue(page, "contact_description", language, fallback.contact.description),
        emailLabel: pageValue(page, "contact_email_label", language, fallback.contact.emailLabel),
        phoneLabel: pageValue(page, "contact_phone_label", language, fallback.contact.phoneLabel),
        linkedinLabel: pageValue(
          page,
          "contact_linkedin_label",
          language,
          fallback.contact.linkedinLabel
        ),
        downloadLabel: pageValue(
          page,
          "contact_download_label",
          language,
          fallback.contact.downloadLabel
        ),
        saveLabel: pageValue(page, "contact_save_label", language, fallback.contact.saveLabel),
        copyright: pageValue(page, "contact_copyright", language, fallback.contact.copyright),
        roleAt: pageValue(page, "contact_role_at", language, fallback.contact.roleAt),
        writeToMe: pageValue(page, "contact_write_to_me", language, fallback.contact.writeToMe),
        loadingContact: pageValue(
          page,
          "contact_loading_contact",
          language,
          fallback.contact.loadingContact
        ),
        formTitle: pageValue(page, "contact_form_title", language, fallback.contact.formTitle),
        formReachMeAt: pageValue(
          page,
          "contact_form_reach_me_at",
          language,
          fallback.contact.formReachMeAt
        ),
        formName: pageValue(page, "contact_form_name", language, fallback.contact.formName),
        formNamePlaceholder: pageValue(
          page,
          "contact_form_name_placeholder",
          language,
          fallback.contact.formNamePlaceholder
        ),
        formEmail: pageValue(page, "contact_form_email", language, fallback.contact.formEmail),
        formEmailPlaceholder: pageValue(
          page,
          "contact_form_email_placeholder",
          language,
          fallback.contact.formEmailPlaceholder
        ),
        formMessage: pageValue(page, "contact_form_message", language, fallback.contact.formMessage),
        formMessagePlaceholder: pageValue(
          page,
          "contact_form_message_placeholder",
          language,
          fallback.contact.formMessagePlaceholder
        ),
        formSubmit: pageValue(page, "contact_form_submit", language, fallback.contact.formSubmit),
        formSending: pageValue(page, "contact_form_sending", language, fallback.contact.formSending),
        formSuccess: pageValue(page, "contact_form_success", language, fallback.contact.formSuccess),
        formError: pageValue(page, "contact_form_error", language, fallback.contact.formError),
        scheduleTitle: pageValue(
          page,
          "contact_schedule_title",
          language,
          fallback.contact.scheduleTitle
        ),
        scheduleDescription: pageValue(
          page,
          "contact_schedule_description",
          language,
          fallback.contact.scheduleDescription
        ),
        scheduleFallbackLink: pageValue(
          page,
          "contact_schedule_fallback_link",
          language,
          fallback.contact.scheduleFallbackLink
        ),
        callNowBtn: pageValue(page, "contact_call_now_btn", language, fallback.contact.callNowBtn),
        callNowLabel: pageValue(
          page,
          "contact_call_now_label",
          language,
          fallback.contact.callNowLabel
        ),
        meetShort: pageValue(page, "contact_meet_short", language, fallback.contact.meetShort),
        linkedinUrl:
          typeof page.contact_linkedin_url === "string"
            ? page.contact_linkedin_url
            : fallback.contact.linkedinUrl,
        linkedinHandle:
          typeof page.contact_linkedin_handle === "string"
            ? page.contact_linkedin_handle
            : fallback.contact.linkedinHandle,
        currentCompany:
          typeof page.contact_current_company === "string"
            ? page.contact_current_company
            : fallback.contact.currentCompany,
        footerImageAlt: pageValue(
          page,
          "contact_footer_image_alt",
          language,
          fallback.contact.footerImageAlt
        ),
      },
      cookies: {
        ...fallback.cookies,
        bannerText: pageValue(page, "cookies_banner_text", language, fallback.cookies.bannerText),
        policyLink: pageValue(page, "cookies_policy_link", language, fallback.cookies.policyLink),
        accept: pageValue(page, "cookies_accept", language, fallback.cookies.accept),
        reject: pageValue(page, "cookies_reject", language, fallback.cookies.reject),
      },
    };
  };

  return {
    en: buildLanguage("en"),
    pl: buildLanguage("pl"),
  };
}

async function getStructuredSiteContent(directusUrl: string): Promise<SiteContent | null> {
  const siteKey = process.env.DIRECTUS_SITE_KEY ?? defaultSiteContent.siteKey;
  const slug = process.env.DIRECTUS_PAGE_SLUG ?? defaultSiteContent.slug;
  const common = {
    "filter[site_key][_eq]": siteKey,
    "filter[status][_eq]": "published",
    fields: "*",
    sort: "sort",
  };
  const pageQuery = {
    ...common,
    "filter[slug][_eq]": slug,
    limit: "1",
  };

  const [
    pages,
    profiles,
    profileHighlights,
    experiences,
    experienceHighlights,
    experienceTechnologies,
    projects,
    projectImpacts,
    projectTechnologies,
    skillCategories,
    skills,
    cmsLanguages,
    hobbies,
    awards,
    recommendations,
  ] = await Promise.all([
    fetchDirectusItems<SaganPageRecord>(directusUrl, getCollectionName("pages"), pageQuery),
    fetchDirectusItems<SaganProfileRecord>(directusUrl, getCollectionName("profiles"), {
      ...common,
      limit: "1",
    }),
    fetchDirectusItems<SaganProfileHighlightRecord>(
      directusUrl,
      getCollectionName("profile_highlights"),
      common
    ),
    fetchDirectusItems<SaganExperienceRecord>(directusUrl, getCollectionName("experiences"), common),
    fetchDirectusItems<SaganExperienceHighlightRecord>(
      directusUrl,
      getCollectionName("experience_highlights"),
      common
    ),
    fetchDirectusItems<SaganExperienceTechnologyRecord>(
      directusUrl,
      getCollectionName("experience_technologies"),
      common
    ),
    fetchDirectusItems<SaganProjectRecord>(directusUrl, getCollectionName("projects"), common),
    fetchDirectusItems<SaganProjectImpactRecord>(
      directusUrl,
      getCollectionName("project_impacts"),
      common
    ),
    fetchDirectusItems<SaganProjectTechnologyRecord>(
      directusUrl,
      getCollectionName("project_technologies"),
      common
    ),
    fetchDirectusItems<SaganSkillCategoryRecord>(
      directusUrl,
      getCollectionName("skill_categories"),
      common
    ),
    fetchDirectusItems<SaganSkillRecord>(directusUrl, getCollectionName("skills"), common),
    fetchDirectusItems<SaganLanguageRecord>(directusUrl, getCollectionName("languages"), common),
    fetchDirectusItems<SaganHobbyRecord>(directusUrl, getCollectionName("hobbies"), common),
    fetchDirectusItems<SaganAwardRecord>(directusUrl, getCollectionName("awards"), common),
    fetchDirectusItems<SaganRecommendationRecord>(
      directusUrl,
      getCollectionName("recommendations"),
      common
    ),
  ]);

  const page = pages[0];
  const profile = profiles[0];
  if (!page || !profile) return null;

  return {
    siteKey,
    slug,
    translations: buildTranslations({
      page,
      profile,
      profileHighlights,
      experiences,
      experienceHighlights,
      experienceTechnologies,
      projects,
      projectImpacts,
      projectTechnologies,
      skillCategories,
      skills,
      languages: cmsLanguages,
      hobbies,
      awards,
      recommendations,
    }),
    seo: mergeDeep(defaultSiteContent.seo, page.seo),
    contact: {
      email:
        typeof page.contact_email === "string"
          ? page.contact_email
          : defaultSiteContent.contact.email,
      phone:
        typeof page.contact_phone === "string"
          ? page.contact_phone
          : defaultSiteContent.contact.phone,
    },
    schemaJson: mergeDeep(defaultSiteContent.schemaJson, page.schema_json),
  };
}

async function getLegacySiteContent(directusUrl: string): Promise<SiteContent> {
  const siteKey = process.env.DIRECTUS_SITE_KEY ?? defaultSiteContent.siteKey;
  const slug = process.env.DIRECTUS_PAGE_SLUG ?? defaultSiteContent.slug;
  const params = new URLSearchParams({
    "filter[site_key][_eq]": siteKey,
    "filter[slug][_eq]": slug,
    "filter[status][_eq]": "published",
    fields: "site_key,slug,content,seo,contact,schema_json",
    limit: "1",
  });

  const response = await fetch(`${directusUrl}/items/site_pages?${params}`, {
    headers: getDirectusHeaders(),
    next: { revalidate: getCacheSeconds() },
  });

  if (!response.ok) {
    throw new Error(`Directus site_pages returned ${response.status}`);
  }

  const payload = (await response.json()) as DirectusResponse;
  const record = payload.data?.[0];

  return record ? mergeContent(record) : defaultSiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  const directusUrl = getDirectusBaseUrl();
  if (!directusUrl) return defaultSiteContent;

  try {
    const structured = await getStructuredSiteContent(directusUrl);
    if (structured) return structured;
    return await getLegacySiteContent(directusUrl);
  } catch (error) {
    console.warn("[cms] Could not fetch Directus content; using local fallback.", error);
    return defaultSiteContent;
  }
}
