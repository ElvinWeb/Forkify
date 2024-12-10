import * as model from "./model.js";
import {
  MODAL_CLOSE_SEC,
  FORBIDDEN_PATTERN,
  FADE_ANIMATION_SEC,
} from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import introView from "./views/introView.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

const controlRecipes = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;

    recipeView.renderSpinner();
    
    // Batch updates together
    await Promise.all([
      model.loadRecipe(hashId),
      resultsView.update(model.getSearchResultsPage()),
      bookmarksView.update(model.state.bookmarks)
    ]);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error('Error loading recipe:', err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    
    if (FORBIDDEN_PATTERN.test(query)) {
      return resultsView.renderError("Your search query is not allowed!");
    }

    await model.loadSearchResults(query);
    
    // Batch render updates
    Promise.all([
      resultsView.render(model.getSearchResultsPage()),
      paginationView.render(model.state.search)
    ]);
  } catch (err) {
    console.error('Error searching recipes:', err);
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Batch render updates
  Promise.all([
    resultsView.render(model.getSearchResultsPage(goToPage)),
    paginationView.render(model.state.search)
  ]);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  const { recipe } = model.state;
  if (!recipe.bookmarked) {
    model.addBookmark(recipe);
  } else {
    model.deleteBookmark(recipe.id);
  }
  
  // Batch render updates
  Promise.all([
    recipeView.update(recipe),
    bookmarksView.render(model.state.bookmarks)
  ]);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    
    // Batch render updates
    await Promise.all([
      recipeView.render(model.state.recipe),
      bookmarksView.render(model.state.bookmarks)
    ]);

    addRecipeView.renderMessage();
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      setTimeout(() => {
        addRecipeView.toggleWindow();
        location.reload();
      }, MODAL_CLOSE_SEC);
    });
  } catch (err) {
    console.error('Error adding recipe:', err);
    addRecipeView.renderError(err);
  }
};

const controlIntroAnimation = function () {
  document.body.style.overflow = "hidden";
  introView.render(model.state.recipe);

  requestAnimationFrame(() => {
    setTimeout(() => {
      introView.addIntroAnimation();
      document.body.style.overflow = "initial";
    }, FADE_ANIMATION_SEC);
  });
};

const init = function () {
  // Initialize all event handlers
  const handlers = [
    [bookmarksView, 'addHandlerRender', controlBookmarks],
    [recipeView, 'addHandlerHelper', controlRecipes],
    [recipeView, 'addHandlerUpdateServings', controlServings], 
    [recipeView, 'addHandlerBookmark', controlAddBookmark],
    [searchView, 'addHandlerSearch', controlSearchResults],
    [paginationView, 'addHandlerClick', controlPagination],
    [addRecipeView, 'addHandlerUpload', controlAddRecipe],
    [introView, 'addHandlerIntro', controlIntroAnimation]
  ];

  handlers.forEach(([view, handler, controller]) => {
    view[handler](controller);
  });
};

init();
