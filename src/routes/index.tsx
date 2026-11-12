import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import poster from "@/assets/hero-poster.jpg";
import jar from "@/assets/ghee-jar.jpg";
import village from "@/assets/village.jpg";
import { FIRST_ORDER_DISCOUNT, PRODUCTS, SITE, discountedPrice, rupees, whatsappLink, type Product } from "@/config/site";
import { Footer, Header, WaIcon } from "@/components/site-layout";
import { addReview, getReviews, reviewInputSchema, type Review } from "@/lib/reviews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haryanvi Desi Ghee – Asli Haryane Ka Desi Swad" },
      { name: "description", content: "Traditional Haryanvi desi ghee in 250 GM, 500 GM, 1 KG and 5 KG packs. Order easily on WhatsApp." },
      { property: "og:title", content: "Haryanvi Desi Ghee – Asli Haryane Ka Desi Swad" },
      { property: "og:description", content: "Traditional taste from Haryana. Order your desi ghee directly on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getReviews(),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  useReveal();
  return (
    <div className="min-h-screen">
      <Header overHero />
      <Hero />
      <Products />
      <About />
      <Why />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden">
      {SITE.heroVideoUrl ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={SITE.heroVideoUrl} poster={poster} autoPlay muted loop playsInline preload="metadata" />
      ) : (
        <img src={poster} alt="Desi ghee being poured in a Haryana village kitchen" width={1920} height={1088} className="absolute inset-0 h-full w-full animate-kenburns object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 max-w-4xl px-6 text-center text-primary-foreground">
        <p className="animate-rise text-sm font-semibold uppercase tracking-[0.35em] text-gold">Haryanvi Desi Ghee</p>
        <h1 className="mt-5 animate-rise text-5xl font-bold leading-tight [animation-delay:150ms] sm:text-7xl md:text-8xl">
          Asli Haryane Ka <span className="text-gradient-gold italic">Desi Swad</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-rise text-lg opacity-90 [animation-delay:300ms] sm:text-xl">
          Pure Desi Ghee – Traditional Taste, Natural Goodness.
        </p>
        <a href="#products" className="mt-10 inline-block animate-rise rounded-full bg-gradient-gold px-9 py-4 font-semibold text-accent-foreground shadow-warm transition hover:scale-105 [animation-delay:450ms]">
          Explore Our Products
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 h-12 w-7 -translate-x-1/2 rounded-full border-2 border-primary-foreground/60">
        <div className="mx-auto mt-2 h-2 w-1 animate-bounce rounded-full bg-primary-foreground" />
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="reveal mx-auto mb-14 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
    </div>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const [qty, setQty] = useState(1);
  const price = discountedPrice(p);
  const hasOffer = FIRST_ORDER_DISCOUNT > 0 && price < p.mrp;
  return (
    <div className="reveal group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition duration-500 hover:-translate-y-2" style={{ transitionDelay: `${i * 80}ms` }}>
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={jar} alt={`${p.name} ${p.weight}`} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">{p.weight}</span>
        {p.tag && <span className="absolute right-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-accent-foreground">{p.tag}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold text-primary">{p.name}</h3>
        <p className="text-sm text-muted-foreground">Packing: {p.weight}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-display text-4xl font-bold text-earth">{rupees(price)}</p>
          {hasOffer && (
            <>
              <s className="text-lg text-muted-foreground" aria-label={`Original price ${rupees(p.mrp)}`}>{rupees(p.mrp)}</s>
              <span className="rounded-full bg-whatsapp/15 px-2.5 py-0.5 text-xs font-bold text-whatsapp">{FIRST_ORDER_DISCOUNT}% OFF</span>
            </>
          )}
        </div>
        {hasOffer && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold">First order offer</p>}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Qty</span>
          <div className="flex items-center rounded-full border border-border">
            <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 text-lg">−</button>
            <span className="w-6 text-center font-semibold">{qty}</span>
            <button aria-label="Increase" onClick={() => setQty(qty + 1)} className="px-3 py-1 text-lg">+</button>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm" aria-live="polite">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Total ({qty} × {rupees(price)})</span>
            <span className="font-bold text-primary">{rupees(price * qty)}</span>
          </div>
          {hasOffer && (
            <div className="mt-1 flex justify-between gap-2 text-whatsapp">
              <span>You save</span>
              <span className="font-semibold">{rupees((p.mrp - price) * qty)}</span>
            </div>
          )}
        </div>
        <a href={whatsappLink(p, qty)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-whatsapp-foreground transition hover:brightness-110">
          <WaIcon /> Buy Now
        </a>
      </div>
    </div>
  );
}

function Products() {
  return (
    <section id="products" className="scroll-mt-20 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Our Packs" title="Explore Our Pure Desi Ghee" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-primary px-5 py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="reveal overflow-hidden rounded-2xl shadow-warm">
          <img src={village} alt="Butter being churned in a Haryana village" loading="lazy" width={1280} height={960} className="h-full w-full object-cover" />
        </div>
        <div className="reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">About Our Brand</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Gaon ki rasoi se, aapke ghar tak</h2>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            In the villages of Haryana, desi ghee has always been part of daily life — slowly prepared at home, the way grandmothers taught. Haryanvi Desi Ghee brings that familiar taste to your kitchen.
          </p>
          <p className="mt-4 text-lg leading-relaxed opacity-90">
            We follow a traditional style of preparation, so every spoon carries the rich aroma and grainy texture that reminds you of home-cooked rotis, halwa and festive sweets.
          </p>
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { t: "Traditional Haryanvi Taste", d: "The rich aroma and flavour of village-style ghee." },
  { t: "Multiple Packing Sizes", d: "From 250 GM to 5 KG — choose what suits your family." },
  { t: "Premium Packaging", d: "Carefully sealed jars that look great in any kitchen." },
  { t: "Easy WhatsApp Ordering", d: "No sign-ups or checkout — just send a message." },
];

function Why() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Our Promise" title="Why Choose Haryanvi Desi Ghee?" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <div key={w.t} className="reveal rounded-2xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:shadow-warm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold font-display text-2xl font-bold text-accent-foreground">{i + 1}</div>
              <h3 className="mt-5 text-2xl font-bold text-primary">{w.t}</h3>
              <p className="mt-2 text-muted-foreground">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type FieldErrors = Partial<Record<"name" | "city" | "rating" | "comment", string>>;

function Stars({ value }: { value: number }) {
  return (
    <div className="text-gold" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="opacity-30">{"★".repeat(5 - value)}</span>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ReviewForm({ onAdded }: { onAdded: (reviews: Review[]) => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    const input = { name, city, rating, comment, website };
    const parsed = reviewInputSchema.safeParse(input);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if ((key === "name" || key === "city" || key === "rating" || key === "comment") && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (Object.keys(next).length === 0) setFormError("Could not submit your review. Please try again.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await addReview({ data: input });
      onAdded(res.reviews);
      setName("");
      setCity("");
      setRating(0);
      setComment("");
      setSuccess("Thank you! Your review has been added.");
    } catch {
      setFormError("Could not save your review right now. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-1 w-full rounded-xl border bg-background px-4 py-3 text-base font-normal text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} noValidate className="relative mx-auto mt-14 max-w-2xl rounded-2xl bg-card p-6 shadow-warm sm:p-8">
      <h3 className="text-center font-display text-3xl font-bold text-primary">Share Your Experience</h3>
      <p className="mt-2 text-center text-muted-foreground">Tried our ghee? Tell others what you think.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-primary">
          Your Name <span className="text-destructive">*</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`${field} ${errors.name ? "border-destructive" : "border-border"}`}
            placeholder="e.g. Sunita Devi"
          />
          {errors.name && <span className="mt-1 block text-sm font-normal text-destructive">{errors.name}</span>}
        </label>
        <label className="block text-sm font-semibold text-primary">
          City <span className="font-normal text-muted-foreground">(optional)</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={40}
            aria-invalid={!!errors.city}
            className={`${field} ${errors.city ? "border-destructive" : "border-border"}`}
            placeholder="e.g. Rohtak"
          />
          {errors.city && <span className="mt-1 block text-sm font-normal text-destructive">{errors.city}</span>}
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-primary">
          Rating <span className="text-destructive">*</span>
        </legend>
        <div className="mt-1 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className={`p-1 text-4xl leading-none transition hover:scale-110 ${n <= shown ? "text-gold" : "text-muted-foreground/30"}`}
            >
              ★
            </button>
          ))}
        </div>
        {errors.rating && <span className="mt-1 block text-sm text-destructive">{errors.rating}</span>}
      </fieldset>

      <label className="mt-5 block text-sm font-semibold text-primary">
        Your Review <span className="text-destructive">*</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          aria-invalid={!!errors.comment}
          className={`${field} resize-y ${errors.comment ? "border-destructive" : "border-border"}`}
          placeholder="How was the taste, aroma and quality?"
        />
        <span className="mt-1 flex justify-between gap-2 text-sm font-normal">
          <span className="text-destructive">{errors.comment}</span>
          <span className="shrink-0 text-muted-foreground">{comment.trim().length}/500</span>
        </span>
      </label>

      {/* Honeypot: hidden from people, catches simple spam bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {formError && <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>}
      {success && <p role="status" className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

function Reviews() {
  const initial = Route.useLoaderData();
  const [reviews, setReviews] = useState<Review[]>(initial ?? []);

  return (
    <section id="reviews" className="scroll-mt-20 bg-secondary px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Testimonials" title="What Our Customers Say" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-card p-8 shadow-warm duration-500">
              <div className="flex items-center justify-between gap-3">
                <Stars value={r.rating} />
                <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
              </div>
              <blockquote className="mt-4 whitespace-pre-line break-words font-display text-xl italic leading-relaxed text-foreground">“{r.comment}”</blockquote>
              <figcaption className="mt-5 break-words font-semibold text-primary">
                {r.name}
                {r.city && <span className="font-normal text-muted-foreground"> · {r.city}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length === 0 && (
          <p className="mx-auto max-w-xl rounded-2xl bg-card p-8 text-center text-muted-foreground shadow-warm">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
        <ReviewForm onAdded={setReviews} />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 py-24">
      <div className="reveal mx-auto max-w-4xl rounded-3xl bg-earth p-10 text-center text-primary-foreground shadow-warm sm:p-16">
        <h2 className="text-4xl font-bold sm:text-5xl">Contact Us</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-90">Have a question or want to place a bulk order? Message us on WhatsApp.</p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 font-semibold text-whatsapp-foreground transition hover:scale-105">
          <WaIcon /> Chat on WhatsApp
        </a>
        <div className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-gold">Phone</p>
            <p>
              {SITE.phone ? (
                <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`} className="hover:text-gold">{SITE.phone}</a>
              ) : (
                "Coming soon"
              )}
            </p>
          </div>
          <div>
            <p className="text-gold">Email</p>
            <p className="break-all">
              {SITE.email ? (
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a>
              ) : (
                "Coming soon"
              )}
            </p>
          </div>
          <div><p className="text-gold">Address</p><p>{SITE.address}</p></div>
        </div>
      </div>
    </section>
  );
}
