import {
  displayErrorsAlerts,
  validateUserLogin,
  validationErrors,
} from "../register/validationUtils.js";

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

export { loginSubmitHandler };
