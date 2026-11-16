// Google structured data (schema.org JSON-LD) for a product page.
// Everything is built from src/config/site.ts and the saved customer reviews,
// so new packs, price changes and new reviews show up automatically.
import {
  DELIVERY,
  PRODUCTS,
  PRODUCT_CATEGORY,
  SITE,
  inStock,
  productPath,
  skuFor,
  type GheeTypeInfo,
  type Product,
} from "@/config/site";
import type { RatingSummary, Review } from "@/lib/reviews";
import { absoluteUrl, productImage } from "@/lib/product-media";

export function productsOf(type: GheeTypeInfo) {
  return PRODUCTS.filter((p) => p.type === type.id);
}

export function productPageUrl(type: GheeTypeInfo) {
  return `${SITE.url}/products/${type.slug}`;
}

// Free delivery details, from DELIVERY in site config.
function shippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: DELIVERY.handlingDays.min, maxValue: DELIVERY.handlingDays.max, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: DELIVERY.transitDays.min, maxValue: DELIVERY.transitDays.max, unitCode: "DAY" },
    },
  };
}

function variant(type: GheeTypeInfo, p: Product, image: string) {
  return {
    "@type": "Product",
    "@id": `${SITE.url}${productPath(p)}#product`,
    name: `${p.name} ${p.weight}`,
    sku: skuFor(p),
    size: p.weight,
    image: [image],
    description: `${p.name}, ${p.weight} pack. ${type.description}`,
    brand: { "@type": "Brand", name: SITE.brand },
    category: PRODUCT_CATEGORY,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}${productPath(p)}`,
      priceCurrency: "INR",
      // Regular price. The first-order discount is a one-time offer, so it is
      // not sent as the product price.
      price: p.mrp.toFixed(2),
      availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.brand },
      shippingDetails: shippingDetails(),
    },
  };
}

export function productSchema(type: GheeTypeInfo, reviews: Review[], summary: RatingSummary) {
  const products = productsOf(type);
  const image = absoluteUrl(productImage(type.id));
  const url = productPageUrl(type);

  const group: Record<string, unknown> = {
    "@type": "ProductGroup",
    "@id": `${url}#productgroup`,
    name: `Haryanvi ${type.label}`,
    description: type.description,
    url,
    image: [image],
    brand: { "@type": "Brand", name: SITE.brand },
    category: PRODUCT_CATEGORY,
    productGroupID: `HDG-${type.id.toUpperCase()}`,
    variesBy: ["https://schema.org/size"],
    hasVariant: products.map((p) => variant(type, p, image)),
  };

  // Only real reviews customers wrote about this ghee type, all shown on the page.
  if (summary.count > 0) {
    group["aggregateRating"] = { "@type": "AggregateRating", ratingValue: summary.average, reviewCount: summary.count, bestRating: 5, worstRating: 1 };
    group["review"] = reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.createdAt.slice(0, 10),
      reviewBody: r.comment,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    }));
  }

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "Our Products", item: `${SITE.url}/#products` },
      { "@type": "ListItem", position: 3, name: type.label, item: url },
    ],
  };

  return { "@context": "https://schema.org", "@graph": [group, breadcrumbs] };
}
