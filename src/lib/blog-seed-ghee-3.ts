import { DELIVERY, FIRST_ORDER_DISCOUNT, PRODUCTS, discountedPrice, productPath, rupees, type Product } from "@/config/site";
import type { BlogPost } from "./blog";

// Third set of desi ghee articles (Nov 2026). Keywords come from Google Trends
// data for India: desi ghee soan papdi, ghee laddu, motichoor laddu, barfi,
// desi ghee jalebi, weight loss / weight gain / diet / fatty liver, gyr (gir)
// cattle, a2 desi cow ghee, diya, ml / litre / kg, desi ghee online, desi ghee
// 1kg price. Brand names from the Trends data are left out on purpose.
// Prices are read from src/config/site.ts, so they always match the shop.

// Cover pictures live in public/images/blog so they are always served at the
// same address (files imported only by server code are not copied to the site).
const cover = (name: string) => `/images/blog/${name}.jpg`;

const AUTHOR = "Haryanvi Desi Ghee";

function post(p: Omit<BlogPost, "author" | "published" | "updatedAt">): BlogPost {
  return { ...p, author: AUTHOR, published: true, updatedAt: p.createdAt };
}

const find = (id: string) => PRODUCTS.find((p) => p.id === id) ?? (PRODUCTS[0] as Product);
const cow1 = find("1kg");
const cow250 = find("250g");
const buf1 = find("buffalo-1kg");
const offer = (p: Product) => (FIRST_ORDER_DISCOUNT > 0 ? ` (${rupees(discountedPrice(p))} on your first order)` : "");
const link = (p: Product, text: string) => `[${text}](${productPath(p)})`;
const deliveryDays = DELIVERY.zones[0]?.days ?? "a few days";
const ghee = (p: Product) => `${link(p, `${p.name.replace("Haryanvi ", "")} ${p.weight}`)}: ${rupees(p.mrp)}${offer(p)}`;

export const GHEE_SEED_POSTS_3: BlogPost[] = [
  // 1 ---------------------------------------------------------------
  post({
    id: "seed-desi-ghee-sweets",
    slug: "desi-ghee-sweets-soan-papdi-laddu-barfi",
    title: "Desi Ghee Sweets: Soan Papdi, Laddu, Barfi & Jalebi + Easy Besan Ghee Laddu Recipe",
    metaTitle: "Desi Ghee Sweets: Soan Papdi, Laddu, Barfi & Jalebi",
    metaDescription: "Why pure desi ghee makes the best soan papdi, motichoor laddu, barfi and jalebi, how to spot real ghee sweets, plus an easy besan ghee laddu recipe at home.",
    keywords: "desi ghee soan papdi, soan papdi, ghee laddu, desi ghee laddu, motichoor laddu, besan laddu, barfi, desi ghee jalebi, bandar laddu, desi ghee sweets, laddu, diwali sweets",
    excerpt: "Soan papdi, motichoor laddu, barfi and jalebi taste best in pure desi ghee. Why ghee matters, how to spot real ghee sweets, and an easy besan laddu recipe.",
    content: `Every festive season, searches for "desi ghee soan papdi", "ghee laddu", "motichoor laddu" and "barfi" shoot up. Indian sweets have always been made in ghee, and the difference between a sweet made in pure desi ghee and one made in cheaper fat is easy to taste. Here is why, and how to make ghee laddu at home.

## Why desi ghee makes better mithai
- Aroma: slow-cooked desi ghee has a nutty, caramel smell that no other fat has. It is the first thing you notice when you open a box of fresh laddu.
- Texture: ghee sets firm when cool, so laddu hold their shape, barfi slices cleanly and soan papdi stays flaky.
- Roasting: ghee can take high heat without burning, so besan, suji and atta roast evenly to a golden colour.
- Shelf life: ghee has almost no water, so sweets made in it keep longer than those made with butter.

## Popular desi ghee sweets
### Desi ghee soan papdi
Soan papdi is the flaky, melt-in-the-mouth sweet made by pulling a hot sugar syrup into roasted besan and flour again and again, until it forms fine threads. Roasting the flour in desi ghee gives it a rich taste. It is one of the most gifted sweets on Diwali.

### Motichoor laddu
Tiny boondi made from besan batter are fried, soaked in sugar syrup and pressed into laddu. Frying the boondi in desi ghee gives the soft, fragrant motichoor laddu offered at temples and weddings.

### Besan laddu and atta laddu
Besan or atta is roasted slowly in ghee until golden and nutty, mixed with sugar or gur and shaped by hand. A North Indian winter favourite.

### Bandar laddu
A famous sweet from Machilipatnam (Bandar) in Andhra Pradesh, made with besan, jaggery and generous ghee. It has a soft, almost melting texture.

### Barfi
Khoya or milk powder barfi, besan barfi and kaju barfi all use ghee to cook the mixture and grease the tray. Ghee keeps them smooth and glossy.

### Desi ghee jalebi
Jalebi fried in desi ghee is crisper and more fragrant than jalebi fried in oil or vanaspati, which is why sweet shops proudly write "shudh ghee jalebi" on their boards.

## How to spot sweets made in real desi ghee
- Smell: real ghee sweets smell nutty and rich, not oily or plain.
- Mouthfeel: ghee melts at around body temperature. Vanaspati and hydrogenated fats leave a waxy coating on the tongue.
- Label: on packed sweets, read the ingredients. Look for "ghee" or "desi ghee", not "vanaspati", "hydrogenated vegetable fat" or "edible vegetable oil".
- Freshness: loose sweets in India must show a "best before" date on the tray. Check it.
- Price: a box made in pure ghee cannot be very cheap, because ghee costs far more than vanaspati.

## Easy besan ghee laddu recipe (makes about 12)
### Ingredients
- 2 cups besan (gram flour), about 200 g
- 1/2 cup desi ghee, about 110 g
- 3/4 cup powdered sugar or boora, about 90 g
- 1/2 teaspoon cardamom powder
- 2 tablespoons chopped almonds or cashews (optional)

### Method
- Melt the ghee in a heavy kadhai on a low flame. Add the besan.
- Roast slowly, stirring all the time, for 15 to 20 minutes. It will turn golden and smell nutty. Do not rush this step.
- Switch off the flame and let the mixture cool until it is just warm.
- Mix in the sugar, cardamom and nuts.
- Take a small handful and press it into a round laddu. If it does not hold, add a spoon of warm ghee.
- Store in an airtight box. They keep well for about two weeks.

Tip: cow ghee gives a golden colour and a lighter taste, while buffalo ghee gives richer, more grainy laddu. Read [cow ghee vs buffalo ghee](/blog/cow-ghee-vs-buffalo-ghee) to choose.

## Ghee for your festive cooking
For home-made sweets this season, start with pure ghee:
- ${ghee(cow1)}
- ${ghee(buf1)}

We deliver free, usually within ${deliveryDays}. Not sure your ghee is pure? Try the [home purity tests](/blog/how-to-check-pure-desi-ghee-at-home).`,
    faqs: [
      { q: "Is soan papdi made in desi ghee?", a: "Good soan papdi is made by roasting besan and flour in desi ghee. Cheaper versions use vanaspati or vegetable fat, so read the ingredients on the box." },
      { q: "Which ghee is best for laddu?", a: "Both work. Cow ghee gives golden, lighter laddu; buffalo ghee gives richer, more grainy laddu. Use pure desi ghee for the best aroma." },
      { q: "How do I know if sweets are made in pure ghee?", a: "Real ghee sweets smell nutty and melt cleanly in the mouth. Vanaspati leaves a waxy feel. On packed sweets, check that the fat listed is ghee." },
      { q: "How long do besan ghee laddu last?", a: "Kept in an airtight box at room temperature, besan ghee laddu usually stay good for about two weeks." },
      { q: "What is bandar laddu?", a: "Bandar laddu is a soft sweet from Machilipatnam (Bandar) in Andhra Pradesh, made with besan, jaggery and plenty of ghee." },
    ],
    coverImage: cover("desi-ghee-sweets"),
    createdAt: "2026-11-19T14:00:00.000Z",
  }),

  // 2 ---------------------------------------------------------------
  post({
    id: "seed-ghee-weight-loss-gain",
    slug: "desi-ghee-for-weight-loss-and-weight-gain",
    title: "Desi Ghee for Weight Loss or Weight Gain? Calories, Diet Tips & Fatty Liver Facts",
    metaTitle: "Desi Ghee for Weight Loss or Weight Gain? Diet Facts",
    metaDescription: "Does desi ghee cause weight gain or help weight loss? Ghee calories per spoon, how much ghee per day fits a diet, and what people with fatty liver should know.",
    keywords: "desi ghee for weight loss, ghee for weight gain, ghee in diet, ghee calories, 1 spoon ghee calories, is desi ghee good for health, ghee and fatty liver, desi ghee benefits, ghee protein, desi ghee ke fayde",
    excerpt: "Can ghee help you lose weight, or will it make you gain? The honest answer, with calories per spoon, how much ghee a day fits a diet, and fatty liver cautions.",
    content: `"Ghee for weight loss" and "ghee for weight gain" are both rising searches, which tells you how confused people are. Some say a spoon of ghee melts belly fat; others say ghee is the reason for weight gain. The truth sits in between, and it mostly comes down to how much you eat.

## Ghee calories: the numbers
Ghee is almost pure milk fat, so it is very energy dense:
- 1 teaspoon of ghee (about 5 g): about 45 calories
- 1 tablespoon of ghee (about 14 g): about 125 calories
- 100 g of ghee: about 900 calories

Ghee has almost no protein and no carbohydrate. It carries fat-soluble vitamins A, D, E and K, and small amounts of butyric acid and CLA. See exact spoon and gram conversions in our [ghee measurement guide](/blog/ghee-measurements-spoon-ml-grams-litre-kg).

## Does desi ghee cause weight gain?
Weight changes when the calories you eat are more or less than the calories you burn. Ghee does not have a special power to add or remove fat, but because it is so calorie dense, it is easy to eat a lot without noticing. Three extra spoons a day add about 135 calories, which over months can add weight.

## Can ghee help with weight loss?
No single food burns fat. What ghee can do in a sensible diet:
- Keep you full: a little fat with your meal slows digestion, so you may snack less.
- Make healthy food tasty: a spoon of ghee on dal, sabzi or millet roti makes simple home food satisfying.
- Replace worse fats: using a measured amount of ghee instead of deep-fried snacks, vanaspati or packaged foods is a better swap.

Claims like "ghee in warm water on an empty stomach burns belly fat" are not backed by good science.

## Ghee for weight gain
For people who need to gain weight, such as underweight children, people recovering from illness or very active young people, ghee is an easy way to add healthy calories to roti, dal, khichdi, halwa and laddu. A doctor or dietitian can tell you the right amount.

## How much ghee per day is okay?
Indian dietary guidelines suggest keeping total visible fat (oil plus ghee) to about 20 to 30 g a day for most adults, depending on how active you are. That is roughly 4 to 6 teaspoons in total. So if you cook with oil, keep ghee to about 1 to 2 teaspoons a day, and rotate between fats rather than using only one.

## Ghee and fatty liver
Fatty liver disease is becoming common in India and is closely linked to excess weight, sugar, refined carbs and alcohol. Ghee is about 60% saturated fat, so people with fatty liver, high cholesterol, diabetes or heart disease should not eat it freely. Many can still have a small, measured amount; ask your doctor what suits you.

## Smart ways to use ghee in a diet
- Measure with a teaspoon instead of pouring from the jar.
- Add ghee at the end, on top of dal or roti, where you taste it most.
- Use it for tadka in place of extra oil, not on top of it.
- Choose pure ghee: you get more flavour from less. Learn [how to check pure ghee at home](/blog/how-to-check-pure-desi-ghee-at-home).

## Bottom line
Desi ghee is neither a fat-burner nor a poison. In small, measured amounts it fits well into an Indian diet. Read more about its everyday benefits in [desi ghee khane ke fayde](/blog/desi-ghee-khane-ke-fayde).

A small pack helps you keep portions in check: ${ghee(cow250)}.`,
    faqs: [
      { q: "Does eating ghee cause weight gain?", a: "Only if it adds more calories than you burn. Ghee has about 45 calories per teaspoon, so large amounts can add weight. Small, measured amounts fit a healthy diet." },
      { q: "Is ghee good for weight loss?", a: "No single food burns fat. A little ghee can keep meals filling and replace worse fats, but weight loss still depends on total calories and activity." },
      { q: "How many calories are in 1 spoon of ghee?", a: "About 45 calories in 1 teaspoon (5 g) and about 125 calories in 1 tablespoon (14 g)." },
      { q: "How much ghee should I eat per day?", a: "For most adults, keep total oil and ghee to about 20 to 30 g a day, so about 1 to 2 teaspoons of ghee if you also cook with oil." },
      { q: "Can I eat ghee if I have fatty liver?", a: "Ghee is high in saturated fat, so people with fatty liver should limit it. Many can have a small amount, but ask your doctor first." },
    ],
    coverImage: cover("desi-ghee-weight-loss"),
    createdAt: "2026-11-19T13:00:00.000Z",
  }),

  // 3 ---------------------------------------------------------------
  post({
    id: "seed-gir-cow-ghee-breeds",
    slug: "gir-cow-ghee-desi-cow-breeds",
    title: "Gir Cow Ghee & Desi Cow Breeds: Gir, Sahiwal, Hariana and Tharparkar Explained",
    metaTitle: "Gir Cow Ghee & Desi Cow Breeds: Gir, Sahiwal, Hariana",
    metaDescription: "What is Gir cow ghee? Learn about India's desi cow breeds (Gir, Sahiwal, Hariana, Tharparkar, Rathi), A2 milk, and how to judge desi cow ghee price and claims.",
    keywords: "gir cow ghee, gyr cow ghee, a2 cow ghee, a2 desi cow ghee, desi cow ghee, cow desi ghee, sahiwal cow ghee, hariana cow, desi cow ghee price, pure desi cow ghee, cow ghee",
    excerpt: "Gir, Sahiwal, Hariana, Tharparkar: what makes a desi cow, what A2 milk means, why Gir cow ghee costs more, and how to judge breed claims on a ghee label.",
    content: `"Cow desi ghee" and "desi cow ghee" are the most searched ghee terms in India, and "Gir cow ghee" is rising fast. Many labels now name a breed. But what is a desi cow, and does the breed really change the ghee? Here is a simple guide.

## What is a desi cow?
Desi cows are India's native breeds (Bos indicus). They have a hump, loose skin under the neck and long ears, and are built for heat. They give less milk than foreign breeds like Holstein Friesian or Jersey, but are hardy and well suited to Indian farms. India has dozens of recognised native cattle breeds.

## Popular desi cow breeds
### Gir (Gyr)
From the Gir forest area of Gujarat. Easy to spot by its domed forehead, long curled ears and red or speckled coat. It is one of India's best known dairy breeds, and "Gir cow ghee" is one of the costliest ghees in the market.

### Sahiwal
Originally from the Punjab region. Reddish-brown, calm and among the highest milk yielding native breeds, which is why it is common on dairy farms across north India.

### Hariana
Haryana's own breed, from the Rohtak, Hisar, Jind and Karnal belt. White to light grey, tall and strong. It is a dual-purpose breed, used both for milk and for farm work, and has been part of Haryanvi village life for generations.

### Tharparkar
From the Thar desert. White or grey, very hardy, and known for giving steady milk even in hot, dry conditions.

### Rathi and Red Sindhi
Rathi is a hardy breed from the Bikaner area of Rajasthan. Red Sindhi is a deep red dairy breed now kept in many states.

## What is A2 cow ghee?
Milk has a protein called beta-casein, which comes in A1 and A2 types. Milk from most desi breeds is mainly the A2 type, which is why ghee from them is sold as "A2 ghee". But ghee is almost pure fat with only traces of protein, so the A1/A2 difference in ghee is very small. We explain this in detail in [A2 desi cow ghee vs regular cow ghee](/blog/a2-desi-cow-ghee-vs-regular-cow-ghee).

## Why is Gir cow ghee so expensive?
- Low milk yield: desi cows give much less milk per day than foreign breeds.
- More milk per kilo: making ghee by the curd and churning method needs a lot of milk for each kilo of ghee.
- Care: grazing, fodder and small herds raise costs.
- Demand: breed names have become a premium marketing tag.

## Does the breed change the taste?
Feed, season and the making method affect ghee as much as the breed does. Grass-fed cows give a more golden ghee with stronger aroma. Ghee made by setting curd and churning makkhan (the bilona way) has a deeper, nutty taste than ghee made straight from cream. Read [what bilona ghee is](/blog/bilona-ghee-kya-hai).

## How to judge breed claims on a ghee label
- A single-breed claim (only Gir, only Sahiwal) is hard to check. Buy from sellers who are open about their farms and milk source.
- Look for an FSSAI licence number, a packing date and a sealed jar.
- Compare the price per kg. Very cheap "Gir ghee" is a red flag.
- Test purity at home with our [pure ghee tests](/blog/how-to-check-pure-desi-ghee-at-home).

## Our cow ghee
Our cow desi ghee is made the traditional Haryanvi way: milk set into curd, churned into makkhan and slow-cooked on a low flame. ${ghee(cow1)}. See current rates in our [desi ghee price 1kg guide](/blog/desi-ghee-price-1kg-in-india).`,
    faqs: [
      { q: "What is Gir cow ghee?", a: "It is ghee made from the milk of Gir cows, a native dairy breed from the Gir forest area of Gujarat. It is usually sold at a premium price." },
      { q: "Which is the best desi cow breed for ghee?", a: "Gir and Sahiwal are the best known dairy breeds, and Hariana is Haryana's own breed. Feed and the making method affect ghee as much as the breed." },
      { q: "Is desi cow ghee always A2 ghee?", a: "Milk from most desi breeds is mainly A2 type, but ghee has only traces of protein, so the A1/A2 difference in ghee itself is very small." },
      { q: "Why is Gir cow ghee costly?", a: "Gir cows give less milk, the bilona method needs a lot of milk per kilo of ghee, and herd care is costly. Breed names also carry a premium." },
      { q: "What is the Hariana cow?", a: "Hariana is a native breed from Haryana (Rohtak, Hisar, Jind, Karnal). It is white to grey, tall and strong, and used for both milk and farm work." },
    ],
    coverImage: cover("gir-cow-ghee"),
    createdAt: "2026-11-19T12:00:00.000Z",
  }),

  // 4 ---------------------------------------------------------------
  post({
    id: "seed-ghee-diya",
    slug: "ghee-diya-benefits-how-to-light",
    title: "Ghee Diya: Why Light a Desi Ghee Diya, Ghee vs Oil Diya & How to Make It",
    metaTitle: "Ghee Diya: Benefits, Ghee vs Oil Diya & How to Light",
    metaDescription: "Why families light a desi ghee diya for puja and Diwali, ghee diya vs oil diya, how much ghee a diya needs, how to make a cotton batti, and safety tips.",
    keywords: "ghee diya, desi ghee diya, diya, ghee ka diya, ghee diya benefits, ghee vs oil diya, akhand jyot ghee, diwali diya, cotton batti, cow ghee for puja",
    excerpt: "Why a desi ghee diya is special in puja, how it differs from an oil diya, how much ghee it needs, how to roll a cotton batti, and simple safety tips.",
    content: `Searches for "diya" jump every festive season, and "ghee diya" is one of the most common questions. In many Indian homes, a small diya of desi ghee is lit every morning and evening, not just on Diwali. Here is why, and how to light one properly.

## Why light a desi ghee diya?
- Tradition: ghee is considered pure and sattvic, so a ghee diya has a special place in puja, aarti and havan.
- Clean flame: pure ghee burns with a soft, steady, golden flame and gives less smoke and soot than most oils.
- Fragrance: a ghee diya fills the room with a gentle, warm aroma.
- Long-lasting light: many families keep an "akhand jyot" (unbroken flame) of ghee during Navratri and other festivals.

## Ghee diya vs oil diya
- Ghee diya: softer light, less smoke, pleasant aroma; traditionally used in the main puja. Many families place it on the right side of the deity.
- Mustard or til oil diya: brighter flame, more smoke; very common for outdoor and doorstep diyas on Diwali, and for the Yam Deepak on Dhanteras evening.
- Cost: ghee is costlier, so many homes light one ghee diya in the mandir and use oil for the rest.

Customs differ from family to family and region to region. Follow what your elders do. If you use mustard oil for outdoor diyas, read about [mustard oil for diya](/blog/mustard-oil-benefits-and-uses).

## Which ghee is best for a diya?
Cow ghee is the traditional choice for puja. Any pure desi ghee burns cleanly. Avoid vanaspati or blended "puja ghee"; it smokes, smells and sputters. A pure ghee also tells you something: if your diya smokes a lot, the ghee may not be pure. Check it with our [home purity tests](/blog/how-to-check-pure-desi-ghee-at-home).

## How much ghee does a diya need?
A small clay diya holds about 1 to 2 teaspoons of ghee, which usually burns for around an hour, depending on the wick. A brass akhand jyot holds much more. A 250 GM pack is enough for many small diyas.

## How to make a cotton batti (wick)
### Phool batti (round, for short puja)
- Take a small tuft of clean cotton.
- Pinch the centre and twist it into a point, with a flat round base.
- Dip it in melted ghee and place it flat in the diya with the point upwards.

### Lambi batti (long, for longer burning)
- Take a thin strip of cotton.
- Roll it between your palms into a long thread with a pointed end.
- Lay it in the diya so the tip rests on the lip, with the rest soaking in ghee.

Tip: soak new clay diyas in water for a few hours and dry them before use. They will drink less ghee.

## How to light a ghee diya
- Melt the ghee slightly so it spreads evenly.
- Fill the diya, then soak the batti fully before lighting.
- Light the tip and let the flame settle. Trim the wick if the flame grows too tall.

## Safety tips
- Keep diyas away from curtains, paper decorations and clothes.
- Place them on a metal plate or tray, out of reach of children and pets.
- Never leave a diya burning in an empty room or overnight without a safe holder.

## Pure ghee for puja
Our ${link(cow250, "Cow Desi Ghee 250 GM")} pack (${rupees(cow250.mrp)}${offer(cow250)}) is a handy size for daily diya and puja. For cooking and festivals, see the ${link(cow1, "1 KG pack")}. Free delivery, usually within ${deliveryDays}.`,
    faqs: [
      { q: "Why is a ghee diya lit in puja?", a: "Ghee is considered pure and sattvic. A ghee diya gives a soft, steady flame with little smoke and a pleasant aroma, so it is traditional in puja and aarti." },
      { q: "Is a ghee diya better than an oil diya?", a: "A ghee diya gives less smoke and a softer light; an oil diya is brighter and cheaper. Many homes light ghee in the mandir and oil diyas outside." },
      { q: "Which ghee is best for a diya?", a: "Pure cow desi ghee is the traditional choice. Avoid vanaspati or blended puja ghee, which smokes and smells." },
      { q: "How long does a ghee diya burn?", a: "A small clay diya with 1 to 2 teaspoons of ghee usually burns for around an hour, depending on the wick and diya size." },
      { q: "On which side should the ghee diya be placed?", a: "Many families place the ghee diya on the right side of the deity and the oil diya on the left. Customs vary, so follow your family tradition." },
    ],
    coverImage: cover("ghee-diya"),
    createdAt: "2026-11-19T11:00:00.000Z",
  }),

  // 5 ---------------------------------------------------------------
  post({
    id: "seed-ghee-measurements",
    slug: "ghee-measurements-spoon-ml-grams-litre-kg",
    title: "1 Spoon Ghee in Grams, Ml to Grams & 1 Litre Ghee in Kg: Easy Ghee Measurement Guide",
    metaTitle: "Ghee Measurement: 1 Spoon in Grams, Ml & Litre vs Kg",
    metaDescription: "How many grams in 1 spoon of ghee, ghee ml to grams, 1 litre ghee in kg, calories per spoon, and how to compare desi ghee online prices by weight, simply.",
    keywords: "1 spoon ghee in grams, 1 tablespoon ghee calories, ghee ml to grams, 1 litre ghee in kg, ghee kg to litre, desi ghee online, desi ghee 1kg price, ghee price, desi ghee rate, ghee 500 ml in grams",
    excerpt: "Teaspoon, tablespoon, ml, litre or kg? Simple ghee conversions, calories per spoon, and why you should compare desi ghee prices online by weight.",
    content: `Recipes say "1 tablespoon ghee", diet charts say "10 g ghee", and packs say "1 litre" or "1 kg". No wonder "1 spoon ghee in grams" and "1 litre ghee in kg" are common searches. Here are the simple conversions, and how they help you compare desi ghee prices online.

## Ghee spoon to grams
Measured with level, melted ghee:
- 1 teaspoon (5 ml) = about 5 g
- 1 tablespoon (15 ml) = about 14 g
- 1 katori or 1/2 cup (120 ml) = about 110 g
- 1 cup (240 ml) = about 220 g

A heaped spoon of soft, grainy ghee can hold almost double, so for diets use a level spoon.

## Ghee calories per spoon
- 1 teaspoon: about 45 calories
- 1 tablespoon: about 125 calories
- 10 g: about 90 calories

Read [desi ghee for weight loss or weight gain](/blog/desi-ghee-for-weight-loss-and-weight-gain) to see how much fits a daily diet.

## Ghee ml to grams, and litre to kg
Ghee is lighter than water. One litre of melted ghee weighs about 0.91 kg.
- 100 ml ghee = about 91 g
- 500 ml ghee = about 455 g
- 1 litre ghee = about 910 g
- 1 kg ghee = about 1.1 litres
- 5 litres ghee = about 4.55 kg

## Why litre vs kg matters when you buy ghee
Some brands sell ghee by volume (500 ml, 1 litre) and others by weight (500 g, 1 kg). A 1 litre pack has about 90 g less ghee than a 1 kg pack. If both cost the same, the 1 kg pack is about 10% better value.

To compare fairly:
- Turn every price into price per kg.
- For a litre pack: price per kg = pack price ÷ 0.91.
- Check if delivery is included.

The same maths applies to big tins: a 15 litre tin holds only about 13.7 kg. See our [desi ghee tin price guide](/blog/desi-ghee-tin-price-gst-hsn-code).

## Buying desi ghee online: quick checklist
"Desi ghee online" searches have more than doubled in a month. Before you order:
- Compare price per kg, not pack price.
- Look for an FSSAI licence number and packing date.
- Prefer sealed glass or food-grade jars.
- Read real customer reviews, and check that delivery covers your area.
- Very cheap ghee is a warning sign: pure ghee needs a lot of milk per kilo. See [desi ghee price 1kg in India](/blog/desi-ghee-price-1kg-in-india).

## Our ghee is sold by weight
All our packs are sold by weight (GM and KG), so there is no litre confusion:
- ${ghee(cow1)}
- ${ghee(buf1)}

Delivery is free, usually within ${deliveryDays}. See [delivery areas](/free-delivery).`,
    faqs: [
      { q: "How many grams is 1 spoon of ghee?", a: "A level teaspoon of melted ghee is about 5 g, and a level tablespoon is about 14 g. A heaped spoon of grainy ghee can hold much more." },
      { q: "How many kg is 1 litre of ghee?", a: "About 0.91 kg. Ghee is lighter than water, so 1 kg of ghee is about 1.1 litres." },
      { q: "How many calories are in 1 tablespoon of ghee?", a: "About 125 calories in a level tablespoon (14 g), and about 45 calories in a teaspoon." },
      { q: "Is 1 litre ghee the same as 1 kg?", a: "No. A 1 litre pack holds about 910 g of ghee, about 90 g less than a 1 kg pack. Compare prices per kg." },
      { q: "How should I compare desi ghee prices online?", a: "Convert every price to price per kg, check that delivery is included, and look for an FSSAI number, packing date and sealed jar." },
    ],
    coverImage: cover("ghee-measurement"),
    createdAt: "2026-11-19T10:00:00.000Z",
  }),
];
