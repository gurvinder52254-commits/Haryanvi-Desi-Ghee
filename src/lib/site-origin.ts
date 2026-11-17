// Public address of the site for server routes (sitemap, robots.txt, llms.txt).
// Uses SITE_URL (e.g. https://www.example.com) when set, otherwise the incoming request.
export function siteOrigin(request: Request) {
  const fromEnv = process.env["SITE_URL"]?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  return `${proto}://${host}`;
}
