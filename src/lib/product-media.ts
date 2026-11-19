import jar from "@/assets/ghee-jar.jpg";
import poster from "@/assets/hero-poster.jpg";
import oil1l from "@/assets/mustard-oil-1l.jpg";
import oil2l from "@/assets/mustard-oil-2l.jpg";
import oil5l from "@/assets/mustard-oil-5l.jpg";
import { SITE, type GheeType } from "@/config/site";

// Product photo for each product type. Replace the imports above when you have
// a real photo of each product.
const IMAGES: Record<GheeType, string> = { cow: jar, buffalo: poster, oil: oil1l };

// Optional photo for one pack size (product id from PRODUCTS in config/site.ts).
// Sizes not listed here use the product type's photo above.
const SIZE_IMAGES: Record<string, string> = {
  "oil-1l": oil1l,
  "oil-2l": oil2l,
  "oil-5l": oil5l,
};

export function productImage(type: GheeType, productId?: string) {
  return (productId ? SIZE_IMAGES[productId] : undefined) ?? IMAGES[type];
}

/** Full https:// address of a site file, as Google and social apps need. */
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}
