import View from "./view.js";
import intro_logo from "../../img/logo.png";

class IntroView extends View {
  // Cache DOM elements in constructor for better performance
  constructor() {
    super();
    this._parentElement = document.querySelector(".intro");
    this._container = document.querySelector(".container"); 
  }

  _generateMarkup() {
    // Use template literal with proper quotes for attributes
    return `<img src="${intro_logo}" class="fade-in intro__logo" alt="intro-logo">`;
  }

  addIntroAnimation() {
    // Add both classes in one reflow for better performance
    requestAnimationFrame(() => {
      this._parentElement.classList.add("close");
      this._container.classList.add("container-intro");
    });
  }

  addHandlerIntro(handler) {
    // Use once:true option to auto-cleanup event listener
    window.addEventListener("DOMContentLoaded", handler, { once: true });
  }
}

export default new IntroView();
