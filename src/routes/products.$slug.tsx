import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Footer, Header, WaIcon } from "@/components/site-layout";
import { ShieldCheckIcon, TruckIcon } from "@/components/trust-strip";
import { BuffaloIcon, CowIcon, OilIcon } from "@/components/ghee-icons";
import {
  DELIVERY,
  FIRST_ORDER_DISCOUNT,
  GHEE_TYPES,
  SITE,
  discountedPrice,
  inStock,
  rupees,
  sizeKey,
  skuFor,
  whatsappLink,
  type GheeType,
} from "@/config/site";
import { getProductReviews } from "@/lib/reviews";
import { absoluteUrl, productImage } from "@/lib/product-media";
import { productPageUrl, productSchema, productsOf } from "@/lib/product-schema";
import { productFaqs } from "@/lib/product-faqs";
import { faqPageSchema, jsonLdScript, type Faq } from "@/lib/seo";

function withFaqs(schema: ReturnType<typeof productSchema>, path: string, faqs: Faq[]) {
  return faqs.length ? { ...schema, "@graph": [...schema["@graph"], faqPageSchema(path, faqs)] } : schema;
}

export const Route = createFileRoute("/products/$slug")({
  validateSearch: (search: Record<string, unknown>): { size?: string } =>
    typeof search["size"] === "string" && search["size"] ? { size: search["size"] } : {},
  loader: async ({ params }) => {
    const type = GHEE_TYPES.find((t) => t.slug === params.slug);
    if (!type) throw notFound();
    const { reviews, summary } = await getProductReviews({ data: { product: type.id } });
    return { typeId: type.id, reviews, summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found – Haryanvi Desi Ghee" }, { name: "robots", content: "noindex" }] };
    const type = GHEE_TYPES.find((t) => t.id === loaderData.typeId) ?? GHEE_TYPES[0]!;
    const products = productsOf(type);
    const prices = products.map((p) => p.mrp);
    const oneKg = products.find((p) => sizeKey(p) === "1kg") ?? products[0];
    // Kept under ~60 / ~160 characters so Google shows them in full.
    const title = `Haryanvi ${type.label}${oneKg ? ` ${oneKg.weight} ${rupees(oneKg.mrp)}` : ""} – Buy Online`;
    const sizes = `${products.map((p) => p.weight).join(", ")} packs from ${rupees(Math.min(...prices))}. Free delivery, order on WhatsApp.`;
    const description =
      type.kind === "oil"
        ? `Haryanvi ${type.label.toLowerCase()} for everyday Indian cooking. ${sizes}`
        : `Pure Haryanvi ${type.label.toLowerCase()}, slow-cooked from curd-churned makkhan. ${sizes}`;
    const url = productPageUrl(type);
    const image = absoluteUrl(productImage(type.id));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: type.kind === "oil" ? "cooking oil, cooking oil price 1 liter, cooking oil 5 liter price, cooking oil 2 liter, buy cooking oil online, cooking oil mohali" : `${type.label.toLowerCase()}, haryanvi ${type.label.toLowerCase()}, ${type.label.toLowerCase()} price 1kg, buy ${type.label.toLowerCase()} online, pure desi ghee` },
        { property: "og:type", content: "product" },
        { property: "og:title", content: `Haryanvi ${type.label} | ${SITE.brand}` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "product:brand", content: SITE.brand },
        ...(oneKg ? [{ property: "product:price:amount", content: String(oneKg.mrp) }, { property: "product:price:currency", content: "INR" }] : []),
        { name: "twitter:title", content: `Haryanvi ${type.label} | ${SITE.brand}` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      // One JSON-LD block per page: ProductGroup (all sizes) + BreadcrumbList + FAQPage.
      scripts: [jsonLdScript(withFaqs(productSchema(type, loaderData.reviews, loaderData.summary), `/products/${type.slug}`, productFaqs(type)))],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

const TYPE_ICON: Record<GheeType, typeof CowIcon> = { cow: CowIcon, buffalo: BuffaloIcon, oil: OilIcon };

function Stars({ value, className = "" }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span className={`text-gold ${className}`} aria-hidden>
      {"★".repeat(full)}
      <span className="opacity-30">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function ProductPage() {
  const { typeId, reviews, summary } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const type = GHEE_TYPES.find((t) => t.id === typeId) ?? GHEE_TYPES[0]!;
  const products = productsOf(type);
  const fallback = products.find((p) => sizeKey(p) === "1kg") ?? products[0]!;
  const selected = products.find((p) => sizeKey(p) === search.size) ?? fallback;
  const [qty, setQty] = useState(1);
  const offer = discountedPrice(selected);
  const hasOffer = FIRST_ORDER_DISCOUNT > 0 && offer < selected.mrp;
  const available = inStock(selected);
  const other = GHEE_TYPES.find((t) => t.id !== type.id);
  const Icon = TYPE_ICON[type.id];
  const OtherIcon = other ? TYPE_ICON[other.id] : null;
  const faqs = productFaqs(type);
  const noun = type.kind === "oil" ? "oil" : "ghee";

  const choose = (key: string) => {
    setQty(1);
    navigate({ search: { size: key }, replace: true, resetScroll: false });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 sm:pt-32">
        {/* Breadcrumb (matches the BreadcrumbList data) */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li aria-hidden>/</li>
            <li><a href="/#products" className="hover:text-primary">Our Products</a></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-primary">{type.label}</li>
          </ol>
        </nav>

        <section className="px-5 pb-16 pt-6 sm:pb-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl bg-secondary shadow-warm lg:sticky lg:top-28 lg:self-start">
              <img key={selected.id} src={productImage(type.id, selected.id)} alt={`Haryanvi ${type.label} ${selected.weight} ${type.kind === "oil" ? "pack" : "jar"}`} width={1024} height={1024} className="aspect-square w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">{selected.weight}</span>
              {selected.tag && <span className="absolute right-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-accent-foreground">{selected.tag}</span>}
            </div>

            <div>
              <p className="flex items-center gap-2 text-base font-semibold text-earth">
                <Icon className="h-6 w-6" /> {type.hindi}
              </p>
              <h1 className="mt-2 text-4xl font-bold leading-tight text-primary sm:text-5xl">Haryanvi {type.label}</h1>

              {summary.count > 0 ? (
                <a href="#product-reviews" className="mt-3 inline-flex items-center gap-2 text-sm">
                  <Stars value={summary.average} className="text-lg" />
                  <span className="font-semibold text-primary">{summary.average.toFixed(1)}</span>
                  <span className="text-muted-foreground underline-offset-4 hover:underline">({summary.count} review{summary.count > 1 ? "s" : ""})</span>
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No reviews yet for this {noun}.</p>
              )}

              <p className="mt-5 text-lg leading-relaxed text-foreground/85">{type.description}</p>

              {/* Size */}
              <fieldset className="mt-7">
                <legend className="text-sm font-semibold uppercase tracking-wider text-primary">Pack size</legend>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {products.map((p) => {
                    const active = p.id === selected.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => choose(sizeKey(p))}
                        className={`rounded-xl border-2 px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 ${active ? "border-gold bg-primary text-primary-foreground shadow-warm" : "border-border bg-card text-primary hover:border-gold/60"}`}
                      >
                        <span className="block font-bold">{p.weight}</span>
                        <span className={`block text-sm ${active ? "opacity-85" : "text-muted-foreground"}`}>{rupees(p.mrp)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Price */}
              <div className="mt-7 rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-display text-4xl font-bold text-primary">{rupees(selected.mrp)}</span>
                  <span className="text-sm text-muted-foreground">for {selected.weight} · incl. free delivery</span>
                </div>
                {hasOffer && (
                  <p className="mt-2 rounded-lg bg-whatsapp/10 px-3 py-2 text-sm text-foreground">
                    <span className="font-bold text-whatsapp">First order offer:</span> pay <span className="font-bold">{rupees(offer)}</span> ({FIRST_ORDER_DISCOUNT}% OFF) on your first order.
                  </p>
                )}
                <p className={`mt-3 text-sm font-semibold ${available ? "text-whatsapp" : "text-destructive"}`}>{available ? "● In stock" : "● Out of stock"}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg">−</button>
                    <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty(qty + 1)} className="px-4 py-2 text-lg">+</button>
                  </div>
                  {available ? (
                    <a href={whatsappLink(selected, qty)} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-whatsapp-foreground transition hover:brightness-110">
                      <WaIcon /> Buy Now on WhatsApp
                    </a>
                  ) : (
                    <span className="flex-1 rounded-full bg-muted px-6 py-3.5 text-center font-semibold text-muted-foreground">Currently unavailable</span>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">SKU: {skuFor(selected)}</p>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {/* The lab report and purity page are about our ghee, so not shown for oil. */}
                {type.kind !== "oil" && (
                  <li>
                    <a href="/lab-tested" className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-primary hover:bg-card">
                      <ShieldCheckIcon className="h-5 w-5 text-earth" /> Lab Tested 100% Pure
                    </a>
                  </li>
                )}
                <li>
                  <a href="/free-delivery" className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-primary hover:bg-card">
                    <TruckIcon className="h-5 w-5 text-earth" /> Free delivery · {DELIVERY.zones[0]?.days}
                  </a>
                </li>
              </ul>

              <h2 className="mt-10 text-2xl font-bold text-primary">Why you'll love it</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-foreground/85 marker:text-gold">
                {type.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <h2 className="mt-10 text-2xl font-bold text-primary">Product details</h2>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-border bg-card p-5 text-sm">
                <dt className="text-muted-foreground">Brand</dt>
                <dd className="font-semibold text-primary">{SITE.brand}</dd>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-semibold text-primary">{type.label} ({type.hindi})</dd>
                <dt className="text-muted-foreground">Pack sizes</dt>
                <dd className="font-semibold text-primary">{products.map((p) => p.weight).join(" · ")}</dd>
                <dt className="text-muted-foreground">Made in</dt>
                <dd className="font-semibold text-primary">India</dd>
              </dl>
            </div>
          </div>
        </section>

        {/* Reviews for this product (the same reviews sent to Google) */}
        <section id="product-reviews" className="scroll-mt-28 bg-secondary px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Customer Reviews</p>
                <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">What customers say about our {type.label.toLowerCase()}</h2>
              </div>
              <a href="/#reviews" className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                Write a review
              </a>
            </div>
            {reviews.length === 0 ? (
              <p className="mt-8 rounded-2xl bg-card p-8 text-center text-muted-foreground shadow-warm">No reviews for this {noun} yet. Tried it? Be the first to review it.</p>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r) => (
                  <figure key={r.id} className="rounded-2xl bg-card p-7 shadow-warm">
                    <div className="flex items-center justify-between gap-3">
                      <span aria-label={`${r.rating} out of 5 stars`}><Stars value={r.rating} /></span>
                      <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <blockquote className="mt-3 whitespace-pre-line break-words font-display text-xl italic leading-relaxed">“{r.comment}”</blockquote>
                    <figcaption className="mt-4 break-words font-semibold text-primary">
                      {r.name}
                      {r.city && <span className="font-normal text-muted-foreground"> · {r.city}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick answers (same questions as the FAQPage data) */}
        <section id="faq" className="scroll-mt-28 px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">Questions about our {type.label.toLowerCase()}</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-primary">
                    <h3 className="text-lg font-semibold">{f.q}</h3>
                    <span className="text-2xl leading-none text-gold transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-foreground/85">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {other && OtherIcon && (
          <section className="px-5 pb-14">
            <a href={`/products/${other.slug}`} className="mx-auto flex max-w-3xl items-center gap-5 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-warm">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-earth">
                <OtherIcon className="h-9 w-9" />
              </span>
              <span className="flex-1">
                <span className="block text-sm text-muted-foreground">Also try</span>
                <span className="block font-display text-2xl font-bold text-primary">Haryanvi {other.label}</span>
              </span>
              <span className="text-2xl text-gold" aria-hidden>→</span>
            </a>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-28 text-center">
        <h1 className="text-4xl font-bold text-primary">Product not found</h1>
        <p className="mt-3 text-muted-foreground">This product may have been moved or removed.</p>
        <a href="/#products" className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">See all products</a>
      </main>
      <Footer />
    </div>
  );
}
