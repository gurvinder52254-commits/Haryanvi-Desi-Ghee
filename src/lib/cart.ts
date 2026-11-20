import { useSyncExternalStore } from "react";
import { FIRST_ORDER_DISCOUNT, PRODUCTS, SITE, discountedPrice, rupees, whatsappTextLink, type Product } from "@/config/site";

// Shopping cart, kept in the visitor's browser (localStorage) so it survives page
// changes and reloads. Orders are sent on WhatsApp; nothing is stored on the server.

/** No real limit: every product and pack size can go in the cart together. */
export const MAX_CART_ITEMS = PRODUCTS.length;
const MAX_QTY = 99;
const CART_KEY = "hdg-cart-v1";
const CUSTOMER_KEY = "hdg-customer-v1";

export type CartLine = { id: string; qty: number };
export type CartItem = CartLine & { product: Product };
export type Customer = { name: string; address: string };
export type CartNotice = { kind: "added" | "updated" | "full"; name: string } | null;
type CartUi = { open: boolean; notice: CartNotice };

const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
let ui: CartUi = { open: false, notice: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
const cleanQty = (n: unknown) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1));

function sanitize(data: unknown): CartLine[] {
  if (!Array.isArray(data)) return EMPTY;
  const seen = new Set<string>();
  const out: CartLine[] = [];
  for (const row of data) {
    const id = typeof row?.id === "string" ? row.id : "";
    if (!productById(id) || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, qty: cleanQty(row.qty) });
  }
  return out.slice(0, MAX_CART_ITEMS);
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    lines = sanitize(JSON.parse(window.localStorage.getItem(CART_KEY) || "[]"));
  } catch {
    lines = EMPTY;
  }
  // Keep tabs in sync: a cart change in one tab shows in the others.
  window.addEventListener("storage", (e) => {
    if (e.key !== CART_KEY) return;
    try {
      lines = sanitize(JSON.parse(e.newValue || "[]"));
    } catch {
      lines = EMPTY;
    }
    emit();
  });
}

function save(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage blocked: the cart still works until the page closes.
  }
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------- hooks ----------

/** Cart items with their product details. Empty during server rendering. */
export function useCart(): CartItem[] {
  const snap = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return lines;
    },
    () => EMPTY,
  );
  return snap.flatMap((l) => {
    const product = productById(l.id);
    return product ? [{ ...l, product }] : [];
  });
}

export function useCartUi(): CartUi {
  return useSyncExternalStore(
    subscribe,
    () => ui,
    () => ui,
  );
}

// ---------- actions ----------

/** Adds a pack to the cart. The same pack again only raises its quantity. */
export function addToCart(id: string, qty = 1): "added" | "updated" | "full" {
  load();
  const product = productById(id);
  if (!product) return "full";
  const name = `${product.name} ${product.weight}`;
  const existing = lines.find((l) => l.id === id);
  let result: "added" | "updated" | "full";
  if (existing) {
    save(lines.map((l) => (l.id === id ? { ...l, qty: cleanQty(l.qty + qty) } : l)));
    result = "updated";
  } else if (lines.length >= MAX_CART_ITEMS) {
    result = "full";
  } else {
    save([...lines, { id, qty: cleanQty(qty) }]);
    result = "added";
  }
  ui = { open: true, notice: { kind: result, name } };
  emit();
  return result;
}

export function setCartQty(id: string, qty: number) {
  load();
  save(lines.map((l) => (l.id === id ? { ...l, qty: cleanQty(qty) } : l)));
}

export function removeFromCart(id: string) {
  load();
  save(lines.filter((l) => l.id !== id));
  if (ui.notice?.kind === "full") {
    ui = { ...ui, notice: null };
    emit();
  }
}

export function clearCart() {
  load();
  save(EMPTY);
}

export function openCart() {
  ui = { open: true, notice: null };
  emit();
}

export function closeCart() {
  ui = { open: false, notice: null };
  emit();
}

// ---------- totals and order message ----------

export function cartTotals(items: CartItem[]) {
  const mrp = items.reduce((s, i) => s + i.product.mrp * i.qty, 0);
  const pay = items.reduce((s, i) => s + discountedPrice(i.product) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { mrp, pay, save: mrp - pay, count };
}

export function validateCustomer(c: Customer) {
  const errors: Partial<Record<keyof Customer, string>> = {};
  const name = c.name.trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 60) errors.name = "Name is too long.";
  if (c.address.length > 300) errors.address = "Address is too long (300 characters max).";
  return errors;
}

export function buildCartMessage(items: CartItem[], c: Customer) {
  const t = cartTotals(items);
  const offer = FIRST_ORDER_DISCOUNT > 0 && t.save > 0;
  const lines: string[] = [`Hello ${SITE.brand}!`, "", "I want to order these products:", ""];
  items.forEach((i, n) => {
    const each = offer ? discountedPrice(i.product) : i.product.mrp;
    lines.push(`${n + 1}. ${i.product.name} – ${i.product.weight}`);
    lines.push(`   Qty: ${i.qty} × ${rupees(each)} = ${rupees(each * i.qty)}${offer ? ` (MRP ${rupees(i.product.mrp)} each)` : ""}`);
  });
  lines.push("", `Total items: ${t.count}`, `MRP total: ${rupees(t.mrp)}`);
  if (offer) lines.push(`First order discount (${FIRST_ORDER_DISCOUNT}% OFF): -${rupees(t.save)}`);
  lines.push(`Total to pay: ${rupees(offer ? t.pay : t.mrp)}`, "Delivery: Free", "", "My details:");
  lines.push(`Name: ${c.name.trim()}`);
  if (c.address.trim()) lines.push(`Address: ${c.address.trim().replace(/\s*\n\s*/g, ", ")}`);
  lines.push("");
  if (offer) lines.push(`This is my first order, please apply the ${FIRST_ORDER_DISCOUNT}% first-order discount.`);
  lines.push("Please share the order confirmation and delivery details.");
  return lines.join("\n");
}

export function cartWhatsappLink(items: CartItem[], c: Customer) {
  return whatsappTextLink(buildCartMessage(items, c));
}

// The customer's details are remembered only in their own browser, to fill the
// form next time.
export function loadCustomer(): Customer {
  const empty = { name: "", address: "" };
  try {
    const d = JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) || "{}");
    return {
      name: typeof d.name === "string" ? d.name : "",
      address: typeof d.address === "string" ? d.address : "",
    };
  } catch {
    return empty;
  }
}

export function saveCustomer(c: Customer) {
  try {
    window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
  } catch {
    // ignore
  }
}
