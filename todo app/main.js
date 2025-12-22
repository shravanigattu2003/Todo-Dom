let TODOS = [];

let taskForm, taskInput, tasksContainer;
let sortNewestBtn, sortOldestBtn, sortCompletedBtn, clearCompletedBtn;
let totalCountEl, completedCountEl, taskError;

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    taskForm = document.querySelector(".taskForm");
    taskInput = document.querySelector(".taskInput");
    tasksContainer = document.querySelector(".taskContainer");

    sortNewestBtn = document.getElementById("newest");
    sortOldestBtn = document.getElementById("oldest");
    sortCompletedBtn = document.getElementById("completed");
    clearCompletedBtn = document.getElementById("clear");

    totalCountEl = document.getElementById("totalCount");
    completedCountEl = document.getElementById("completedCount");
    taskError = document.getElementById("taskError");

    if (loadTodos()) {
        renderTodos(TODOS);
    }
    updateTaskCounts();

    taskForm.addEventListener("submit", handleTaskSubmit);
    taskInput.addEventListener("input", () => (taskError.textContent = ""));

    sortNewestBtn.addEventListener("click", sortNewest);
    sortOldestBtn.addEventListener("click", sortOldest);
    sortCompletedBtn.addEventListener("click", sortCompleted);
    clearCompletedBtn.addEventListener("click", clearCompletedTasks);
}
function handleTaskSubmit(event) {
    event.preventDefault();

    const cleanedText = cleanTaskText(taskInput.value);

    if (cleanedText.length < 3) {
        taskError.textContent = "Task must be at least 3 characters.";
        return;
    }

    const newTask = {
        taskId: Date.now(),
        taskText: cleanedText,
        isTaskDone: false,
        timeStamp: new Date().toISOString()
    };

    TODOS.push(newTask);
    saveAndReRender();

    taskInput.value = "";
    taskInput.focus();
}

function handleTaskDone(taskId) {
    const task = TODOS.find(t => t.taskId == taskId);
    if (!task) return;

    task.isTaskDone = !task.isTaskDone;
    saveAndReRender();
}

function handleTaskDelete(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    TODOS = TODOS.filter(task => task.taskId != taskId);
    saveAndReRender();
}

function sortNewest() {
    TODOS.sort((a, b) => a.taskId - b.taskId);
    saveAndReRender();
}

function sortOldest() {
    TODOS.sort((a, b) => b.taskId - a.taskId);
    saveAndReRender();
}

function sortCompleted() {
    TODOS.sort((a, b) => a.isTaskDone - b.isTaskDone);
    saveAndReRender();
}

function clearCompletedTasks() {
    if (!TODOS.some(task => task.isTaskDone)) {
        alert("No completed tasks to clear.");
        return;
    }

    TODOS = TODOS.filter(task => !task.isTaskDone);
    saveAndReRender();
}
function renderTodos(todos) {
    tasksContainer.innerHTML = "";
    todos.forEach(createAndPushPtag);
}

function createAndPushPtag(task) {
    const li = document.createElement("li");
    li.id = task.taskId;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.isTaskDone;
    checkbox.addEventListener("change", () => handleTaskDone(task.taskId));

    const contentDiv = document.createElement("div");

    const taskText = document.createElement("p");
    taskText.className = "task";
    taskText.textContent = task.taskText;
    if (task.isTaskDone) taskText.classList.add("taskDone");

    const timeText = document.createElement("p");
    timeText.textContent = formatTimestamp(task.timeStamp);

    contentDiv.append(taskText, timeText);

    const actionsDiv = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () =>
        enableEditMode(task, taskText)
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () =>
        handleTaskDelete(task.taskId)
    );

    actionsDiv.append(editBtn, deleteBtn);

    li.append(checkbox, contentDiv, actionsDiv);
    tasksContainer.appendChild(li);
}
function enableEditMode(task, taskTextPTag) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.taskText;

    taskTextPTag.replaceWith(input);
    input.focus();

    function save() {
        const cleaned = cleanTaskText(input.value);
        if (cleaned.length < 3) {
            alert("Task must be at least 3 characters");
            return;
        }

        task.taskText = cleaned;
        taskTextPTag.textContent = cleaned;
        saveAndReRender();
    }

    function cancel() {
        input.replaceWith(taskTextPTag);
    }

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cancel();
    });
}
function saveAndReRender() {
    localStorage.setItem("todos", JSON.stringify(TODOS));
    renderTodos(TODOS);
    updateTaskCounts();
}

function loadTodos() {
    const data = JSON.parse(localStorage.getItem("todos"));
    if (data && data.length) {
        TODOS = data;
        return true;
    }
    return false;
}

function updateTaskCounts() {
    totalCountEl.textContent = TODOS.length;
    completedCountEl.textContent =
        TODOS.filter(t => t.isTaskDone).length;
}

function cleanTaskText(text) {
    return text.trim().replace(/\s+/g, " ");
}

function formatTimestamp(iso) {
    const d = new Date(iso);
    return d.toLocaleString();
}
