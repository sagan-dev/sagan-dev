import { HomePage } from "@/components/HomePage";
import { siteContent } from "@/content/site-content";

export default async function Home() {

  return <HomePage schemaJson={siteContent.schemaJson} />;
}
