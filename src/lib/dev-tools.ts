export const DEV_TOOLS = [
  {
    slug: "jwt-decoder",
    key: "jwt",
    title: "JWT Decoder",
    description:
      "Decode JWT header and payload locally, inspect claims, roles, groups, scopes, expiration and token age.",
  },
  {
    slug: "linux-time",
    key: "unix",
    title: "Linux Time Converter",
    description:
      "Convert Unix timestamps to readable dates and see live time distance to or from a timestamp.",
  },
] as const;

export type DevToolSlug = (typeof DEV_TOOLS)[number]["slug"];

export function getDevTool(slug: string) {
  return DEV_TOOLS.find((tool) => tool.slug === slug);
}
