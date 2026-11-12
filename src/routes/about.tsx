import { createFileRoute } from "@tanstack/react-router";
import village from "@/assets/village.jpg";
import jar from "@/assets/ghee-jar.jpg";
import { PageShell, WaIcon } from "@/components/site-layout";
import { SITE, whatsappLink } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us – Haryanvi Desi Ghee" },
      { name: "description", content: "The story of Haryanvi Desi Ghee: village-style desi ghee made the traditional Haryana way, with care for quality in every jar." },
      { property: "og:title", content: "About Us – Haryanvi Desi Ghee" },
      { property: "og:description", content: "Village-style desi ghee made the traditional Haryana way." },
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  { t: "Milk to Curd", d: "Milk is boiled, cooled and set into curd, just like it is done in village homes." },
  { t: "Churning Makkhan", d: "The curd is churned until white makkhan separates from the chhaachh." },
  { t: "Slow Heating", d: "The makkhan is heated slowly on a low flame until it turns clear, golden and fragrant." },
  { t: "Filtering & Packing", d: "The ghee is filtered, cooled and sealed in clean jars, ready for your kitchen." },
];

const QUALITY = [
  { t: "Traditional Method", d: "Prepared slowly in the village style, never rushed." },
  { t: "Rich Aroma & Danedar Texture", d: "The familiar smell and grainy texture of homemade ghee." },
  { t: "Hygienic Packing", d: "Filled in clean, sealed jars to keep it fresh." },
  { t: "Direct From Us", d: "Order on WhatsApp and talk to us directly, no middlemen." },
];

function AboutPage() {
  return (
    <PageShell eyebrow="About Us" title="Gaon ki rasoi se, aapke ghar tak" subtitle="The story behind Haryanvi Desi Ghee and the traditional way we make it.">
      {/* Story */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl shadow-warm">
            <img src={village} alt="Butter being churned in a Haryana village" width={1280} height={960} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Our Story</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">A taste that reminds you of home</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/85">
              <p>
                In the villages of Haryana, desi ghee has always been part of daily life. It was made slowly at home, the way grandmothers taught, and served on hot rotis, in dal and in festive sweets.
              </p>
              <p>
                Haryanvi Desi Ghee was started to bring that same familiar taste to families who miss it. We follow the traditional style of preparation, so every spoon carries the rich aroma and grainy texture of village-made ghee.
              </p>
              <p>For us, ghee is not just a product. It is a piece of Haryana's food culture that we are proud to share.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-secondary px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">How It's Made</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">The Traditional Haryanvi Process</h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
          </div>
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative rounded-2xl bg-card p-8 shadow-warm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold font-display text-2xl font-bold text-accent-foreground">{i + 1}</div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-2xl text-center text-muted-foreground">
            Want to know more? Read our article on{" "}
            <a href="/blog/how-traditional-desi-ghee-is-made" className="font-semibold text-primary underline decoration-gold underline-offset-4">how traditional desi ghee is made</a>.
          </p>
        </div>
      </section>

      {/* Quality */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2 overflow-hidden rounded-2xl shadow-warm">
            <img src={jar} alt="Jar of Haryanvi Desi Ghee" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Our Quality Promise</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">Made with care, jar after jar</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {QUALITY.map((q) => (
                <div key={q.t} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-gold">✦</p>
                  <h3 className="mt-2 text-xl font-bold text-primary">{q.t}</h3>
                  <p className="mt-1 text-muted-foreground">{q.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand info */}
      <section className="bg-primary px-5 py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 text-center md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Brand</p>
            <p className="mt-2 font-display text-2xl font-bold">{SITE.brand}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Packs</p>
            <p className="mt-2 font-display text-2xl font-bold">250 GM · 500 GM · 1 KG · 5 KG</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Based In</p>
            <p className="mt-2 font-display text-2xl font-bold">{SITE.address}</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 font-semibold text-whatsapp-foreground transition hover:scale-105">
            <WaIcon /> Order on WhatsApp
          </a>
        </div>
      </section>
    </PageShell>
  );
}
