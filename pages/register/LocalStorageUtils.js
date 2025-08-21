import { showToast } from "../../actions/showToast.js";

// add the newly Created User(customer/seller) to users arry & save in Local Storage
function addUserToLocalStorage(userObj) {
  // if there is already a users array
  const users = getUsersFromLocalStorage();

  users.push(userObj);

  localStorage.setItem("users", JSON.stringify({ users }));

  showToast("user Added Succesfully", "success");
}

// setting the newly created user as Current
function setCurrentUser(userobj) {
  localStorage.setItem("currentUser", JSON.stringify(userobj));
  showToast("new User Logged in ", "success");
}

// function that looks for a users array stored in local Storage
function getUsersFromLocalStorage() {
  const users = JSON.parse(localStorage.getItem("users")) || { users: [] };
  return users.users;
}

function checkIfUserExists(email) {
  const users = getUsersFromLocalStorage();
  const user = users.find((user) => user.email === email);
  return user ? true : false;
}

// check if User's Credentials match whats in localStorage
function validateUserCredentials(email, password) {
  let state = false;
  const users = getUsersFromLocalStorage();
  const user = users.find((user) => user.email === email);

  if (!user) {
    showToast("not such User , PLease Enter Valid Email", "error");
  } else if (user.password != password) {
    showToast("Uncorrect Password ,try again", "error");
  } else {
    setCurrentUser(user); // ADD THIS LINE - Set the current user
    state = true;
  }
  return state;
}

export {
  addUserToLocalStorage,
  checkIfUserExists,
  getUsersFromLocalStorage,
  setCurrentUser,
  validateUserCredentials,
};
