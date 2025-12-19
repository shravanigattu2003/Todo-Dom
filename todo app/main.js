const taskForm = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const tasksContainer = document.querySelector(".taskContainer");

let TODOS = [];
document.addEventListener("DOMContentLoaded",function(){
    const areTodosLoaded = loadTodos()
    areTodosLoaded && renderTodos(TODOS) 
})

function handleTaskDelete(taskIdToDelete){
    TODOS = TODOS.filter((task) => task.taskId != taskIdToDelete)
   
    localStorage.setItem("todos",JSON.stringify(TODOS));
   
    const listItemTobeRemoved = document.getElementById(taskIdToDelete);
    listItemTobeRemoved.remove();
}

function loadTodos(){
    console.log(TODOS);
    const stringifiedTobos = localStorage.getItem("todos");
    const todosArray = JSON.parse(stringifiedTobos); 
    if(todosArray && todosArray.length){
        TODOS = todosArray; 
        return true
    }
    return false;
}
function renderTodos(todos){
    for(let index=0; index<todos.length; index++){ 
        createAndPushPtag(todos[index])
    }
}


function handleTaskDone(taskIdToUpdateIsTaskDone){
    for(let index=0; index < TODOS.length; index++){
        if(TODOS[index].taskId == taskIdToUpdateIsTaskDone){
            TODOS[index].isTaskDone = !TODOS[index].isTaskDone;
        }
    }
    localStorage.setItem("todos",JSON.stringify(TODOS));
}

function createAndPushPtag(task){
  const newListItem = document.createElement("li");
    
  newListItem.setAttribute("id", task.taskId);


  const checkBoxInput = document.createElement("input"); 
  checkBoxInput.setAttribute("type", "checkbox"); 
  checkBoxInput.checked = task.isTaskDone;
  checkBoxInput.addEventListener("change", () => handleTaskDone(task.taskId))

  const taskContentContainer = document.createElement("div");

  const taskTextPTag = document.createElement("p");
  taskTextPTag.setAttribute("class", "task");
  taskTextPTag.textContent = task.taskText;

  const timeStampPTag = document.createElement("p");
  timeStampPTag.textContent = task.timeStamp;

  taskContentContainer.appendChild(taskTextPTag);
  taskContentContainer.appendChild(timeStampPTag);

  const taskActionButtonsContainer = document.createElement("div");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => handleTaskDelete(task.taskId));


  taskActionButtonsContainer.appendChild(editButton);
  taskActionButtonsContainer.appendChild(deleteButton);

  newListItem.appendChild(checkBoxInput);
  newListItem.appendChild(taskContentContainer);
  newListItem.appendChild(taskActionButtonsContainer);

  tasksContainer.appendChild(newListItem);
}

    
function saveTodosInLocalStorage(todos){
    const stringifiedTodos = JSON.stringify(todos); 
    localStorage.setItem("todos",stringifiedTodos);
    return;
}

taskForm.addEventListener("submit", function(event){
    event.preventDefault(); 

    if(!taskInput.value.trim()){
        alert("please enter something inside task input!")
        return;
    }
    const newTask = {
        taskId:Date.now(),
        taskText: taskInput.value.trim(),
        isTaskDone: false,
        timeStamp: new Date().toLocaleString()

    }

    
    console.log("hello")
    TODOS.push(newTask);
    createAndPushPtag(newTask)
    saveTodosInLocalStorage(TODOS)

    taskInput.value = "";
    taskInput.focus()

})