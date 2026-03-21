// =======================
// STATE
// =======================
let tasks = [];
let currentFilter = "active";

// =======================
// ELEMENTS
// =======================
const input = document.getElementById("task-input");
const button = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filters button");
const clearBtn = document.getElementById("clear-completed");

// =======================
// LOAD FILTER (LOCALSTORAGE)
// =======================
const savedFilter = localStorage.getItem("filter");
if (savedFilter) {
  currentFilter = savedFilter;
}

// =======================
// EVENT LISTENERS
// =======================
button.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// FILTER BUTTON
filterButtons.forEach(btn => {
  if (btn.dataset.filter === currentFilter) {
    btn.classList.add("active");
  }

  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    localStorage.setItem("filter", currentFilter);

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

// CLEAR COMPLETED
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// =======================
// ADD TASK
// =======================
function addTask() {
  const text = input.value.trim();
  if (text === "") return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  input.value = "";
}

// =======================
// RENDER TASKS
// =======================
function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    // LEFT SIDE
    const left = document.createElement("div");
    left.className = "task-left";

    // CHECKBOX
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => toggleTask(task.id));

    // TEXT
    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    // EDIT MODE (DOUBLE CLICK)
    span.addEventListener("dblclick", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = task.text;
      inputEdit.className = "edit-input";

      left.replaceChild(inputEdit, span);
      inputEdit.focus();

      inputEdit.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          updateTask(task.id, inputEdit.value);
        }
      });

      inputEdit.addEventListener("blur", () => {
        updateTask(task.id, inputEdit.value);
      });
    });

    left.appendChild(checkbox);
    left.appendChild(span);

    // DELETE BUTTON
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.className = "delete-btn";
    btn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(left);
    li.appendChild(btn);

    list.appendChild(li);
  });

  // COUNTER
  const activeCount = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} active tasks`;
}

// =======================
// DELETE
// =======================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

// =======================
// TOGGLE
// =======================
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// =======================
// UPDATE TASK (EDIT)
// =======================
function updateTask(id, newText) {
  const text = newText.trim();
  if (text === "") return;

  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, text: text };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// =======================
// LOCAL STORAGE
// =======================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
}

// =======================
// INIT
// =======================
loadTasks();
renderTasks();

window.onload = () => {
  input.focus();
};