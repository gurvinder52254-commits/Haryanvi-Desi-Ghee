import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageShell } from "@/components/site-layout";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy – Haryanvi Desi Ghee" },
      { name: "description", content: "How Haryanvi Desi Ghee collects, uses and protects your personal information, order details and payment information." },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "11 November 2026";

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: (
      <>
        <p>
          {SITE.brand} ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect when you visit our website, place an order with us or contact us, how we use it, and the choices you have.
        </p>
        <p>By using our website or placing an order, you agree to the practices described in this policy.</p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: (
      <>
        <p><strong>Information you give us:</strong></p>
        <ul>
          <li><strong>Order details:</strong> when you order through WhatsApp, we receive your name, WhatsApp phone number and the products, quantity and price in your message. To deliver your order, we ask for your delivery address and may ask for an alternate phone number.</li>
          <li><strong>Reviews:</strong> when you post a review on our website, we collect your name, city (optional), star rating and review text. Reviews are shown publicly on our website.</li>
          <li><strong>Messages:</strong> anything you send us by WhatsApp, phone or email, such as questions or feedback.</li>
        </ul>
        <p><strong>Information collected automatically:</strong> like most websites, our hosting provider may record basic technical data such as your IP address, browser type, pages visited and the time of your visit in server logs, to keep the website secure and working properly.</p>
      </>
    ),
  },
  {
    id: "payment-information",
    title: "3. Payment Information",
    body: (
      <>
        <p>
          Our website does not take online payments and does not collect or store your card, UPI PIN, net banking or other payment credentials. Payment is arranged directly with you on WhatsApp or by phone, for example through UPI, bank transfer or cash on delivery.
        </p>
        <p>
          When you pay through UPI or a bank, the transaction is processed by your bank or payment app under their own privacy policies. We only keep the payment confirmation details we need for our records, such as the amount, date and transaction reference.
        </p>
        <p>We will never ask for your card number, CVV, OTP or UPI PIN.</p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Information",
    body: (
      <ul>
        <li>To confirm, prepare, deliver and follow up on your orders.</li>
        <li>To apply offers such as the first-order discount and to prevent misuse of offers.</li>
        <li>To reply to your questions, feedback and support requests.</li>
        <li>To show the reviews you choose to publish.</li>
        <li>To keep our website secure and fix technical problems.</li>
        <li>To keep records required by law, such as invoices and tax records.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "5. How We Share Your Information",
    body: (
      <>
        <p>We do not sell or rent your personal information. We share it only when needed:</p>
        <ul>
          <li><strong>Delivery partners:</strong> your name, phone number and address, so they can deliver your order.</li>
          <li><strong>Service providers:</strong> companies that help us run our business, such as our website hosting provider and WhatsApp (Meta), which carries our messages under its own privacy policy.</li>
          <li><strong>Legal reasons:</strong> when required by law, a court order or a government authority, or to protect our rights and our customers.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies and Third-Party Services",
    body: (
      <>
        <p>
          Our website does not use advertising or tracking cookies. A single essential cookie is used only when our staff log in to manage the website. Our pages load fonts from Google Fonts, which means your browser connects to Google's servers and shares your IP address with Google.
        </p>
        <p>Links to WhatsApp and other websites are covered by those services' own privacy policies.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "7. How Long We Keep Your Information",
    body: (
      <p>
        We keep order and payment records for as long as needed to serve you and to meet legal, tax and accounting requirements. Reviews stay on the website until you ask us to remove them or we remove them. Other messages are kept only as long as they are useful to help you.
      </p>
    ),
  },
  {
    id: "security",
    title: "8. How We Protect Your Information",
    body: (
      <p>
        We take reasonable steps to protect your information, such as limiting access to staff who need it and using secure, password-protected systems. No method of sending or storing data online is 100% secure, but we work to keep your information safe.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "9. Your Rights and Choices",
    body: (
      <>
        <p>You can contact us at any time to:</p>
        <ul>
          <li>ask what personal information we hold about you;</li>
          <li>correct or update your information;</li>
          <li>ask us to delete your information or remove your review, unless we must keep it by law;</li>
          <li>stop receiving offer messages from us.</li>
        </ul>
        <p>We will respond to your request within a reasonable time.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    body: <p>Our website and services are meant for adults. We do not knowingly collect personal information from children under 18. If you believe a child has shared information with us, please contact us and we will delete it.</p>,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    body: <p>We may update this Privacy Policy from time to time. The latest version will always be on this page with the "Last updated" date at the top.</p>,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    body: (
      <>
        <p>If you have any questions about this Privacy Policy or your information, contact us:</p>
        <ul>
          {SITE.phone && (
            <li>
              Phone / WhatsApp: <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`}>{SITE.phone}</a>
            </li>
          )}
          {SITE.email && (
            <li>
              Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          )}
          <li>Address: {SITE.address}</li>
        </ul>
      </>
    ),
  },
];

function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy" subtitle={`Last updated: ${LAST_UPDATED}`}>
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-earth">On this page</p>
              <ul className="mt-4 space-y-2 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="min-w-0 rounded-2xl bg-card p-6 shadow-warm sm:p-10">
            <div className="space-y-12 break-words text-base leading-relaxed text-foreground/85 sm:text-lg [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-4 [&_li]:marker:text-gold [&_p+p]:mt-4 [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul+p]:mt-4">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="mb-4 font-display text-3xl font-bold text-primary">{s.title}</h2>
                  {s.body}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
