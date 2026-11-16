// Small line icons and the "trust strip" shown under the home page hero.
// Each item links to the page that explains it.

type IconProps = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function DropIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function FlaskIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

export function TruckIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

export function BoxIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}

export function ChatIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

const ITEMS = [
  { href: "/about", Icon: DropIcon, t: "Traditional Bilona Method", d: "Curd churned into makkhan, then slow-cooked into danedar ghee.", cta: "Our process" },
  { href: "/lab-tested", Icon: ShieldCheckIcon, t: "Lab Tested 100% Pure", d: "Free from adulteration, vanaspati, colours and preservatives.", cta: "See what we test" },
  { href: "/free-delivery", Icon: TruckIcon, t: "Free Pan-India Delivery", d: "Safely packed and dispatched to your doorstep across India.", cta: "Delivery details" },
  { href: "/#products", Icon: ChatIcon, t: "Easy WhatsApp Order", d: "Pick a pack and order in one message. No sign-up needed.", cta: "Order now" },
];

export function TrustStrip() {
  return (
    <section aria-label="Our promise" className="border-b border-border bg-secondary/60 px-5">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ href, Icon, t, d, cta }, i) => (
          <li key={t} className={`border-border ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <a href={href} className="group flex h-full flex-col items-center px-3 py-7 text-center transition hover:bg-card sm:px-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-card text-earth transition group-hover:bg-gradient-gold group-hover:text-primary">
                <Icon />
              </span>
              <span className="mt-3 font-display text-lg font-bold leading-tight text-primary sm:text-xl">{t}</span>
              <span className="mt-1 hidden max-w-[16rem] text-sm text-muted-foreground sm:block">{d}</span>
              <span className="mt-2 text-xs font-semibold text-earth underline-offset-4 group-hover:underline">{cta} →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
