let cardId = 0;

window.onload = init;

function init() {
  let localStorageData = getDataFromLocalStorage();
  if (!localStorageData || localStorageData.length == 0) {
    document.getElementById("emptyBoard").innerHTML =
      "Add your first task here!";
    return;
  }
  for (let index = 0; index < localStorageData.length; index++) {
    const taskTitle = localStorageData[index].title;
    const creationTime = localStorageData[index].creationTime;
    let taskItems = localStorageData[index].tasks;
    createCard(taskItems, taskTitle, creationTime);
  }
}

function createCard(taskItems, taskTitle, creationTime) {
  let chars = taskTitle.length;
  let cardSize = 1;
  let k = 0;

  let newCard = {
    title: taskTitle,
    creationTime: creationTime,
    tasks: []
  };
  let short_title = taskTitle;
  if (chars > 70) {
    short_title = taskTitle.slice(0, 40);
    short_title = short_title + "....";
  }

  taskItems.sort(function(x, y) {
    return x.done === y.done ? 0 : x.done ? 1 : -1;
  });

  const columnDiv = document.createElement("div");
  columnDiv.setAttribute("class", "column");
  columnDiv.setAttribute("id", `column${cardId}`);

  const closeDiv = document.createElement("span");
  closeDiv.setAttribute("class", "close");
  const closeX = document.createTextNode("x");
  closeDiv.appendChild(closeX);
  closeDiv.setAttribute("onclick", `removeCard(${cardId})`);

  const zoomDiv = document.createElement("span");
  zoomDiv.setAttribute("id", "btnExp");
  const zoomX = document.createTextNode("View");
  zoomDiv.appendChild(zoomX);
  zoomDiv.setAttribute("onclick", `expandCard(${cardId})`);

  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");

  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title");
  const newTitle = document.createTextNode(short_title);
  titleDiv.appendChild(newTitle);

  const ulDiv = document.createElement("ul");
  ulDiv.setAttribute("id", "list");

  taskItems.forEach(element => {
    //for each starts here
    if (cardSize < 4) {
      const newTodo = document.createElement("li");
      let addTask = document.createTextNode(element.name);
      newTodo.setAttribute("id", "listItem");
      chars = chars + element.name.length;
      newTodo.appendChild(addTask);
      ulDiv.appendChild(newTodo);
      cardSize++;
    }
    newCard.tasks.push(element);
    k++;
  }); // end of forEach loop
  if (taskItems.length > 3) {
    const largeCardIndicator = document.createElement("span");
    const enlarger = document.createTextNode(" . . . ");
    largeCardIndicator.appendChild(enlarger);
    zoomDiv.appendChild(largeCardIndicator);
  }

  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(ulDiv);
  columnDiv.appendChild(closeDiv);
  columnDiv.appendChild(zoomDiv);
  columnDiv.appendChild(cardDiv);
  document.querySelector(".row").appendChild(columnDiv);

  document.getElementById("titleInput").value = "";
  document.querySelector("#listInput").innerHTML = "";
  cardId++;
  document.getElementById("emptyBoard").innerHTML = " ";

  return newCard;
}

//when submit button gets clicked
function addTask() {
  let taskTitle = document.getElementById("titleInput").value;
  const dateTime = getDateTime();
  if (taskTitle == "") {
    taskTitle = "My Todo";
  }
  if (taskItems.length == 0) {
    document.getElementById("emptyListErr").innerHTML = "Please add tasks!";
  } else {
    taskTitle = taskTitle.replace(/^\s+|\s+$/g, "");
    document.getElementById("emptyListErr").innerHTML = "";
    let newCard = createCard(taskItems, taskTitle, dateTime);
    pushCardInLocalstorage(newCard);
    span.onclick();
  }
}

let taskItems = [];
//adding to modal list
function addToList() {
  let toDo = document.querySelector("#input").value;
  if (toDo == "") {
    document.getElementById("emptyTaskErr").innerHTML =
      "Please enter a valid task !";
  } else {
    toDo = toDo.replace(/^\s+|\s+$/g, "");
    document.getElementById("emptyTaskErr").innerHTML = "";
    document.getElementById("emptyListErr").innerHTML = "";

    let createTodo = document.createElement("li");
    createTodo.setAttribute("id", "newTask");
    let addTodo = document.createTextNode(toDo);
    createTodo.appendChild(addTodo);
    document.querySelector("#listInput").appendChild(createTodo);
    document.querySelector("#input").value = "";
    let newTask = {
      name: toDo,
      done: false
    };
    taskItems.push(newTask);
  }
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("closing")[0];

function openAddTaskModal() {
  taskItems = [];
  document.getElementById("overlay").style = "display:block";
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
  document.getElementById("overlay").style = "display:none";
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("overlay").style = "display:none";
  }
};

var closeExp = document.getElementsByClassName("closeExp")[0];
closeExp.onclick = function() {
  location.reload();
  document.querySelector(".exp").innerHTML = "";
  myModalExp.style.display = "none";
  document.getElementById("overlay").style = "display:none";
};

function expandCard(cardNumber) {
  document.querySelector(".dateTimeExp").innerHTML = "";
  document.getElementById("overlay").style = "display:block";
  document.getElementById("myModalExp").style.display = "block";

  const localStorageData = getDataFromLocalStorage();
  let k = 0;

  for (let index = 0; index < localStorageData.length; index++) {
    if (cardNumber == index) {
      var taskTitle = localStorageData[index].title;
      var taskItems = localStorageData[index].tasks;
      var creationTime = localStorageData[index].creationTime;
      break;
    }
  }

  const columnDiv = document.createElement("div");
  columnDiv.setAttribute("class", "column");
  columnDiv.setAttribute("id", `column${cardNumber}`);

  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "cardModal");

  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title");
  const newTitle = document.createTextNode(taskTitle);
  titleDiv.appendChild(newTitle);

  const ulDiv = document.createElement("ul");
  ulDiv.setAttribute("id", "list");

  let displayDateTime = document.createElement("div");
  displayDateTime.innerHTML = creationTime;

  taskItems.forEach(element => {
    //for each starts here
    const newTodo = document.createElement("li");
    const addTask = document.createTextNode(element.name);
    newTodo.setAttribute("id", "lis");

    const chk = document.createElement("input");
    chk.setAttribute("type", "checkbox");
    chk.setAttribute("id", "myCheck");
    const chkId = `column${cardNumber}${k++}`;
    chk.setAttribute("class", `${chkId}`);
    newTodo.setAttribute("class", `${chkId}`);
    chk.setAttribute("onclick", `changeStatusOfTask(${cardNumber},${k - 1})`);

    newTodo.appendChild(chk);
    newTodo.appendChild(addTask);
    ulDiv.appendChild(newTodo);
  }); // end of forEach loop

  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(ulDiv);
  columnDiv.appendChild(cardDiv);
  document.querySelector(".exp").appendChild(columnDiv);
  document.querySelector(".dateTimeExp").appendChild(displayDateTime);

  document.getElementById("titleInput").value = "";
  document.querySelector("#listInput").innerHTML = "";
  markDone(cardNumber);
}

function removeCard(cardNumber) {
  const remCol = `column${cardNumber}`;
  const element = document.getElementById(remCol);
  let localStorageData = getDataFromLocalStorage();
  element.remove();
  localStorageData.splice(cardNumber, 1);
  setDataInLocalStorage(localStorageData);
  location.reload();
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

function getDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem("todoList"));
}

function pushCardInLocalstorage(localStorageData) {
  let oldData = JSON.parse(localStorage.getItem("todoList")) || [];
  oldData.push(localStorageData);
  localStorageData = JSON.stringify(oldData);
  localStorage.setItem("todoList", localStorageData);

  return;
}

function setDataInLocalStorage(localStorageData) {
  localStorageData = JSON.stringify(localStorageData);
  localStorage.setItem("todoList", localStorageData);
}

const LI_ELEMENT_ITEM_TITLE = 0;
const INPUT_ELEMENT_CHECKBOX = 1;

function strikeThroughItem(cardNumber, itemNumber, status) {
  const refernce = `column${cardNumber}${itemNumber}`;
  const listItem = document.querySelectorAll(`.${refernce}`);
  if (status) {
    listItem[LI_ELEMENT_ITEM_TITLE].style.textDecoration = "line-through";
    listItem[INPUT_ELEMENT_CHECKBOX].checked = true;
  } else {
    listItem[LI_ELEMENT_ITEM_TITLE].style.textDecoration = "none";
    listItem[INPUT_ELEMENT_CHECKBOX].checked = false;
  }
}

function changeStatusOfTask(cardNumber, taskNumber) {
  let localStorageData = getDataFromLocalStorage();
  let status = localStorageData[cardNumber].tasks[taskNumber].done;
  if (status) {
    localStorageData[cardNumber].tasks[taskNumber].done = false;
    status = false;
  } else {
    localStorageData[cardNumber].tasks[taskNumber].done = true;
    status = true;
  }
  setDataInLocalStorage(localStorageData);
  strikeThroughItem(cardNumber, taskNumber, status);
}

function markDone(cardNumber) {
  let allTasksDone = 0;
  const localStorageData = getDataFromLocalStorage();
  const currentTask = localStorageData[cardNumber];
  const taskItemsLength = currentTask.tasks.length;

  for (let j = 0; j < taskItemsLength; j++) {
    if (currentTask.tasks[j].done) {
      strikeThroughItem(cardNumber, j, true);
      allTasksDone++;
    }
  }
  if (allTasksDone == taskItemsLength) {
    let askToRemove = window.confirm(
      "All tasks are done in the list. Would you like to delete it?"
    );
    if (askToRemove) {
      removeCard(cardNumber);
    }
  }
}
