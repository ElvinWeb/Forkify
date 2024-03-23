import * as model from "./model.js";
import recipeView from "./views/recipeview.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;

    recipeView.renderSpinner();

    await model.loadRecipe(hashId);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

["haschange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipes)
);
