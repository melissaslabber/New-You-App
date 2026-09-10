const RESTAURANT_FOODS = [
  // McDonald's South Africa — current menu nutrition pages; values are per listed item/meal.
  { id: "mcd-big-mac", brand: "McDonald's", name: "Big Mac", category: "Burgers", cal: 543, protein: 27, carb: 46.8, fat: 26.7, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd big mac beef burger" },
  { id: "mcd-mcfeast", brand: "McDonald's", name: "McFeast", category: "Burgers", cal: 846, protein: 50.7, carb: 44.8, fat: 52.7, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd mc feast beef burger" },
  { id: "mcd-chicken-burger", brand: "McDonald's", name: "Chicken Burger", category: "Burgers", cal: 284, protein: 12.6, carb: 27.1, fat: 10.8, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd chicken burger" },
  { id: "mcd-quarter-pounder-cheese", brand: "McDonald's", name: "Quarter Pounder with Cheese", category: "Burgers", cal: 440, protein: 26.1, carb: 37.2, fat: 19.9, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd quarter pounder qpc cheese beef burger" },
  { id: "mcd-quarter-pounder-deluxe", brand: "McDonald's", name: "Quarter Pounder with Cheese Deluxe", category: "Burgers", cal: 474, protein: 25.8, carb: 38.6, fat: 23, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd qpc deluxe quarter pounder cheese" },
  { id: "mcd-veggie-burger", brand: "McDonald's", name: "Veggie Burger", category: "Burgers", cal: 369, protein: 9.7, carb: 37.7, fat: 12.4, servingLabel: "1 burger", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd vegetarian veggie burger" },
  { id: "mcd-big-mac-meal", brand: "McDonald's", name: "Big Mac Meal", category: "Meals", cal: 1024, protein: 34.4, carb: 104.7, fat: 50.1, servingLabel: "1 meal", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd big mac meal fries drink" },
  { id: "mcd-quarter-pounder-meal", brand: "McDonald's", name: "Quarter Pounder with Cheese Meal", category: "Meals", cal: 928, protein: 34, carb: 95.7, fat: 43.4, servingLabel: "1 meal", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd qpc quarter pounder meal fries drink" },
  { id: "mcd-chicken-big-mac", brand: "McDonald's", name: "Chicken Big Mac", category: "Burgers", cal: 989, protein: 33.7, carb: 74.5, fat: 47.7, servingLabel: "1 listed item", source: "McDonald's South Africa", verified: true, aliases: "mcdonalds mcd chicken big mac" },

  // KFC South Africa — energy cross-checked against KFC SA's current nutrition listing.
  // Macros are from South African nutrition database listings for the corresponding menu items.
  { id: "kfc-zinger", brand: "KFC", name: "Zinger Burger", category: "Burgers", cal: 473, protein: 33.8, carb: 33, fat: 21.9, servingLabel: "1 burger", source: "KFC South Africa / SA nutrition listing", verified: true, aliases: "kfc new zinger hot spicy chicken burger" },
  { id: "kfc-crunch", brand: "KFC", name: "Crunch Burger", category: "Burgers", cal: 390, protein: 18.1, carb: 26.9, fat: 22.9, servingLabel: "1 burger", source: "KFC South Africa / SA nutrition listing", verified: true, aliases: "kfc crunch chicken burger" },
  { id: "kfc-streetwise-2-chips", brand: "KFC", name: "Streetwise 2 with Chips", category: "Streetwise", cal: 510, protein: 28.8, carb: 36, fat: 26.4, servingLabel: "1 meal", source: "KFC South Africa / SA nutrition listing", verified: true, aliases: "kfc streetwise two 2 chicken chips fries meal" },
  { id: "kfc-streetwise-2-pap", brand: "KFC", name: "Streetwise 2 with Pap", category: "Streetwise", cal: 578, protein: 31.8, carb: 57, fat: 23.3, servingLabel: "1 meal", source: "KFC South Africa / SA nutrition listing", verified: true, aliases: "kfc streetwise two 2 chicken pap meal" },
  { id: "kfc-small-chips", brand: "KFC", name: "Small Chips", category: "Sides", cal: 194, protein: 3.6, carb: 21, fat: 9.7, servingLabel: "1 small serving", source: "SA nutrition listing", verified: false, aliases: "kfc small chips fries" },
  { id: "kfc-regular-chips", brand: "KFC", name: "Regular Chips", category: "Sides", cal: 334, protein: 4.1, carb: 41.5, fat: 16.2, servingLabel: "1 regular serving", source: "SA nutrition listing", verified: false, aliases: "kfc regular chips fries" },

  // Steers — serving-based items kept separate from grocery/per-100g foods.
  { id: "steers-king", brand: "Steers", name: "King Steer Burger", category: "Burgers", cal: 461, protein: 24.3, carb: 33.8, fat: 26.3, servingLabel: "1 serving", source: "SA nutrition listing", verified: false, aliases: "steers king steer burger beef flame grilled" },
  { id: "steers-burger", brand: "Steers", name: "Steers Beef Burger", category: "Burgers", cal: 360, protein: 25.1, carb: 27, fat: 16.8, servingLabel: "1 burger", source: "SA nutrition listing", verified: false, aliases: "steers original beef burger flame grilled" },
  { id: "steers-spicy-king-beef", brand: "Steers", name: "Spicy King Burger Beef", category: "Burgers", cal: 714, protein: 46.7, carb: 40, fat: 42.1, servingLabel: "1 burger", source: "SA nutrition listing", verified: false, aliases: "steers spicy king beef burger" },
  { id: "steers-spicy-king-chicken", brand: "Steers", name: "Spicy King Burger Chicken", category: "Burgers", cal: 614, protein: 62.9, carb: 40, fat: 17.5, servingLabel: "1 burger", source: "SA nutrition listing", verified: false, aliases: "steers spicy king chicken burger" },

  // Pizza values are estimates for one standard slice; recipes and sizes differ by outlet and crust.
  { id: "debonairs-margherita", brand: "Debonairs Pizza", name: "Margherita", category: "Pizza", cal: 245, protein: 11, carb: 32, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs pizza cheese tomato" },
  { id: "debonairs-hawaiian", brand: "Debonairs Pizza", name: "Hawaiian", category: "Pizza", cal: 250, protein: 12, carb: 32, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs pizza ham pineapple" },
  { id: "debonairs-chicken-mushroom", brand: "Debonairs Pizza", name: "Chicken & Mushroom", category: "Pizza", cal: 255, protein: 14, carb: 30, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs chicken mushroom pizza" },
  { id: "debonairs-something-meaty", brand: "Debonairs Pizza", name: "Something Meaty", category: "Pizza", cal: 310, protein: 15, carb: 29, fat: 15, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs meaty meat beef ham pepperoni pizza" },
  { id: "debonairs-triple-decker", brand: "Debonairs Pizza", name: "Triple-Decker", category: "Pizza", cal: 390, protein: 18, carb: 39, fat: 18, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs triple decker layered pizza" },
  { id: "debonairs-bbq-chicken", brand: "Debonairs Pizza", name: "BBQ Chicken", category: "Pizza", cal: 265, protein: 14, carb: 33, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "debonairs barbecue chicken pizza" },

  { id: "romans-margherita", brand: "Roman's Pizza", name: "Margherita", category: "Pizza", cal: 250, protein: 11, carb: 33, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman pizza cheese tomato" },
  { id: "romans-hawaiian", brand: "Roman's Pizza", name: "Hawaiian", category: "Pizza", cal: 260, protein: 12, carb: 33, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman pizza ham pineapple" },
  { id: "romans-regina", brand: "Roman's Pizza", name: "Regina", category: "Pizza", cal: 265, protein: 13, carb: 31, fat: 10, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman pizza ham mushroom" },
  { id: "romans-pepperoni", brand: "Roman's Pizza", name: "Pepperoni", category: "Pizza", cal: 300, protein: 13, carb: 32, fat: 14, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman salami pizza" },
  { id: "romans-bbq-chicken", brand: "Roman's Pizza", name: "BBQ Chicken", category: "Pizza", cal: 270, protein: 14, carb: 33, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman barbecue chicken pizza" },
  { id: "romans-bacon-supreme", brand: "Roman's Pizza", name: "Bacon Supreme", category: "Pizza", cal: 315, protein: 15, carb: 30, fat: 15, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "romans roman bacon pizza" },

  { id: "pizza-perfect-margherita", brand: "Pizza Perfect", name: "Margherita", category: "Pizza", cal: 245, protein: 11, carb: 32, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect cheese tomato" },
  { id: "pizza-perfect-regina", brand: "Pizza Perfect", name: "Regina", category: "Pizza", cal: 260, protein: 13, carb: 31, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect ham mushroom" },
  { id: "pizza-perfect-hawaiian", brand: "Pizza Perfect", name: "Hawaiian", category: "Pizza", cal: 255, protein: 12, carb: 33, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect ham pineapple" },
  { id: "pizza-perfect-pepperoni", brand: "Pizza Perfect", name: "Pepperoni", category: "Pizza", cal: 295, protein: 13, carb: 31, fat: 14, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect salami" },
  { id: "pizza-perfect-chicken-mayo", brand: "Pizza Perfect", name: "Chicken Mayo", category: "Pizza", cal: 285, protein: 14, carb: 30, fat: 12, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect chicken mayonnaise" },
  { id: "pizza-perfect-vegetarian", brand: "Pizza Perfect", name: "Vegetarian", category: "Pizza", cal: 230, protein: 10, carb: 32, fat: 7, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "pizza perfect veggie vegetable" },

  { id: "colcacchio-margherita", brand: "Col'Cacchio", name: "Margherita", category: "Pizza", cal: 235, protein: 10, carb: 31, fat: 8, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio pizza cheese tomato" },
  { id: "colcacchio-regina", brand: "Col'Cacchio", name: "Regina", category: "Pizza", cal: 250, protein: 12, carb: 30, fat: 9, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio ham mushroom pizza" },
  { id: "colcacchio-four-cheese", brand: "Col'Cacchio", name: "Four Cheese", category: "Pizza", cal: 290, protein: 14, carb: 28, fat: 14, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio quattro formaggi pizza" },
  { id: "colcacchio-bacon-avo-feta", brand: "Col'Cacchio", name: "Bacon, Avo & Feta", category: "Pizza", cal: 285, protein: 12, carb: 28, fat: 14, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio avocado pizza" },
  { id: "colcacchio-vegetarian", brand: "Col'Cacchio", name: "Vegetarian", category: "Pizza", cal: 220, protein: 9, carb: 31, fat: 7, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio veggie vegetable pizza" },
  { id: "colcacchio-vegan", brand: "Col'Cacchio", name: "Vegan Vegetable", category: "Pizza", cal: 205, protein: 7, carb: 34, fat: 5, servingLabel: "1 standard slice (estimated)", source: "Estimated from a typical serving", verified: false, aliases: "colcacchio col cacchio dairy free plant pizza" },
];

const RESTAURANTS = ["Col'Cacchio", "Debonairs Pizza", "KFC", "McDonald's", "Pizza Perfect", "Roman's Pizza", "Steers"];

function score(item, words, query) {
  const haystack = `${item.brand} ${item.name} ${item.category} ${item.aliases || ""}`.toLowerCase();
  if (!words.every((word) => haystack.includes(word))) return -1;
  const brand = item.brand.toLowerCase();
  const name = item.name.toLowerCase();
  let value = 0;
  if (brand === query) value += 100;
  if (name === query) value += 90;
  if (name.startsWith(query)) value += 50;
  if (brand.startsWith(query)) value += 40;
  if (item.verified) value += 5;
  return value;
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const query = String(req.query?.q || "").trim().toLowerCase();
  if (!query) return res.status(200).json({ restaurants: RESTAURANTS, results: [] });

  const words = query.split(/\s+/).filter(Boolean);
  const results = RESTAURANT_FOODS
    .map((item) => ({ item, rank: score(item, words, query) }))
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => b.rank - a.rank || a.item.name.localeCompare(b.item.name))
    .slice(0, 30)
    .map(({ item }) => ({
      ...item,
      unit: "serving",
      defaultQty: 1,
      nutritionBasis: "serving",
      restaurant: true,
    }));

  return res.status(200).json({ restaurants: RESTAURANTS, results });
}
