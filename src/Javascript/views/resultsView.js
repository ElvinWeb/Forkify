import View from "./view.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  // Cache DOM queries in constructor for better performance
  constructor() {
    super();
    this._parentElement = document.querySelector(".search-results__list");
    this._countElement = document.querySelector(".count__number"); 
    this._minuteFilterBtn = document.querySelector(".sorting__button--min");
  }

  // Define static messages to avoid creating new strings
  static ERROR_MESSAGE = "No recipes found for your query! Please try again";
  static SUCCESS_MESSAGE = "";

  get _errorMessage() {
    return ResultsView.ERROR_MESSAGE;
  }

  get _message() {
    return ResultsView.SUCCESS_MESSAGE;
  }

  _generateMarkup() {
    // Use more efficient array method
    return this._data.reduce((markup, result) => 
      markup + previewView.render(result, false), 
    "");
  }
}

export default new ResultsView();
