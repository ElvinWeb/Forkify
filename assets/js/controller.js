import * as model from "./model.js";
import recipeView from "./views/recipeview.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;

    recipeView.renderSpinner();

    await model.loadRecipe(hashId);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.state.search.results);
  } catch (err) {
    alert(err);
  }
};

const init = function () {
  recipeView.addHandlerHelper(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
