import View from "./view.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".search-results__list");
  _countElement = document.querySelector(".count__number");
  _minuteFilterBtn = document.querySelector(".sorting__button--min");
  _errorMessage = "No recipes found for your query! Please try again";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
