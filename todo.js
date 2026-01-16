document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-form");
  const taskInput = document.getElementById("task-input");
  const categorySelect = document.getElementById("category-select");
  
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Initialiser l'affichage
  renderAll();

  // Ajouter une tâche
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const category = categorySelect.value;

    if (text) {
      const todo = {
        id: Date.now(),
        text,
        category,
        done: false,
        createdAt: new Date().toISOString(),
      };

      todos.push(todo);
      saveTodos();
      renderAll();
      
      taskInput.value = "";
      taskInput.focus();
      
      // Animation d'ajout
      setTimeout(() => {
        const addedItem = document.querySelector(`[data-id="${todo.id}"]`);
        if (addedItem) {
          addedItem.style.animation = "taskSlideIn 0.4s ease-out";
        }
      }, 10);
    }
  });

  // Gérer les interactions sur les tâches
  document.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const id = parseInt(taskItem.dataset.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Toggle checkbox
    if (e.target.classList.contains("task-checkbox") || 
        e.target.classList.contains("task-label")) {
      todo.done = !todo.done;
      saveTodos();
      animateToggle(taskItem, todo.done);
      setTimeout(() => renderAll(), 300);
    }

    // Supprimer
    if (e.target.closest(".delete-btn")) {
      animateDelete(taskItem);
      setTimeout(() => {
        todos = todos.filter((t) => t.id !== id);
        saveTodos();
        renderAll();
      }, 300);
    }
  });

  // Animation toggle
  function animateToggle(element, isDone) {
    if (isDone) {
      element.style.transform = "scale(0.95)";
      element.style.opacity = "0.5";
    } else {
      element.style.transform = "scale(1.05)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 200);
    }
  }

  // Animation suppression
  function animateDelete(element) {
    element.style.transform = "translateX(-100%)";
    element.style.opacity = "0";
  }

  // Sauvegarder dans localStorage
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // Afficher toutes les tâches
  function renderAll() {
    const categories = ["courses", "prevoir", "important", "oublier"];
    
    categories.forEach((category) => {
      const list = document.getElementById(`list-${category}`);
      const count = document.getElementById(`count-${category}`);
      const categoryTodos = todos.filter((t) => t.category === category);
      
      // Mettre à jour le compteur
      count.textContent = categoryTodos.length;
      
      // Vider la liste
      list.innerHTML = "";
      
      // Trier: non faites en premier
      const sortedTodos = [...categoryTodos].sort((a, b) => {
        if (a.done === b.done) return 0;
        return a.done ? 1 : -1;
      });
      
      // Afficher les tâches
      sortedTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.className = `task-item${todo.done ? " done" : ""}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
          <input 
            class="task-checkbox" 
            type="checkbox" 
            ${todo.done ? "checked" : ""}
            id="task-${todo.id}"
          >
          <label class="task-label" for="task-${todo.id}">
            ${escapeHtml(todo.text)}
          </label>
          <button class="delete-btn" aria-label="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        
        list.appendChild(li);
      });
    });
    
    // Mettre à jour les stats globales
    updateGlobalStats();
  }

  // Mettre à jour les statistiques globales
  function updateGlobalStats() {
    const totalCount = document.getElementById("total-count");
    const doneCount = document.getElementById("done-count");
    
    const total = todos.length;
    const done = todos.filter((t) => t.done).length;
    
    totalCount.textContent = `${total} tâche${total > 1 ? "s" : ""}`;
    doneCount.textContent = `${done} faite${done > 1 ? "s" : ""}`;
  }

  // Échapper le HTML pour éviter les injections XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Nettoyer les tâches terminées (fonctionnalité bonus)
  function clearCompleted() {
    todos = todos.filter((t) => !t.done);
    saveTodos();
    renderAll();
  }

  // Exposer la fonction pour usage potentiel
  window.clearCompleted = clearCompleted;
});