// pages/index.js
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

// ---------- Validator ----------
const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

// ---------- TodoCounter ----------
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

// helper: attach counter listeners to each todo DOM node
const attachCounterListeners = (todoElement) => {
  const checkbox = todoElement.querySelector(".todo__completed");
  const deleteBtn = todoElement.querySelector(".todo__delete-btn");

  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        todoCounter.updateCompleted(true);
      } else {
        todoCounter.updateCompleted(false);
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      // if it was completed when deleted, decrement completed count
      if (checkbox && checkbox.checked) {
        todoCounter.updateCompleted(false);
      }
      todoCounter.updateTotal(false);
      // actual removal is handled inside Todo class
    });
  }
};

// ---------- Create todo DOM element ----------
const createTodoElement = (data) => {
  const todo = new Todo(data, "#todo-template");
  const element = todo.getView();
  attachCounterListeners(element);
  return element;
};

// ---------- Section for todos ----------
const todosSection = new Section(
  {
    items: initialTodos,
    renderer: (item) => {
      const todoElement = createTodoElement(item);
      todosSection.addItem(todoElement);
    },
  },
  ".todos__list"
);

// render initial items
todosSection.renderItems();

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

    // reset validation and close popup
    newTodoValidator.resetValidation();
    addTodoPopup.close();
  }
);

addTodoPopup.setEventListeners();

// ---------- Listener to open popup (only listener left on the form/popup) ----------
addTodoButton.addEventListener("click", () => {
  newTodoValidator.resetValidation();
  addTodoPopup.open();
});
