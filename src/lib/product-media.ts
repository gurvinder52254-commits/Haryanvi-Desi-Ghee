import jar from "@/assets/ghee-jar.jpg";
import poster from "@/assets/hero-poster.jpg";
import { SITE, type GheeType } from "@/config/site";

// Product photo for each ghee type. Replace the imports above when you have
// a real photo of each product.
const IMAGES: Record<GheeType, string> = { cow: jar, buffalo: poster };

export function productImage(type: GheeType) {
  return IMAGES[type];
}

/** Full https:// address of a site file, as Google and social apps need. */
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}
