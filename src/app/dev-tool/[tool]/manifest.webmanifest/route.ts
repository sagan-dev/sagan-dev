import { NextResponse } from "next/server";
import { getDevTool, getDevToolIconPath } from "@/lib/dev-tools";

interface DevToolManifestRouteProps {
  params: Promise<{
    tool: string;
  }>;
}

export async function GET(_request: Request, { params }: DevToolManifestRouteProps) {
  const { tool: slug } = await params;
  const tool = getDevTool(slug);

  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: `${tool.title} | sagan.dev`,
    short_name: tool.title,
    description: tool.description,
    start_url: `/dev-tool/${tool.slug}`,
    scope: `/dev-tool/${tool.slug}`,
    display: "standalone",
    background_color: tool.backgroundColor,
    theme_color: tool.themeColor,
    icons: [
      {
        src: getDevToolIconPath(tool.iconBase, 192),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: getDevToolIconPath(tool.iconBase, 512),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
}
