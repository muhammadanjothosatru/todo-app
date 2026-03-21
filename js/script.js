let tasks = [];

const input = document.getElementById("task-input");
const button = document.getElementById("add-btn");
const list = document.getElementById("task-list");

button.addEventListener("click", addTask);

input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    addTask();
  }
});

function addTask(){
  const text = input.value.trim();

  if(text === "") return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);

  renderTasks();

  input.value = "";
}

function renderTasks(){
  list.innerHTML = "";

  tasks.forEach(task => {

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${task.text}</span>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    list.appendChild(li);

  });
}

function deleteTask(id){
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}