// pages/index.js
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopup.querySelector(".popup__form");
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");

// handle closing popup with Escape key
const handleEscClose = (evt) => {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_visible");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
};

const openModal = (modal) => {
  modal.classList.add("popup_visible");
  document.addEventListener("keydown", handleEscClose);
};

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
  document.removeEventListener("keydown", handleEscClose);
};

// creates Todo instance and returns DOM node
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template");
  return todo.getView();
};

// helper to avoid repeated generate + append logic
const addTodoToList = (data) => {
  const todoElement = generateTodo(data);
  todosList.append(todoElement);
};

// init validator BEFORE using it in listeners
const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

// open / close popup
addTodoButton.addEventListener("click", () => {
  // clear old values + errors and reset button
  newTodoValidator.resetValidation();
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

// optional: close popup when clicking on the overlay/background
addTodoPopup.addEventListener("mousedown", (evt) => {
  if (evt.target === addTodoPopup) {
    closeModal(addTodoPopup);
  }
});

// submit form
addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = evt.target.name.value.trim();
  const dateInput = evt.target.date.value;

  if (!name) {
    return;
  }

  const id = uuidv4();

  const values = {
    id,
    name,
    date: dateInput,
    completed: false,
  };

  addTodoToList(values);

  // use validator to reset form + errors + button state
  newTodoValidator.resetValidation();
  closeModal(addTodoPopup);
});

// render initial todos
initialTodos.forEach((item) => {
  addTodoToList(item);
});
