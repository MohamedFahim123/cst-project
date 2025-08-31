import { Customer, Seller } from "./User.js";
import { displayErrorsAlerts, validateUserRegister, validationErrors } from "./validationUtils.js";

import { showToast } from "../../actions/showToast.js";
import { router } from "../../js/router.js";
import { addUserToLocalStorage, checkIfUserExists, setCurrentUser } from "./LocalStorageUtils.js";

// event Handler for Form Submission

function registerSubmitHandler() {
  const userNameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const userName = userNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = document.querySelector("input[name='userType']:checked").value;

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

// Initialize password toggle functionality
function initializePasswordToggle() {
  const passwordToggle = document.getElementById("passwordToggle");
  const passwordInput = document.getElementById("password");
  const passwordToggleIcon = document.getElementById("passwordToggleIcon");

  if (passwordToggle && passwordInput && passwordToggleIcon) {
    passwordToggle.addEventListener("click", function () {
      // Toggle password visibility
      const isPasswordVisible = passwordInput.type === "text";

      if (isPasswordVisible) {
        // Hide password
        passwordInput.type = "password";
        passwordToggleIcon.classList.remove("fa-eye-slash");
        passwordToggleIcon.classList.add("fa-eye");
        passwordToggle.setAttribute("aria-label", "Show password");
      } else {
        // Show password
        passwordInput.type = "text";
        passwordToggleIcon.classList.remove("fa-eye");
        passwordToggleIcon.classList.add("fa-eye-slash");
        passwordToggle.setAttribute("aria-label", "Hide password");
      }
    });

    // Handle keyboard interaction for accessibility
    passwordToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  }
}

// Initialize register functionality
export function initializeRegister() {
  registerSubmitHandler();
  initializePasswordToggle();
}
