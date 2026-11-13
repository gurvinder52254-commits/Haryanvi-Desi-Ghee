// Central place to edit business details and product prices.
export const SITE = {
  brand: "Haryanvi Desi Ghee",
  // WhatsApp number in international format, digits only (e.g. "919876543210"). Leave empty until provided.
  whatsappNumber: "918569852254",
  phone: "+91 85698 52254",
  email: "gurvinder52254@gmail.com",
  address: "Mohali, Chandigarh",
  // Optional promotional video URL (mp4). When empty, the hero shows the poster image.
  heroVideoUrl: "",
};

// mrp = original price (shown with a strikethrough). The selling price is calculated
// automatically from mrp and FIRST_ORDER_DISCOUNT, so to change a price, change mrp only.
export type GheeType = "cow" | "buffalo";
export type Product = { id: string; type: GheeType; name: string; weight: string; mrp: number; tag?: string };

export const GHEE_TYPES: { id: GheeType; label: string; hindi: string }[] = [
  { id: "cow", label: "Cow Desi Ghee", hindi: "गाय का घी" },
  { id: "buffalo", label: "Buffalo Desi Ghee", hindi: "भैंस का घी" },
];

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
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(buildOrderMessage(p, qty))}`;
}
