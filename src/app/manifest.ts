import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michał Sagan",
    short_name: "sagan.dev",
    description: "Michał Sagan - Product Architect and developer toolbox.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icons/generated/sagan-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/generated/sagan-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
