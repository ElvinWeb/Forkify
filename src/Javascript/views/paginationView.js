import View from "./view.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const { page: currPage, results, resultsPerPage } = this._data;
    const numPages = Math.ceil(results.length / resultsPerPage);

    // Return early if only 1 page
    if (numPages <= 1) return "";

    // Always show page label
    const pageLabel = `
      <div class="pagination__label">
        <span class="pagination__label-text">Page ${currPage} out of ${numPages}</span>
      </div>`;

    // Generate prev button markup if not on first page
    const prevButton = currPage > 1 ? `
      <button class="btn--inline pagination__btn--prev" data-goto="${currPage - 1}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
      </button>` : '';

    // Generate next button markup if not on last page  
    const nextButton = currPage < numPages ? `
      <button class="btn--inline pagination__btn--next" data-goto="${currPage + 1}">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>` : '';

    return prevButton + nextButton + pageLabel;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
}

export default new PaginationView();
