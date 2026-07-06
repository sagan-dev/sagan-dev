import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevToolFullscreen } from "@/components/Toolbox";
import { DEV_TOOLS, getDevTool, type DevToolSlug } from "@/lib/dev-tools";

interface DevToolPageProps {
  params: Promise<{
    tool: string;
  }>;
}

export function generateStaticParams() {
  return DEV_TOOLS.map((tool) => ({
    tool: tool.slug,
  }));
}

export async function generateMetadata({ params }: DevToolPageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getDevTool(slug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.title} | Developer Toolbox | Michał Sagan`,
    description: tool.description,
    alternates: {
      canonical: `https://sagan.dev/dev-tool/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} | Developer Toolbox`,
      description: tool.description,
      url: `https://sagan.dev/dev-tool/${tool.slug}`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DevToolPage({ params }: DevToolPageProps) {
  const { tool: slug } = await params;
  const tool = getDevTool(slug);

  if (!tool) {
    notFound();
  }

  return <DevToolFullscreen tool={tool.slug as DevToolSlug} />;
}
