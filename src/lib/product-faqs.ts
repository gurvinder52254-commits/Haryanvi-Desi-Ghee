import { DELIVERY, FIRST_ORDER_DISCOUNT, GHEE_TYPES, discountedPrice, rupees, type GheeTypeInfo, type Product } from "@/config/site";
import { productsOf } from "@/lib/product-schema";
import type { Faq } from "@/lib/seo";

// Short, direct answers shown on each product page and sent to Google/AI search as
// FAQPage data. Prices and delivery times come from site config, so they stay correct.
export function productFaqs(type: GheeTypeInfo): Faq[] {
  const products = productsOf(type);
  const isOil = type.kind === "oil";
  const first = products.find((p) => /^1\s?(kg|liter)$/i.test(p.weight)) ?? products[0];
  const zone = DELIVERY.zones[0];
  const name = `Haryanvi ${type.label}`;
  const offerText = (p: Product) => (FIRST_ORDER_DISCOUNT > 0 ? ` On your first order you pay ${rupees(discountedPrice(p))} (${FIRST_ORDER_DISCOUNT}% OFF).` : "");
  const faqs: Faq[] = [];

  if (first) {
    const rest = products.filter((p) => p.id !== first.id).map((p) => `${p.weight} ${rupees(p.mrp)}`).join(", ");
    faqs.push({
      q: `What is the price of ${name} ${first.weight}?`,
      a: `${name} ${first.weight} costs ${rupees(first.mrp)} with free delivery.${offerText(first)}${rest ? ` Other packs: ${rest}.` : ""}`,
    });
  }
  faqs.push(
    {
      q: `How do I order ${name}?`,
      a: `Choose your pack size and tap "Buy Now on WhatsApp". Send the ready-made order message with your address, and we confirm the price, payment and delivery on WhatsApp.`,
    },
    {
      q: "Where do you deliver and how long does it take?",
      a: zone
        ? `We deliver free to ${zone.label}. Orders are dispatched within ${DELIVERY.dispatch} and usually arrive in ${zone.days}. For other areas, message us on WhatsApp.`
        : `Orders are dispatched within ${DELIVERY.dispatch}. Message us on WhatsApp to confirm delivery to your area.`,
    },
  );

  if (isOil) {
    faqs.push({
      q: `Which pack sizes of ${type.label.toLowerCase()} are available?`,
      a: `${products.map((p) => p.weight).join(", ")}. The 1 and 2 liter packs suit daily home cooking, while the 5 liter family pack is good value for big families.`,
    });
    return faqs;
  }

  faqs.push({
    q: `Is ${name} pure?`,
    a: `Yes. It is made only from curd-churned ${type.id} milk makkhan, slow-cooked on a low flame. No vanaspati, palm oil, colour, essence or preservatives are added. See our Lab Tested page for the purity checks.`,
  });
  // Compare with the other ghee (not the cooking oil).
  const other = GHEE_TYPES.find((t) => t.id !== type.id && t.kind !== "oil");
  if (other) {
    faqs.push({
      q: `What is the difference between ${type.label.toLowerCase()} and ${other.label.toLowerCase()}?`,
      a: `${type.description.split(". ")[0] ?? ""}. ${(other.description.split(". ")[0] ?? "").replace(/^Haryanvi /, "Our ")}. Many families keep both: one for daily rotis and dal, the other for parathas and sweets.`,
    });
  }
  return faqs;
}
