import { DELIVERY, FIRST_ORDER_DISCOUNT, PRODUCTS, discountedPrice, rupees, type Product } from "@/config/site";
import type { Faq } from "@/lib/seo";

// Questions for the /faq page (and a short list on the home page), written from
// real Google search queries about desi ghee and mustard oil. Brand names are left
// out on purpose. Prices and delivery times come from site config, so they stay correct.

export type SiteFaq = Faq & { link?: { href: string; label: string } };
export type FaqGroup = { id: string; title: string; faqs: SiteFaq[] };

const byId = (id: string) => PRODUCTS.find((p) => p.id === id) as Product | undefined;
const price = (p?: Product) => (p ? (FIRST_ORDER_DISCOUNT > 0 ? `${rupees(p.mrp)} (${rupees(discountedPrice(p))} on your first order)` : rupees(p.mrp)) : "");
const zone = DELIVERY.zones[0];
const deliveryLine = zone
  ? `Orders are dispatched within ${DELIVERY.dispatch} and usually reach ${zone.label} in ${zone.days}. For other areas, message us on WhatsApp and we will confirm.`
  : `Orders are dispatched within ${DELIVERY.dispatch}. Message us on WhatsApp to confirm delivery to your area.`;
const offer = FIRST_ORDER_DISCOUNT > 0 ? ` First-time customers get ${FIRST_ORDER_DISCOUNT}% OFF.` : "";

const cow1 = byId("1kg");
const buf1 = byId("buffalo-1kg");
const oil1 = byId("oil-1l");
const oil5 = byId("oil-5l");
const bigGhee = PRODUCTS.filter((p) => p.type !== "oil").at(-1);
const bigOil = PRODUCTS.filter((p) => p.type === "oil").at(-1);

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "desi-ghee",
    title: "Desi Ghee",
    faqs: [
      {
        q: "What is desi ghee called in Hindi?",
        a: "Desi ghee is called देसी घी (desi ghee) in Hindi, and shudh desi ghee means pure desi ghee. It is clarified butter made by slow-cooking makkhan (butter) until the water evaporates and only golden fat is left.",
        link: { href: "/blog/how-traditional-desi-ghee-is-made", label: "How traditional desi ghee is made" },
      },
      {
        q: "What is the difference between cow desi ghee and buffalo desi ghee?",
        a: "Cow desi ghee is golden yellow, lighter and has a mild aroma, so many families use it for daily rotis, dal and for children. Buffalo desi ghee is white to pale golden, thicker and richer, and is loved for parathas, halwa and sweets. We sell both.",
        link: { href: "/blog/cow-ghee-vs-buffalo-ghee", label: "Cow ghee vs buffalo ghee" },
      },
      {
        q: "What is A2 desi cow ghee?",
        a: "A2 ghee is made from the milk of cows that give only A2-type protein, such as Indian breeds like Gir and Sahiwal. The fat in ghee is almost the same either way; the label is mainly about the cow breed. Ask us on WhatsApp if you want to know about the milk used in our cow ghee.",
        link: { href: "/blog/a2-desi-cow-ghee-vs-regular-cow-ghee", label: "A2 ghee vs regular cow ghee" },
      },
      {
        q: "How can I check if desi ghee is pure?",
        a: "Pure desi ghee melts quickly on your palm, has a fresh, nutty smell and turns golden-brown when heated, with no foul smell. A simple water test and a heat test at home can show common adulteration. Our ghee is made only from churned makkhan, with no vanaspati, palm oil, colour or essence.",
        link: { href: "/blog/how-to-check-pure-desi-ghee-at-home", label: "How to check pure desi ghee at home" },
      },
      {
        q: "What is danedar ghee?",
        a: "Danedar ghee has a grainy texture, like small granules. The grains form when ghee is slow-cooked on a low flame and cools down slowly. Many people see danedar texture as a sign of traditionally made ghee.",
      },
      {
        q: "What are the benefits of eating desi ghee (desi ghee ke fayde)?",
        a: "Desi ghee adds taste and energy to food, helps the body absorb fat-soluble vitamins (A, D, E and K) and is easy to digest for most people. It is still a fat, so 1–2 teaspoons a day is enough for most adults as part of a balanced diet.",
        link: { href: "/blog/desi-ghee-khane-ke-fayde", label: "Desi ghee khane ke fayde" },
      },
      {
        q: "Is desi ghee good for health?",
        a: "In small amounts, yes, for most healthy people. Ghee is rich in saturated fat, so eat it in moderation and stay active. If you have heart disease, high cholesterol or another health condition, ask your doctor how much ghee is right for you.",
        link: { href: "/blog/health-benefits-of-desi-ghee", label: "Health benefits of desi ghee" },
      },
      {
        q: "Can I use desi ghee for sweets like soan papdi, laddu and barfi?",
        a: "Yes. Desi ghee gives sweets their rich taste and aroma. Buffalo ghee is popular for laddu and halwa because it is thick and rich, while cow ghee gives a lighter, fragrant taste.",
        link: { href: "/blog/desi-ghee-sweets-soan-papdi-laddu-barfi", label: "Desi ghee sweets" },
      },
      {
        q: "How should I store desi ghee?",
        a: "Keep ghee in a clean, dry, airtight jar away from sunlight and moisture. Always use a dry spoon. Stored this way at room temperature, ghee stays fresh for months.",
        link: { href: "/blog/how-to-store-and-use-desi-ghee", label: "How to store and use desi ghee" },
      },
    ],
  },
  {
    id: "price-and-buying",
    title: "Price & Buying",
    faqs: [
      {
        q: "What is the price of desi ghee 1 kg?",
        a: `Our Cow Desi Ghee 1 KG costs ${price(cow1)} and our Buffalo Desi Ghee 1 KG costs ${price(buf1)}, with free delivery. Smaller and bigger packs are also available.`,
        link: { href: "/blog/desi-ghee-price-1kg-in-india", label: "Desi ghee price 1 kg in India" },
      },
      {
        q: "Why is pure desi ghee more expensive than ordinary ghee?",
        a: "Making pure desi ghee takes a lot of milk: roughly 25–30 litres of milk give about 1 kg of ghee by the curd-and-churning method. Cheap ghee is often made from cream or mixed with vanaspati or other fats, which keeps the price low.",
      },
      {
        q: "Do you sell desi ghee in a tin or bulk pack?",
        a: `Our biggest pack is ${bigGhee?.weight ?? "5 KG"}, which suits big families and festivals. For bulk orders, sweet shops or events, message us on WhatsApp for a quote.`,
        link: { href: "/blog/desi-ghee-tin-price-gst-hsn-code", label: "Desi ghee tin price guide" },
      },
      {
        q: "Which is the best desi ghee in India?",
        a: "The best desi ghee is one made only from milk fat, with no vanaspati or palm oil, a fresh aroma, a danedar texture and clear labelling. Check the ingredients, the making method and lab test details before you buy.",
        link: { href: "/blog/best-desi-ghee-in-india", label: "How to choose the best desi ghee" },
      },
      {
        q: "Can I buy desi ghee online from you?",
        a: `Yes. Add your ghee to the cart on our website and send the order on WhatsApp, or tap the WhatsApp button and send us a message.${offer}`,
      },
      {
        q: "Is organic desi ghee different from pure desi ghee?",
        a: "Organic ghee comes from milk of animals raised under certified organic farming rules. Pure desi ghee means ghee made only from milk fat with nothing added. Our ghee is pure desi ghee; we do not sell it as certified organic.",
      },
    ],
  },
  {
    id: "mustard-oil",
    title: "Mustard Oil",
    faqs: [
      {
        q: "What is mustard oil called in Hindi?",
        a: "Mustard oil is called सरसों का तेल (sarson ka tel or sarso oil) in Hindi. It is pressed from mustard seeds and is the main cooking oil in many homes in North and East India.",
        link: { href: "/blog/what-is-mustard-oil-meaning-in-hindi", label: "What is mustard oil" },
      },
      {
        q: "What is the price of mustard oil 1 litre and 5 litre?",
        a: `Our cooking oil costs ${price(oil1)} for 1 litre and ${price(oil5)} for the 5 litre family pack, with free delivery. A 2 litre pack is also available.`,
        link: { href: "/blog/mustard-oil-price-1-litre-5-litre-15-kg-tin", label: "Mustard oil price guide" },
      },
      {
        q: "Do you sell mustard oil in a 15 kg tin?",
        a: `Our biggest oil pack is ${bigOil?.weight ?? "5 Liter"}. For bulk quantities, message us on WhatsApp and we will tell you what we can supply.`,
      },
      {
        q: "What is the difference between kachi ghani, cold pressed and refined mustard oil?",
        a: "Kachi ghani oil is pressed from mustard seeds at a low temperature in a traditional ghani, so it keeps its strong smell and taste. Cold pressed is the modern name for pressing without added heat. Refined oil is chemically processed to remove colour, smell and taste.",
        link: { href: "/blog/kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil", label: "Kachi ghani vs cold pressed vs refined" },
      },
      {
        q: "What are the benefits of mustard oil?",
        a: "Mustard oil has mostly unsaturated fats, including omega-3 and omega-6, a high smoking point for Indian frying and tadka, and a sharp flavour that suits pickles and sabzi. Like any oil, use it in moderation.",
        link: { href: "/blog/mustard-oil-benefits-and-uses", label: "Mustard oil benefits and uses" },
      },
      {
        q: "Can mustard oil be used for hair and baby massage?",
        a: "Mustard oil is traditionally used for hair oiling and for baby massage in many Indian homes. Babies and some adults have sensitive skin, so do a small patch test first and ask your doctor or paediatrician if you are unsure.",
      },
      {
        q: "Can I use mustard oil for a diya?",
        a: "Yes. Mustard oil is commonly used to light diyas on Diwali, Dhanteras and for daily puja. Desi ghee diyas are also popular for puja.",
        link: { href: "/blog/ghee-diya-benefits-how-to-light", label: "Ghee diya: benefits and how to light" },
      },
      {
        q: "How do I choose good, pure mustard oil?",
        a: "Pure mustard oil has a strong, pungent smell and a sharp taste, and the label should say it is 100% mustard oil, not a blend. Buy sealed packs from a seller you trust and check the packing date.",
        link: { href: "/blog/best-mustard-oil-how-to-choose-pure-mustard-oil", label: "How to choose pure mustard oil" },
      },
    ],
  },
  {
    id: "ordering-and-delivery",
    title: "Ordering & Delivery",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Tap Add to Cart on any product, open the cart, check your products, then tap Proceed to order. Enter your name (and address if you like) and send the ready-made order message on WhatsApp. We confirm the price, payment and delivery with you there.",
      },
      {
        q: "Can I order more than one product at a time?",
        a: "Yes. You can add as many products and pack sizes as you like to the cart, change the quantity of each, and send them all in one WhatsApp order.",
      },
      {
        q: "Is there a first order discount?",
        a: FIRST_ORDER_DISCOUNT > 0 ? `Yes. You get ${FIRST_ORDER_DISCOUNT}% OFF on your first order. The discounted price is shown on every product and in your cart.` : "We share our current offers on WhatsApp. Message us to know more.",
      },
      {
        q: "Is delivery free and how long does it take?",
        a: `${DELIVERY.freeAbove > 0 ? `Delivery is free on orders above ${rupees(DELIVERY.freeAbove)}.` : "Yes, delivery is free on every order."} ${deliveryLine}`,
        link: { href: "/free-delivery", label: "Check delivery for your pincode" },
      },
      {
        q: "How can I pay?",
        a: "Our website does not take online payments. We arrange payment with you on WhatsApp or by phone, for example by UPI or bank transfer. We will never ask for your card number, CVV, OTP or UPI PIN.",
      },
      {
        q: "What if my jar or pack arrives damaged?",
        a: "Please record a short video while opening the parcel and send it to us on WhatsApp within 24 hours. We will sort it out with a replacement.",
      },
      {
        q: "Is your ghee lab tested?",
        a: "Yes. See our Lab Tested page for the purity checks and how to get the latest lab report.",
        link: { href: "/lab-tested", label: "Lab Tested 100% Pure" },
      },
    ],
  },
];

export const ALL_SITE_FAQS: SiteFaq[] = FAQ_GROUPS.flatMap((g) => g.faqs);

// Short list for the home page: the most searched questions.
export const HOME_FAQS: SiteFaq[] = [
  "What is the price of desi ghee 1 kg?",
  "What is the difference between cow desi ghee and buffalo desi ghee?",
  "How can I check if desi ghee is pure?",
  "What are the benefits of eating desi ghee (desi ghee ke fayde)?",
  "What is the price of mustard oil 1 litre and 5 litre?",
  "How do I place an order?",
]
  .map((q) => ALL_SITE_FAQS.find((f) => f.q === q))
  .filter((f): f is SiteFaq => !!f);
