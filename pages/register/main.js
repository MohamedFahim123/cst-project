import { Customer, Seller } from "../register/User.js";
import {
  displayErrorsAlerts,
  validateUserRegister,
  validationErrors,
} from "../register/validationUtils.js";

import { showToast } from "../../actions/showToast.js";
import { router } from "../../js/router.js";
import {
  addUserToLocalStorage,
  checkIfUserExists,
  setCurrentUser,
} from "../register/LocalStorageUtils.js";

// event Handler for Form Submission

function registerSubmitHandler() {
  const userNameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const userName = userNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const role = document.querySelector(
        "input[name='userType']:checked"
      ).value;

      const isValidData = validateUserRegister(userName, email, password);

      const userExist = checkIfUserExists(email);
      if (userExist) {
        showToast("User Already Exists, Please Login", "error");
        return;
      }

      if (isValidData) {
        showToast("User Registered Successfully", "success");
        if (role === "customer") {
          const newCustomer = new Customer(userName, email, password);
          addUserToLocalStorage(newCustomer);
          setCurrentUser(newCustomer);
          router.navigate("/login");
        } else {
          const newSeller = new Seller(userName, email, password);
          addUserToLocalStorage(newSeller);
          setCurrentUser(newSeller);
          router.navigate("/login");
        }
      } else {
        showToast("User Registration Failed", "error");
        displayErrorsAlerts(validationErrors, {
          userName: userNameInput,
          email: emailInput,
          password: passwordInput,
        });
      }
    });
}

export { registerSubmitHandler };
