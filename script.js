const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskStats = document.getElementById("taskStats");
const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");
const toggleBtn = document.getElementById("themeToggle"); // 🌙 / ☀️ button
const notifyBtn = document.getElementById("notifyBtn"); // 🔔 bell
const body = document.body;

let tasks = [];

// ✅ Load Theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
} else {
  toggleBtn.textContent = "🌙";
}

// 🌙 Theme Toggle
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// ✅ Setup Bell badge & dropdown
const bellCount = document.createElement("span");
bellCount.classList.add("bell-count");
notifyBtn.appendChild(bellCount);

const bellDropdown = document.createElement("ul");
bellDropdown.classList.add("bell-dropdown");
notifyBtn.appendChild(bellDropdown);

// 🔔 Update bell count & dropdown
function updateBell() {
  const pendingTasks = tasks.filter(t => !t.done);
  
  // Badge
  if (pendingTasks.length > 0) {
    bellCount.innerText = pendingTasks.length;
    bellCount.style.display = "block";
  } else {
    bellCount.style.display = "none";
  }

  // Dropdown
  bellDropdown.innerHTML = "";
  pendingTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.text;
    bellDropdown.appendChild(li);
  });
}

// Toggle dropdown visibility
notifyBtn.addEventListener("click", () => {
  bellDropdown.style.display = bellDropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!notifyBtn.contains(e.target)) {
    bellDropdown.style.display = "none";
  }
});

// ➕ Add Task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    date: taskDate.value,
    priority: prioritySelect.value,
    done: false
  };

  tasks.push(task);
  taskInput.value = "";
  renderTasks();
});

// 🎨 Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  let pending = 0, done = 0, overdue = 0;

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.done) li.classList.add("done");
    if (!task.done && task.date && new Date(task.date) < new Date()) {
      li.classList.add("overdue");
      overdue++;
    }

    li.innerHTML = `
      <span>${task.text} <small>[${task.priority}] ${task.date || ""}</small></span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    taskList.appendChild(li);

    if (task.done) done++;
    else pending++;
  });

  taskStats.textContent = `${pending} Pending | ${done} Done | ${overdue} Overdue`;

  // 🔔 Update bell every time tasks change
  updateBell();
}

// ✅ Toggle Done
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? {...task, done: !task.done} : task
  );
  renderTasks();
}

// ❌ Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// 🧹 Clear Completed
clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  renderTasks();
});

// 🗑 Clear All
clearAll.addEventListener("click", () => {
  tasks = [];
  renderTasks();
});
