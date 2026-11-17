import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell, WaIcon } from "@/components/site-layout";
import { BoxIcon, ChatIcon, ShieldCheckIcon, TruckIcon } from "@/components/trust-strip";
import { DELIVERY, FIRST_ORDER_DISCOUNT, SITE, rupees, whatsappLink, whatsappTextLink } from "@/config/site";
import { breadcrumbSchema, faqPageSchema, jsonLdScript } from "@/lib/seo";

const TITLE = "Free Pan-India Delivery of Desi Ghee | Haryanvi Desi Ghee";
const DESCRIPTION =
  "Free home delivery of pure desi ghee across India. Check delivery time for your pincode, see how we pack every jar and how ordering on WhatsApp works.";

export const Route = createFileRoute("/free-delivery")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "free delivery desi ghee, desi ghee online delivery india, buy desi ghee online, ghee home delivery, desi ghee delivery time" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE.url}/free-delivery` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/free-delivery` }],
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@graph": [breadcrumbSchema([{ name: "Free Delivery", path: "/free-delivery" }]), faqPageSchema("/free-delivery", FAQ)],
      }),
    ],
  }),
  component: DeliveryPage,
});

const freeLine = DELIVERY.freeAbove > 0 ? `Free delivery on orders above ${rupees(DELIVERY.freeAbove)}` : "Free delivery on every order";

const STEPS = [
  { Icon: ChatIcon, t: "Order on WhatsApp", d: "Pick your ghee and pack size, then send us the order message with your address." },
  { Icon: ShieldCheckIcon, t: "Order Confirmed", d: "We confirm the price, payment and delivery details with you on WhatsApp." },
  { Icon: BoxIcon, t: "Packed & Dispatched", d: `Your jar is sealed, packed safely and dispatched within ${DELIVERY.dispatch}.` },
  { Icon: TruckIcon, t: "Delivered Home", d: "We share the tracking details so you know when it will arrive." },
];

const PACKING = [
  { t: "Sealed Jar", d: "Every jar is sealed after filling, so it reaches you clean and untouched." },
  { t: "Leak-Proof Wrap", d: "Jars are wrapped and cushioned so they do not move or leak in transit." },
  { t: "Strong Outer Box", d: "Packed in a sturdy box made to handle long-distance courier." },
];

const FAQ = [
  { q: "Is delivery really free?", a: `Yes. ${freeLine}. The price you see is the price you pay for the ghee, with no extra shipping charge.` },
  { q: "Which places do you deliver to?", a: "Enter your pincode in the checker above to see the expected delivery time. For any other area, message us on WhatsApp and we will confirm." },
  { q: "How will I know where my order is?", a: "Once your order is dispatched, we send the tracking details on WhatsApp." },
  { q: "What if my jar arrives damaged?", a: "Please record a short video while opening the parcel and send it to us on WhatsApp within 24 hours. We will sort it out with a replacement." },
  { q: "Can I order for someone else?", a: "Yes. Share their name, address and phone number when you order, and we will deliver to them." },
];

// Rough region and delivery zone from an Indian pincode (first digits = postal region).
const REGIONS: [string, string][] = [
  ["11", "Delhi"], ["12", "Haryana"], ["13", "Haryana"], ["14", "Punjab"], ["15", "Punjab"], ["16", "Punjab & Chandigarh"],
  ["17", "Himachal Pradesh"], ["18", "Jammu & Kashmir"], ["19", "Jammu & Kashmir / Ladakh"],
  ["20", "Uttar Pradesh"], ["21", "Uttar Pradesh"], ["22", "Uttar Pradesh"], ["23", "Uttar Pradesh"], ["24", "Uttarakhand / Uttar Pradesh"],
  ["25", "Uttar Pradesh"], ["26", "Uttarakhand / Uttar Pradesh"], ["27", "Uttar Pradesh"], ["28", "Uttar Pradesh"],
  ["30", "Rajasthan"], ["31", "Rajasthan"], ["32", "Rajasthan"], ["33", "Rajasthan"], ["34", "Rajasthan"],
  ["36", "Gujarat"], ["37", "Gujarat"], ["38", "Gujarat"], ["39", "Gujarat"],
  ["40", "Maharashtra / Goa"], ["41", "Maharashtra"], ["42", "Maharashtra"], ["43", "Maharashtra"], ["44", "Maharashtra"],
  ["45", "Madhya Pradesh"], ["46", "Madhya Pradesh"], ["47", "Madhya Pradesh"], ["48", "Madhya Pradesh"], ["49", "Chhattisgarh"],
  ["50", "Telangana"], ["51", "Andhra Pradesh"], ["52", "Andhra Pradesh"], ["53", "Andhra Pradesh"],
  ["56", "Karnataka"], ["57", "Karnataka"], ["58", "Karnataka"], ["59", "Karnataka"],
  ["60", "Tamil Nadu"], ["61", "Tamil Nadu"], ["62", "Tamil Nadu"], ["63", "Tamil Nadu"], ["64", "Tamil Nadu"],
  ["67", "Kerala"], ["68", "Kerala"], ["69", "Kerala"],
  ["70", "West Bengal"], ["71", "West Bengal"], ["72", "West Bengal"], ["73", "West Bengal / Sikkim"], ["74", "West Bengal / Andaman"],
  ["75", "Odisha"], ["76", "Odisha"], ["77", "Odisha"], ["78", "Assam"], ["79", "North East"],
  ["80", "Bihar"], ["81", "Bihar / Jharkhand"], ["82", "Bihar / Jharkhand"], ["83", "Jharkhand"], ["84", "Bihar"], ["85", "Bihar"],
];

// `local` = inside a listed delivery zone; other areas are confirmed on WhatsApp.
function zoneFor(pin: string): { local: boolean; region: string } | null {
  if (!/^[1-8]\d{5}$/.test(pin)) return null;
  const region = REGIONS.find(([p]) => pin.startsWith(p))?.[1];
  if (!region) return null;
  const p3 = pin.slice(0, 3);
  if (["160", "140", "134"].includes(p3)) return { local: true, region: "Mohali / Chandigarh / Panchkula" };
  return { local: false, region };
}

function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<ReturnType<typeof zoneFor> | "invalid" | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(zoneFor(pin.trim()) ?? "invalid");
  };
  const zone = result && result !== "invalid" && result.local ? DELIVERY.zones[0] : undefined;

  return (
    <div className="rounded-2xl bg-card p-6 text-left text-foreground shadow-warm sm:p-8">
      <h2 className="font-display text-3xl font-bold text-primary">Check delivery time</h2>
      <p className="mt-1 text-muted-foreground">Enter your 6-digit pincode.</p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="pincode" className="sr-only">Pincode</label>
        <input
          id="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="e.g. 160062"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setResult(null);
          }}
          className="min-w-0 flex-1 rounded-full border-2 border-border bg-background px-5 py-3 text-lg tracking-widest outline-none transition focus:border-gold"
        />
        <button type="submit" className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:scale-105">
          Check
        </button>
      </form>
      <div aria-live="polite" className="mt-5">
        {result === "invalid" && <p className="font-semibold text-destructive">Please enter a valid 6-digit Indian pincode.</p>}
        {result && result !== "invalid" && (
          <div className="rounded-xl bg-secondary p-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-earth">{result.region}</p>
            {zone ? (
              <>
                <p className="mt-1 font-display text-3xl font-bold text-primary">Delivery in {zone.days}</p>
                <p className="mt-1 text-muted-foreground">
                  {freeLine}. Times are estimates and can change during festivals or bad weather.
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 font-display text-2xl font-bold text-primary">Ask us about delivery to your area</p>
                <p className="mt-1 text-muted-foreground">Send us your pincode on WhatsApp and we will confirm delivery and the expected time.</p>
              </>
            )}
            <a
              href={whatsappTextLink(`Hello ${SITE.brand}! My pincode is ${pin}. I would like to order desi ghee, please confirm delivery to my area.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground transition hover:scale-105"
            >
              <WaIcon /> {zone ? "Order for this pincode" : "Ask on WhatsApp"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DeliveryPage() {
  return (
    <PageShell eyebrow="Free Pan-India Delivery" title="Pure ghee, delivered free to your door" subtitle={`${freeLine}, anywhere in India. Packed safely and dispatched within ${DELIVERY.dispatch}.`}>
      {/* Checker + zones */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          <PincodeChecker />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Delivery Time</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">How long it takes</h2>
            <p className="mt-4 text-muted-foreground">Estimated days after dispatch. We ship from {SITE.address}.</p>
            <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {DELIVERY.zones.map((z) => (
                <li key={z.id} className="flex items-center justify-between gap-4 px-6 py-5">
                  <span className="flex items-center gap-3 font-semibold text-primary">
                    <TruckIcon className="h-5 w-5 shrink-0 text-earth" /> {z.label}
                  </span>
                  <span className="shrink-0 rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-earth">{z.days}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-gradient-gold px-5 py-3 text-center font-semibold text-accent-foreground">₹0 delivery charge · {freeLine}</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">How It Works</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">From our kitchen to yours</h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
          </div>
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, t, d }, i) => (
              <li key={t} className="rounded-2xl bg-card p-8 shadow-warm">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-primary">
                    <Icon />
                  </span>
                  <span className="font-display text-4xl font-bold text-gold/70">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Packing */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Safe Packing</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">Packed to reach you safely</h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PACKING.map((p) => (
              <div key={p.t} className="rounded-2xl border border-border bg-card p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-earth">
                  <BoxIcon />
                </span>
                <h3 className="mt-4 text-2xl font-bold text-primary">{p.t}</h3>
                <p className="mt-2 text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-4xl font-bold text-primary sm:text-5xl">Delivery questions</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-card p-6 shadow-warm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-primary">
                  {f.q}
                  <span className="text-2xl text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-5 py-16 text-center text-primary-foreground sm:py-20">
        <h2 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">Order now, delivery is on us</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-85">
          {FIRST_ORDER_DISCOUNT > 0 ? `First order ${FIRST_ORDER_DISCOUNT}% OFF. ` : ""}Lab tested, pure desi ghee from Haryana.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 font-semibold text-whatsapp-foreground transition hover:scale-105">
            <WaIcon /> Order on WhatsApp
          </a>
          <a href="/lab-tested" className="rounded-full border-2 border-gold px-8 py-4 font-semibold text-gold transition hover:bg-gold hover:text-primary">
            Our Purity Promise
          </a>
        </div>
      </section>
    </PageShell>
  );
}
