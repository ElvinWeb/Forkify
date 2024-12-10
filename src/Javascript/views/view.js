import icons from "../../img/icons.svg";

export default class View {
  _data;

  render(data, render = true) {
    // Early return if no valid data
    if (!data || (Array.isArray(data) && !data.length)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newDom = document.createRange().createContextualFragment(this._generateMarkup());
    
    const [newElements, curElements] = [
      [...newDom.querySelectorAll("*")],
      [...this._parentElement.querySelectorAll("*")]
    ];

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      
      // Update text content if needed
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()) {
        curEl.textContent = newEl.textContent;
      }

      // Update attributes if elements are different
      if (!newEl.isEqualNode(curEl)) {
        [...newEl.attributes].forEach(attr => 
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
