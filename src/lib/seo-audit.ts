import { createServerFn } from "@tanstack/react-start";

// Admin "SEO Check": fetches every page in the sitemap from the live site and checks
// what Google (SEO), answer boxes and voice search (AEO) and AI assistants like
// ChatGPT and Perplexity (GEO) look at. Rankings and indexing status come from
// Google Search Console; the admin page links straight to it for each URL.

export type SeoIssue = { level: "error" | "warn"; text: string };

export type SeoPageResult = {
  url: string;
  status: number;
  ms: number;
  title: string;
  description: string;
  h1: number;
  words: number;
  schema: string[];
  faqs: number;
  questionHeadings: number;
  issues: SeoIssue[];
};

export type SeoGroup = "SEO" | "AEO" | "GEO";
export type SeoSiteCheck = { group: SeoGroup; label: string; ok: boolean; detail: string };

export type SeoAuditResult = {
  origin: string;
  checkedAt: string;
  site: SeoSiteCheck[];
  pages: SeoPageResult[];
};

// AI search and assistant crawlers that should be able to read the site.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended"];
const UA = "HDG-SEO-Check/1.0";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function attr(tag: string, name: string) {
  return decode(new RegExp(`\\s${name}="([^"]*)"`, "i").exec(tag)?.[1] ?? "");
}

function metaContent(html: string, key: string) {
  for (const m of html.matchAll(/<meta\s[^>]*>/gi)) {
    const tag = m[0];
    if (attr(tag, "name").toLowerCase() === key || attr(tag, "property").toLowerCase() === key) return attr(tag, "content");
  }
  return null;
}

type Node = Record<string, unknown>;

function schemaNodes(html: string): { nodes: Node[]; broken: boolean } {
  const nodes: Node[] = [];
  let broken = false;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1] ?? "");
      const list: unknown[] = Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
      for (const n of list) if (n && typeof n === "object") nodes.push(n as Node);
    } catch {
      broken = true;
    }
  }
  return { nodes, broken };
}

const typesOf = (n: Node) => {
  const t = n["@type"];
  return typeof t === "string" ? [t] : Array.isArray(t) ? t.map(String) : [];
};

const plain = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function checkPage(url: string): Promise<SeoPageResult> {
  const start = Date.now();
  const issues: SeoIssue[] = [];
  let res: Response;
  try {
    res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "manual" });
  } catch {
    return { url, status: 0, ms: Date.now() - start, title: "", description: "", h1: 0, words: 0, schema: [], faqs: 0, questionHeadings: 0, issues: [{ level: "error", text: "Page could not be loaded" }] };
  }
  const html = await res.text();
  const ms = Date.now() - start;
  if (res.status !== 200) issues.push({ level: "error", text: `Returns status ${res.status} (should be 200)` });

  const title = decode(/<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? "").trim();
  const description = metaContent(html, "description") ?? "";
  const robots = (metaContent(html, "robots") ?? "").toLowerCase();
  const canonicalTag = /<link\s[^>]*rel="canonical"[^>]*>/i.exec(html)?.[0];
  const canonical = canonicalTag ? attr(canonicalTag, "href") : "";
  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  const body = /<body[\s\S]*<\/body>/i.exec(html)?.[0] ?? html;
  const text = plain(body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " "));
  const words = text.split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const imgsNoAlt = [...html.matchAll(/<img\s[^>]*>/gi)].filter((m) => !/\salt=/i.test(m[0])).length;
  const { nodes, broken } = schemaNodes(html);
  const types = nodes.flatMap(typesOf);

  // AEO: FAQ data and question-style headings that answer engines pick up.
  const faqNode = nodes.find((n) => typesOf(n).includes("FAQPage"));
  const questions = Array.isArray(faqNode?.["mainEntity"]) ? (faqNode["mainEntity"] as Node[]) : [];
  const hidden = questions.filter((q) => {
    const name = typeof q["name"] === "string" ? q["name"] : "";
    return name && !text.includes(name.replace(/\s+/g, " ").trim());
  });
  const questionHeadings = [...body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].filter((m) => plain(m[1] ?? "").endsWith("?")).length;

  // SEO
  if (!title) issues.push({ level: "error", text: "Missing page title" });
  else if (title.length > 65) issues.push({ level: "warn", text: `Title is ${title.length} characters; Google may cut it after ~60` });
  else if (title.length < 25) issues.push({ level: "warn", text: `Title is short (${title.length} characters)` });
  if (!description) issues.push({ level: "error", text: "Missing meta description" });
  else if (description.length > 170) issues.push({ level: "warn", text: `Description is ${description.length} characters; Google may cut it after ~160` });
  else if (description.length < 70) issues.push({ level: "warn", text: `Description is short (${description.length} characters)` });
  if (robots.includes("noindex")) issues.push({ level: "error", text: "Page is set to noindex, so Google will not show it" });
  if (!canonical) issues.push({ level: "warn", text: "No canonical URL" });
  else if (new URL(canonical, url).pathname.replace(/\/$/, "") !== new URL(url).pathname.replace(/\/$/, "")) {
    issues.push({ level: "warn", text: `Canonical points to a different page: ${canonical}` });
  }
  if (h1 === 0) issues.push({ level: "error", text: "No H1 heading in the page HTML (Google and AI bots may not see the content)" });
  else if (h1 > 1) issues.push({ level: "warn", text: `${h1} H1 headings (use one)` });
  if (words < 250) issues.push({ level: "warn", text: `Only about ${words} words; thin pages rank poorly` });
  if (imgsNoAlt) issues.push({ level: "warn", text: `${imgsNoAlt} image(s) without alt text` });
  if (broken) issues.push({ level: "error", text: "Structured data (JSON-LD) has invalid JSON" });
  if (!types.length) issues.push({ level: "warn", text: "No structured data" });
  if (ms > 3000) issues.push({ level: "warn", text: `Slow response (${(ms / 1000).toFixed(1)} s)` });
  // AEO
  if (hidden.length) issues.push({ level: "error", text: `${hidden.length} FAQ question(s) in structured data are not shown on the page (Google requires them visible)` });

  return { url, status: res.status, ms, title, description, h1, words, schema: [...new Set(types)], faqs: questions.length, questionHeadings, issues };
}

// Runs up to `limit` checks at once.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i] as T);
      }
    }),
  );
  return out;
}

async function getText(url: string, userAgent = UA) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": userAgent } });
    return { status: res.status, text: await res.text() };
  } catch {
    return { status: 0, text: "" };
  }
}

// Is "/" blocked for this bot in robots.txt? Uses the bot's own group, or "*".
function robotsBlocks(robots: string, bot: string) {
  const groups: { agents: string[]; rules: string[] }[] = [];
  let current: { agents: string[]; rules: string[] } | null = null;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line);
    if (!m) continue;
    const key = (m[1] ?? "").toLowerCase();
    const value = (m[2] ?? "").trim();
    if (key === "user-agent") {
      if (!current || current.rules.length) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
    } else if (current && (key === "allow" || key === "disallow")) {
      current.rules.push(`${key}:${value}`);
    }
  }
  const own = groups.find((g) => g.agents.includes(bot.toLowerCase())) ?? groups.find((g) => g.agents.includes("*"));
  return !!own?.rules.includes("disallow:/") && !own.rules.includes("allow:/");
}

export const adminSeoAudit = createServerFn({ method: "GET" }).handler(async (): Promise<SeoAuditResult> => {
  const session = await import("./admin-session.server");
  session.requireAdmin();
  const { getRequest } = await import("@tanstack/react-start/server");
  const { siteOrigin } = await import("./site-origin");
  const origin = siteOrigin(getRequest());

  const [sitemap, robots, llms, asGpt, asPerplexity] = await Promise.all([
    getText(`${origin}/sitemap.xml`),
    getText(`${origin}/robots.txt`),
    getText(`${origin}/llms.txt`),
    getText(`${origin}/`, "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)"),
    getText(`${origin}/`, "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"),
  ]);
  const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1] ?? "")).filter((u) => u.startsWith(origin));
  const pages = await mapLimit(urls.slice(0, 60), 4, checkPage);

  const okRobots = robots.status === 200;
  const searchBlocked = ["Googlebot", "Bingbot"].filter((b) => okRobots && robotsBlocks(robots.text, b));
  const aiBlocked = AI_BOTS.filter((b) => okRobots && robotsBlocks(robots.text, b));
  const errorPages = pages.filter((p) => p.issues.some((i) => i.level === "error"));
  const withFaq = pages.filter((p) => p.faqs > 0);
  const productPages = pages.filter((p) => new URL(p.url).pathname.startsWith("/products/"));
  const blogPages = pages.filter((p) => new URL(p.url).pathname.startsWith("/blog/"));
  const hiddenFaq = pages.filter((p) => p.issues.some((i) => i.text.includes("FAQ question")));
  const totalQuestions = withFaq.reduce((n, p) => n + p.faqs, 0);
  const org = schemaNodes(asGpt.text).nodes.find((n) => typesOf(n).includes("Organization"));
  const botSees = (r: { status: number; text: string }) => r.status === 200 && /<h1[\s>]/i.test(r.text);
  const llmsHasFacts = /₹\s?\d/.test(llms.text) && /\+?\d[\d\s]{8,}/.test(llms.text);

  const site: SeoSiteCheck[] = [
    // SEO – Google and Bing search
    { group: "SEO", label: "sitemap.xml", ok: sitemap.status === 200 && urls.length > 0, detail: sitemap.status === 200 ? `${urls.length} pages listed for Google` : `status ${sitemap.status}` },
    {
      group: "SEO",
      label: "robots.txt",
      ok: okRobots && !searchBlocked.length && /sitemap:/i.test(robots.text),
      detail: !okRobots ? `status ${robots.status}` : searchBlocked.length ? `Blocks ${searchBlocked.join(", ")}!` : /sitemap:/i.test(robots.text) ? "Google and Bing allowed, sitemap linked" : "No Sitemap line",
    },
    { group: "SEO", label: "Pages without errors", ok: pages.length > 0 && !errorPages.length, detail: `${pages.length - errorPages.length} of ${pages.length} pages` },
    { group: "SEO", label: "HTTPS", ok: origin.startsWith("https://"), detail: origin.startsWith("https://") ? "Secure address" : "Not HTTPS (fine on a local test server)" },
    // AEO – answer boxes, "People also ask", voice search
    { group: "AEO", label: "FAQ answers", ok: withFaq.length > 0, detail: `${totalQuestions} questions on ${withFaq.length} pages, marked up as FAQPage` },
    { group: "AEO", label: "FAQs visible on page", ok: withFaq.length > 0 && !hiddenFaq.length, detail: hiddenFaq.length ? `${hiddenFaq.length} page(s) have hidden FAQ data` : "Every FAQ in the data is shown to visitors" },
    {
      group: "AEO",
      label: "Product pages answer questions",
      ok: productPages.length > 0 && productPages.every((p) => p.faqs >= 3),
      detail: productPages.length ? productPages.map((p) => `${new URL(p.url).pathname.split("/").pop()}: ${p.faqs} FAQs`).join(", ") : "No product pages in sitemap",
    },
    {
      group: "AEO",
      label: "Blog articles with FAQs",
      ok: blogPages.length > 0 && blogPages.filter((p) => p.faqs > 0).length >= Math.ceil(blogPages.length / 3),
      detail: `${blogPages.filter((p) => p.faqs > 0).length} of ${blogPages.length} articles. Add FAQs in Admin → Blog Posts to the rest`,
    },
    // GEO – ChatGPT, Perplexity, Claude, Gemini
    { group: "GEO", label: "AI bots allowed", ok: okRobots && !aiBlocked.length, detail: !okRobots ? "robots.txt missing" : aiBlocked.length ? `Blocked: ${aiBlocked.join(", ")}` : `${AI_BOTS.length} AI bots can read the site (ChatGPT, Perplexity, Claude, Gemini, Apple)` },
    { group: "GEO", label: "ChatGPT bot sees content", ok: botSees(asGpt), detail: botSees(asGpt) ? "Homepage loads with full text for GPTBot" : `status ${asGpt.status}, no readable content` },
    { group: "GEO", label: "Perplexity bot sees content", ok: botSees(asPerplexity), detail: botSees(asPerplexity) ? "Homepage loads with full text for PerplexityBot" : `status ${asPerplexity.status}, no readable content` },
    {
      group: "GEO",
      label: "llms.txt",
      ok: llms.status === 200 && llms.text.startsWith("# ") && llmsHasFacts,
      detail: llms.status !== 200 ? `status ${llms.status}` : llmsHasFacts ? "Business summary with prices and contact" : "Missing prices or contact details",
    },
    {
      group: "GEO",
      label: "Business identity (Organization)",
      ok: !!org && !!org["name"] && !!(org["telephone"] || org["email"]),
      detail: org ? `${String(org["name"] ?? "")}${org["telephone"] ? " · phone" : ""}${org["email"] ? " · email" : ""}${org["address"] ? " · address" : ""}` : "No Organization data on the homepage",
    },
  ];

  return { origin, checkedAt: new Date().toISOString(), site, pages };
});
