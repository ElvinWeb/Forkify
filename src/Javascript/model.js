import {
  RES_PER_PAGE,
  API_URLS,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
  SERVINGS_TO_UPLOAD,
} from "./config.js";
import {
  AJAX,
  formatIngredientsArr,
  getTotalNutrientAmount,
} from "./helpers.js";

// State management
const initialState = {
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

let state = { ...initialState };

// Recipe handling
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

const getNutritionalInfo = async function (ingredients, servings) {
  const ingredientList = ingredients
    .map((ing) => `${ing.quantity ?? ""} ${ing.unit ?? ""} ${ing.description}`)
    .join("\n");

  const ingredientsData = await AJAX(
    `${SPOONACULAR_API_URL}?apiKey=${SPOONACULAR_API_KEY}`,
    {
      ingredientList,
      servings,
      includeNutrition: true,
    },
    "application/x-www-form-urlencoded"
  );

  const nutrients = {
    calories: getTotalNutrientAmount(ingredientsData, "calories"),
    carbs: getTotalNutrientAmount(ingredientsData, "carbohydrates"),
    proteins: getTotalNutrientAmount(ingredientsData, "protein"),
    fats: getTotalNutrientAmount(ingredientsData, "fat"),
  };

  return Object.fromEntries(
    Object.entries(nutrients).map(([key, value]) => [
      key,
      Math.floor(value / servings),
    ])
  );
};

const loadRecipe = async function (id) {
  try {
    const data = await AJAX(API_URLS.recipes(id));
    state.recipe = createRecipeObject(data);
    state.recipe.bookmarked = state.bookmarks.some(
      (bookmark) => bookmark.id === id
    );

    const nutritionalInfo = await getNutritionalInfo(
      state.recipe.ingredients,
      state.recipe.servings
    );
    Object.assign(state.recipe, nutritionalInfo);
  } catch (err) {
    throw err;
  }
};

// Search functionality
const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(API_URLS.search(query));

    const { recipes } = data.data;
    state.search.results = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));
    state.search.page = 1;
  } catch (err) {
    console.error("Error loading search results:", err);
    throw err;
  }
};

const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// Recipe modifications
const updateServings = function (newServings) {
  const ratio = newServings / state.recipe.servings;
  state.recipe.ingredients.forEach(
    (ingredient) =>
      (ingredient.quantity = ingredient.quantity
        ? ingredient.quantity * ratio
        : null)
  );
  state.recipe.servings = newServings;
};

// Bookmark management
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (index !== -1) {
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
  }
};

// Recipe upload
const uploadRecipe = async function (newRecipe) {
  try {
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image.name,
      publisher: newRecipe.publisher,
      total_time: Number(newRecipe.totalTime),
      servings: SERVINGS_TO_UPLOAD,
      ingredients: formatIngredientsArr(newRecipe),
    };

    const data = await AJAX(API_URLS.data, recipe, "application/json");
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// Initialization
const init = function () {
  state.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
};

init();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
};
