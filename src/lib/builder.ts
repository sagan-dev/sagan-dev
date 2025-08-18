const API_KEY = "be4230dedd72448d96f4fa7f3194af7b";

export async function fetchBuilderHtml(urlPath: string): Promise<string | null> {
  const encodedPath = encodeURIComponent(urlPath);
  const res = await fetch(
    `https://cdn.builder.io/api/v3/render/page?apiKey=${API_KEY}&url=${encodedPath}`
  );
  if (!res.ok) {
    return null;
  }
  return res.text();
}
