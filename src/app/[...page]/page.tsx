import { fetchBuilderHtml } from "@/lib/builder";
import { notFound } from "next/navigation";

export const revalidate = 5;

export default async function Page({ params }: { params: { page: string[] } }) {
  const urlPath = "/" + params.page.join("/");
  const html = await fetchBuilderHtml(urlPath);

  if (!html) {
    notFound();
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
