import View from "./view.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _message = "Recipe was successfully uploaded :)";

  constructor() {
    super();
    this._initializeEventListeners();
  }

  _initializeEventListeners() {
    // Use arrow functions to preserve 'this' context without bind
    this._btnOpen.addEventListener("click", () => this.toggleWindow());
    this._btnClose.addEventListener("click", () => this.toggleWindow());
    this._overlay.addEventListener("click", () => this.toggleWindow());
  }

  toggleWindow() {
    // Toggle both elements with single operation
    [this._overlay, this._window].forEach(el => el.classList.toggle("hidden"));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function(e) {
      e.preventDefault();
      // Convert form data to object more directly
      const data = Object.fromEntries(new FormData(this));
      handler(data);
    });
  }
}

export default new AddRecipeView();
