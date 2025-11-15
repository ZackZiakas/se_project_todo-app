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

const openModal = (modal) => {
  modal.classList.add("popup_visible");
};

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
};

// creates Todo instance and returns DOM node
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();
  return todoElement;
};

// open / close popup
addTodoButton.addEventListener("click", () => {
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

// submit form
addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = evt.target.name.value.trim();
  const dateInput = evt.target.date.value;

  if (!name) {
    return;
  }

  // keep raw date string; Todo will format it
  const id = uuidv4();

  const values = {
    id,
    name,
    date: dateInput,
    completed: false,
  };

  const todoElement = generateTodo(values);
  todosList.append(todoElement);

  addTodoForm.reset();
  closeModal(addTodoPopup);
});

// render initial todos
initialTodos.forEach((item) => {
  const todoElement = generateTodo(item);
  todosList.append(todoElement);
});

// enable validation
const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
