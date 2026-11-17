import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import jar from "@/assets/ghee-jar.jpg";
import { PageShell, WaIcon } from "@/components/site-layout";
import { BoxIcon, DropIcon, FlaskIcon, ShieldCheckIcon } from "@/components/trust-strip";
import { FIRST_ORDER_DISCOUNT, LAB_REPORT, SITE, whatsappLink, whatsappTextLink } from "@/config/site";
import { formatBytes, getLabReport, type LabReportInfo } from "@/lib/lab-report";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo";

const TITLE = "Lab Tested 100% Pure Desi Ghee | Haryanvi Desi Ghee";
const DESCRIPTION =
  "Our desi ghee is lab tested for purity: no vanaspati, no palm oil, no added colour or preservatives. See what we test and how to check pure ghee at home.";

export const Route = createFileRoute("/lab-tested")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "lab tested desi ghee, pure desi ghee, how to check pure ghee, ghee purity test, adulteration free ghee, FSSAI ghee standards" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE.url}/lab-tested` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/lab-tested` }],
    scripts: [jsonLdScript({ "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Lab Tested", path: "/lab-tested" }])] })],
  }),
  loader: () => getLabReport(),
  component: LabTestedPage,
});

const PROMISES = [
  { Icon: ShieldCheckIcon, t: "No Adulteration", d: "No vanaspati, dalda, palm oil or refined oil mixed in." },
  { Icon: DropIcon, t: "Only Milk Fat", d: "Made only from curd-churned makkhan. Nothing else goes in." },
  { Icon: FlaskIcon, t: "No Colour or Essence", d: "The golden colour and aroma come naturally from slow cooking." },
  { Icon: BoxIcon, t: "No Preservatives", d: "Pure ghee keeps well on its own when stored dry and sealed." },
];

// Common purity checks for ghee and the FSSAI limits they are measured against.
const PARAMETERS = [
  { name: "Moisture", why: "Too much water spoils ghee quickly and shows poor cooking.", limit: "Not more than 0.5%" },
  { name: "Free Fatty Acids (as oleic acid)", why: "Shows freshness. High values mean old or rancid ghee.", limit: "Not more than 3.0%" },
  { name: "Butyro-Refractometer (BR) reading at 40°C", why: "Pure milk fat falls in a narrow range. Mixed oils shift it.", limit: "40.0 – 44.0 (varies by state)" },
  { name: "Reichert-Meissl (RM) value", why: "Measures fatty acids found only in milk fat. Low values point to added fats.", limit: "Minimum 24 – 28 (varies by state)" },
  { name: "Baudouin test", why: "Detects added sesame oil and vanaspati.", limit: "Must be negative" },
  { name: "Added colour & starch", why: "Checks for artificial colour, mashed potato or other fillers.", limit: "Must be absent" },
];

const HOME_TESTS = [
  {
    id: "heat",
    t: "Heat Test",
    steps: ["Put a teaspoon of ghee in a pan on low flame.", "Watch how fast it melts and what colour it turns."],
    pure: "Melts right away and turns clear, dark golden-brown.",
    fake: "Takes longer to melt and stays pale yellow.",
  },
  {
    id: "palm",
    t: "Palm Test",
    steps: ["Place a little ghee on your palm.", "Wait a minute."],
    pure: "Melts from your body heat and smells rich and nutty.",
    fake: "Stays solid or leaves a greasy, waxy feel with little smell.",
  },
  {
    id: "jar",
    t: "Double Boiler Test",
    steps: ["Melt some ghee in a glass jar kept in hot water.", "Keep the jar in the fridge for 30 minutes."],
    pure: "Sets evenly as one layer.",
    fake: "Sets in separate layers, which means another oil is mixed in.",
  },
  {
    id: "iodine",
    t: "Iodine Test",
    steps: ["Melt half a teaspoon of ghee.", "Add 2–3 drops of iodine solution (from a chemist)."],
    pure: "Colour does not change.",
    fake: "Turns purple, which means starch such as mashed potato is added.",
  },
];

const REPORT_REQUEST = `Hello ${SITE.brand}! Please share the latest lab test report of your desi ghee.`;

function LabTestedPage() {
  const uploaded = Route.useLoaderData();
  const [testId, setTestId] = useState<string>(HOME_TESTS[0]?.id ?? "");
  const test = HOME_TESTS.find((x) => x.id === testId) ?? HOME_TESTS[0];

  return (
    <PageShell eyebrow="Lab Tested 100% Pure" title="Purity you can check, not just trust" subtitle="Our desi ghee is tested for adulteration so every jar is only what it should be: pure ghee from churned makkhan.">
      {/* Promise */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Our Purity Promise</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">Nothing added. Nothing mixed.</h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/85">
              Adulterated ghee is common in the market. Vanaspati, palm oil and starch are mixed in to cut costs, and colour and essence hide it. We keep our ghee simple and get it tested, so you know exactly what reaches your kitchen.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {PROMISES.map(({ Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold text-primary">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-primary">{t}</h3>
                  <p className="mt-1 text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-warm">
            <img src={jar} alt="Jar of lab tested pure desi ghee" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* What we test */}
      <section className="bg-secondary px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">What We Test</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">Checked against FSSAI ghee standards</h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
            <p className="mt-5 text-muted-foreground">These are the standard tests that tell pure ghee apart from mixed or old ghee, with the limits set by FSSAI.</p>
          </div>
          <div className="mt-12 overflow-x-auto rounded-2xl bg-card shadow-warm">
            <table className="w-full min-w-[36rem] text-left">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th scope="col" className="px-5 py-4 font-semibold">Test</th>
                  <th scope="col" className="px-5 py-4 font-semibold">What it shows</th>
                  <th scope="col" className="px-5 py-4 font-semibold">FSSAI standard</th>
                </tr>
              </thead>
              <tbody>
                {PARAMETERS.map((p) => (
                  <tr key={p.name} className="border-t border-border align-top">
                    <th scope="row" className="px-5 py-4 font-semibold text-primary">{p.name}</th>
                    <td className="px-5 py-4 text-muted-foreground">{p.why}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-earth">{p.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report */}
          <LabReportCard report={uploaded} />
        </div>
      </section>

      {/* Home tests */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth">Check It Yourself</p>
            <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">How to check pure ghee at home</h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-gold" />
            <p className="mt-5 text-muted-foreground">Try these simple tests on any ghee, including ours. Pick a test to see how it works.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Home purity tests">
            {HOME_TESTS.map((x) => {
              const active = x.id === test?.id;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={active}
                  aria-controls="home-test-panel"
                  onClick={() => setTestId(x.id)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 ${active ? "border-gold bg-primary text-primary-foreground shadow-warm" : "border-border bg-card text-primary hover:border-gold/60"}`}
                >
                  {x.t}
                </button>
              );
            })}
          </div>

          {test && (
            <div id="home-test-panel" role="tabpanel" aria-labelledby={`tab-${test.id}`} className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 md:grid-cols-3">
              <div>
                <h3 className="text-2xl font-bold text-primary">{test.t}</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/85">
                  {test.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl bg-secondary p-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">✓ Pure ghee</p>
                <p className="mt-2 text-foreground/85">{test.pure}</p>
              </div>
              <div className="rounded-xl border border-destructive/30 p-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-destructive">✗ Adulterated ghee</p>
                <p className="mt-2 text-foreground/85">{test.fake}</p>
              </div>
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">Home tests give a quick hint. Only a lab test can confirm purity fully.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-5 py-16 text-center text-primary-foreground sm:py-20">
        <h2 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">Taste the difference of pure ghee</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-85">Order on WhatsApp with free delivery across India.{FIRST_ORDER_DISCOUNT > 0 ? ` First order ${FIRST_ORDER_DISCOUNT}% OFF.` : ""}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 font-semibold text-whatsapp-foreground transition hover:scale-105">
            <WaIcon /> Order on WhatsApp
          </a>
          <a href="/free-delivery" className="rounded-full border-2 border-gold px-8 py-4 font-semibold text-gold transition hover:bg-gold hover:text-primary">
            Delivery Details
          </a>
        </div>
      </section>
    </PageShell>
  );
}

// Shows the report uploaded in /admin. Without one, falls back to the link in
// src/config/site.ts (LAB_REPORT), and then to a WhatsApp request button.
function LabReportCard({ report }: { report: LabReportInfo | null }) {
  if (!report) {
    return (
      <div id="lab-report" className="mt-10 flex scroll-mt-28 flex-col items-center gap-5 rounded-2xl border border-gold/40 bg-card p-8 text-center sm:flex-row sm:text-left">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-primary">
          <FlaskIcon className="h-7 w-7" />
        </span>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-primary">See our lab report</h3>
          <p className="mt-1 text-muted-foreground">
            {LAB_REPORT.labName ? `Tested at ${LAB_REPORT.labName}${LAB_REPORT.testedOn ? ` · ${LAB_REPORT.testedOn}` : ""}. ` : ""}
            {LAB_REPORT.url ? "Open the full report to see the results." : "Message us on WhatsApp and we will send you the latest report."}
          </p>
          {SITE.fssaiLicense && <p className="mt-2 text-sm font-semibold text-earth">FSSAI Lic. No. {SITE.fssaiLicense}</p>}
        </div>
        {LAB_REPORT.url ? (
          <a href={LAB_REPORT.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:scale-105">
            View Lab Report
          </a>
        ) : (
          <a href={whatsappTextLink(REPORT_REQUEST)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-whatsapp px-7 py-3 font-semibold text-whatsapp-foreground transition hover:scale-105">
            <WaIcon /> Request Report
          </a>
        )}
      </div>
    );
  }

  const isImage = report.mime.startsWith("image/");
  const downloadUrl = `${report.url}&download=1`;
  return (
    <div id="lab-report" className="mt-10 grid scroll-mt-28 overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-warm md:grid-cols-[1.1fr_1fr]">
      {/* Preview */}
      <div className="bg-secondary/70 p-4 sm:p-6">
        {isImage ? (
          <a href={report.url} target="_blank" rel="noopener noreferrer" className="block" aria-label="Open the lab report in full size">
            <img src={report.url} alt={`Lab test report${report.labName ? ` from ${report.labName}` : ""}`} loading="lazy" className="max-h-[28rem] w-full rounded-xl bg-card object-contain shadow-sm" />
          </a>
        ) : (
          <>
            <iframe src={`${report.url}#view=FitH`} title="Lab test report (PDF)" loading="lazy" className="hidden h-[28rem] w-full rounded-xl border border-border bg-card md:block" />
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl bg-card p-5 md:hidden">
              <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-md bg-destructive/90 text-sm font-bold text-white">PDF</span>
              <span className="min-w-0 break-words font-semibold text-primary">{report.fileName}</span>
            </a>
          </>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-primary">
          <FlaskIcon />
        </span>
        <h3 className="mt-4 text-3xl font-bold text-primary">Our latest lab report</h3>
        <p className="mt-2 text-muted-foreground">See the full test results for our desi ghee. You can open it here or download a copy.</p>
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {report.labName && (
            <>
              <dt className="text-muted-foreground">Tested at</dt>
              <dd className="font-semibold text-primary">{report.labName}</dd>
            </>
          )}
          {report.testedOn && (
            <>
              <dt className="text-muted-foreground">Tested on</dt>
              <dd className="font-semibold text-primary">{report.testedOn}</dd>
            </>
          )}
          <dt className="text-muted-foreground">File</dt>
          <dd className="min-w-0 break-words font-semibold text-primary">
            {isImage ? "Image" : "PDF"} · {formatBytes(report.size)}
          </dd>
          {SITE.fssaiLicense && (
            <>
              <dt className="text-muted-foreground">FSSAI Lic.</dt>
              <dd className="font-semibold text-primary">{SITE.fssaiLicense}</dd>
            </>
          )}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={report.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-105">
            View Report
          </a>
          <a href={downloadUrl} download={report.fileName} className="rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
            Download
          </a>
        </div>
        <a href={whatsappTextLink(REPORT_REQUEST)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-earth hover:text-primary">
          <WaIcon className="h-4 w-4" /> Questions about the report? Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
