import { TIMEOUT_SEC } from "./config.js";

const timeout = (s) =>
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Request took too long! Timeout after ${s} second`)),
      s * 1000
    )
  );

const AJAX = async (url, uploadData = undefined, contentType = undefined) => {
  try {
    const fetchOptions = uploadData
      ? {
          method: "POST",
          headers: { "Content-Type": contentType },
          body:
            contentType === "application/json"
              ? JSON.stringify(uploadData)
              : new URLSearchParams(uploadData),
        }
      : undefined;

    const res = await Promise.race([
      fetch(url, fetchOptions),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const getTotalNutrientAmount = (ingredientsArr, nutrient) => {
  const capitalizedNutrient = nutrient[0].toUpperCase() + nutrient.slice(1);
  return ingredientsArr.reduce((total, ing) => {
    const nutrientAmount =
      ing.nutrition?.nutrients.find((n) => n.name === capitalizedNutrient)
        ?.amount ?? 0;
    return total + nutrientAmount;
  }, 0);
};

const formatIngredientsArr = (newRecipe) => {
  const ingredients = [];
  const ingredientEntries = Object.entries(newRecipe).filter((entry) =>
    entry[0].startsWith("ingredient")
  );

  const groupedIngredients = ingredientEntries.reduce((acc, [key, value]) => {
    const [index, type] = key.split("-").slice(-2);
    const ingredientIndex = +index - 1;
    
    if (!acc[ingredientIndex]) {
      acc[ingredientIndex] = {};
    }
    acc[ingredientIndex][type] = value;
    return acc;
  }, []);

  for (const ing of groupedIngredients) {
    if (!ing || (!ing.quantity && !ing.unit && !ing.description)) break;
    
    ingredients.push({
      quantity: ing.quantity ? +ing.quantity : null,
      unit: ing.unit || "",
      description: ing.description || "",
    });
  }

  return ingredients;
};

export { AJAX, getTotalNutrientAmount, formatIngredientsArr };
