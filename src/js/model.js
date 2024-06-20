import {
  API_URL,
  RES_PER_PAGE,
  API_KEY,
  BASE_API_URL,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "./config.js";
import { AJAX, getTotalNutrientAmount } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  ingredientList: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    const ingredientList = state.recipe.ingredients
      .map(
        (ing) => `${ing.quantity ?? ""} ${ing.unit ?? ""} ${ing.description}`
      )
      .join("\n");

    const ingredientsData = await AJAX(
      `${SPOONACULAR_API_URL}?apiKey=${SPOONACULAR_API_KEY}`,
      {
        ingredientList: ingredientList,
        servings: state.recipe.servings,
        includeNutrition: true,
      },
      "application/x-www-form-urlencoded"
    );

    const calories = getTotalNutrientAmount(ingredientsData, "calories");
    const carbs = getTotalNutrientAmount(ingredientsData, "carbohydrates");
    const proteins = getTotalNutrientAmount(ingredientsData, "protein");
    const fats = getTotalNutrientAmount(ingredientsData, "fat");

    state.recipe.calories = Math.floor(calories / state.recipe.servings);
    state.recipe.carbs = Math.floor(carbs / state.recipe.servings);
    state.recipe.proteins = Math.floor(proteins / state.recipe.servings);
    state.recipe.fats = Math.floor(fats / state.recipe.servings);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log(data);

    const { recipes } = data.data;

    state.search.results = recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
export const filterIngredients = function () {
  state.recipe.ingredients.reduce((acc, cur) => acc + cur, 0);
};
export const filterMinutes = function () {};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ingredient) => {
        const ingredientArr = ingredient[1].split(",").map((ing) => ing.trim());
        if (ingredientArr.length !== 3) {
          throw new Error("Invalid ingredient format");
        }
        const [quantity, unit, description] = ingredientArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
