// Central place to edit business details and product prices.
export const SITE = {
  brand: "Haryanvi Desi Ghee",
  // WhatsApp number in international format, digits only (e.g. "919876543210"). Leave empty until provided.
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "Haryana, India",
  // Optional promotional video URL (mp4). When empty, the hero shows the poster image.
  heroVideoUrl: "",
};

export type Product = { id: string; name: string; weight: string; price: number; tag?: string };

export const PRODUCTS: Product[] = [
  { id: "5kg", name: "Haryanvi Desi Ghee", weight: "5 KG", price: 10000, tag: "Family Pack" },
  { id: "1kg", name: "Haryanvi Desi Ghee", weight: "1 KG", price: 2000, tag: "Bestseller" },
  { id: "500g", name: "Haryanvi Desi Ghee", weight: "500 GM", price: 1000 },
  { id: "250g", name: "Haryanvi Desi Ghee", weight: "250 GM", price: 500 },
];

export function buildOrderMessage(p?: Product, qty = 1) {
  if (!p) return `Hello ${SITE.brand}! I would like to place an order.`;
  return `Hello ${SITE.brand}!\n\nI want to order:\n\nProduct: ${p.name}\nPacking: ${p.weight}\nPrice: ₹${p.price}\nQuantity: ${qty}\n\nPlease share the order confirmation and delivery details.`;
}

export function whatsappLink(p?: Product, qty = 1) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(buildOrderMessage(p, qty))}`;
}
