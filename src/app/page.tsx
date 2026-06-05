import { HomePage } from "@/components/HomePage";
import { getSiteContent } from "@/lib/cms";

export default async function Home() {
  const siteContent = await getSiteContent();

  return <HomePage schemaJson={siteContent.schemaJson} />;
}
