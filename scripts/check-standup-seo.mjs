#!/usr/bin/env node
// SEO checks for the static Standup landing pages (public/apps/standup, EN and PL).
// No dependencies: run with `npm run check:standup-seo`. Exits with 1 when a check fails.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_ID = "id6817507284";
const BASE = "https://sagan.dev/apps/standup";
const PAGES = [
  { file: "public/apps/standup/index.html", lang: "en", url: BASE, store: "/us/app/" },
  { file: "public/apps/standup/pl/index.html", lang: "pl", url: `${BASE}/pl`, store: "/pl/app/" },
];

let failures = 0;
const check = (page, ok, message) => {
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} ${page.lang}: ${message}`);
};

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3]) : undefined;
};
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
const meta = (html, key, value) =>
  tags(html, "meta").filter((t) => attr(t, key) === value).map((t) => attr(t, "content"));

for (const page of PAGES) {
  const html = readFileSync(join(root, page.file), "utf8");

  check(page, new RegExp(`<html lang="${page.lang}"`).test(html), `<html lang="${page.lang}">`);
  check(page, meta(html, "name", "viewport").length === 1, "one viewport meta");

  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => text(m[1]));
  check(page, titles.length === 1, `one <title> (found ${titles.length})`);
  check(page, titles[0] && titles[0].length <= 60, `title <= 60 chars (${titles[0]?.length}): ${titles[0]}`);

  const descriptions = meta(html, "name", "description");
  check(page, descriptions.length === 1, "one meta description");
  const d = descriptions[0] ?? "";
  check(page, d.length > 0 && d.length <= 155, `description <= 155 chars (${d.length})`);

  check(page, meta(html, "name", "robots").every((c) => !/noindex/i.test(c)), "no noindex");

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  check(page, h1s.length === 1, `exactly one H1 (found ${h1s.length})`);
  check(page, /IDÅSEN/.test(h1s[0] ?? ""), `H1 names the IDÅSEN desk: ${h1s[0]}`);

  const links = tags(html, "link");
  const canonical = links.filter((t) => attr(t, "rel") === "canonical").map((t) => attr(t, "href"));
  check(page, canonical.length === 1 && canonical[0] === page.url, `canonical = ${page.url}`);
  const alternates = Object.fromEntries(
    links.filter((t) => attr(t, "rel") === "alternate" && attr(t, "hreflang")).map((t) => [attr(t, "hreflang"), attr(t, "href")]),
  );
  check(
    page,
    alternates.en === BASE && alternates.pl === `${BASE}/pl` && alternates["x-default"] === BASE,
    "hreflang en, pl and x-default",
  );

  check(page, meta(html, "property", "og:url")[0] === page.url, "og:url matches canonical");
  for (const key of ["og:title", "og:description", "og:image", "og:image:alt"]) {
    check(page, meta(html, "property", key).length === 1, `${key} present`);
  }
  const ogImage = meta(html, "property", "og:image")[0] ?? "";
  check(page, ogImage.startsWith("https://sagan.dev/") && existsSync(join(root, "public", new URL(ogImage).pathname)), `og:image exists: ${ogImage}`);
  check(page, meta(html, "name", "twitter:card")[0] === "summary_large_image", "twitter:card summary_large_image");

  // App Store links: right app, right storefront, referrer kept for App Store Connect's Web Referrer report.
  const store = tags(html, "a").filter((t) => (attr(t, "href") ?? "").includes("apps.apple.com"));
  check(page, store.length >= 1, `App Store link present (${store.length})`);
  for (const t of store) {
    const href = attr(t, "href");
    check(page, href.includes(APP_ID) && href.includes(page.store), `App Store link ${page.store}…${APP_ID}`);
    check(page, !/noreferrer/.test(attr(t, "rel") ?? ""), "App Store link keeps the referrer (no noreferrer)");
  }

  // Local files referenced by the page exist.
  for (const m of html.matchAll(/(?:src|href|srcset)="(\/apps\/standup\/[^"?#]*\.(?:png|webp|css|js))/g)) {
    check(page, existsSync(join(root, "public", m[1])), `file exists: ${m[1]}`);
  }

  // JSON-LD: parses, has the required fields, no ratings or reviews.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const data = [];
  for (const b of blocks) {
    try {
      data.push(JSON.parse(b));
    } catch (e) {
      check(page, false, `JSON-LD parses: ${e.message}`);
    }
  }
  check(page, data.length === blocks.length && blocks.length > 0, `JSON-LD blocks parse (${blocks.length})`);
  check(page, !/aggregateRating|"review"/i.test(blocks.join("\n")), "JSON-LD has no aggregateRating or review");

  const app = data.find((x) => x["@type"] === "SoftwareApplication");
  check(page, !!app, "SoftwareApplication JSON-LD");
  if (app) {
    check(page, app.name && app.applicationCategory && /macOS 13/.test(app.operatingSystem ?? ""), "name, applicationCategory, operatingSystem macOS 13");
    check(page, app.offers && Number(app.offers.price) === 0 && !!app.offers.priceCurrency, "offers price 0");
    check(page, (app.url ?? "").includes(APP_ID) && (app.url ?? "").includes(page.store), "url points to the App Store listing");
    check(page, app.publisher?.name === "Michal Sagan", "publisher Michal Sagan");
    check(page, app.inLanguage === page.lang, `inLanguage ${page.lang}`);
  }

  const faq = data.find((x) => x["@type"] === "FAQPage");
  check(page, !!faq, "FAQPage JSON-LD");
  if (faq) {
    const visible = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((m) => ({
      q: text(m[1]),
      a: text(m[2]),
    }));
    const marked = faq.mainEntity.map((x) => ({ q: x.name, a: x.acceptedAnswer?.text }));
    check(page, marked.length >= 6 && marked.length <= 8, `FAQ has 6–8 questions (${marked.length})`);
    check(page, JSON.stringify(marked) === JSON.stringify(visible), "FAQPage matches the visible questions and answers");
  }

  // Only the IDÅSEN is claimed as confirmed; no unreleased features advertised as available.
  check(page, !/webhook/i.test(text(html)), "no webhooks (not released)");
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll Standup SEO checks passed");
process.exit(failures ? 1 : 0);
