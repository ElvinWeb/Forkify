const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
const API_KEY = "a3a17dd3-d5ba-4a69-b796-e2ac3fa11dcb";
const SPOONACULAR_API_URL = `https://api.spoonacular.com/recipes/parseIngredients`;
const SPOONACULAR_API_KEY = "622843b5344a4effbf4516c17ed810f3";
const TIMEOUT_SEC = 10;
const FADE_ANIMATION_SEC = 2500;
const RES_PER_PAGE = 15;
const MODAL_CLOSE_SEC = 2000;
const SERVINGS_TO_UPLOAD = 4;
const FORBIDDEN_PATTERN = /[\d,;!@#$%^&*()_+\=\[\]{}|\\:";'<>?,./]/;
const API_URLS = {
  recipes(id) {
    return `${API_URL}/${id}?key=${API_KEY}`;
  },
  search(searchValue) {
    return `${API_URL}?search=${searchValue}&key=${API_KEY}`;
  },
  data: `${API_URL}?key=${API_KEY}`,
};

export {
  API_KEY,
  SPOONACULAR_API_URL,
  TIMEOUT_SEC,
  FADE_ANIMATION_SEC,
  SPOONACULAR_API_KEY,
  RES_PER_PAGE,
  MODAL_CLOSE_SEC,
  API_URL,
  API_URLS,
  FORBIDDEN_PATTERN,
  SERVINGS_TO_UPLOAD,
};
