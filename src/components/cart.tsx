import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { FIRST_ORDER_DISCOUNT, discountedPrice, inStock, productPath, rupees, type Product } from "@/config/site";
import { productImage } from "@/lib/product-media";
import {
  MAX_CART_ITEMS,
  addToCart,
  cartTotals,
  cartWhatsappLink,
  clearCart,
  closeCart,
  loadCustomer,
  openCart,
  removeFromCart,
  saveCustomer,
  setCartQty,
  useCart,
  useCartUi,
  validateCustomer,
  type Customer,
} from "@/lib/cart";

function BagIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function WhatsappGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6z" />
    </svg>
  );
}

/** Cart icon with item count, for the site header. */
export function CartButton({ light = false }: { light?: boolean }) {
  const items = useCart();
  const n = items.length;
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={n ? `Open cart, ${n} ${n === 1 ? "product" : "products"}` : "Open cart"}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:text-gold ${light ? "text-primary-foreground" : "text-foreground"}`}
    >
      <BagIcon />
      {n > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold leading-none text-primary" aria-hidden>
          {n}
        </span>
      )}
    </button>
  );
}

/** "Add to Cart" button for product cards and the product page. */
export function AddToCartButton({ product, qty = 1, className = "" }: { product: Product; qty?: number; className?: string }) {
  const available = inStock(product);
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => addToCart(product.id, qty)}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent ${className}`}
    >
      <BagIcon className="h-5 w-5" /> {available ? "Add to Cart" : "Out of stock"}
    </button>
  );
}

const FIELD = "mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Slide-in cart panel with the order form. Rendered once, inside the header. */
export function CartDrawer() {
  const items = useCart();
  const { open, notice } = useCartUi();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"cart" | "details" | "sent">("cart");
  const [customer, setCustomer] = useState<Customer>({ name: "", address: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [sentLink, setSentLink] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Each time the panel opens: start on the cart, fill saved details, lock page scroll.
  useEffect(() => {
    if (!open) return;
    setStep((s) => (s === "sent" ? "cart" : s));
    setCustomer((c) => (c.name || c.address ? c : loadCustomer()));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Back to the cart list if the last item is removed on the form step.
  useEffect(() => {
    if (!items.length && step === "details") setStep("cart");
  }, [items.length, step]);

  if (!mounted) return null;

  const t = cartTotals(items);
  const offer = FIRST_ORDER_DISCOUNT > 0 && t.save > 0;
  const set = (k: keyof Customer, v: string) => {
    setCustomer((c) => ({ ...c, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateCustomer(customer);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`cart-${first}`)?.focus();
      return;
    }
    saveCustomer(customer);
    const url = cartWhatsappLink(items, customer);
    setSentLink(url);
    setStep("sent");
    // Opens the WhatsApp app on phones and WhatsApp Web / desktop on computers.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.href = url;
  }

  const title = step === "details" ? "Your details" : step === "sent" ? "Order ready on WhatsApp" : "Your Cart";

  return createPortal(
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={closeCart} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            {step === "details" && (
              <button type="button" onClick={() => setStep("cart")} aria-label="Back to cart" className="-ml-1 rounded-full p-1 text-xl text-muted-foreground hover:text-primary">←</button>
            )}
            <h2 className="font-display text-2xl font-bold text-primary">{title}</h2>
            {step === "cart" && items.length > 0 && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{items.length}</span>}
          </div>
          <button ref={closeRef} type="button" onClick={closeCart} aria-label="Close cart" className="rounded-full p-2 text-2xl leading-none text-muted-foreground hover:bg-secondary hover:text-primary">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === "cart" && (
            <>
              {notice && (
                <p role="status" className={`mb-4 rounded-xl px-4 py-3 text-sm ${notice.kind === "full" ? "bg-destructive/10 text-destructive" : "bg-whatsapp/10 text-whatsapp"}`}>
                  {notice.kind === "full"
                    ? `Your cart already has ${MAX_CART_ITEMS} products, the maximum. Remove one to add ${notice.name}.`
                    : notice.kind === "updated"
                      ? `Updated quantity: ${notice.name}.`
                      : `Added to cart: ${notice.name}.`}
                </p>
              )}
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <BagIcon className="mx-auto h-14 w-14 text-muted-foreground/60" />
                  <p className="mt-4 font-semibold text-foreground">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add products and order them together on WhatsApp.</p>
                  <a href="/#products" onClick={closeCart} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Shop products</a>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {items.map((i) => {
                      const each = offer ? discountedPrice(i.product) : i.product.mrp;
                      return (
                        <li key={i.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                          <a href={productPath(i.product)} onClick={closeCart} className="shrink-0">
                            <img src={productImage(i.product.type, i.product.id)} alt="" width={80} height={80} className="h-20 w-20 rounded-xl bg-secondary object-cover" />
                          </a>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <a href={productPath(i.product)} onClick={closeCart} className="block font-semibold leading-snug text-primary hover:text-earth">{i.product.name}</a>
                                <p className="text-sm text-muted-foreground">{i.product.weight}</p>
                              </div>
                              <button type="button" onClick={() => removeFromCart(i.id)} aria-label={`Remove ${i.product.name} ${i.product.weight}`} className="shrink-0 rounded-full p-1 text-sm text-muted-foreground hover:text-destructive">
                                Remove
                              </button>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center rounded-full border border-border">
                                <button type="button" aria-label="Decrease quantity" onClick={() => setCartQty(i.id, i.qty - 1)} className="px-3 py-1 text-lg">−</button>
                                <span className="w-7 text-center font-semibold" aria-live="polite">{i.qty}</span>
                                <button type="button" aria-label="Increase quantity" onClick={() => setCartQty(i.id, i.qty + 1)} className="px-3 py-1 text-lg">+</button>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-earth">{rupees(each * i.qty)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {i.qty} × {rupees(each)}
                                  {offer && <s className="ml-1">{rupees(i.product.mrp)}</s>}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Want more products?{" "}
                    <a href="/#products" onClick={closeCart} className="font-semibold text-earth underline-offset-4 hover:underline">Add more</a>
                  </p>
                </>
              )}
            </>
          )}

          {step === "details" && (
            <form id="cart-form" onSubmit={submit} noValidate className="space-y-4">
              <p className="text-sm text-muted-foreground">We need these details to confirm your order on WhatsApp.</p>
              <label className="block text-sm font-semibold text-foreground">
                Full name <span className="text-destructive">*</span>
                <input id="cart-name" value={customer.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={60} className={FIELD} aria-invalid={!!errors.name} aria-describedby={errors.name ? "cart-name-err" : undefined} />
                {errors.name && <span id="cart-name-err" className="mt-1 block text-xs font-medium text-destructive">{errors.name}</span>}
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Delivery address <span className="font-normal text-muted-foreground">(optional)</span>
                <textarea id="cart-address" value={customer.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" rows={3} maxLength={300} placeholder="House no., street, city, pincode" className={FIELD} />
                {errors.address && <span className="mt-1 block text-xs font-medium text-destructive">{errors.address}</span>}
              </label>
              <div className="rounded-xl bg-secondary px-4 py-3 text-sm">
                <p className="font-semibold text-foreground">Order summary</p>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-2">
                      <span className="min-w-0 truncate">{i.product.name} {i.product.weight} × {i.qty}</span>
                      <span className="shrink-0">{rupees((offer ? discountedPrice(i.product) : i.product.mrp) * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                Your details go only into the WhatsApp message you send us, and are saved in this browser to fill the form next time. See our <a href="/privacy-policy" onClick={closeCart} className="underline">privacy policy</a>.
              </p>
            </form>
          )}

          {step === "sent" && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp"><WhatsappGlyph className="h-8 w-8" /></div>
              <p className="mt-4 text-lg font-semibold text-foreground">Almost done!</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">WhatsApp has opened with your order and details. Tap <b>Send</b> in WhatsApp to place the order.</p>
              <a href={sentLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground">
                <WhatsappGlyph /> Open WhatsApp again
              </a>
              <div className="mt-4 flex flex-col items-center gap-2 text-sm">
                <button type="button" onClick={() => { clearCart(); setStep("cart"); closeCart(); }} className="font-semibold text-earth underline-offset-4 hover:underline">I've sent it – clear my cart</button>
                <button type="button" onClick={() => setStep("cart")} className="text-muted-foreground hover:text-primary">Back to cart</button>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && step !== "sent" && (
          <div className="border-t border-border bg-card px-5 py-4">
            <div className="space-y-1 text-sm">
              {offer && (
                <>
                  <div className="flex justify-between text-muted-foreground"><span>MRP total</span><s>{rupees(t.mrp)}</s></div>
                  <div className="flex justify-between text-whatsapp"><span>First order discount ({FIRST_ORDER_DISCOUNT}% OFF)</span><span>-{rupees(t.save)}</span></div>
                </>
              )}
              <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="font-semibold text-whatsapp">Free</span></div>
              <div className="flex items-baseline justify-between pt-1"><span className="font-semibold text-foreground">Total</span><span className="font-display text-2xl font-bold text-primary">{rupees(offer ? t.pay : t.mrp)}</span></div>
            </div>
            {step === "cart" ? (
              <button type="button" onClick={() => setStep("details")} className="mt-3 w-full rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:brightness-110">
                Proceed to order
              </button>
            ) : (
              <button type="submit" form="cart-form" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-whatsapp-foreground transition hover:brightness-110">
                <WhatsappGlyph /> Send order on WhatsApp
              </button>
            )}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
