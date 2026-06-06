import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://cal.sagan.dev
    https://t.contentsquare.net
    https://challenges.cloudflare.com;
  script-src-elem 'self' 'unsafe-inline' 'unsafe-eval'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://cal.sagan.dev
    https://t.contentsquare.net
    https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://ui-avatars.com https://media.licdn.com;
  connect-src 'self'
    https://www.google-analytics.com
    https://region1.google-analytics.com
    https://analytics.google.com
    https://cal.sagan.dev
    https://*.contentsquare.net
    https://challenges.cloudflare.com
    https://api.sagan.eu;
  frame-src https://challenges.cloudflare.com https://cal.sagan.dev;
  worker-src 'self' blob:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
