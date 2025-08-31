import { displayErrorsAlerts, validateUserLogin, validationErrors } from "../register/validationUtils.js";

import { showToast } from "../../actions/showToast.js";
import { router } from "../../js/router.js";
import { validateUserCredentials } from "../register/LocalStorageUtils.js";

function loginSubmitHandler() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const isValid = validateUserLogin(email, password);

    if (isValid) {
      const state = validateUserCredentials(email, password);
      if (state) {
        showToast("User Logged In Successfully", "success");
        router.navigate("/");
      }
    } else {
      showToast("Invalid User Inputs", "error");
      displayErrorsAlerts(validationErrors, {
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

// Initialize login functionality
export function initializeLogin() {
  loginSubmitHandler();
  initializePasswordToggle();
}
