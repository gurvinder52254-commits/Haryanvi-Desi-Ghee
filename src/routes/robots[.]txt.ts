import { createFileRoute } from "@tanstack/react-router";
import { siteOrigin } from "@/lib/site-origin";

// /robots.txt – lets search engines and AI search/assistant bots read the public
// site, keeps the admin area out, and points to the sitemap and llms.txt.
// One group with several user-agents, so every bot gets the same rules.
const BOTS = [
  "*",
  // Search engines
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "YandexBot",
  // AI search and assistants (ChatGPT, Perplexity, Claude, Gemini, Apple, Meta)
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  // Link previews
  "Twitterbot",
  "facebookexternalhit",
];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = siteOrigin(request);
        const body = [
          ...BOTS.map((b) => `User-agent: ${b}`),
          "Allow: /",
          "Disallow: /admin",
          "",
          `Sitemap: ${origin}/sitemap.xml`,
          "",
          `# Summary of this site for AI assistants: ${origin}/llms.txt`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
