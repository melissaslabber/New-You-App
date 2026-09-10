import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Upgrade only the food-modal invocation at build time. This leaves the
// large, stable src/App.jsx source file untouched.
function unifiedFoodLogger() {
  return {
    name: "new-you-unified-food-logger",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith("/src/App.jsx") && !id.endsWith("\\src\\App.jsx")) return null;

      const oldModal = '{showFoodModal && <FoodModal onAdd={addFood} onAddAndContinue={addFoodAndContinue} onClose={() => setShowFoodModal(false)} recentFoods={foodLogs} savedMeals={savedMeals} onSaveMeal={saveMeal} />}';
      const newModal = '{showFoodModal && <UnifiedFoodModal onAdd={addFood} onAddAndContinue={addFoodAndContinue} onClose={() => setShowFoodModal(false)} recentFoods={foodLogs} savedMeals={savedMeals} onSaveMeal={saveMeal} />}';

      if (!code.includes(oldModal)) return null;

      let next = code.replace(oldModal, newModal);
      if (!next.includes('from "./UnifiedFoodModal.jsx"')) {
        next = `import UnifiedFoodModal from "./UnifiedFoodModal.jsx";\n${next}`;
      }
      return { code: next, map: null };
    },
  };
}

export default defineConfig({
  plugins: [unifiedFoodLogger(), react()],
});
