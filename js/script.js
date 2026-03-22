try {

let tasks = [];
let filter = "all";

const input = document.getElementById("task-input");
const button = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-btn");

// CEK ELEMENT
if (!input || !button || !list || !taskCount || !clearBtn) {
  console.error("HTML element not found!");
}

// LOAD
function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) tasks = JSON.parse(data);
}

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD
button?.addEventListener("click", addTask);
input?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

// DELETE
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// TOGGLE
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// FILTER
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;

    document.querySelectorAll(".filters button").forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");

    renderTasks();
  });
});

// CLEAR
clearBtn?.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// RENDER
function renderTasks() {
  if (!list) return;

  list.innerHTML = "";

  let filtered = tasks;

  if (filter === "active") {
    filtered = tasks.filter((t) => !t.completed);
  } else if (filter === "completed") {
    filtered = tasks.filter((t) => t.completed);
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    list.appendChild(li);
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  if (taskCount) {
    taskCount.textContent = `${activeCount} tasks left`;
  }
}

// INIT
loadTasks();
renderTasks();

} catch (err) {
  console.error("APP ERROR:", err);
}