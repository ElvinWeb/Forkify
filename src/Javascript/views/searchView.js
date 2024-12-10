class SearchView {
  _parentElement = document.querySelector(".search");
  _searchField = this._parentElement?.querySelector(".search__field");

  getQuery() {
    if (!this._searchField) return '';
    const query = this._searchField.value.trim();
    this._clearInput();
    return query;
  }

  _clearInput() {
    if (this._searchField) {
      this._searchField.value = "";
    }
  }

  addHandlerSearch(handler) {
    this._parentElement?.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
