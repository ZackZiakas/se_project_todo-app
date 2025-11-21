// components/PopupWithForm.js
import Popup from "./Popup.js";

class PopupWithForm extends Popup {
  // ✅ accepts two arguments: selector + callback
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);

    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popupElement.querySelector(".popup__form");
    this._inputList = Array.from(this._form.querySelectorAll(".popup__input"));
  }

  // ✅ collects inputs into an object
  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }

  // ✅ overrides parent, but still calls parent’s setEventListeners()
  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formValues = this._getInputValues();
      this._handleFormSubmit(formValues);
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}

export default PopupWithForm;
