let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* SAVE */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* RENDER */
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  // SORT BY DATE
  tasks.sort((a, b) => {
    return new Date(a.date || "2100-01-01") - new Date(b.date || "2100-01-01");
  });

  let completedCount = 0;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.classList.add(task.priority);
    if (task.completed) {
      li.classList.add("completed");
      completedCount++;
    }

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <span class="category">${task.category}</span><br>
        <small>📅 ${task.date || "No date"}</small>
      </div>

      <div class="icons">
        <i class="fa-solid fa-check" onclick="toggleComplete(${index})"></i>
        <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgress(completedCount);
}

/* ADD TASK */
function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const date = document.getElementById("dueDate").value;
  const category = document.getElementById("category").value;

  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    priority: priority,
    date: date,
    category: category,
    completed: false
  });

  input.value = "";
  document.getElementById("dueDate").value = "";

  saveTasks();
  renderTasks();
}

/* DELETE */
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

/* COMPLETE */
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

/* PROGRESS */
function updateProgress(completedCount) {
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  document.getElementById("progressText").innerText = percent + "% complete";
  document.getElementById("progressFill").style.width = percent + "%";
}

/* ENTER KEY SUPPORT */
document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

/* INITIAL LOAD */
renderTasks();