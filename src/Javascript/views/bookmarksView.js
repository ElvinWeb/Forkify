import View from "./view.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  // Cache DOM element in constructor for better performance
  constructor() {
    super();
    this._parentElement = document.querySelector(".bookmarks__list");
    this._errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
    this._message = "";
  }

  _generateMarkup() {
    // Use map with join for better performance than concatenation
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    // Use once:true option since we only need this once on load
    window.addEventListener("load", handler, { once: true });
  }
}

export default new BookmarksView();
