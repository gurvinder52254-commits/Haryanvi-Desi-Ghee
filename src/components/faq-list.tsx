import type { SiteFaq } from "@/lib/site-faqs";

// Open/close question list, same look as the FAQ on the Free Delivery page.
export function FaqList({ faqs }: { faqs: readonly SiteFaq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f.q} className="group rounded-2xl bg-card p-5 shadow-warm sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-primary sm:text-lg [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="shrink-0 text-2xl text-gold transition group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-3 text-muted-foreground">{f.a}</p>
          {f.link && (
            <a href={f.link.href} className="mt-3 inline-block text-sm font-semibold text-earth underline-offset-4 hover:underline">
              {f.link.label} →
            </a>
          )}
        </details>
      ))}
    </div>
  );
}
