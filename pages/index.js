import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupSelector = "#add-todo-popup";
const addTodoForm = document.querySelector("#add-todo-form");
const todosListElement = document.querySelector(".todos__list");

// ---------- Validator ----------
const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

// ---------- TodoCounter ----------
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

// ---------- Create todo DOM element ----------
const createTodoElement = (data) => {
  const todo = new Todo(data, "#todo-template");
  return todo.getView();
};

// ---------- Section for todos ----------
const todosSection = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todoElement = createTodoElement(item);
    todosSection.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});

// render initial items
todosSection.renderItems();

// ---------- Counter updates via delegated listeners ----------
todosListElement.addEventListener("change", (evt) => {
  if (evt.target.classList.contains("todo__completed")) {
    // checkbox toggled
    todoCounter.updateCompleted(evt.target.checked);
  }
});

todosListElement.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("todo__delete-btn")) {
    const todoItem = evt.target.closest(".todo");
    if (!todoItem) {
      return;
    }

    const checkbox = todoItem.querySelector(".todo__completed");

    // if todo was completed when deleted, decrement completed count
    if (checkbox && checkbox.checked) {
      todoCounter.updateCompleted(false);
    }

    // in all cases, total count goes down by 1
    todoCounter.updateTotal(false);
  }
});

// ---------- PopupWithForm for "Add Todo" ----------
const addTodoPopup = new PopupWithForm(
  addTodoPopupSelector,
  ({ name, date }) => {
    const trimmedName = name ? name.trim() : "";
    if (!trimmedName) {
      return;
    }

    const newTodoData = {
      id: uuidv4(),
      name: trimmedName,
      date,
      completed: false,
    };

    const todoElement = createTodoElement(newTodoData);
    todosSection.addItem(todoElement);

    // update total count for new todo
    todoCounter.updateTotal(true);

    // reset validation and close popup after successful submit
    newTodoValidator.resetValidation();
    addTodoPopup.close();
  }
);

addTodoPopup.setEventListeners();

// ---------- Listener to open popup ----------
addTodoButton.addEventListener("click", () => {
  // no extra resetValidation() here — it already runs after submit
  addTodoPopup.open();
});
