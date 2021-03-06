function registerUser() {
  document.querySelector("#blankPasswordError").innerHTML = "";
  document.querySelector("#userNameError").innerHTML = "";
  signupForm = document.querySelector("#signupForm");
  let allUsers = JSON.parse(localStorage.getItem("usersList"));
  const name = signupForm.userName.value;
  if (name === "") {
    document.querySelector("#userNameError").innerHTML =
      "Please enter a valid username.";
    return;
  }

  if (!allUsers || allUsers.length === 0) {
    allUsers = [];
  }

  const duplicateUserName = allUsers.filter(function (e) {
    return e.userName === name;
  });
  if (!duplicateUserName || duplicateUserName.length === 0) {
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    if (password === "") {
      document.querySelector("#blankPasswordError").innerHTML =
        "Please Enter a valid password!";
    } else {
      createUser(name, email, password);
      signupForm.reset();
    }
  } else {
    document.querySelector("#userNameError").innerHTML =
      "The username already exists!";
    // window.document.location = `./signup.html`;
  }
}

function createUser(name, email, password) {
  const user = {
    userName: name,
    password: password,
    emailId: email,
    todos: [],
  };
  pushDataInLocalstorage(user, "usersList");
}

function pushDataInLocalstorage(localStorageData, key) {
  const oldData = JSON.parse(localStorage.getItem(key)) || [];
  oldData.push(localStorageData);
  localStorageData = JSON.stringify(oldData);
  localStorage.setItem(key, localStorageData);
  window.document.location = `./login.html`;

  return;
}
