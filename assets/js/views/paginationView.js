import View from "./view.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currPage === 1 && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--next" data-goto="${
        currPage + 1
      }">
        <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
    }

    if (currPage === numPages && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        currPage - 1
      }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
        <span>Page ${currPage - 1}</span>
      </button>
      `;
    }

    if (currPage < numPages) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          currPage - 1
        }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-goto="${
          currPage + 1
        }">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    return "";
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
