let tasks = [];

const input = document.getElementById("task-input");
const button = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

// Event
button.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add Task
function addTask() {
  const text = input.value.trim();
  if (text === "") return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(task);

  saveTasks(); // ✅ penting
  renderTasks();

  input.value = "";
}

// Render
function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", () => toggleTask(task.id));

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(span);
    li.appendChild(btn);

    list.appendChild(li);
  });

  // ✅ update counter
  taskCount.textContent = `${tasks.length} tasks`;
}

// Delete
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks(); // ✅ penting
  renderTasks();
}

// Toggle
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }
    return task;
  });

  saveTasks(); // ✅ penting
  renderTasks();
}

// LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");

  if (data) {
    tasks = JSON.parse(data);
  }
}

// Init
loadTasks();
renderTasks();