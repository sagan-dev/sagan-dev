import { HomePage } from "@/components/HomePage";
import type { Metadata } from "next";
import { siteContent } from "@/content/site-content";
import { indexable, openGraph } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: openGraph("/"),
  robots: indexable,
};

export default async function Home() {

  return <HomePage schemaJson={siteContent.schemaJson} />;
}
