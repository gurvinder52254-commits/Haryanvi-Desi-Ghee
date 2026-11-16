// Central place to edit business details and product prices.
export const SITE = {
  brand: "Haryanvi Desi Ghee",
  // Public website address, no slash at the end. Used for Google's site name
  // (structured data). Change it when you move to your own domain.
  url: "https://haryanvi-desi-ghee.onrender.com",
  // WhatsApp number in international format, digits only (e.g. "919876543210"). Leave empty until provided.
  whatsappNumber: "918569852254",
  phone: "+91 85698 52254",
  email: "gurvinder52254@gmail.com",
  address: "Mohali, Chandigarh",
  // Optional promotional video URL (mp4). When empty, the hero shows the poster image.
  heroVideoUrl: "",
  // FSSAI licence number. Shown on the Lab Tested page when filled in.
  fssaiLicense: "",
};

// Lab report shown on the /lab-tested page. When `url` is empty, customers are
// asked to request the latest report on WhatsApp instead.
export const LAB_REPORT = {
  labName: "", // e.g. "ABC Food Testing Lab, Chandigarh"
  testedOn: "", // e.g. "October 2026"
  url: "", // link to the report PDF or image
};

// Delivery details shown on the /free-delivery page. Days are estimates after dispatch.
export const DELIVERY = {
  // Orders above this amount get free delivery. 0 = free delivery on every order.
  freeAbove: 0,
  dispatch: "24–48 hours",
  zones: [{ id: "local", label: "Mohali, Chandigarh & Panchkula", days: "7–10 days" }],
  // Same times as numbers, for Google product data. Keep in line with the text above.
  handlingDays: { min: 1, max: 2 },
  transitDays: { min: 7, max: 10 },
} as const;

// mrp = original price (shown with a strikethrough). The selling price is calculated
// automatically from mrp and FIRST_ORDER_DISCOUNT, so to change a price, change mrp only.
export type GheeType = "cow" | "buffalo";
// inStock: set to false when a pack is sold out (shown on the website and sent to Google).
export type Product = { id: string; type: GheeType; name: string; weight: string; mrp: number; tag?: string; inStock?: boolean };

export type GheeTypeInfo = {
  id: GheeType;
  label: string;
  hindi: string;
  // Product page address: /products/<slug>
  slug: string;
  // Shown on the product page and sent to Google. Keep each one unique.
  description: string;
  highlights: string[];
};

export const GHEE_TYPES: GheeTypeInfo[] = [
  {
    id: "cow",
    label: "Cow Desi Ghee",
    hindi: "गाय का घी",
    slug: "cow-desi-ghee",
    description:
      "Haryanvi Cow Desi Ghee is made the traditional village way: cow milk is set into curd, churned into makkhan and slow-cooked on a low flame. The result is golden, danedar ghee with a rich aroma, ideal for rotis, dal, khichdi and festive sweets.",
    highlights: ["Made from cow milk curd, churned into makkhan", "Slow-cooked for a golden, danedar texture", "No vanaspati, colour, essence or preservatives", "Available in 250 GM, 500 GM, 1 KG and 5 KG packs"],
  },
  {
    id: "buffalo",
    label: "Buffalo Desi Ghee",
    hindi: "भैंस का घी",
    slug: "buffalo-desi-ghee",
    description:
      "Haryanvi Buffalo Desi Ghee is slow-cooked from churned buffalo milk makkhan, giving a creamy white-to-pale-golden ghee with a thick, grainy texture and full, rich taste. Perfect for parathas, halwa, laddoo and everyday Haryanvi cooking.",
    highlights: ["Made from buffalo milk curd, churned into makkhan", "Thick, grainy texture with a rich, creamy taste", "No vanaspati, colour, essence or preservatives", "Available in 250 GM, 500 GM, 1 KG and 5 KG packs"],
  },
];

export const PRODUCT_CATEGORY = "Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils";

export function gheeType(id: GheeType) {
  return GHEE_TYPES.find((t) => t.id === id) as GheeTypeInfo;
}

export function inStock(p: Product) {
  return p.inStock !== false;
}

// "250 GM" -> "250g", "1 KG" -> "1kg". Used in product links (?size=1kg).
export function sizeKey(p: Product) {
  return p.weight.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/gm$/, "g");
}

// Stable product code, e.g. HDG-COW-1KG.
export function skuFor(p: Product) {
  return `HDG-${p.type.toUpperCase()}-${sizeKey(p).toUpperCase()}`;
}

export function productPath(p: Product) {
  return `/products/${gheeType(p.type).slug}?size=${sizeKey(p)}`;
}

// First-time customer discount in percent. Set to 0 to turn the offer off.
export const FIRST_ORDER_DISCOUNT = 20;

export const PRODUCTS: Product[] = [
  // Cow desi ghee: 1 KG MRP ₹2,500, first order ₹2,000
  { id: "250g", type: "cow", name: "Haryanvi Cow Desi Ghee", weight: "250 GM", mrp: 625 },
  { id: "500g", type: "cow", name: "Haryanvi Cow Desi Ghee", weight: "500 GM", mrp: 1250 },
  { id: "1kg", type: "cow", name: "Haryanvi Cow Desi Ghee", weight: "1 KG", mrp: 2500, tag: "Bestseller" },
  { id: "5kg", type: "cow", name: "Haryanvi Cow Desi Ghee", weight: "5 KG", mrp: 12500, tag: "Family Pack" },
  // Buffalo desi ghee: 1 KG MRP ₹1,875, first order ₹1,500
  { id: "buffalo-250g", type: "buffalo", name: "Haryanvi Buffalo Desi Ghee", weight: "250 GM", mrp: 469 },
  { id: "buffalo-500g", type: "buffalo", name: "Haryanvi Buffalo Desi Ghee", weight: "500 GM", mrp: 938 },
  { id: "buffalo-1kg", type: "buffalo", name: "Haryanvi Buffalo Desi Ghee", weight: "1 KG", mrp: 1875, tag: "Bestseller" },
  { id: "buffalo-5kg", type: "buffalo", name: "Haryanvi Buffalo Desi Ghee", weight: "5 KG", mrp: 9375, tag: "Family Pack" },
];

// Price after the first-order discount, rounded to whole rupees.
export function discountedPrice(p: Product) {
  return Math.round((p.mrp * (100 - FIRST_ORDER_DISCOUNT)) / 100);
}

export function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function buildOrderMessage(p?: Product, qty = 1) {
  if (!p) return `Hello ${SITE.brand}! I would like to place an order.`;
  const price = discountedPrice(p);
  const lines = [
    `Hello ${SITE.brand}!`,
    "",
    "I want to order:",
    "",
    `Product: ${p.name}`,
    `Packing: ${p.weight}`,
    `MRP: ${rupees(p.mrp)}`,
  ];
  if (FIRST_ORDER_DISCOUNT > 0) {
    lines.push(
      `First Order Price (${FIRST_ORDER_DISCOUNT}% OFF): ${rupees(price)}`,
      `Quantity: ${qty}`,
      `Total: ${rupees(price * qty)} (You save ${rupees((p.mrp - price) * qty)})`,
      "",
      `This is my first order, please apply the ${FIRST_ORDER_DISCOUNT}% first-order discount.`,
    );
  } else {
    lines.push(`Quantity: ${qty}`, `Total: ${rupees(p.mrp * qty)}`);
  }
  lines.push("", "Please share the order confirmation and delivery details.");
  return lines.join("\n");
}

export function whatsappLink(p?: Product, qty = 1) {
  return whatsappTextLink(buildOrderMessage(p, qty));
}

// WhatsApp link with any custom message (e.g. lab report or delivery questions).
export function whatsappTextLink(text: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
