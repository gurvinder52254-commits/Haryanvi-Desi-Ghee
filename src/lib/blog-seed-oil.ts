import { DELIVERY, FIRST_ORDER_DISCOUNT, PRODUCTS, discountedPrice, productPath, rupees, type Product } from "@/config/site";
import type { BlogPost } from "./blog";

// Cover pictures live in public/images/blog so they are always served at the
// same address (files imported only by server code are not copied to the site).
const cover = (name: string) => `/images/blog/${name}.jpg`;

// Mustard oil articles (Nov 2026). Keywords come from Google Trends data for
// India (mustard oil price, 1 litre / 5 litre / 15 kg tin, kachi ghani, cold
// pressed, benefits, hair, baby massage, diya, mustard oil in hindi / urdu /
// telugu / kannada, canola oil vs mustard oil, best mustard oil). Brand names
// from the Trends data are left out on purpose.
// Prices are read from src/config/site.ts, so they always match the shop.

const AUTHOR = "Haryanvi Desi Ghee";

function post(p: Omit<BlogPost, "author" | "published" | "updatedAt">): BlogPost {
  return { ...p, author: AUTHOR, published: true, updatedAt: p.createdAt };
}

const oils = PRODUCTS.filter((p) => p.type === "oil");
const find = (id: string) => oils.find((p) => p.id === id) ?? oils[0] ?? (PRODUCTS[0] as Product);
const oil1 = find("oil-1l");
const oil5 = find("oil-5l");
const offer = (p: Product) => (FIRST_ORDER_DISCOUNT > 0 ? ` (${rupees(discountedPrice(p))} on your first order)` : "");
const litres = (p: Product) => Number.parseFloat(p.weight) || 1;
const perLitre = (p: Product) => rupees(Math.round(p.mrp / litres(p)));
const priceList = oils.map((p) => `- [${p.weight} pack](${productPath(p)}): ${rupees(p.mrp)}${offer(p)}, about ${perLitre(p)} per litre`).join("\n");
const packList = oils.map((p) => p.weight).join(", ");
const deliveryDays = DELIVERY.zones[0]?.days ?? "a few days";
const shopLink = `[Haryanvi sarson ka tel](/products/cooking-oil)`;

export const OIL_SEED_POSTS: BlogPost[] = [
  // 1 ---------------------------------------------------------------
  post({
    id: "seed-mustard-oil-price",
    slug: "mustard-oil-price-1-litre-5-litre-15-kg-tin",
    title: "Mustard Oil Price Today: 1 Litre, 5 Litre & 15 Kg Tin Rate Guide",
    metaTitle: "Mustard Oil Price Today: 1 Litre, 5 Litre & Tin Rate",
    metaDescription: "Mustard oil price guide: 1 litre, 5 litre and 15 kg tin rates, litre vs kg, why the rate changes, GST, and how to buy sarson ka tel online at a fair price.",
    keywords: "mustard oil price, mustard oil price 1 litre, mustard oil 1 litre price, mustard oil rate today, mustard oil price today, mustard oil 5 litre, mustard oil 15 kg tin price, mustard oil tin 15 kg, mustard oil 15 litre price, mustard oil rate, mustard oil buy, mustard oil online",
    excerpt: "What should a litre of mustard oil cost? How to compare 1 litre bottles, 5 litre jars and 15 kg tins, why the rate keeps changing, and our current prices.",
    content: `"Mustard oil price" is one of the most searched kitchen questions in India, and "mustard oil 1 litre price" and "mustard oil rate today" are close behind. The rate really does move every few weeks, so it helps to know how to read a price, not just what one shop charges today. This guide explains the simple maths behind 1 litre, 5 litre and 15 kg tin rates.

## Mustard oil price at a glance
- Packs: most families buy 1 litre bottles, 2 litre bottles or 5 litre jars. Shops, dhabas and big families often buy a 15 kg or 15 litre tin.
- Unit: always compare the price per litre (or per kg), never the pack price alone.
- Trend: the rate rises and falls with the mustard seed crop, the season and import prices of other edible oils.

## Our mustard oil price today
These are our current prices for ${shopLink}, with free delivery included:
${priceList}

The bigger pack is the easy choice for families that cook with sarson ka tel every day. Smaller packs suit small kitchens or anyone trying our oil for the first time.

## Litre vs kg: the most common confusion
Oil is sold both by volume (litre) and by weight (kg), and they are not the same thing. Mustard oil is lighter than water: 1 litre weighs about 0.91 kg.
- 1 litre of mustard oil = about 910 grams
- 1 kg of mustard oil = about 1.1 litres
- 15 litre tin = about 13.7 kg of oil
- 15 kg tin = about 16.5 litres of oil

So a "15 kg tin" holds more oil than a "15 litre tin". Before you compare two tin prices, check which unit is printed on the label, then work out the price per kg or per litre.

## Mustard oil 15 kg tin price: how to work it out
Divide the tin price by 15 to get the price per kg, then divide by 1.1 to get the price per litre. Compare that with the per litre price of bottles and jars. Tins are usually a little cheaper per litre, but:
- a tin is opened again and again, so the oil meets air and light many times;
- most homes take months to finish 15 kg, and the oil can lose its fresh, sharp aroma;
- a tin is heavy and hard to pour without a spill.

For a home kitchen, three 5 litre packs (15 litres, ${rupees(oil5.mrp * 3)} at our regular price) stay sealed until you need them. That keeps the oil fresher than one big open tin.

## Why does the mustard oil rate change?
- Crop size: mustard (sarson) is a rabi crop, sown around October and harvested around February to March. A good harvest usually brings rates down; a poor one pushes them up.
- Season: demand rises in winter, when north Indian kitchens use more sarson ka tel for saag, pickles and frying.
- Other oils: India imports a lot of edible oil. When imported oils get costlier, buyers shift to mustard oil and its rate rises too.
- Pressing method: kachi ghani and cold pressed oils give less oil per kilo of seed than machine and solvent methods, so they cost more. Read [kachi ghani vs cold pressed vs refined mustard oil](/blog/kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil) to see why.
- Packing: glass bottles cost more than plastic jars and tins, and small packs cost more per litre than big ones.

## GST on mustard oil
Edible oils, including mustard oil, come under HSN heading 1514 and are taxed at 5% GST. Tax rules can change, so business buyers should confirm the current rate on the official GST portal before filing.

## Is cheap mustard oil safe?
A price far below the market rate is a warning sign. Pure mustard oil needs roughly three kilos of seed for every kilo of oil, so there is a limit to how cheap it can honestly be. Very cheap oil may be blended or adulterated. Read our [guide to choosing pure mustard oil](/blog/best-mustard-oil-how-to-choose-pure-mustard-oil) for simple checks.

## How to buy mustard oil online
- Check the price per litre and whether delivery is included.
- Look for a sealed pack, a clear packing date and an FSSAI number on the label.
- Buy a size you will finish within a few months of opening.

We deliver ${packList} packs for free, usually within ${deliveryDays}. See [delivery areas](/free-delivery), or order on WhatsApp from the [product page](/products/cooking-oil).`,
    faqs: [
      { q: "What is the price of mustard oil per litre?", a: `It changes with the season and crop, so always compare the price per litre. Our 1 litre pack is ${rupees(oil1.mrp)}${offer(oil1)}, with free delivery.` },
      { q: "How many litres are in a 15 kg mustard oil tin?", a: "About 16.5 litres. Mustard oil weighs roughly 0.91 kg per litre, so a 15 kg tin holds more oil than a 15 litre tin (about 13.7 kg)." },
      { q: "Why does the mustard oil rate keep changing?", a: "The rate follows the mustard seed harvest, winter demand, the price of imported edible oils and the pressing method. A good rabi harvest usually brings prices down." },
      { q: "Is a tin cheaper than bottles?", a: "A tin is usually a little cheaper per litre, but it is opened many times. For home use, sealed 5 litre packs keep the oil fresher." },
      { q: "What is the GST rate on mustard oil?", a: "Edible oils such as mustard oil are taxed at 5% GST under HSN heading 1514. Check the official GST portal for the latest rate." },
    ],
    coverImage: cover("mustard-oil-price"),
    createdAt: "2026-11-19T08:00:00.000Z",
  }),

  // 2 ---------------------------------------------------------------
  post({
    id: "seed-kachi-ghani-vs-cold-pressed",
    slug: "kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil",
    title: "Kachi Ghani vs Cold Pressed vs Refined Mustard Oil: Differences Explained",
    metaTitle: "Kachi Ghani vs Cold Pressed vs Refined Mustard Oil",
    metaDescription: "What is kachi ghani mustard oil? Compare kachi ghani, cold pressed, expeller pressed and refined oil, plus black vs yellow mustard oil, in simple words.",
    keywords: "kachi ghani mustard oil, cold pressed mustard oil, mustard oil cold pressed, ghani mustard oil, kachi ghani mustard oil price, expeller pressed mustard oil, refined oil, black mustard oil, yellow mustard oil, pure mustard oil, organic mustard oil, mustard oil machine",
    excerpt: "Kachi ghani, cold pressed, expeller pressed or refined? What each label really means, how the oil is made, and black vs yellow mustard oil.",
    content: `Walk into any shop and you will see "kachi ghani", "cold pressed", "pure" and "refined" on mustard oil labels. Searches for "kachi ghani mustard oil" and "cold pressed mustard oil" are rising fast, yet many buyers are not sure what the words mean. Here is a simple explanation of each method.

## How mustard oil is made
Mustard seeds hold about a third of their weight as oil. To get it out, the seeds are crushed and pressed. What changes from one method to another is the machine, the heat and whether chemicals are used afterwards. Those choices decide the oil's smell, colour, sharpness and price.

## What is kachi ghani mustard oil?
"Ghani" is the traditional oil press: a big wooden or stone mortar with a pestle that turns slowly, once pulled by a bullock (the old "kolhu"). "Kachi" means raw. Kachi ghani oil comes from the first pressing of the seeds at low temperature, without cooking them first.
- Taste and smell: very sharp and pungent, the classic "jhaanj" that makes your eyes water.
- Colour: deep golden to amber.
- Yield: lower, because a slow press leaves more oil in the seed cake. That is why kachi ghani mustard oil costs more.

Today many kachi ghani oils are made in slow, modern presses that copy the low heat of a wooden ghani.

## What is cold pressed mustard oil?
Cold pressed oil is pressed mechanically while the temperature stays low, usually below about 50°C. Nothing is added and the oil is only filtered. In everyday use, "kachi ghani" and "cold pressed" mean almost the same thing: a raw, first press with low heat. "Wood pressed" or "lakdi ghani" oil is cold pressed oil made in a wooden ghani.

## What is expeller pressed oil?
An expeller is a steel screw press that squeezes the seed hard and fast. The friction heats the seed, so more oil comes out but some aroma is lost. Expeller pressed mustard oil is still a pressed oil, just made faster and warmer.

## What is pakki ghani oil?
In pakki ghani, the seed is heated or the seed cake is pressed a second time to get more oil out. The oil is milder in smell and cheaper.

## What is refined oil?
Refined oil is taken out with a chemical solvent (usually hexane), then refined, bleached and deodorised. The result is pale, almost odourless and neutral in taste. Refining removes most of the natural mustard aroma and some natural compounds. Refined mustard oil exists, but most Indian kitchens that want sarson ka tel buy it for its sharp taste, so they choose a pressed oil instead.

## Kachi ghani vs cold pressed vs refined: quick comparison
- Heat: kachi ghani and cold pressed use low heat; expeller pressed is warmer; refined oil goes through high heat.
- Chemicals: none in pressed oils; solvent and refining in refined oil.
- Smell: strongest in kachi ghani, mild in refined oil.
- Price: kachi ghani and cold pressed cost the most per litre, refined the least.
- Best for: pressed oils for Indian cooking, pickles and tadka; refined oil for neutral frying.

## Black vs yellow mustard oil
Most Indian mustard oil comes from brown or black mustard seed (rai, mostly grown in Rajasthan, Haryana, Uttar Pradesh and Madhya Pradesh). It gives the sharp, pungent oil north Indians know. Yellow mustard (peeli sarson) is grown more in eastern India; its oil is milder and paler. "Black mustard oil" and "yellow mustard oil" are both pure mustard oils, just from different seeds.

## What about organic mustard oil?
Organic refers to how the seed was grown (without synthetic pesticides and fertilisers), not how it was pressed. An organic oil can be cold pressed or expeller pressed. Look for a valid organic certification on the label if this matters to you.

## Mustard oil machine and mill
Searches for "mustard oil machine" come from small businesses and farmers who want to press their own oil. A small oil expeller or a wooden "lakdi ghani" machine can press a few kilos an hour. If you buy from a local mill, ask to see the seed and the press, and check that the oil is filtered and stored in clean containers.

## Which one should you buy?
For dal, saag, sabzi, pickles and pakode, a pressed mustard oil gives the real taste of a Haryanvi or Punjabi kitchen. Whatever the label says, buy from a seller you trust, check the FSSAI number and packing date, and compare the price per litre (see our [mustard oil price guide](/blog/mustard-oil-price-1-litre-5-litre-15-kg-tin)). You can order ${shopLink} in ${packList} packs on WhatsApp.`,
    faqs: [
      { q: "What does kachi ghani mean?", a: "Ghani is the traditional oil press and kachi means raw. Kachi ghani mustard oil is the first, low-heat pressing of raw mustard seeds, which gives a strong, pungent oil." },
      { q: "Is kachi ghani the same as cold pressed?", a: "Almost. Both are first pressings at low temperature without chemicals. Kachi ghani is the traditional Indian name; cold pressed is the general term." },
      { q: "Why is kachi ghani mustard oil more expensive?", a: "A slow, low-heat press leaves more oil in the seed cake, so more seed is needed for each litre of oil. That raises the price per litre." },
      { q: "What is the difference between black and yellow mustard oil?", a: "Black or brown mustard seed gives the sharp, pungent oil common in north India. Yellow mustard gives a milder, paler oil, more common in eastern India." },
      { q: "Is refined mustard oil bad?", a: "It is not unsafe, but refining uses solvents and high heat and removes most of the natural mustard aroma. Most Indian cooks prefer pressed mustard oil for its taste." },
    ],
    coverImage: cover("kachi-ghani-mustard-oil"),
    createdAt: "2026-11-19T07:00:00.000Z",
  }),

  // 3 ---------------------------------------------------------------
  post({
    id: "seed-mustard-oil-benefits",
    slug: "mustard-oil-benefits-and-uses",
    title: "Mustard Oil Benefits & Uses: Cooking, Hair, Massage and Diya",
    metaTitle: "Mustard Oil Benefits & Uses: Cooking, Hair, Massage",
    metaDescription: "Benefits of mustard oil explained simply: nutrition, cooking uses, mustard oil for hair, body and baby massage (with care), diya on Diwali and safety tips.",
    keywords: "benefits of mustard oil, mustard oil benefits, cold pressed mustard oil benefits, mustard oil for hair, mustard oil for baby massage, mustard oil for diya, mustard oil massage, sarson ka tel ke fayde, mustard oil for cooking",
    excerpt: "What is good about sarson ka tel? Its nutrition, best cooking uses, traditional hair and massage uses, mustard oil diyas, and the cautions you should know.",
    content: `"Benefits of mustard oil" is a top search in India, and "cold pressed mustard oil benefits" has suddenly jumped. Sarson ka tel has been part of north and east Indian homes for centuries, in the kitchen and outside it. Here is a balanced look at what it offers, how to use it, and where to be careful.

## What is in mustard oil?
Like every cooking oil, mustard oil is almost 100% fat, about 9 calories per gram. What matters is the kind of fat. Roughly:
- Low saturated fat: under about 12%, one of the lowest among common cooking oils.
- High monounsaturated fat: around 60%, the same family of fats found in olive oil.
- Omega-3 and omega-6: mustard oil carries a good amount of plant omega-3 (alpha-linolenic acid) and a healthy balance with omega-6, which many other oils lack.
- Natural vitamin E and plant compounds, more of which survive in cold pressed oil.

The sharp smell comes from allyl isothiocyanate, the same natural compound that gives mustard and wasabi their bite.

## Benefits of mustard oil in cooking
- High smoke point (around 250°C): it does not break down easily, so it suits Indian deep frying, tadka and roasting.
- Strong flavour: a little goes a long way in sarson da saag, aloo, fish curry, pakode and baingan bharta.
- Natural preservative: its pungency and low moisture are why it is the classic oil for achaar (pickles).
- Good fat balance: low saturated fat with omega-3, when used in place of fats high in saturated fat.

Tip: many cooks heat mustard oil until it just starts to smoke, then let it cool a little before adding spices. This old practice softens the raw sharpness.

## What do cold pressed mustard oil benefits mean?
Cold pressed or kachi ghani oil is pressed at low heat and not refined, so it keeps more of the natural aroma, colour, vitamin E and plant compounds. Refined oil loses most of these. Learn the difference in [kachi ghani vs cold pressed vs refined mustard oil](/blog/kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil).

## Mustard oil for hair
Warm mustard oil "champi" is a much loved winter habit in Punjab and Haryana. It softens dry hair, helps with tangles and feels good on a dry scalp. Science has not proven that it makes hair grow faster or cures dandruff, so treat it as conditioning, not medicine.
- Warm 2 to 3 spoons slightly, massage into the scalp and hair, and wash off after an hour.
- Do a patch test first; mustard oil can irritate sensitive skin.
- Its smell is strong, so a mild shampoo wash may be needed.

## Mustard oil for body massage
A warm mustard oil massage is a winter tradition across north India. It warms the skin, eases dry patches and is relaxing. Wash it off if your skin feels itchy or red.

## Mustard oil for baby massage: be careful
Many families in India massage babies with mustard oil. However, some research suggests mustard oil can weaken the thin skin barrier of newborns, especially premature babies. Many child doctors now suggest milder oils for babies. Always ask your paediatrician before using any oil on a baby, and never put oil in a baby's nose or ears.

## Mustard oil for diya, Diwali and Dhanteras
Mustard oil diyas burn with a steady flame, which is why they are common for evening puja and on Diwali. On Dhanteras evening, many families light a "Yam Deepak" with mustard oil. People also search "can we buy mustard oil on Dhanteras"; customs differ from family to family and region to region, so many simply buy their festival oil a few days earlier. Follow what your family tradition says.

## How much mustard oil is healthy?
Use any oil in moderation. Health guidelines in India suggest keeping total visible fat (oil and ghee together) to a few teaspoons a day per adult, and rotating between oils rather than using just one. Mustard oil naturally contains erucic acid. Indian food rules allow mustard oil for cooking, and it has been eaten here for generations, but this is one more reason to use it in sensible amounts and mix it with other fats such as [desi ghee](/products/cow-desi-ghee).

## Storing mustard oil
Keep it in a closed container away from sunlight and the stove. Finish an opened pack within a few months for the best aroma. Smaller packs suit small homes.

Order ${shopLink} in ${packList} packs on WhatsApp, with free delivery. Compare sizes in our [mustard oil price guide](/blog/mustard-oil-price-1-litre-5-litre-15-kg-tin).`,
    faqs: [
      { q: "What are the main benefits of mustard oil?", a: "It is low in saturated fat, high in monounsaturated fat, has plant omega-3, a high smoke point for Indian cooking, and a strong flavour that also helps preserve pickles." },
      { q: "Is mustard oil good for hair?", a: "Warm mustard oil is a traditional conditioner that softens dry hair and scalp. It has not been proven to make hair grow faster. Do a patch test first." },
      { q: "Is mustard oil safe for baby massage?", a: "Some research suggests mustard oil can harm a newborn's delicate skin barrier, especially in premature babies. Ask your paediatrician before using any oil on a baby." },
      { q: "Can mustard oil be used for diya?", a: "Yes. Mustard oil burns with a steady flame and is widely used for diyas, including the Yam Deepak lit on Dhanteras evening in many homes." },
      { q: "How much mustard oil should I use daily?", a: "Use it in moderation, a few teaspoons of total oil and ghee per adult per day, and rotate between different fats instead of using only one oil." },
    ],
    coverImage: cover("mustard-oil-benefits"),
    createdAt: "2026-11-19T06:00:00.000Z",
  }),

  // 4 ---------------------------------------------------------------
  post({
    id: "seed-what-is-mustard-oil",
    slug: "what-is-mustard-oil-meaning-in-hindi",
    title: "What Is Mustard Oil? Meaning in Hindi, Urdu, Telugu, Kannada & More",
    metaTitle: "What Is Mustard Oil? Meaning in Hindi & Other Languages",
    metaDescription: "What is mustard oil and how is it made? Learn mustard oil meaning in Hindi (sarson ka tel), Urdu, Telugu, Kannada, Tamil and more, with mustard seed facts.",
    keywords: "what is mustard oil, mustard oil in hindi, mustard oil hindi, mustard oil meaning, sarso oil, sarson ka tel, mustard oil in urdu, mustard oil in telugu, mustard oil in kannada, mustard oil in tamil, mustard seeds, yellow mustard oil",
    excerpt: "Mustard oil is sarson ka tel. What it is, where it comes from, how it is made, and its name in Hindi, Urdu, Telugu, Kannada, Tamil, Bengali and more.",
    content: `"What is mustard oil", "mustard oil in Hindi" and "mustard oil meaning" are searched thousands of times every month. The short answer: mustard oil is the oil pressed from mustard seeds, known in Hindi as sarson ka tel. Here is everything else you may want to know.

## Mustard oil meaning
Mustard oil is an edible oil made by pressing the seeds of the mustard plant. It is golden to amber in colour, with a sharp, pungent smell and taste. In India it is used for cooking, pickles, hair and body massage, and lighting diyas.

## Mustard oil in Hindi and other Indian languages
- Hindi: सरसों का तेल (sarson ka tel). Many people also write "sarso oil" or call it "kadwa tel" (the pungent oil).
- Haryanvi and Punjabi: ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ (sarhon da tel), often just "sarson ka tel".
- Urdu: سرسوں کا تیل (sarson ka tel).
- Bengali: সরিষার তেল (shorishar tel).
- Telugu: ఆవ నూనె (aava noone).
- Kannada: ಸಾಸಿವೆ ಎಣ್ಣೆ (saasive enne).
- Tamil: கடுகு எண்ணெய் (kadugu ennai).
- Malayalam: കടുക് എണ്ണ (kaduku enna).
- Marathi: मोहरीचे तेल (mohariche tel).
- Gujarati: સરસવનું તેલ (sarsav nu tel).

## Where does mustard oil come from?
Mustard (sarson) is a winter, or rabi, crop. Farmers sow it around October, and by January the fields turn bright yellow with flowers, a famous sight across Haryana, Punjab and Rajasthan. The pods ripen and are harvested around February to March. Inside each pod are tiny round seeds, brown-black or yellow, which hold about a third of their weight as oil.

Rajasthan grows the most mustard in India, followed by states such as Haryana, Madhya Pradesh and Uttar Pradesh.

## How is mustard oil made?
- Cleaning: the seeds are cleaned and dried.
- Pressing: they are crushed and pressed in a ghani (traditional press) or an expeller (machine press).
- Settling: the oil is left to settle and then filtered.
- Packing: pressed oil is simply filtered and packed; refined oil is treated further with solvents and heat.

It takes roughly three kilos of seed to make one kilo of oil. The method changes the taste a lot; read [kachi ghani vs cold pressed vs refined mustard oil](/blog/kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil).

## Mustard seeds vs mustard oil
Mustard seeds (rai or sarson) are used whole in tadka and ground into pastes and pickles. Mustard oil is the fat pressed out of those seeds. The seed cake left after pressing (khal) is fed to cattle, so nothing goes to waste on a farm.

## Black, brown and yellow mustard oil
Most Indian mustard oil comes from brown or black mustard seed and is sharp and pungent. Yellow mustard oil, from yellow sarson seed, is milder and paler and is more common in eastern India. Both are pure mustard oil.

## Why does mustard oil smell so strong?
When mustard seed is crushed, a natural reaction releases allyl isothiocyanate, the compound that gives mustard its bite. That is why fresh, pressed mustard oil can make your eyes water, and why it tastes so different from neutral refined oils.

## What is mustard oil used for?
- Cooking: tadka, sabzi, saag, fish curry, pakode and puri.
- Pickles: the classic oil for mango, lemon and mixed achaar.
- Hair and body massage, mostly in winter.
- Diyas for puja and festivals.

See all its uses and cautions in [mustard oil benefits and uses](/blog/mustard-oil-benefits-and-uses).

## Buy sarson ka tel online
We sell ${shopLink} in ${packList} packs, delivered free within ${deliveryDays}. Order on WhatsApp from the [product page](/products/cooking-oil).`,
    faqs: [
      { q: "What is mustard oil called in Hindi?", a: "Mustard oil is called sarson ka tel (सरसों का तेल) in Hindi. Many people also call it kadwa tel because of its sharp, pungent taste." },
      { q: "What is mustard oil called in Telugu and Kannada?", a: "In Telugu it is aava noone (ఆవ నూనె). In Kannada it is saasive enne (ಸಾಸಿವೆ ಎಣ್ಣೆ)." },
      { q: "What is mustard oil called in Urdu?", a: "In Urdu, mustard oil is sarson ka tel (سرسوں کا تیل), the same name as in Hindi." },
      { q: "How is mustard oil made?", a: "Mustard seeds are cleaned, then pressed in a ghani or expeller. The oil is settled and filtered. Roughly three kilos of seed give one kilo of oil." },
      { q: "Why does mustard oil smell so strong?", a: "Crushing mustard seed releases allyl isothiocyanate, a natural compound that gives mustard oil its sharp, eye-watering aroma." },
    ],
    coverImage: cover("what-is-mustard-oil"),
    createdAt: "2026-11-19T05:00:00.000Z",
  }),

  // 5 ---------------------------------------------------------------
  post({
    id: "seed-best-mustard-oil",
    slug: "best-mustard-oil-how-to-choose-pure-mustard-oil",
    title: "Best Mustard Oil: How to Choose Pure Mustard Oil + vs Canola, Olive & Sunflower Oil",
    metaTitle: "Best Mustard Oil: How to Choose + vs Canola & Olive Oil",
    metaDescription: "How to pick the best pure mustard oil: label checks, adulteration warning signs, bottle vs tin, plus canola oil vs mustard oil, olive and sunflower oil.",
    keywords: "best mustard oil, best mustard oil in india, pure mustard oil, canola oil vs mustard oil, canola oil, mustard oil vs olive oil, olive oil, sunflower oil, groundnut oil, refined oil, mustard oil bottle, mustard oil buy, mustard oil online",
    excerpt: "Which mustard oil is best? Simple label checks, signs of adulteration, bottle vs tin, and how mustard oil compares with canola, olive, sunflower and other oils.",
    content: `"Best mustard oil" and "best mustard oil in India" are searched every day, and "canola oil vs mustard oil" is a fast-rising question. There is no single best oil for everyone, but there are clear signs of a good, pure mustard oil. Here is how to choose, and how mustard oil compares with other cooking oils.

## What makes a mustard oil "the best"?
- Purity: 100% mustard oil, not mixed with cheaper oils.
- Freshness: a recent packing date and a sealed pack.
- Method you like: kachi ghani or cold pressed for a sharp, traditional taste; expeller pressed for a slightly milder one.
- Honest price: a fair price per litre, not suspiciously cheap.
- A seller you can reach: a real phone number and an FSSAI licence on the label.

## How to check mustard oil on the label
- FSSAI licence number: every packed edible oil in India must show it.
- Name of the oil: it should clearly say mustard oil. Since October 2020, Indian food rules do not allow mustard oil to be sold blended with other oils, so "blended mustard oil" is a red flag.
- Packing and best before date: fresher is better.
- Net quantity: check whether it is in litres or kg (1 litre is about 0.91 kg).
- Agmark: a voluntary government quality grade that some mustard oils carry.

## Signs of adulteration
Mustard oil has a sad history of adulteration. In 1998, oil mixed with argemone (a wild weed seed) made thousands of people ill in Delhi. Today, testing is stricter, but stay alert:
- The price is far below the market rate.
- The smell is weak or odd. Pure pressed mustard oil smells sharp and pungent.
- It is sold loose from an unknown source with no label.
- The colour looks unnaturally pale or bright.

Home tricks cannot prove purity. If you suspect a problem, a food testing lab can check the oil, and you can report unsafe food to FSSAI.

## Bottle, jar or tin?
- Bottles (1 to 2 litres): easy to pour and store; best for small families.
- Jars (5 litres): good value for daily cooking in bigger homes; still sealed until opened.
- Tins (15 litres or 15 kg): cheapest per litre, but opened many times; best for shops and dhabas.

Light and air make oil go stale faster, so keep it closed, away from sunlight and the stove. See prices per litre in our [mustard oil price guide](/blog/mustard-oil-price-1-litre-5-litre-15-kg-tin).

## Canola oil vs mustard oil
Canola and mustard both come from the same plant family, which is why people confuse them.
- Origin: canola is a variety of rapeseed bred in Canada to have very little erucic acid and a mild taste. Indian mustard oil comes from brown or black mustard seed.
- Taste: canola oil is neutral; mustard oil is sharp and pungent.
- Fats: both are low in saturated fat and carry omega-3.
- Erucic acid: mustard oil naturally has more of it; canola was bred to have almost none. Indian food rules allow mustard oil for cooking, but it is wise to use any oil in moderation.
- Price and use: canola is mostly imported and costlier in India; mustard oil is local and made for Indian cooking.

## Mustard oil vs olive oil
Extra virgin olive oil is great for salads and light cooking, but its smoke point is lower and it costs much more in India. Mustard oil handles high heat, tadka and deep frying better and suits Indian flavours.

## Mustard oil vs sunflower, groundnut, sesame and coconut oil
- Sunflower oil: neutral and light, but high in omega-6 and very low in omega-3.
- Groundnut oil: mild and nutty, popular in Gujarat and the south.
- Sesame (til) oil: rich aroma, used in south Indian cooking and pickles.
- Coconut oil: high in saturated fat; the traditional oil of Kerala.
- Refined oils: neutral in taste and highly processed.

Nutrition experts in India suggest rotating between two or three oils rather than using only one. Mustard oil is a strong choice for north Indian cooking, and it pairs well with a little [desi ghee](/products/cow-desi-ghee).

## So which mustard oil should you buy?
Choose a sealed, clearly labelled, pure mustard oil from a seller you trust, at an honest price per litre, in a pack size you will finish within a few months. Read [what kachi ghani and cold pressed mean](/blog/kachi-ghani-vs-cold-pressed-vs-refined-mustard-oil) to pick the taste you like.

We sell ${shopLink} in ${packList} packs, with free delivery and easy WhatsApp ordering:
${priceList}`,
    faqs: [
      { q: "How do I know if mustard oil is pure?", a: "Buy sealed oil with an FSSAI number, a clear packing date and the words mustard oil (not blended). Pure pressed mustard oil smells sharp. Only a lab test can prove purity." },
      { q: "Is blended mustard oil allowed in India?", a: "Since October 2020, Indian food rules do not allow mustard oil to be sold blended with other edible oils." },
      { q: "What is the difference between canola oil and mustard oil?", a: "Canola is a low erucic acid rapeseed oil with a neutral taste. Mustard oil comes from brown or black mustard seed and is sharp and pungent. Both are low in saturated fat." },
      { q: "Is mustard oil better than olive oil for Indian cooking?", a: "For high-heat Indian cooking such as tadka and frying, mustard oil works better and costs less. Extra virgin olive oil suits salads and light cooking." },
      { q: "Should I buy mustard oil in a bottle or a tin?", a: "Bottles and 5 litre jars stay sealed and fresher for homes. Tins are cheaper per litre but are opened many times, so they suit shops and big kitchens." },
    ],
    coverImage: cover("best-mustard-oil"),
    createdAt: "2026-11-19T04:00:00.000Z",
  }),
];
