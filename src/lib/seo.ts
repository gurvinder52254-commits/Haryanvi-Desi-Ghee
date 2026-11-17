import { SITE } from "@/config/site";

export type Faq = { q: string; a: string };

// A JSON-LD <script> entry for a route's head(). "<" is escaped so page text can
// never close the script tag.
export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data).replace(/</g, "\x5cu003c") };
}

// FAQPage structured data. Only use it for questions that are also shown on the page.
export function faqPageSchema(path: string, faqs: readonly Faq[]) {
  return {
    "@type": "FAQPage",
    "@id": `${SITE.url}${path}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// Home > ... breadcrumb trail for structured data.
export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
