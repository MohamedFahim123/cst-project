import { User, Customer, Seller } from "../register/User.js";
import {
  validationErrors,
  validateUserRegister,
  displayErrorsAlerts,
} from "../register/validationUtils.js";

import {
  addUserToLocalStorage,
  setCurrentUser,
} from "../register/LocalStorageUtils.js";
import { router } from "../../js/router.js";
import { showToast } from "../../actions/showToast.js";

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
