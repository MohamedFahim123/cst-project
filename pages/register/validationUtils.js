// VALIDATION utilities

let validationErrors = {};

function validateUserRegister(userName, email, password) {
  validationErrors = {};

  const usernameRegex = /^[A-Za-z0-9_]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{8,}$/; // 8 chars minimum

  if (!usernameRegex.test(userName)) {
    validationErrors.userName =
      "Please Enter a valid User Name , at least 3 letters";
  }
  if (!emailRegex.test(email)) {
    validationErrors.email = "Please Enter a valid Email Address";
  }
  if (!passwordRegex.test(password)) {
    validationErrors.password =
      "Password must be at least 8 characters and contain letters";
  }
  return Object.keys(validationErrors).length === 0;
}

function displayErrorsAlerts(validationErrors, inputs) {
  document.querySelectorAll(".error-alert").forEach((e) => e.remove());

  Object.entries(validationErrors).forEach(([key, value]) => {
    let inputElement = inputs[key];

    if (inputElement) {
      const alert = document.createElement("div");
      alert.classList.add(
        "alert",
        "alert-danger",
        "mt-2",
        "p-1",
        "error-alert"
      );
      alert.innerText = value;
      inputElement.insertAdjacentElement("afterend", alert);
    }
  });
}

function validateUserLogin(email, password) {
  validationErrors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{8,}$/;

  if (!emailRegex.test(email)) {
    validationErrors.email = "Please enter a valid Email Address";
  }
  if (!passwordRegex.test(password)) {
    validationErrors.password =
      "Password must be at least 8 characters and contain letters";
  }

  return Object.keys(validationErrors).length === 0;
}

function displayLoginErrorsAlerts(validationErrors, inputs) {
  // remove old alerts
  document.querySelectorAll(".error-alert").forEach((e) => e.remove());

  Object.entries(validationErrors).forEach(([key, value]) => {
    let inputElement = inputs[key];

    if (inputElement) {
      const alert = document.createElement("div");
      alert.classList.add(
        "alert",
        "alert-danger",
        "mt-2",
        "p-1",
        "error-alert"
      );
      alert.innerText = value;
      inputElement.insertAdjacentElement("afterend", alert);
    }
  });
}

export {
  validationErrors,
  validateUserRegister,
  displayErrorsAlerts,
  validateUserLogin,
  displayLoginErrorsAlerts,
};
