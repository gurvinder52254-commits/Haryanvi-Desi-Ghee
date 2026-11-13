import { useEffect, useState, type ReactNode } from "react";
import { GHEE_TYPES, PRODUCTS, whatsappLink } from "@/config/site";

// Links work from every page: "/#products" scrolls on the home page and
// navigates back to it from other pages.
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Our Products" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact Us" },
];

export function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6z" />
    </svg>
  );
}

// Brand mark: a golden ghee drop inside a green badge with a gold ring.
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="23" className="fill-primary" />
      <circle cx="24" cy="24" r="19.5" fill="none" strokeWidth="1.2" className="stroke-gold" opacity="0.85" />
      <path d="M24 9.5C24 9.5 15.5 20 15.5 27.5a8.5 8.5 0 0 0 17 0C32.5 20 24 9.5 24 9.5Z" className="fill-gold" />
      <ellipse cx="20.6" cy="29" rx="2.1" ry="2.6" className="fill-primary-foreground" opacity="0.85" />
      <path d="M17 39.5h14" strokeWidth="1.4" strokeLinecap="round" className="stroke-gold" opacity="0.85" />
    </svg>
  );
}

// `overHero`: header starts transparent over the home page hero image and turns
// solid on scroll. Other pages have no hero, so the header is always solid.
export function Header({ overHero = false }: { overHero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const solid = !overHero || scrolled || open;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "bg-background/95 shadow-warm backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" aria-label="Haryanvi Desi Ghee – Home" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-11 sm:w-11" />
          <span className="flex flex-col leading-none">
            <span className={`font-display text-xl font-bold sm:text-2xl ${solid ? "text-primary" : "text-primary-foreground"}`}>
              Haryanvi <span className={solid ? "text-earth" : "text-gold"}>Desi Ghee</span>
            </span>
            <span className={`mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.25em] sm:block ${solid ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
              Asli Haryane Ka Swad
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${solid ? "text-foreground" : "text-primary-foreground"}`}>
              {n.label}
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-whatsapp-foreground transition hover:scale-105">
            <WaIcon className="h-4 w-4" /> WhatsApp Order
          </a>
        </nav>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className={`md:hidden ${solid ? "text-foreground" : "text-primary-foreground"}`}>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 md:hidden ${open ? "max-h-[32rem]" : "max-h-0"}`}>
        <nav className="flex flex-col gap-1 px-5 pb-5">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-border py-3 font-medium text-foreground">
              {n.label}
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-whatsapp-foreground">
            <WaIcon /> WhatsApp Order
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-overlay px-5 pt-16 pb-8 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-bold">Haryanvi <span className="text-gold">Desi Ghee</span></p>
          <p className="mt-3 max-w-sm opacity-75">Traditional desi ghee with the authentic taste of Haryana, delivered to your home.</p>
        </div>
        <div>
          <p className="font-semibold text-gold">Quick Links</p>
          <ul className="mt-3 space-y-2 opacity-80">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-gold">{n.label}</a>
              </li>
            ))}
            <li>
              <a href="/privacy-policy" className="hover:text-gold">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gold">Products</p>
          {GHEE_TYPES.map((t) => (
            <div key={t.id} className="mt-3">
              <p className="text-sm font-semibold opacity-90">{t.label}</p>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm opacity-80">
                {PRODUCTS.filter((p) => p.type === t.id).map((p) => (
                  <li key={p.id}>
                    <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" className="hover:text-gold" aria-label={`Order ${t.label} ${p.weight} on WhatsApp`}>{p.weight}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-sm opacity-70 sm:flex-row">
        <p>© {new Date().getFullYear()} Haryanvi Desi Ghee. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <a href="/privacy-policy" className="hover:text-gold">Privacy Policy</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold"><WaIcon className="h-4 w-4" /> WhatsApp us</a>
        </div>
      </div>
    </footer>
  );
}

// Shared shell for inner pages: solid header, a page banner, content, footer.
export function PageShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="bg-primary px-5 pt-36 pb-16 text-center text-primary-foreground sm:pt-40 sm:pb-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg opacity-85">{subtitle}</p>}
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-gold" />
      </section>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
