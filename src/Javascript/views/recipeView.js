import icons from "../../img/icons.svg";
import View from "./view.js";
import fracty from "fracty";

class RecipeView extends View {
  // Cache DOM elements and static messages
  constructor() {
    super();
    this._parentElement = document.querySelector(".recipe");
    this._errorMessage = "We couldn't find that recipe. Please try again!";
    this._message = "";
  }

  _generateMarkup() {
    const {
      image,
      title,
      cookingTime,
      servings,
      key,
      bookmarked,
      calories,
      carbs,
      proteins,
      fats,
      ingredients,
      publisher,
      sourceUrl
    } = this._data;

    return `
    <figure class="recipe__fig">
          <img src=${image} alt="${title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${title}</span>
          </h1>
        </figure>

      <div class="recipe__details">
        <div class="recipe__data">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
            <span class="recipe__info-text">min</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${servings}</span>
            <span class="recipe__info-text recipe__info-user">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>  
            
        <div class="recipe__buttons">
          <div class="recipe__user-generated ${key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${bookmarked ? "-fill" : ""}"></use>
            </svg>
          </button>
        </div>
      </div>

        ${this._generateNutritionalData(calories, carbs, proteins, fats)}

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${ingredients.map(this._generateIngredients).join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateNutritionalData(calories, carbs, proteins, fats) {
    if (!(calories && carbs && proteins && fats)) return '';
    
    return `
      <div class="recipe__nutritional-data">  
        <h2 class="heading--2">Nutritions / serving</h2>
        <div class="recipe__nutrients">
          <div class="recipe__nutrient-field recipe__calories">
            <h3 class="heading--3">Calories</h3>
            <span class="recipe__nutrient-value">${calories} kcal</span>
          </div>
          <div class="recipe__nutrient-field recipe__carbs">
            <h3 class="heading--3">Carbs</h3>
            <span class="recipe__nutrient-value">${carbs} g</span>
          </div>
          <div class="recipe__nutrient-field recipe__proteins">
            <h3 class="heading--3">Proteins</h3>
            <span class="recipe__nutrient-value">${proteins} g</span>
          </div>
          <div class="recipe__nutrient-field recipe__fats">
            <h3 class="heading--3">Fats</h3>
            <span class="recipe__nutrient-value">${fats} g</span>
          </div>
        </div>
      </div>`;
  }

  addHandlerHelper(handler) {
    const events = ["hashchange", "load"];
    events.forEach(event => window.addEventListener(event, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener("click", e => {
      if (!e.target.closest(".btn--bookmark")) return;
      handler();
    });
  }

  _generateIngredients(ingredient) {
    const {quantity, unit, description} = ingredient;
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${quantity ? fracty(quantity).toString() : ""}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${unit}</span>
        ${description}
      </div>
    </li>`;
  }
}

export default new RecipeView();
