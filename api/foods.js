const COMMON_FOODS = [
  ["chicken-breast", "Chicken breast, cooked", "", 165, 31, 0, 3.6],
  ["lean-beef-mince", "Lean beef mince, cooked", "", 215, 26, 0, 12],
  ["egg", "Whole egg", "", 143, 12.6, 0.7, 9.5, "egg eggs boiled egg fried egg", 50],
  ["scrambled-eggs", "Scrambled eggs", "", 148, 10, 1.5, 11, "scrambled egg eggs", 150],
  ["egg-white", "Egg white, cooked", "", 52, 11, 0.7, 0.2],
  ["tuna-water", "Tuna in water, drained", "", 116, 26, 0, 0.8],
  ["salmon", "Salmon, cooked", "", 206, 22, 0, 12],
  ["biltong", "Beef biltong", "", 250, 50, 3, 5],
  ["yoghurt-fat-free", "Plain fat-free yoghurt", "", 56, 5.7, 7.7, 0.2],
  ["greek-yoghurt", "Plain Greek yoghurt, low fat", "", 73, 9.9, 3.9, 1.9],
  ["whey", "Whey protein powder", "", 400, 80, 8, 6],
  ["oats", "Rolled oats, dry", "", 379, 13.2, 67.7, 6.5],
  ["rice", "White rice, cooked", "", 130, 2.7, 28.2, 0.3],
  ["potato", "Potato, cooked", "", 87, 1.9, 20.1, 0.1],
  ["sweet-potato", "Sweet potato, cooked", "", 90, 2, 20.7, 0.2],
  ["bread", "Whole-wheat bread", "", 247, 13, 41, 3.4],
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
  ["olive-oil", "Olive oil", "", 884, 0, 0, 100],
  ["milk-low-fat", "Low-fat milk", "", 46, 3.4, 4.9, 1.5, "milk low fat milk", 250],
  ["cottage-cheese", "Low-fat cottage cheese", "", 82, 12, 3.4, 2.3, "cottage cheese", 100],
  ["broccoli", "Broccoli, cooked", "", 35, 2.4, 7.2, 0.4, "broccoli vegetable vegetables", 100],
  ["mixed-salad", "Mixed salad vegetables", "", 25, 1.2, 5, 0.2, "salad mixed salad lettuce cucumber tomato vegetables", 200],
  ["baby-potatoes", "Baby potatoes, cooked", "", 87, 1.9, 20.1, 0.1, "baby potato potatoes", 150],
].map(([id, name, brand, cal, protein, carb, fat, aliases = "", defaultQty = 100]) => ({ id, name, brand, cal, protein, carb, fat, aliases, defaultQty, unit: "g" }));

const number = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value) * 10) / 10 : 0;

function normaliseProduct(product) {
  const nutrients = product?.nutriments || {};
  const name = String(product?.product_name || "").trim();
  if (!name) return null;
  const cal = number(nutrients["energy-kcal_100g"] ?? nutrients["energy-kcal"]);
  if (!cal) return null;
  return {
    id: String(product.code || `${name}-${product.brands || ""}`),
    name,
    brand: String(product.brands || "").split(",")[0].trim(),
    cal,
    protein: number(nutrients.proteins_100g),
    carb: number(nutrients.carbohydrates_100g),
    fat: number(nutrients.fat_100g),
    unit: "g",
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
    if (query.length < 2) return res.status(400).json({ error: "Enter at least two characters" });
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const local = COMMON_FOODS.filter((item) => words.every((word) => `${item.name} ${item.brand} ${item.aliases || ""}`.toLowerCase().includes(word)));
    if (local.length) return res.status(200).json({ results: local.slice(0, 12) });
    let remote = [];
    try {
      const params = new URLSearchParams({
        search_terms: query,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "15",
        fields: "code,product_name,brands,nutriments",
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
