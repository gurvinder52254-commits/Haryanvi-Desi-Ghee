import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/blog";
import { DELIVERY, FIRST_ORDER_DISCOUNT, GHEE_TYPES, SITE, discountedPrice, inStock, rupees } from "@/config/site";
import { productsOf } from "@/lib/product-schema";
import { productFaqs } from "@/lib/product-faqs";
import { ALL_SITE_FAQS } from "@/lib/site-faqs";
import { siteOrigin } from "@/lib/site-origin";

// /llms.txt – a plain-text summary of the business for AI assistants and AI search
// (ChatGPT, Perplexity, Claude, Gemini). Built from site config, so prices, delivery
// and blog posts are always current. Format: https://llmstxt.org
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = siteOrigin(request);
        const posts = await listPublishedPosts();
        const zone = DELIVERY.zones[0];
        const lines: string[] = [
          `# ${SITE.brand}`,
          "",
          `> ${SITE.brand} sells traditional village-style cow and buffalo desi ghee from Haryana, made by setting milk into curd, churning it into makkhan and slow-cooking it on a low flame, and also sells everyday cooking oil. Based in ${SITE.address}, India. Orders are taken on WhatsApp.`,
          "",
          "## Key facts",
          "",
          ...GHEE_TYPES.map((t) => `- Haryanvi ${t.label}: ${productsOf(t).map((p) => p.weight).join(", ")} packs.`),
          "- Ghee ingredients: only curd-churned milk makkhan. No vanaspati, palm oil, colour, essence or preservatives.",
          `- Delivery: free. ${zone ? `Delivered to ${zone.label} in ${zone.days}; ` : ""}dispatched within ${DELIVERY.dispatch}.`,
          ...(FIRST_ORDER_DISCOUNT > 0 ? [`- Offer: ${FIRST_ORDER_DISCOUNT}% off the first order.`] : []),
          `- How to order: WhatsApp ${SITE.phone}, or the "Buy Now on WhatsApp" button on each product page.`,
          `- Contact: ${SITE.phone}, ${SITE.email}`,
          ...(SITE.fssaiLicense ? [`- FSSAI licence: ${SITE.fssaiLicense}`] : []),
          "",
          "## Products and prices (INR, free delivery included)",
          "",
        ];
        for (const type of GHEE_TYPES) {
          lines.push(`### [Haryanvi ${type.label}](${origin}/products/${type.slug})`, "", type.description, "");
          for (const p of productsOf(type)) {
            const offer = FIRST_ORDER_DISCOUNT > 0 ? `, first order ${rupees(discountedPrice(p))}` : "";
            lines.push(`- ${p.weight}: ${rupees(p.mrp)}${offer}${inStock(p) ? "" : " (out of stock)"}`);
          }
          lines.push("");
        }
        lines.push(
          "## Pages",
          "",
          `- [Home](${origin}/): products, reviews and how our ghee is made`,
          `- [Lab Tested 100% Pure](${origin}/lab-tested): purity promises, FSSAI parameters, lab report and home purity tests`,
          `- [Free Delivery](${origin}/free-delivery): delivery areas, times and packing`,
          `- [FAQ](${origin}/faq): desi ghee and mustard oil questions, prices, ordering and delivery`,
          `- [About Us](${origin}/about): our story and the traditional method`,
          `- [Blog](${origin}/blog): guides on desi ghee`,
          "",
          "## Blog articles",
          "",
          ...posts.map((p) => `- [${p.title}](${origin}/blog/${p.slug}): ${p.excerpt}`),
          "",
          "## Frequently asked questions",
          "",
        );
        const seen = new Set<string>();
        for (const type of GHEE_TYPES) {
          for (const f of productFaqs(type)) {
            if (seen.has(f.q)) continue;
            seen.add(f.q);
            lines.push(`**${f.q}**`, f.a, "");
          }
        }
        for (const f of ALL_SITE_FAQS) {
          if (seen.has(f.q)) continue;
          seen.add(f.q);
          lines.push(`**${f.q}**`, f.a, "");
        }
        return new Response(lines.join("\n"), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
