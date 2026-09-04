export const DEV_TOOLS = [
  {
    slug: "jwt-decoder",
    key: "jwt",
    title: "JWT Decoder",
    description:
      "Decode JWT header and payload locally, inspect claims, roles, groups, scopes, expiration and token age.",
    iconBase: "tool-jwt-decoder",
    themeColor: "#0891b2",
    backgroundColor: "#020617",
  },
  {
    slug: "linux-time",
    key: "unix",
    title: "Linux Time Converter",
    description:
      "Convert Unix timestamps to readable dates and see live time distance to or from a timestamp.",
    iconBase: "tool-linux-time",
    themeColor: "#2563eb",
    backgroundColor: "#020617",
  },
  {
    slug: "tls-certificate",
    key: "tls",
    title: "TLS Certificate Inspector",
    description:
      "Inspect public HTTPS certificate details, validity, issuer, subject alternative names, fingerprints and chain.",
    iconBase: "tool-tls-certificate",
    themeColor: "#0f766e",
    backgroundColor: "#020617",
  },
] as const;

export type DevToolSlug = (typeof DEV_TOOLS)[number]["slug"];

export function getDevTool(slug: string) {
  return DEV_TOOLS.find((tool) => tool.slug === slug);
}

export function getDevToolIconPath(iconBase: string, size: 32 | 180 | 192 | 512) {
  return `/icons/generated/${iconBase}-${size}.png`;
}

export function getDevToolFaviconPath(iconBase: string) {
  return `/icons/generated/${iconBase}.ico`;
}
