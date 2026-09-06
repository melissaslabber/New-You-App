function servingMeasures(name, unit = "g") {
  const value = String(name).toLowerCase();
  if (unit === "ml" || value.includes("milk")) return { tsp: 5, tbsp: 15, cup: 250 };
  if (value.includes("peanut butter")) return { tsp: 5.3, tbsp: 16, cup: 258 };
  if (value.includes("oil")) return { tsp: 4.5, tbsp: 13.5, cup: 216 };
  if (value.includes("yoghurt") || value.includes("yogurt")) return { tsp: 5.1, tbsp: 15.3, cup: 245 };
  if (value.includes("oats")) return { tsp: 1.7, tbsp: 5, cup: 80 };
  if (value.includes("rice")) return { tsp: 3.8, tbsp: 11.5, cup: 185 };
  return { tsp: 5, tbsp: 15, cup: 240 };
}

const COMMON_FOODS = [
  ["chicken-breast", "Chicken breast, cooked", "", 165, 31, 0, 3.6, "chicken grilled roasted skinless", 150],
  ["chicken-thigh", "Chicken thigh, cooked, skinless", "", 209, 26, 0, 10.9, "chicken dark meat", 150],
  ["chicken-thigh-skin", "Chicken thigh, cooked, with skin", "", 232, 23, 0, 15, "chicken dark meat skin on", 150],
  ["lean-beef-mince", "Lean beef mince, cooked", "", 215, 26, 0, 12],
  ["extra-lean-beef-mince", "Extra-lean beef mince, cooked", "", 176, 27, 0, 7, "mince beef 5 percent fat", 150],
  ["regular-beef-mince", "Regular beef mince, cooked", "", 254, 25, 0, 18, "mince beef", 150],
  ["egg", "Whole egg", "", 143, 12.6, 0.7, 9.5, "egg eggs boiled egg fried egg", 50],
  ["scrambled-eggs", "Scrambled eggs", "", 148, 10, 1.5, 11, "scrambled egg eggs", 150],
  ["boiled-egg", "Boiled egg", "", 155, 12.6, 1.1, 10.6, "egg eggs hard boiled soft boiled", 50],
  ["poached-egg", "Poached egg", "", 143, 12.6, 0.7, 9.5, "egg eggs", 50],
  ["fried-egg", "Fried egg, with a little oil", "", 196, 13.6, 0.8, 15, "egg eggs", 50],
  ["egg-white", "Egg white, cooked", "", 52, 11, 0.7, 0.2],
  ["tuna-water", "Tuna in water, drained", "", 116, 26, 0, 0.8],
  ["tuna-brine", "Tuna in brine, drained", "", 116, 26, 0, 0.8, "tinned canned tuna", 100],
  ["tuna-oil", "Tuna in oil, drained", "", 198, 29, 0, 8.2, "tinned canned tuna", 100],
  ["salmon", "Salmon, cooked", "", 206, 22, 0, 12],
  ["biltong", "Beef biltong", "", 250, 50, 3, 5],
  ["yoghurt-fat-free", "Plain fat-free yoghurt", "", 56, 5.7, 7.7, 0.2],
  ["greek-yoghurt", "Plain Greek yoghurt, low fat", "", 73, 9.9, 3.9, 1.9],
  ["greek-yoghurt-full", "Plain Greek yoghurt, full fat", "", 97, 9, 3.9, 5, "yogurt yoghurt full cream", 250],
  ["yoghurt-low-fat", "Plain low-fat yoghurt", "", 63, 5.3, 7, 1.6, "yogurt yoghurt", 250],
  ["yoghurt-full-cream", "Plain full-cream yoghurt", "", 82, 4.2, 6.2, 4.5, "yogurt yoghurt", 250],
  ["whey", "Whey protein powder", "", 400, 80, 8, 6],
  ["oats", "Rolled oats, dry", "", 379, 13.2, 67.7, 6.5],
  ["rice", "White rice, cooked", "", 130, 2.7, 28.2, 0.3],
  ["brown-rice", "Brown rice, cooked", "", 123, 2.7, 25.6, 1, "rice wholegrain", 150],
  ["basmati-rice", "Basmati rice, cooked", "", 121, 3.5, 25.2, 0.4, "rice", 150],
  ["potato", "Potato, cooked", "", 87, 1.9, 20.1, 0.1],
  ["sweet-potato", "Sweet potato, cooked", "", 90, 2, 20.7, 0.2],
  ["bread", "Whole-wheat bread", "", 247, 13, 41, 3.4],
  ["bread-white", "White bread", "", 266, 8.9, 49, 3.3, "bread toast", 40],
  ["bread-brown", "Brown bread", "", 246, 9, 45, 3.2, "bread toast", 40],
  ["bread-low-gi", "Low-GI seeded bread", "", 236, 11, 36, 5, "bread toast seed", 45],
  ["apple", "Apple", "", 52, 0.3, 13.8, 0.2, "apple apples fruit", 182],
  ["banana", "Banana", "", 89, 1.1, 22.8, 0.3, "banana bananas fruit", 118],
  ["orange", "Orange", "", 47, 0.9, 11.8, 0.1, "orange oranges fruit", 130],
  ["pear", "Pear", "", 57, 0.4, 15.2, 0.1, "pear pears fruit", 178],
  ["grapes", "Grapes", "", 69, 0.7, 18.1, 0.2, "grape grapes fruit", 100],
  ["strawberries", "Strawberries", "", 32, 0.7, 7.7, 0.3, "strawberry strawberries fruit", 100],
  ["watermelon", "Watermelon", "", 30, 0.6, 7.6, 0.2, "watermelon fruit", 200],
  ["blueberries", "Blueberries", "", 57, 0.7, 14.5, 0.3],
  ["avocado", "Avocado", "", 160, 2, 8.5, 14.7],
  ["peanut-butter", "Peanut butter, no added sugar", "", 588, 25, 20, 50],
  ["peanut-butter-smooth", "Smooth peanut butter", "", 588, 25, 20, 50, "peanut butter regular", 15],
  ["peanut-butter-crunchy", "Crunchy peanut butter", "", 594, 25, 20, 51, "peanut butter regular", 15],
  ["olive-oil", "Olive oil", "", 884, 0, 0, 100, "oil extra virgin", 5],
  ["sunflower-oil", "Sunflower oil", "", 884, 0, 0, 100, "cooking oil", 5],
  ["milk-fat-free", "Fat-free milk", "", 35, 3.4, 5, 0.1, "milk skim long life fresh", 250, "ml"],
  ["milk-low-fat", "Low-fat milk", "", 46, 3.4, 4.9, 1.5, "milk 1.5 percent long life fresh", 250, "ml"],
  ["milk-full-cream", "Full-cream milk", "", 61, 3.2, 4.8, 3.3, "milk whole full fat long life fresh", 250, "ml"],
  ["milk-uht-full", "Full-cream long-life milk", "", 62, 3.2, 4.8, 3.4, "milk uht full fat whole", 250, "ml"],
  ["milk-uht-low", "Low-fat long-life milk", "", 46, 3.4, 4.9, 1.5, "milk uht 1.5 percent", 250, "ml"],
  ["milk-lactose-free", "Lactose-free full-cream milk", "", 61, 3.2, 4.8, 3.3, "milk whole", 250, "ml"],
  ["milk-almond-unsweetened", "Unsweetened almond milk", "", 15, 0.6, 0.3, 1.2, "milk plant dairy free", 250, "ml"],
  ["milk-oat-unsweetened", "Unsweetened oat milk", "", 43, 1, 6.7, 1.5, "milk plant dairy free", 250, "ml"],
  ["cottage-cheese", "Low-fat cottage cheese", "", 82, 12, 3.4, 2.3, "cottage cheese", 100],
  ["cottage-cheese-full", "Full-fat cottage cheese", "", 98, 11.1, 3.4, 4.3, "cottage cheese", 100],
  ["cheddar", "Cheddar cheese", "", 403, 25, 1.3, 33, "cheese mature mild", 30],
  ["mozzarella", "Mozzarella cheese", "", 280, 28, 3.1, 17, "cheese", 30],
  ["feta", "Feta cheese", "", 264, 14, 4.1, 21, "cheese", 30],
  ["mayonnaise", "Regular mayonnaise", "", 680, 1, 1, 75, "mayo dressing", 15],
  ["mayonnaise-light", "Light mayonnaise", "", 330, 1, 7, 33, "mayo low fat dressing", 15],
  ["coffee-black", "Black coffee, no sugar", "", 1, 0.1, 0, 0, "coffee americano filter espresso", 250, "ml"],
  ["americano", "Americano, no milk or sugar", "", 2, 0.1, 0.3, 0, "coffee black", 250, "ml"],
  ["cappuccino-full", "Cappuccino with full-cream milk", "", 48, 2.6, 4, 2.4, "coffee cappucino full fat whole milk", 250, "ml"],
  ["cappuccino-low", "Cappuccino with low-fat milk", "", 36, 2.7, 4.1, 1, "coffee cappucino skinny", 250, "ml"],
  ["cappuccino-skim", "Cappuccino with fat-free milk", "", 30, 2.8, 4.2, 0.2, "coffee cappucino skim skinny", 250, "ml"],
  ["latte-full", "Caffè latte with full-cream milk", "", 58, 3, 4.8, 2.9, "coffee cafe latte full fat whole milk", 300, "ml"],
  ["latte-low", "Caffè latte with low-fat milk", "", 44, 3.1, 4.9, 1.3, "coffee cafe latte skinny", 300, "ml"],
  ["flat-white-full", "Flat white with full-cream milk", "", 61, 3.2, 4.8, 3.2, "coffee milk", 250, "ml"],
  ["mocha", "Caffè mocha with full-cream milk", "", 86, 3.2, 12, 3, "coffee chocolate mocha latte", 300, "ml"],
  ["iced-coffee", "Sweetened iced coffee", "", 72, 2.4, 11, 2.1, "coffee cold milk drink", 300, "ml"],
  ["cola-regular", "Regular cola cooldrink", "", 42, 0, 10.6, 0, "coke coca cola soda fizzy drink soft drink", 330, "ml"],
  ["cola-zero", "Cola no sugar / zero", "", 0.2, 0, 0, 0, "coke coca cola diet cooldrink soda fizzy drink soft drink", 330, "ml"],
  ["lemonade-regular", "Regular lemonade cooldrink", "", 40, 0, 10, 0, "sprite lemon soda fizzy drink soft drink", 330, "ml"],
  ["lemonade-zero", "Sugar-free lemonade cooldrink", "", 0.5, 0, 0.1, 0, "sprite zero diet lemon soda fizzy drink soft drink", 330, "ml"],
  ["cream-soda", "Cream soda cooldrink", "", 44, 0, 11, 0, "soda fizzy drink soft drink", 330, "ml"],
  ["orange-soda", "Orange cooldrink", "", 43, 0, 10.8, 0, "fanta orange soda fizzy drink soft drink", 330, "ml"],
  ["grape-soda", "Grape cooldrink", "", 44, 0, 11, 0, "sparletta grape soda fizzy drink soft drink", 330, "ml"],
  ["tonic-water", "Tonic water, regular", "", 34, 0, 8.5, 0, "cooldrink mixer soda soft drink", 200, "ml"],
  ["energy-drink", "Regular energy drink", "", 45, 0.4, 10.8, 0, "red bull monster switch cooldrink", 250, "ml"],
  ["energy-drink-zero", "Sugar-free energy drink", "", 3, 0.4, 0.3, 0, "red bull monster switch zero diet cooldrink", 250, "ml"],
  ["fruit-juice", "100% fruit juice", "", 45, 0.5, 10.5, 0.1, "orange apple grape juice drink", 250, "ml"],
  ["milk-chocolate", "Milk chocolate", "", 535, 7.6, 59, 30, "chocolate slab sweet sweets cadbury beacon", 25],
  ["dark-chocolate", "Dark chocolate", "", 598, 7.8, 46, 43, "chocolate slab sweet sweets", 20],
  ["jelly-sweets", "Jelly sweets / gummies", "", 340, 5, 79, 0.2, "sweet sweets candy gummy bears", 30],
  ["wine-gums", "Wine gums", "", 330, 4, 78, 0.2, "sweet sweets candy gummies", 30],
  ["hard-sweets", "Hard-boiled sweets", "", 390, 0, 98, 0, "sweet sweets candy sucker lollipop", 20],
  ["marshmallows", "Marshmallows", "", 318, 1.8, 81, 0.2, "sweet sweets candy", 30],
  ["toffee", "Toffee / caramel sweets", "", 410, 2.5, 77, 10, "sweet sweets candy", 25],
  ["biscuits-tea", "Plain tea biscuits", "", 445, 7, 72, 14, "biscuit cookies marie tennis", 25],
  ["biscuits-chocolate", "Chocolate biscuits", "", 500, 6, 65, 24, "biscuit cookies oreo romany creams sweet", 30],
  ["ice-cream", "Vanilla ice cream", "", 207, 3.5, 24, 11, "dessert sweet", 100],
  ["crisps-salted", "Salted potato chips / crisps", "", 536, 6.5, 53, 33, "chips simba lays snack", 30],
  ["crisps-flavoured", "Flavoured potato chips / crisps", "", 530, 6, 54, 32, "chips simba lays salt vinegar cheese onion snack", 30],
  ["corn-chips", "Corn chips / nacho chips", "", 500, 7, 58, 27, "doritos tortilla chips snack", 30],
  ["maize-snack", "Cheese-flavoured maize snack", "", 520, 6, 56, 30, "niknaks cheetos chips snack", 30],
  ["popcorn-air", "Air-popped popcorn", "", 387, 13, 78, 4.5, "popcorn snack no oil", 20],
  ["popcorn-oil", "Popcorn prepared with oil", "", 480, 9, 55, 25, "popcorn cinema microwave snack", 30],
  ["rusk-buttermilk", "Buttermilk rusk", "", 430, 8, 67, 14, "rusks ouma beskuit biscuit", 35],
  ["rusk-muesli", "Muesli rusk", "", 420, 9, 64, 14, "rusks ouma beskuit", 40],
  ["rusk-bran", "Bran rusk", "", 405, 10, 63, 13, "rusks ouma beskuit wholewheat", 35],
  ["cookie-choc-chip", "Chocolate-chip cookie", "", 488, 6, 65, 23, "cookies biscuit biscuits bakers", 30],
  ["cookie-oat", "Oat cookie", "", 450, 7, 66, 18, "cookies biscuit biscuits", 30],
  ["cookie-ginger", "Ginger biscuit", "", 455, 6, 75, 15, "cookies biscuit biscuits ginger nuts bakers", 25],
  ["cookie-butter", "Butter cookie / shortbread", "", 500, 6, 62, 26, "cookies biscuit biscuits bakers", 25],
  ["cracker-cream", "Cream crackers", "", 440, 9, 68, 15, "biscuits savoury snack bakers", 25],
  ["cracker-wholewheat", "Wholewheat crackers", "", 420, 10, 65, 14, "biscuits savoury snack", 25],
  ["ham-lean", "Lean ham", "", 145, 21, 2, 5.5, "pork cold meat sandwich", 50],
  ["ham-smoked", "Smoked ham", "", 160, 20, 2, 7.5, "pork cold meat sandwich", 50],
  ["bacon-back", "Back bacon, cooked", "", 250, 29, 1, 14, "pork breakfast meat", 50],
  ["bacon-streaky", "Streaky bacon, cooked", "", 470, 29, 1, 39, "pork breakfast meat", 40],
  ["polony", "Polony", "", 260, 11, 4, 22, "cold meat sandwich processed meat", 50],
  ["vienna", "Vienna sausage", "", 290, 12, 3, 25, "hot dog processed meat", 50],
  ["boerewors", "Boerewors, cooked", "", 310, 18, 2, 26, "wors sausage braai meat", 100],
  ["droewors", "Droëwors", "", 460, 35, 3, 34, "dry wors biltong snack meat", 40],
  ["beef-rump", "Beef rump steak, cooked", "", 250, 27, 0, 16, "steak braai meat", 150],
  ["beef-sirloin", "Beef sirloin steak, cooked", "", 242, 27, 0, 15, "steak braai meat", 150],
  ["beef-fillet", "Beef fillet steak, cooked", "", 218, 29, 0, 11, "steak tenderloin meat", 150],
  ["pork-chop", "Pork chop, cooked", "", 240, 27, 0, 14, "pork meat braai", 150],
  ["lamb-chop", "Lamb chop, cooked", "", 280, 25, 0, 20, "lamb meat braai", 120],
  ["hake-grilled", "Hake, grilled", "", 115, 24, 0, 2, "fish seafood", 150],
  ["hake-battered", "Hake, battered and fried", "", 220, 15, 19, 10, "fish seafood takeaway", 180],
  ["chicken-schnitzel", "Chicken schnitzel, crumbed", "", 230, 20, 15, 10, "chicken crumbed meat", 150],
  ["cheese-roll", "Cheese roll", "", 330, 13, 40, 13, "bread roll sandwich bakery", 100],
  ["ham-cheese-roll", "Ham and cheese roll", "", 285, 17, 34, 9, "bread roll sandwich lunch", 150],
  ["chicken-mayo-roll", "Chicken mayonnaise roll", "", 275, 16, 31, 10, "bread roll sandwich lunch", 180],
  ["sausage-roll", "Sausage roll", "", 360, 11, 29, 23, "pastry bakery snack pie", 100],
  ["steak-pie", "Steak pie", "", 295, 11, 27, 16, "beef pastry bakery takeaway", 180],
  ["chicken-pie", "Chicken pie", "", 270, 11, 28, 13, "pastry bakery takeaway", 180],
  ["burger-beef", "Beef burger with bun and salad", "", 240, 13, 24, 10, "hamburger takeaway restaurant", 220],
  ["cheeseburger", "Cheeseburger", "", 265, 14, 23, 13, "beef hamburger takeaway restaurant", 220],
  ["burger-chicken-grilled", "Grilled chicken burger", "", 210, 16, 24, 6, "hamburger takeaway restaurant", 220],
  ["burger-chicken-crispy", "Crispy chicken burger", "", 270, 14, 25, 13, "fried hamburger takeaway restaurant", 230],
  ["burger-double", "Double beef cheeseburger", "", 285, 18, 17, 17, "hamburger takeaway restaurant", 300],
  ["fries", "French fries / slap chips", "", 310, 3.5, 41, 15, "takeaway potato chips restaurant", 120],
  ["pizza-margherita", "Margherita pizza", "", 245, 11, 32, 8, "pizza cheese tomato takeaway restaurant slice", 120],
  ["pizza-hawaiian", "Hawaiian ham and pineapple pizza", "", 250, 12, 32, 8, "pizza takeaway restaurant slice", 125],
  ["pizza-pepperoni", "Pepperoni pizza", "", 290, 13, 31, 13, "pizza salami takeaway restaurant slice", 125],
  ["pizza-chicken", "Chicken pizza", "", 255, 14, 30, 9, "pizza takeaway restaurant slice", 125],
  ["pizza-vegetarian", "Vegetarian pizza", "", 225, 10, 32, 6.5, "pizza vegetable takeaway restaurant slice", 125],
  ["pizza-cheese-ham", "Ham and cheese pizza", "", 270, 14, 31, 10, "pizza takeaway restaurant slice", 125],
  ["broccoli", "Broccoli, cooked", "", 35, 2.4, 7.2, 0.4, "broccoli vegetable vegetables", 100],
  ["mixed-salad", "Mixed salad vegetables", "", 25, 1.2, 5, 0.2, "salad mixed salad lettuce cucumber tomato vegetables", 200],
  ["baby-potatoes", "Baby potatoes, cooked", "", 87, 1.9, 20.1, 0.1, "baby potato potatoes", 150],
].map(([id, name, brand, cal, protein, carb, fat, aliases = "", defaultQty = 100, unit = "g"]) => ({ id, name, brand, cal, protein, carb, fat, aliases, defaultQty, unit, measures: servingMeasures(name, unit) }));

const number = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value) * 10) / 10 : 0;

function normaliseProduct(product) {
  const nutrients = product?.nutriments || {};
  const brand = String(product?.brands || "").split(",")[0].trim();
  const englishName = String(product?.product_name_en || "").trim();
  const originalName = String(product?.product_name || "").trim();
  const language = String(product?.lang || "").toLowerCase();
  const name = englishName || ((!language || language === "en") ? originalName : (brand ? `${brand} product` : "South African product"));
  if (!name) return null;
  const cal = number(nutrients["energy-kcal_100g"] ?? nutrients["energy-kcal"]);
  if (!cal) return null;
  return {
    id: String(product.code || `${name}-${product.brands || ""}`),
    name,
    brand,
    cal,
    protein: number(nutrients.proteins_100g),
    carb: number(nutrients.carbohydrates_100g),
    fat: number(nutrients.fat_100g),
    unit: "g",
    measures: servingMeasures(name, "g"),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  try {
    const barcode = String(req.query?.barcode || "").replace(/\D/g, "");
    if (barcode) {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`, {
        headers: { "User-Agent": "NewYouFitness/1.0 (newyoufitness.co.za)" },
        signal: AbortSignal.timeout(8000),
      });
      const data = await response.json();
      const product = data.status === 1 ? normaliseProduct(data.product) : null;
      return product ? res.status(200).json({ product }) : res.status(404).json({ error: "Product not found" });
    }

    const query = String(req.query?.q || "").trim();
    const includeBrands = String(req.query?.more || "") === "1";
    if (query.length < 2) return res.status(400).json({ error: "Enter at least two characters" });
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const local = COMMON_FOODS.filter((item) => words.every((word) => `${item.name} ${item.brand} ${item.aliases || ""}`.toLowerCase().includes(word)));
    if (local.length && !includeBrands) return res.status(200).json({ results: local.slice(0, 12), hasMore: true });
    let remote = [];
    try {
      const params = new URLSearchParams({
        search_terms: query,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "15",
        fields: "code,product_name,product_name_en,brands,nutriments,lang,countries_tags",
        lc: "en",
        cc: "za",
        tagtype_0: "countries",
        tag_contains_0: "contains",
        tag_0: "south-africa",
      });
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, {
        headers: { "User-Agent": "NewYouFitness/1.0 (newyoufitness.co.za)" },
        signal: AbortSignal.timeout(8000),
      });
      const data = await response.json();
      remote = (data.products || []).map(normaliseProduct).filter(Boolean);
    } catch {
      // The built-in common-food list still makes manual search useful offline.
    }
    const seen = new Set();
    const results = [...local, ...remote].filter((item) => {
      const key = `${item.name}-${item.brand}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Food search error", error);
    return res.status(500).json({ error: "Food search is temporarily unavailable" });
  }
}
