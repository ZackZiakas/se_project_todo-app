// components/Popup.js
class Popup {
  constructor(popupSelector) {
    this._popupElement = document.querySelector(popupSelector);
    // bind the handler to the instance (so "this" works)
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  open() {
    this._popupElement.classList.add("popup_visible");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popupElement.classList.remove("popup_visible");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  setEventListeners() {
    // close on overlay or on close button
    this._popupElement.addEventListener("mousedown", (evt) => {
      const target = evt.target;

      // click on overlay (background)
      if (target === this._popupElement) {
        this.close();
      }

      // click on close button
      if (target.classList.contains("popup__close")) {
        this.close();
      }
    });
  }
}

export default Popup;
