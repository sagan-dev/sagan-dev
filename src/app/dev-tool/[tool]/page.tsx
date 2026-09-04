import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevToolFullscreen } from "@/components/Toolbox";
import {
  DEV_TOOLS,
  getDevTool,
  getDevToolFaviconPath,
  getDevToolIconPath,
  type DevToolSlug,
} from "@/lib/dev-tools";

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
    manifest: `/dev-tool/${tool.slug}/manifest.webmanifest`,
    icons: {
      icon: [
        { url: getDevToolFaviconPath(tool.iconBase), sizes: "any", type: "image/x-icon" },
        { url: `/icons/${tool.iconBase}.svg`, type: "image/svg+xml" },
        { url: getDevToolIconPath(tool.iconBase, 32), sizes: "32x32", type: "image/png" },
        { url: getDevToolIconPath(tool.iconBase, 192), sizes: "192x192", type: "image/png" },
      ],
      shortcut: [getDevToolFaviconPath(tool.iconBase)],
      apple: [{ url: getDevToolIconPath(tool.iconBase, 180), sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: tool.title,
      statusBarStyle: "black-translucent",
    },
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
