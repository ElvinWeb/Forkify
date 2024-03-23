import * as model from "./model.js";
import recipeView from "./views/recipeview.js";
import "core-js/stable";
import "regenerator-runtime/runtime";



const controlRecipes = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;

    recipeView.renderSpinner();

    await model.loadRecipe(hashId);

    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

["haschange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipes)
);
