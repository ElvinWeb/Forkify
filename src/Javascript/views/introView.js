import View from "./view.js";
import intro_logo from "../../img/logo.png";

class IntroView extends View {
  _parentElement = document.querySelector(".intro");
  _container = document.querySelector(".container");

  _generateMarkup() {
    return `<img src=${intro_logo} class="fade-in intro__logo" alt="intro-logo"/>`;
  }
  addIntroAnimation() {
    this._parentElement.classList.add("close");
    this._container.classList.add("container-intro");
  }
  addHandlerIntro(handler) {
    window.addEventListener("DOMContentLoaded", handler);
  }
}

export default new IntroView();
