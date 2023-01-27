const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const clearTasksButton = document.querySelector("[data-clear-tasks-button]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = "task.selectedIdLists";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY);

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListID = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListID);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
  }
});

// CREATE LIST
newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// CREATE TASK
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListID);
  selectedList.tasks.push(task);
  saveAndRender();
});

// CLEAR COMPLETED TASKS
clearTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListID);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

// EDIT TASK BUTTON

// DELETE LIST
deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListID);
  selectedListID = null;
  saveAndRender();
});

// CREATE LIST FUNCTION
function createList(name) {
  return {
    id: (Date.now() + Math.random()).toString(),
    name: name,
    tasks: [],
  };
}

//CREATE TASK FUNCTION
function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

// CREATE MONTH PLAN (FOUR WEEKS)
function createMonthPlan() {
  for (let i = 1; i < 5; i++) {
    let list = createList("WEEK " + i);
    lists.push(list);
  }
}

// SAVE FUNCTIONS
function saveAndRender() {
  save();
  render();
}
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}

// RENDER FUNCTION
function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListID);
  if (selectedListID == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
  }
  clearElement(tasksContainer);
  renderTasks(selectedList);
}

// RENDER TASKS FUNCTION
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    const inputEdit = taskElement.querySelector(".input-edit");
    const editTaskButton = taskElement.querySelector("[data-edit-task-button]");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    inputEdit.value = task.name;
    editTaskButton.id = task.id;

    // EDIT TASK
    editTaskButton.addEventListener("click", (e) => {
      // EDIT
      if (editTaskButton.innerText === "edit") {
        editTaskButton.innerText = "save";
        inputEdit.removeAttribute("readonly");
        inputEdit.style.pointerEvents = "auto";
        inputEdit.focus();
        // SAVE
      } else {
        editTaskButton.innerText = "edit";
        inputEdit.setAttribute("readonly", "readonly");
        inputEdit.style.pointerEvents = "none";
        if (e.target.tagName.toLowerCase() === "button") {
          const selectedList = lists.find((list) => list.id === selectedListID);
          const selectedTask = selectedList.tasks.find(
            (task) => task.id === e.target.id
          );
          selectedTask.name = inputEdit.value;
          save();
        }
      }
    });
    tasksContainer.appendChild(taskElement);
  });
}

// RENDER LISTS FUNCTION
function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListID) listElement.classList.add("active-list");
    listsContainer.appendChild(listElement);
  });
}

// CLEAR ELEMENTS FUNCTION
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
