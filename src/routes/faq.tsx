import { createFileRoute } from "@tanstack/react-router";
import { PageShell, WaIcon } from "@/components/site-layout";
import { FaqList } from "@/components/faq-list";
import { SITE, whatsappLink } from "@/config/site";
import { breadcrumbSchema, faqPageSchema, jsonLdScript } from "@/lib/seo";
import { ALL_SITE_FAQS, FAQ_GROUPS } from "@/lib/site-faqs";

const TITLE = "Desi Ghee & Mustard Oil FAQs – Price, Purity, Delivery | Haryanvi Desi Ghee";
const DESCRIPTION =
  "Answers to common questions about desi ghee and mustard oil: desi ghee price 1 kg, cow vs buffalo ghee, A2 ghee, how to check pure ghee, mustard oil price and benefits, ordering and free delivery.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "desi ghee faq, desi ghee price 1kg, cow desi ghee, desi cow ghee, a2 desi cow ghee, desi ghee in hindi, pure desi ghee, desi ghee benefits, mustard oil price 1 litre, mustard oil in hindi, kachi ghani mustard oil, mustard oil benefits",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE.url}/faq` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/faq` }],
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@graph": [breadcrumbSchema([{ name: "FAQ", path: "/faq" }]), faqPageSchema("/faq", ALL_SITE_FAQS)],
      }),
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PageShell eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Everything you want to know about desi ghee, mustard oil, prices, ordering and delivery.">
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="FAQ topics" className="flex flex-wrap justify-center gap-2">
            {FAQ_GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:border-gold hover:text-earth">
                {g.title}
              </a>
            ))}
          </nav>
          {FAQ_GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="mt-14 scroll-mt-28">
              <h2 className="mb-6 text-3xl font-bold text-primary sm:text-4xl">{g.title}</h2>
              <FaqList faqs={g.faqs} />
            </section>
          ))}
        </div>
      </section>

      <section className="bg-primary px-5 py-16 text-center text-primary-foreground sm:py-20">
        <h2 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">Still have a question?</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-85">Message us on WhatsApp and we will reply as soon as we can.</p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 font-semibold text-whatsapp-foreground transition hover:scale-105">
          <WaIcon /> Ask on WhatsApp
        </a>
      </section>
    </PageShell>
  );
}
