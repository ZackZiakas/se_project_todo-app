// components/Todo.js
class Todo {
  constructor(data, selector) {
    // data: { id, name, date, completed }
    this._data = {
      ...data,
      completed: data.completed ?? false,
    };
    this._selector = selector;
  }

  _getTemplate() {
    const template = document
      .querySelector(this._selector)
      .content.querySelector(".todo")
      .cloneNode(true);

    return template;
  }

  _updateCompletedState() {
    this._checkbox.checked = this._data.completed;
    // Optional: add a class to style completed items
    if (this._data.completed) {
      this._label.classList.add("todo_completed");
    } else {
      this._label.classList.remove("todo_completed");
    }
  }

  _setEventListeners() {
    // checkbox change
    this._checkbox.addEventListener("change", () => {
      this._data.completed = !this._data.completed;
      this._updateCompletedState();
    });

    // delete button
    this._deleteBtn.addEventListener("click", () => {
      this._element.remove();
    });
  }

  getView() {
    this._element = this._getTemplate();

    this._label = this._element.querySelector(".todo__label");
    this._checkbox = this._element.querySelector(".todo__completed");
    this._nameEl = this._element.querySelector(".todo__name");
    this._dateEl = this._element.querySelector(".todo__date");
    this._deleteBtn = this._element.querySelector(".todo__delete-btn");

    // text
    this._nameEl.textContent = this._data.name;

    // date (optional)
    const dueDate = new Date(this._data.date);
    if (!isNaN(dueDate)) {
      this._dateEl.textContent = `Due: ${dueDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    } else {
      this._dateEl.textContent = "";
    }

    // checkbox + label id/for
    if (this._data.id) {
      const checkboxId = `todo-${this._data.id}`;
      this._checkbox.id = checkboxId;
      this._label.setAttribute("for", checkboxId);
    }

    this._updateCompletedState();
    this._setEventListeners();

    return this._element;
  }
}

export default Todo;
