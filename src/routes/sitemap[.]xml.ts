import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/blog";
import { GHEE_TYPES } from "@/config/site";
import { siteOrigin } from "@/lib/site-origin";

// /sitemap.xml – lists every public page and published blog post for Google.

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
          ...GHEE_TYPES.map((t) => ({ loc: `/products/${t.slug}`, priority: "0.9", changefreq: "weekly" })),
          { loc: "/lab-tested", priority: "0.7", changefreq: "monthly" },
          { loc: "/free-delivery", priority: "0.7", changefreq: "monthly" },
          { loc: "/faq", priority: "0.7", changefreq: "monthly" },
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
