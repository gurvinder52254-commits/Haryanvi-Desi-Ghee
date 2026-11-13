import { FIRST_ORDER_DISCOUNT, GHEE_TYPES, PRODUCTS, discountedPrice, rupees } from "@/config/site";
import type { BlogPost } from "./blog";

// Starter articles shown until the admin saves their first change.
// Titles, headings and meta descriptions use search terms people in India are
// looking for (Google Trends, Nov 2026): desi ghee price 1kg, ghee rate, best desi
// ghee in India, shudh desi ghee, desi cow ghee, a2 desi cow ghee, desi ghee in
// hindi, malai se ghee kaise nikale, ghee benefits, ghee rice, desi ghee online.

const AUTHOR = "Haryanvi Desi Ghee";

const priceList = GHEE_TYPES.map(
  (t) =>
    `${t.label} (${t.hindi}):\n\n` +
    PRODUCTS.filter((p) => p.type === t.id)
      .map((p) => `- ${p.weight}: MRP ${rupees(p.mrp)}, first order price ${rupees(discountedPrice(p))} (${FIRST_ORDER_DISCOUNT}% OFF)`)
      .join("\n"),
).join("\n\n");

const oneKg = PRODUCTS.find((p) => p.id === "1kg") ?? (PRODUCTS[0] as (typeof PRODUCTS)[number]);

function post(p: Omit<BlogPost, "author" | "published" | "updatedAt">): BlogPost {
  return { ...p, author: AUTHOR, published: true, updatedAt: p.createdAt };
}

export const SEED_POSTS: BlogPost[] = [
  post({
    id: "seed-price-1kg",
    slug: "desi-ghee-price-1kg-in-india",
    title: "Desi Ghee Price 1kg in India (2026): Complete Ghee Rate Guide",
    metaTitle: "Desi Ghee Price 1kg in India 2026 | Ghee Rate Guide",
    metaDescription: `Desi ghee price 1kg in India explained: what decides the ghee rate, why pure ghee costs more, and our 1 KG price of ${rupees(discountedPrice(oneKg))} on first order.`,
    keywords: "desi ghee price, desi ghee price 1kg, ghee price 1kg, 1kg ghee price, ghee rate, desi ghee online",
    excerpt:
      "Why does desi ghee price 1kg change so much from brand to brand? A simple guide to ghee rate in India, what you pay for, and our price list from 250 GM to 5 KG.",
    content: `"Desi ghee price 1kg" is one of the most searched questions about ghee in India, and for good reason. Ghee rates can look very different from one brand to the next. This guide explains what really decides the price of desi ghee, so you can compare in the right way before you buy.

## Why desi ghee price differs from brand to brand
- Type of milk: desi cow ghee, buffalo ghee and A2 desi cow ghee all have different costs, because the milk itself is priced differently.
- Milk needed per kg: making 1 kg of ghee usually needs a large quantity of milk (often 20 to 30 litres, depending on the fat in the milk). That is the main reason pure ghee is never cheap.
- Method: the traditional way (curd, churning into makkhan, then slow heating) takes more milk, time and hand work than making ghee directly from cream.
- Packing and delivery: glass or tin jars, safe packing and transport all add to the final ghee rate.

## Haryanvi Desi Ghee price list
We sell both cow desi ghee and buffalo desi ghee. Within each type, every pack size is the same rate, so you pay the same per gram whether you buy a small jar or a family pack:

${priceList}

The ${FIRST_ORDER_DISCOUNT}% first-order discount is for new customers. See the latest prices any time on our [products section](/#products).

## Is very cheap ghee a good deal?
If a ghee price looks far below the market rate for 1kg, it is worth asking why. Pure desi ghee needs a lot of milk, so a very low price can mean a different method, mixed fats or a lower grade. Always read the label, check for an FSSAI licence number and buy from a seller you can talk to. Our guide on [how to choose the best desi ghee in India](/blog/best-desi-ghee-in-india) lists simple checks.

## Which pack size gives the best value?
- 250 GM: good for trying a new ghee for the first time.
- 500 GM and 1 KG: right for most families for regular cooking.
- 5 KG: best for large families, festivals and shops that use ghee every day.

## How to buy desi ghee online from us
Buying desi ghee online is simple. Choose your pack on the homepage, tap Order on WhatsApp, and our team confirms the price, delivery and payment with you directly.

Prices on this page were correct when it was published. The homepage always shows the latest price.`,
    coverImage: "",
    createdAt: "2026-11-12T10:00:00.000Z",
  }),
  post({
    id: "seed-best-desi-ghee",
    slug: "best-desi-ghee-in-india",
    title: "Best Desi Ghee in India: 7 Checks to Choose Pure Shudh Desi Ghee",
    metaTitle: "Best Desi Ghee in India: How to Pick Shudh Desi Ghee",
    metaDescription:
      "Looking for the best desi ghee in India? Use these 7 simple checks for aroma, texture, colour and label to choose pure shudh desi ghee and desi cow ghee.",
    keywords: "best desi ghee in india, best ghee, shudh desi ghee, pure ghee, cow desi ghee, desi cow ghee",
    excerpt:
      "Every brand says it sells the best desi ghee in India. These 7 practical checks help you judge pure shudh desi ghee for yourself, before and after you buy.",
    content: `Search for "best desi ghee in India" and you will find hundreds of brands, each calling itself pure. The truth is, the best ghee is the one that is honestly made, clearly labelled and suits your family's taste. Here are 7 checks that help you choose shudh desi ghee with confidence.

## 1. Aroma
Pure desi ghee has a rich, nutty, slightly sweet smell, especially when warmed. A flat smell or a strong artificial "ghee flavour" is a reason to ask questions.

## 2. Texture (danedar ghee)
Traditionally made ghee often sets with a grainy, danedar texture at room temperature. Smooth ghee is not always bad, because texture also depends on temperature and cooling, but a nice grain is a good sign of slow preparation.

## 3. Colour: cow ghee vs buffalo ghee
- Desi cow ghee is usually golden yellow, thanks to natural beta-carotene from the cow's feed.
- Buffalo ghee is usually whiter.
Both can be pure. The colour simply tells you which milk was used, so check that it matches what the label says.

## 4. Label and FSSAI licence
Pure ghee should list only ghee or milk fat as the ingredient. Look for an FSSAI licence number, the manufacturing date and the best-before date on the pack.

## 5. Method of preparation
Ask how the ghee is made. The traditional village method (setting curd, churning makkhan, then slow heating) takes longer, and many families prefer its taste and aroma. Read [how traditional desi ghee is made in Haryana](/blog/how-traditional-desi-ghee-is-made).

## 6. Price that makes sense
Pure desi ghee needs a lot of milk, so it cannot be very cheap. Compare the ghee rate per kg, not just the jar price. Our [desi ghee price 1kg guide](/blog/desi-ghee-price-1kg-in-india) explains what a fair price includes.

## 7. A seller you can talk to
The best ghee brands are happy to answer questions about milk, method and storage. If you cannot reach anyone, that tells you something too.

## Can I test pure ghee at home?
Simple home checks like melting a spoon of ghee and watching for a clean, clear liquid can give you a hint, but they are not proof. Only a food testing laboratory can confirm whether ghee is adulterated. Use home checks as a guide, and buy from a seller you trust.

## So, which is the best desi ghee in India?
There is no single answer for everyone. Choose a ghee that passes these checks, tastes right to your family and comes from people who stand behind it. If you would like to try village-style Haryanvi ghee, see our [pack sizes and prices](/#products). New customers get ${FIRST_ORDER_DISCOUNT}% off the first order.`,
    coverImage: "",
    createdAt: "2026-11-12T09:00:00.000Z",
  }),
  post({
    id: "seed-malai-se-ghee",
    slug: "malai-se-ghee-kaise-nikale",
    title: "Malai Se Ghee Kaise Nikale: Ghar Par Desi Ghee Banane Ka Aasan Tarika",
    metaTitle: "Malai Se Ghee Kaise Nikale | Desi Ghee in Hindi",
    metaDescription:
      "Malai se ghee kaise nikale? Ghar par shudh desi ghee banane ka aasan tarika Hindi mein: malai jama karna, makkhan nikalna aur dhimi aanch par ghee pakana.",
    keywords: "malai se ghee kaise nikale, desi ghee in hindi, ghar par ghee kaise banaye, shudh desi ghee",
    excerpt:
      "Doodh ki malai se ghar par shudh desi ghee banana bilkul aasan hai. Step-by-step tarika Hindi mein, makkhan nikalne se lekar danedar ghee tak.",
    content: `मलाई से घी कैसे निकाले, यह सवाल लगभग हर घर में पूछा जाता है। हरियाणा के गाँवों में आज भी घी इसी तरह धीरे-धीरे बनाया जाता है। नीचे दिया गया तरीका आसान है और इससे घर पर शुद्ध देसी घी बनता है।

## ज़रूरी सामान
- 7 से 10 दिन की इकट्ठी की हुई मलाई
- 1 से 2 चम्मच दही
- ठंडा पानी
- मथानी या मिक्सर, और एक भारी तले की कड़ाही

## स्टेप 1: मलाई इकट्ठा करें
रोज़ दूध उबालने के बाद ठंडा होने पर ऊपर जमी मलाई उतारकर एक साफ़ डिब्बे में फ्रिज में रखें। 7 से 10 दिन में अच्छी मात्रा हो जाती है।

## स्टेप 2: मलाई को जमाएँ
मलाई को फ्रिज से निकालकर कमरे के तापमान पर लाएँ, उसमें 1 से 2 चम्मच दही मिलाएँ और 8 से 10 घंटे के लिए ढककर रख दें। इससे मलाई हल्की खट्टी होकर जम जाती है और घी की खुशबू अच्छी आती है।

## स्टेप 3: मथकर मक्खन निकालें
जमी हुई मलाई में ठंडा पानी डालें और मथानी या मिक्सर से मथें। कुछ मिनट में सफ़ेद मक्खन ऊपर तैरने लगेगा और नीचे छाछ रह जाएगी। मक्खन को हाथ से निकालकर ठंडे पानी से एक-दो बार धो लें।

## स्टेप 4: धीमी आँच पर घी पकाएँ
मक्खन को कड़ाही में डालकर धीमी आँच पर पकाएँ और बीच-बीच में चलाते रहें। पहले झाग बनेगा, फिर पानी उड़ने के साथ बुलबुले कम होंगे। जब नीचे बची खुरचन सुनहरी भूरी हो जाए और घी साफ़ सुनहरा दिखे, तो आँच बंद कर दें।

## स्टेप 5: छानकर रखें
घी को थोड़ा ठंडा होने दें, फिर बारीक छलनी या साफ़ मलमल के कपड़े से छानकर सूखे काँच के जार में भरें। ठंडा होने पर अच्छा घी अक्सर दानेदार जम जाता है।

## कुछ ज़रूरी टिप्स
- घी पकाते समय आँच हमेशा धीमी रखें, तेज़ आँच पर घी जल सकता है।
- बची हुई छाछ को कढ़ी या रायते में इस्तेमाल करें।
- खुरचन में थोड़ी चीनी या गुड़ मिलाकर बच्चों को खिलाया जाता है।
- पकते हुए घी को कभी अकेला न छोड़ें।

## समय नहीं है? तैयार देसी घी मँगाएँ
घर पर घी बनाने में कई दिन और काफ़ी मेहनत लगती है। अगर आप वही गाँव वाला स्वाद बिना झंझट के चाहते हैं, तो हमारा [Haryanvi Desi Ghee](/#products) WhatsApp पर ऑर्डर करें। पहले ऑर्डर पर ${FIRST_ORDER_DISCOUNT}% की छूट मिलती है।

घी को सही तरीके से रखने के लिए पढ़ें: [How to Store Desi Ghee](/blog/how-to-store-and-use-desi-ghee)।`,
    coverImage: "",
    createdAt: "2026-11-12T08:00:00.000Z",
  }),
  post({
    id: "seed-a2-cow-ghee",
    slug: "a2-desi-cow-ghee-vs-regular-cow-ghee",
    title: "A2 Desi Cow Ghee vs Regular Cow Ghee: What Is the Real Difference?",
    metaTitle: "A2 Desi Cow Ghee vs Cow Ghee: The Real Difference",
    metaDescription:
      "A2 desi cow ghee is trending, but what does A2 actually mean? A simple, honest guide to A2 ghee, desi cow ghee, buffalo ghee and what to check before buying.",
    keywords: "a2 desi cow ghee, a2 ghee, desi cow ghee, cow desi ghee, cow ghee, ghee cow",
    excerpt:
      "A2 desi cow ghee is one of the fastest rising ghee searches in India. Here is what A2 means, how it compares with regular cow ghee, and what to ask before you pay more.",
    content: `Searches for "A2 desi cow ghee" have grown fast, and many brands now sell A2 ghee at a higher price. Before you pay more, it helps to know what A2 really means.

## What does A2 mean?
Cow's milk contains a protein called beta-casein. There are two common types: A1 and A2. Milk from many Indian desi cow breeds, such as Gir, Sahiwal, Tharparkar, Rathi and Haryana's own Hariana breed, mainly contains the A2 type. Milk from many foreign and cross-bred cows contains both A1 and A2.

## Does A2 matter in ghee?
Ghee is almost pure milk fat. When butter is slowly heated, the milk proteins separate out as the solids at the bottom of the pan, and most of them are filtered away. So ghee contains very little protein, whether it is A1 or A2. Research on special A2 benefits is still limited. If a brand makes big health claims about A2 ghee, ask for the source.

## Desi cow ghee vs regular cow ghee
- Desi cow ghee: made from the milk of Indian breed cows. Usually golden yellow with a rich aroma.
- Regular cow ghee: may be made from the milk of cross-bred or foreign breed cows.
- Taste, aroma and texture depend a lot on how the ghee is made, not only on the breed.

## Cow ghee vs buffalo ghee
- Cow ghee is golden yellow and a little lighter in taste.
- Buffalo ghee is whiter, thicker and richer.
Both are part of everyday cooking in Haryana. The right choice depends on your family's taste.

## What to check before buying A2 ghee
- Which breed of cow is the milk from, and where are the cows kept?
- Is the method traditional (curd and churning) or directly from cream?
- Is there an FSSAI licence number on the pack?
- Does the price per kg make sense? See our [desi ghee price 1kg guide](/blog/desi-ghee-price-1kg-in-india).

## The bottom line
"A2" is a label about the milk protein, and ghee has very little protein. For most families, the things that matter most are the quality of the milk, an honest traditional method and a seller who answers questions clearly. Want to know how our ghee is made? Read [how traditional desi ghee is made in Haryana](/blog/how-traditional-desi-ghee-is-made) or message us on WhatsApp.

This article is for general information only and is not medical advice.`,
    coverImage: "",
    createdAt: "2026-11-12T07:00:00.000Z",
  }),
  post({
    id: "seed-health-benefits",
    slug: "health-benefits-of-desi-ghee",
    title: "Ghee Benefits: What Pure Desi Ghee Offers in Your Daily Diet",
    metaTitle: "Desi Ghee Benefits: Why Pure Ghee Belongs in Your Diet",
    metaDescription:
      "Know the real ghee benefits: energy, better vitamin absorption, a high smoke point for Indian cooking and great taste. How much pure desi ghee to eat daily.",
    keywords: "ghee benefits, desi ghee benefits, pure ghee, desi cow ghee, desi ghee in hindi",
    excerpt:
      "Desi ghee has been part of Indian kitchens for generations. Here are the real ghee benefits, how pure desi ghee helps everyday cooking, and how much to enjoy.",
    content: `For generations, a spoon of desi ghee on hot rotis or dal has been part of everyday meals in Haryana. Beyond taste, ghee has a long place in traditional Indian cooking and Ayurveda. Here is a simple, honest look at the main ghee benefits.

## Desi ghee benefits 1: A rich source of energy
Ghee is a concentrated source of fat, which gives the body energy. That is why it has always been a staple for farmers and people doing hard physical work.

## Desi ghee benefits 2: Helps absorb fat-soluble vitamins
Vitamins A, D, E and K dissolve in fat. Eating vegetables and dals cooked with a little ghee can help your body make better use of these vitamins.

## Desi ghee benefits 3: High smoke point for Indian cooking
Ghee can be heated to a higher temperature than butter before it starts to burn, which makes it well suited to tadka, frying and roasting.

## Desi ghee benefits 4: Flavour that makes simple food special
A little pure ghee goes a long way. It brings out the taste of khichdi, dal, ghee rice, parathas, halwa and festive sweets.

## Is desi cow ghee better than other ghee?
Desi cow ghee is golden and a little lighter, while buffalo ghee is whiter and richer. Both give the same basic ghee benefits. What matters more is that the ghee is pure and honestly made. See [how to choose the best desi ghee in India](/blog/best-desi-ghee-in-india).

## How much ghee per day?
Like any fat, ghee is best enjoyed in sensible amounts as part of a balanced diet. For most healthy adults, a spoon or two a day spread across meals is common in Indian homes. If you have a heart condition, high cholesterol or any other health concern, please ask your doctor how much is right for you.

## Ghee benefits in Hindi (संक्षेप में)
- शरीर को ऊर्जा देता है।
- विटामिन A, D, E और K को सोखने में मदद करता है।
- तड़का और तलने के लिए अच्छा, क्योंकि यह जल्दी नहीं जलता।
- सीमित मात्रा में खाएँ और कोई बीमारी हो तो डॉक्टर से सलाह लें।

This article is for general information only and is not medical advice.`,
    coverImage: "",
    createdAt: "2026-11-11T09:00:00.000Z",
  }),
  post({
    id: "seed-traditional-method",
    slug: "how-traditional-desi-ghee-is-made",
    title: "How Shudh Desi Ghee Is Made: The Traditional Haryanvi Method",
    metaTitle: "How Shudh Desi Ghee Is Made | Traditional Haryana Method",
    metaDescription:
      "From setting curd to churning makkhan and slow heating, see how pure shudh desi ghee is made the traditional village way in Haryana, step by step.",
    keywords: "shudh desi ghee, how desi ghee is made, pure ghee, traditional ghee, desi ghee",
    excerpt:
      "From setting curd overnight to slow heating the makkhan, the village way of making shudh desi ghee takes time and patience. Here is how it works.",
    content: `In Haryana's villages, making shudh desi ghee at home has always been a slow and careful process, passed down from grandmothers to the next generation. Here are the steps of the traditional method.

## 1. Setting the curd
Milk is boiled, cooled to a warm temperature and set into curd, usually overnight.

## 2. Churning into makkhan
The curd is churned with a wooden churner (madhani) until white butter, or makkhan, separates from the buttermilk (chhaachh).

## 3. Slow heating
The makkhan is heated slowly on a low flame. As the water evaporates, the milk solids settle and turn golden, and the kitchen fills with the familiar aroma of pure ghee.

## 4. Filtering
Once the ghee turns clear and golden, it is filtered to remove the solids and allowed to cool. Good desi ghee often sets with a grainy (danedar) texture.

## Why the slow way matters
Taking time at each step is what gives traditional ghee its rich aroma and taste. It also takes more milk and more hand work, which is one reason pure desi ghee costs more than factory ghee. Read our [desi ghee price 1kg guide](/blog/desi-ghee-price-1kg-in-india) to see what goes into the price.

## Want to try it at home?
You can make ghee from the malai you collect every day. Our Hindi guide [Malai Se Ghee Kaise Nikale](/blog/malai-se-ghee-kaise-nikale) explains it step by step. Or simply order village-style [Haryanvi Desi Ghee](/#products) on WhatsApp.`,
    coverImage: "",
    createdAt: "2026-11-10T09:00:00.000Z",
  }),
  post({
    id: "seed-store-and-use",
    slug: "how-to-store-and-use-desi-ghee",
    title: "How to Store Desi Ghee and Use It Every Day (Plus Easy Ghee Rice)",
    metaTitle: "How to Store Desi Ghee & Easy Ghee Rice Recipe",
    metaDescription:
      "Keep pure desi ghee fresh for longer with simple storage tips, and try easy everyday uses like tadka, rotis and a quick ghee rice recipe.",
    keywords: "how to store ghee, ghee rice, desi ghee uses, pure ghee, desi ghee",
    excerpt:
      "Simple tips to keep your desi ghee fresh for longer, plus easy ways to use it in everyday Indian meals, including a quick ghee rice recipe.",
    content: `Good ghee deserves good care. A few simple habits will keep your desi ghee fresh, fragrant and ready to use.

## Storage tips for desi ghee
- Keep the jar tightly closed after every use.
- Store it in a cool, dry place away from direct sunlight and the stove.
- Always use a clean, dry spoon. Even a drop of water can spoil ghee.
- In very hot weather, you can keep it in the fridge. It will harden but softens again at room temperature.

## Easy ways to use pure ghee every day
- Spread on hot rotis, parathas and bajra rotis.
- Add a spoon to dal, khichdi or rice.
- Use it for tadka with jeera, hing and garlic.
- Make halwa, laddoo, panjiri and other traditional sweets.
- Roast dry fruits or makhana for a quick snack.

## Quick ghee rice recipe
- Heat 1 to 2 spoons of desi ghee in a pan.
- Add 1 spoon of jeera, a bay leaf and a few whole spices if you like.
- Add cooked rice and salt, mix gently and warm through for 2 minutes.
- Serve hot with dal, kadhi or raita.

## Grainy or smooth?
Desi ghee may look grainy (danedar) or smooth depending on temperature. Both are normal and do not change the quality. Want to know more about checking quality? Read [how to choose the best desi ghee in India](/blog/best-desi-ghee-in-india).

Have a favourite way to use ghee? Message us on WhatsApp and tell us.`,
    coverImage: "",
    createdAt: "2026-11-09T09:00:00.000Z",
  }),
];
