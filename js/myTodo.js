const TITLE_DISPLAY_LIMIT = 40;
const NUM_OF_TASKS_ON_CARD = 3;
const TITLE_CHARS_EXCEED_LIMIT = 70;
const CURRENT_USER = JSON.parse(localStorage.getItem("currentUser"));

window.onload = init("usersList");
let taskItems = [];
function init(key) {
  //   colorChange();
  //   let user = document.location.search.replace(/^.*?\=/, "");
  //   document.querySelector("#user").innerHTML = `welcome ${user}`;
  const dataPresent = addFirstCardMsg();
  if (dataPresent === -1) return;
  const currUserTodos = getCurrUserTodosFromLocalStorage(key);
  for (let index = 0; index < currUserTodos.length; index++) {
    const task = currUserTodos[index];
    const taskTitle = task.title;
    const creationTime = task.creationTime;
    const taskItems = task.tasks;
    const cardId = task.id;
    createCard(taskItems, taskTitle, creationTime, cardId);
  }
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("closing")[0];

function openAddTaskModal() {
  getCurrUserTodosFromLocalStorage("usersList");
  taskItems = [];
  document.getElementById("overlay").style = "display:block";
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
  document.getElementById("overlay").style = "display:none";
  // location.replace(
  //   `file:///Users/aditi.laturkar/Desktop/GOMMT/myTodo/myTodo.html?userName=${CURRENT_USER}`
  // );
};

let input = document.getElementById("input");
input.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    addToList();
  }
});

function sortingOfTasks(taskItems) {
  taskItems.sort(function (x, y) {
    return x.done === y.done ? 0 : x.done ? 1 : -1;
  });
  return taskItems;
}
function createCard(taskItems, taskTitle, creationTime, cardId) {
  let chars = taskTitle.length;

  const newCard = {
    id: cardId,
    title: taskTitle,
    creationTime: creationTime,
    tasks: [],
  };
  let short_title = taskTitle;
  if (chars > TITLE_CHARS_EXCEED_LIMIT) {
    short_title = taskTitle.slice(0, TITLE_DISPLAY_LIMIT);
    short_title = short_title + "....";
  }

  taskItems = sortingOfTasks(taskItems);
  console.log(taskItems);

  const columnDiv = document.createElement("div");
  columnDiv.setAttribute("class", "column");
  columnDiv.setAttribute("id", `column${newCard.id}`);

  const closeDiv = document.createElement("span");
  closeDiv.setAttribute("class", "close");
  const closeX = document.createTextNode("x");
  closeDiv.appendChild(closeX);
  closeDiv.setAttribute("onclick", `removeCard(${newCard.id})`);

  const zoomDiv = document.createElement("a");
  zoomDiv.setAttribute("id", "btnExp");
  const zoomX = document.createTextNode("View");
  zoomDiv.setAttribute("href", `#expandCard${newCard.id}`);
  zoomDiv.appendChild(zoomX);
  zoomDiv.setAttribute("onclick", `expandCard(${newCard.id})`);

  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");

  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title");
  const newTitle = document.createTextNode(short_title);
  titleDiv.appendChild(newTitle);

  let ulDiv = document.createElement("ul");
  ulDiv.setAttribute("id", "list");

  const closeExp = document.getElementsByClassName("closeExp")[0];
  closeExp.addEventListener("click", function (e) {
    const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
    console.log(currUserTodos + "jnnn");
    if (!currUserTodos) return;
    taskItems = currUserTodos[cardId].tasks;
    taskItems = sortingOfTasks(taskItems);
    ulDiv = createUnorderedListElements(taskItems, ulDiv);
  });

  taskItems.forEach((element) => {
    newCard.tasks.push(element);
  });

  ulDiv = createUnorderedListElements(taskItems, ulDiv);
  if (taskItems.length > NUM_OF_TASKS_ON_CARD) {
    const largeCardIndicator = document.createElement("li");
    const enlarger = document.createTextNode(" . . . ");
    largeCardIndicator.setAttribute("id", "listItem");
    largeCardIndicator.appendChild(enlarger);
    ulDiv.appendChild(largeCardIndicator);
  }

  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(ulDiv);
  columnDiv.appendChild(closeDiv);
  columnDiv.appendChild(zoomDiv);
  columnDiv.appendChild(cardDiv);
  document.querySelector(".row").appendChild(columnDiv);

  document.getElementById("titleInput").value = "";
  document.querySelector("#listInput").innerHTML = "";
  document.getElementById("emptyBoard").innerHTML = " ";

  return newCard;
}

function createUnorderedListElements(taskItems, ulDiv) {
  ulDiv.innerHTML = "";
  let cardSize = 1;
  taskItems.forEach((element) => {
    if (cardSize < 4) {
      const newTodo = document.createElement("li");
      let addTask = document.createTextNode(element.name);
      newTodo.setAttribute("id", "listItem");
      newTodo.appendChild(addTask);
      ulDiv.appendChild(newTodo);
      cardSize++;
    }
  });
  return ulDiv;
}

//when submit button gets clicked
function addTask() {
  let taskTitle = document.getElementById("titleInput").value;
  taskTitle = taskTitle.toUpperCase();
  const dateTime = getDateTime();
  if (taskTitle === "") {
    taskTitle = "My Todo";
  }
  if (taskItems.length == 0) {
    document.getElementById("emptyListError").innerHTML = "Please add tasks!";
  } else {
    taskTitle = trimExtraSpaces(taskTitle);
    document.getElementById("emptyListError").innerHTML = "";
    const newCard = createCard(taskItems, taskTitle, dateTime, assignCardId());
    pushDataInLocalstorage(newCard, "usersList");
    span.onclick();
  }
  //   colorChange();
}

//adding to modal list
function addToList() {
  let toDo = document.querySelector("#input").value;
  if (toDo == "") {
    document.getElementById("emptyTaskError").innerHTML =
      "Please enter a valid task !";
  } else {
    toDo = trimExtraSpaces(toDo);
    document.getElementById("emptyTaskError").innerHTML = "";
    document.getElementById("emptyListError").innerHTML = "";

    let createTodo = document.createElement("li");
    createTodo.setAttribute("id", "newTask");
    let addTodo = document.createTextNode(toDo);
    createTodo.appendChild(addTodo);
    document.querySelector("#listInput").appendChild(createTodo);
    document.querySelector("#input").value = "";
    let newTask = {
      name: toDo,
      done: false,
    };
    taskItems.push(newTask);
  }
}

function findCurrentCard(currCardId, allUsers) {
  const userIndex = getCurrentUserIndex();
  console.log(allUsers[0].userName);
  const todos = allUsers[userIndex].todos;
  for (let index = 0; index < todos.length; index++) {
    if (currCardId == todos[index].id) {
      return index;
    }
  }
}

var closeExp = document.getElementsByClassName("closeExp")[0];
closeExp.onclick = function () {
  document.querySelector(".exp").innerHTML = "";
  expandCardModal.style.display = "none";
  document.getElementById("overlay").style = "display:none";
  //   location.replace(
  //     `file:///Users/aditi.laturkar/Desktop/GOMMT/myTodo/myTodo.html?userName=${CURRENT_USER}`
  //   );
};

function editCard(currCardId) {
  const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
  const allUsers = JSON.parse(localStorage.getItem("usersList"));

  let val = document.getElementById("editCard").value;
  val = trimExtraSpaces(val);
  const index = findCurrentCard(currCardId, allUsers);
  let newTask = {
    name: val,
    done: false,
  };
  const card = currUserTodos[index];
  card.tasks.push(newTask);

  const userIndex = getCurrentUserIndex();
  allUsers[userIndex].todos = currUserTodos;
  setCurrUserDataInLocalStorage(allUsers, "usersList");
  document.getElementById("editCard").value = "";
  return newTask;
}

function expandCard(currCardId) {
  document.querySelector(".dateTimeExp").innerHTML = "";
  document.getElementById("overlay").style = "display:block";
  document.getElementById("expandCardModal").style.display = "block";
  //   const localStorageData = getDataFromLocalStorage("todoList");
  const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
  const allUsers = JSON.parse(localStorage.getItem("usersList"));

  const index = findCurrentCard(currCardId, allUsers);
  const card = currUserTodos[index];
  const taskTitle = card.title;
  const taskItems = card.tasks;
  const creationTime = card.creationTime;

  let columnDiv = document.createElement("div");
  columnDiv.setAttribute("class", "column");
  columnDiv.setAttribute("id", `column${currCardId}`);

  let cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "cardModal");

  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title");
  const newTitle = document.createTextNode(taskTitle);
  titleDiv.appendChild(newTitle);

  const editList = document.createElement("INPUT");
  editList.setAttribute("type", "text");
  editList.setAttribute("id", "editCard");
  editList.setAttribute("placeholder", "Add task");

  const editIcon = document.createElement("img");
  editIcon.setAttribute("src", "icons/edit.png");
  editIcon.setAttribute("id", "editIcon");

  editIcon.addEventListener("click", function (e) {
    cardDiv.appendChild(editList);
  });

  let ulDiv = document.createElement("ul");
  ulDiv.setAttribute("id", "list");

  let displayDateTime = document.createElement("div");
  displayDateTime.innerHTML = creationTime;

  ulDiv = addTasksToExpandCardList(ulDiv, taskItems, currCardId);
  editList.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      const newAddedTask = editCard(currCardId);
      taskItems.push(newAddedTask);
      addTasksToExpandCardList(ulDiv, taskItems, currCardId);
      markDone(currCardId);
    }
  });
  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(editIcon);

  cardDiv.appendChild(ulDiv);
  columnDiv.appendChild(cardDiv);
  document.querySelector(".exp").appendChild(columnDiv);
  document.querySelector(".dateTimeExp").appendChild(displayDateTime);

  document.getElementById("titleInput").value = "";
  document.querySelector("#listInput").innerHTML = "";
  markDone(currCardId);
}

function addTasksToExpandCardList(ulDiv, taskItems, currCardId) {
  let k = 0;
  ulDiv.innerHTML = "";
  taskItems.forEach((element) => {
    //for each starts here
    const newTodo = document.createElement("li");
    const addTask = document.createTextNode(element.name);
    newTodo.setAttribute("id", "lis");

    const chk = document.createElement("input");
    chk.setAttribute("type", "checkbox");
    chk.setAttribute("id", "myCheck");
    const chkId = `column${currCardId}${k++}`;
    chk.setAttribute("class", `${chkId}`);
    newTodo.setAttribute("class", `${chkId}`);
    chk.setAttribute("onclick", `changeStatusOfTask(${currCardId},${k - 1})`);

    newTodo.appendChild(chk);
    newTodo.appendChild(addTask);
    ulDiv.appendChild(newTodo);
  });
  return ulDiv;
}

function changeStatusOfTask(currCardId, taskNumber) {
  const allUsers = JSON.parse(localStorage.getItem("usersList"));
  const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
  const userIndex = getCurrentUserIndex();
  const index = findCurrentCard(currCardId, allUsers);
  let status = currUserTodos[index].tasks[taskNumber].done;
  if (status) {
    currUserTodos[index].tasks[taskNumber].done = false;
    status = false;
  } else {
    currUserTodos[index].tasks[taskNumber].done = true;
    status = true;
  }
  allUsers[userIndex].todos = currUserTodos;
  setCurrUserDataInLocalStorage(allUsers, "usersList");
  strikeThroughItem(currCardId, taskNumber, status);
}
const LI_ELEMENT_ITEM_TITLE = 0;
const INPUT_ELEMENT_CHECKBOX = 1;

function strikeThroughItem(currCardId, itemNumber, status) {
  const refernce = `column${currCardId}${itemNumber}`;
  const listItem = document.querySelectorAll(`.${refernce}`);
  if (status) {
    listItem[LI_ELEMENT_ITEM_TITLE].style.textDecoration = "line-through";
    listItem[INPUT_ELEMENT_CHECKBOX].checked = true;
  } else {
    listItem[LI_ELEMENT_ITEM_TITLE].style.textDecoration = "none";
    listItem[INPUT_ELEMENT_CHECKBOX].checked = false;
  }
}

function markDone(currCardId) {
  let allTasksDone = 0;
  const allUsers = JSON.parse(localStorage.getItem("usersList"));
  const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
  const index = findCurrentCard(currCardId, allUsers);
  const taskItemsLength = currUserTodos[index].tasks.length;
  for (let j = 0; j < taskItemsLength; j++) {
    if (currUserTodos[index].tasks[j].done) {
      strikeThroughItem(currCardId, j, true);
      allTasksDone++;
    }
  }

  if (allTasksDone == taskItemsLength) {
    let askToRemove = window.confirm(
      "All tasks are done in the list. Would you like to delete it?"
    );
    if (askToRemove) {
      removeCard(currCardId);
    }
  }
}

function removeCard(currCardId) {
  const allUsers = JSON.parse(localStorage.getItem("usersList"));
  const remCol = `column${currCardId}`;
  const element = document.getElementById(remCol);
  let todos = getCurrUserTodosFromLocalStorage("usersList");
  element.remove();
  const index = findCurrentCard(currCardId, allUsers);
  todos.splice(index, 1);
  const userIndex = getCurrentUserIndex();
  allUsers[userIndex].todos = todos;
  setCurrUserDataInLocalStorage(allUsers, "usersList");
  addFirstCardMsg();
  //   colorChange();
}

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + "\xa0\xa0\xa0\xa0\xa0" + time;
  return dateTime;
}

function trimExtraSpaces(inputString) {
  return inputString.replace(/^\s+|\s+$/g, "");
}

function assignCardId() {
  const todos = getCurrUserTodosFromLocalStorage("usersList");
  if (!todos || todos.length == 0) {
    return 0;
  }
  if (todos) {
    const length = todos.length;
    return todos[length - 1].id + 1;
  }
}

function getCurrentUserIndex() {
  const allUsers = JSON.parse(localStorage.getItem("usersList"));
  if (!allUsers || allUsers.length == 0) return;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].userName == CURRENT_USER) return i;
  }
}
function getCurrUserTodosFromLocalStorage(key) {
  const allUsers = JSON.parse(localStorage.getItem(key));
  if (!allUsers || allUsers.length == 0) return;
  const userIndex = getCurrentUserIndex();
  return allUsers[userIndex].todos;
}

function pushDataInLocalstorage(newCard, key) {
  const allUsers = JSON.parse(localStorage.getItem(key));
  const userIndex = getCurrentUserIndex();
  let presentCards = allUsers[userIndex].todos || [];
  presentCards.push(newCard);
  localStorage.setItem(key, JSON.stringify(allUsers));

  return;
}

function setCurrUserDataInLocalStorage(localStorageData, key) {
  localStorageData = JSON.stringify(localStorageData);
  localStorage.setItem(key, localStorageData);
}

function addFirstCardMsg() {
  let todos = getCurrUserTodosFromLocalStorage("usersList");
  if (!todos || todos.length == 0) {
    document.getElementById("emptyBoard").innerHTML =
      "Add your first task here!";
    return -1;
  }
}
function searchCardFromList(searchItem) {
  const currUserTodos = getCurrUserTodosFromLocalStorage("usersList");
  const allUsers = JSON.parse(localStorage.getItem("usersList"));
  const userIndex = getCurrentUserIndex();

  if (!currUserTodos || currUserTodos.length == 0) {
    return 0;
  }
  searchItem = searchItem.toUpperCase();
  console.log(searchItem);
  let searchedCards = currUserTodos.filter(function (e) {
    let cardTitle = e.title;
    return cardTitle.includes(searchItem);
  });
  allUsers[userIndex].todos = searchedCards;
  setCurrUserDataInLocalStorage(allUsers, "searchedList");
  document.querySelector(".row").innerHTML = "";
  if (searchedCards.length) {
    init("searchedList");
    document.querySelector("#noSearchResults").innerHTML = "";
  } else {
    document.querySelector("#noSearchResults").innerHTML = "No match found!";
  }
}

let searchItem = document.getElementById("searchCard");
searchItem.addEventListener("keydown", function (searchItem) {
  if (searchItem.keyCode === 13) {
    searchCardFromList(searchItem.target.value);
  }
});

window.addEventListener("load", onRouteChanged);
function onRouteChanged() {
  let hash = window.location.hash;
  let cardId;
  if (hash[1] == "e") {
    cardId = hash.slice(11);
    console.log(cardId);
    hash = "#expandCard";
  }

  switch (hash) {
    case "#taskicon":
      openAddTaskModal();
      break;

    case `#expandCard`:
      expandCard(Number(cardId));
      break;

    case `#homePage`:
      // expandCard(Number(cardId));
      break;
  }
}
