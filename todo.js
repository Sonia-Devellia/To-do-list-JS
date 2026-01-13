document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector("button.btn-primary");
  const inputField = document.querySelector("input.form-control");
  const todoList = document.getElementById("todo-list");
  const doneList = document.getElementById("done-list");
  const filterButtons = document.querySelectorAll("div.btn-group button");

  let todos = [];
  let currentFilter = "all";

  // Ajouter une tâche
  function addTodo(text) {
    const todo = {
      text,
      done: false,
      id: Date.now(),
    };
    todos.push(todo);
    renderTodos();
  }

  // Afficher les tâches selon le filtre
  function renderTodos() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";

    todos.forEach((todo) => {
      // Filtrer selon le filtre actif
      if (currentFilter === "todo" && todo.done) return;
      if (currentFilter === "done" && !todo.done) return;

      const li = document.createElement("li");
      li.className = "todo list-group-item d-flex align-items-center";
      li.dataset.id = todo.id;

      li.innerHTML = `
        <input class="form-check-input" type="checkbox" ${
          todo.done ? "checked" : ""
        } id="todo-${todo.id}">
        <label class="ms-2 form-check-label" for="todo-${todo.id}">
          ${todo.text}
        </label>
        <label class="ms-auto btn btn-danger btn-sm">
          <i class="bi-trash"></i>
        </label>
      `;

      if (todo.done) {
        doneList.appendChild(li);
      } else {
        todoList.appendChild(li);
      }
    });
  }

  // Basculer statut
  function toggleDone(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      renderTodos();
    }
  }

  // Supprimer
  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
  }

  // Ajouter une tâche
  addButton.addEventListener("click", (e) => {
    e.preventDefault();
    const text = inputField.value.trim();
    if (text) {
      addTodo(text);
      inputField.value = "";
      inputField.focus();
    }
  });

  // Écouteur sur les deux colonnes
  [todoList, doneList].forEach((list) => {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li.todo");
      if (!li) return;
      const id = parseInt(li.dataset.id);

      if (e.target.classList.contains("form-check-input")) {
        toggleDone(id);
      } else if (e.target.classList.contains("bi-trash")) {
        deleteTodo(id);
      }
    });
  });

  // Gestion des filtres
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      renderTodos();
    });
  });
});
