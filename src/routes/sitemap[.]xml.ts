import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/blog";

// /sitemap.xml – lists every public page and published blog post for Google.
// The site address comes from SITE_URL (e.g. https://www.example.com) when set,
// otherwise from the incoming request.

function siteOrigin(request: Request) {
  const fromEnv = process.env["SITE_URL"]?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  return `${proto}://${host}`;
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = siteOrigin(request);
        const posts = await listPublishedPosts();
        const pages = [
          { loc: "/", priority: "1.0", changefreq: "weekly" },
          { loc: "/blog", priority: "0.9", changefreq: "weekly", lastmod: posts[0]?.updatedAt },
          { loc: "/about", priority: "0.6", changefreq: "monthly" },
          { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
          ...posts.map((p) => ({ loc: `/blog/${p.slug}`, priority: "0.8", changefreq: "monthly", lastmod: p.updatedAt })),
        ];
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          pages
            .map(
              (p) =>
                `  <url><loc>${xmlEscape(origin + p.loc)}</loc>` +
                (p.lastmod ? `<lastmod>${xmlEscape(p.lastmod.slice(0, 10))}</lastmod>` : "") +
                `<changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
