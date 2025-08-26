import { generateSecureId } from "../../../actions/generateId.js";
import { showToast } from "../../../actions/showToast.js";
import { router } from "../../../js/router.js";

const setupFormValidation = () => {
  const form = document.getElementById("addUserForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      handleAddUser();
    }
  });

  document
    .getElementById("userConfirmPassword")
    .addEventListener("input", validatePasswordMatch);
  document
    .getElementById("userPassword")
    .addEventListener("input", validatePasswordStrength);
};

const validateForm = () => {
  const form = document.getElementById("addUserForm");

  form.classList.remove("was-validated");

  let isValid = true;
  const requiredFields = [
    "userUsername",
    "userEmail",
    "userPassword",
    "userConfirmPassword",
    "userRole",
  ];

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.setCustomValidity("This field is required");
      isValid = false;
    } else {
      field.setCustomValidity("");
    }
  });

  const emailField = document.getElementById("userEmail");
  if (emailField.value && !isValidEmail(emailField.value)) {
    emailField.setCustomValidity("Please enter a valid email address");
    isValid = false;
  } else if (emailField.value && isEmailExists(emailField.value)) {
    emailField.setCustomValidity("Email already exists");
    isValid = false;
  }

  const usernameField = document.getElementById("userUsername");
  if (usernameField.value && isUsernameExists(usernameField.value)) {
    usernameField.setCustomValidity("Username already exists");
    isValid = false;
  }

  if (!validatePasswordMatch()) {
    isValid = false;
  }

  if (!validatePasswordStrength()) {
    isValid = false;
  }

  form.classList.add("was-validated");

  return isValid;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordMatch = () => {
  const password = document.getElementById("userPassword");
  const confirmPassword = document.getElementById("userConfirmPassword");

  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match");
    return false;
  } else {
    confirmPassword.setCustomValidity("");
    return true;
  }
};

const validatePasswordStrength = () => {
  const password = document.getElementById("userPassword");

  if (password.value && password.value.length < 8) {
    password.setCustomValidity("Password must be at least 8 characters long");
    updatePasswordStrengthIndicator("weak");
    return false;
  } else if (password.value) {
    const hasUpperCase = /[A-Z]/.test(password.value);
    const hasLowerCase = /[a-z]/.test(password.value);
    const hasNumbers = /\d/.test(password.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);

    let strength = "medium";
    if (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      password.value.length >= 12
    ) {
      strength = "strong";
    } else if (
      (hasUpperCase && hasLowerCase) ||
      (hasNumbers && password.value.length >= 10)
    ) {
      strength = "medium";
    } else {
      strength = "weak";
    }

    updatePasswordStrengthIndicator(strength);
    password.setCustomValidity("");
    return true;
  }

  updatePasswordStrengthIndicator("");
  return true;
};

const updatePasswordStrengthIndicator = (strength) => {
  const existingIndicator = document.getElementById(
    "passwordStrengthIndicator"
  );
  if (existingIndicator) {
    existingIndicator.remove();
  }

  const passwordField = document.getElementById("userPassword");
  const strengthMessages = {
    weak: "Password strength: Weak (min. 8 characters)",
    medium: "Password strength: Medium",
    strong: "Password strength: Strong",
  };

  if (strength) {
    const indicator = document.createElement("div");
    indicator.id = "passwordStrengthIndicator";
    indicator.className = `form-text strength-${strength}`;
    indicator.textContent = strengthMessages[strength] || "";

    indicator.style.marginTop = "5px";
    indicator.style.fontSize = "0.875rem";

    if (strength === "weak") {
      indicator.style.color = "#dc3545";
    } else if (strength === "medium") {
      indicator.style.color = "#fd7e14";
    } else if (strength === "strong") {
      indicator.style.color = "#198754";
    }

    passwordField.parentNode.appendChild(indicator);
  }
};

const isEmailExists = (email) => {
  try {
    const usersData = JSON.parse(localStorage.getItem("users")) || {
      users: [],
    };
    return usersData.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error("Error reading users from localStorage:", error);
    return false;
  }
};

const isUsernameExists = (username) => {
  try {
    const usersData = JSON.parse(localStorage.getItem("users")) || {
      users: [],
    };
    return usersData.users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  } catch (error) {
    console.error("Error reading users from localStorage:", error);
    return false;
  }
};

const handleAddUser = () => {
  const username = document.getElementById("userUsername").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();
  const role = document.getElementById("userRole").value;

  if (isEmailExists(email)) {
    showToast("Email already exists!", "error");
    document
      .getElementById("userEmail")
      .setCustomValidity("Email already exists");
    document.getElementById("userEmail").reportValidity();
    return;
  }

  if (isUsernameExists(username)) {
    showToast("Username already exists!", "error");
    document
      .getElementById("userUsername")
      .setCustomValidity("Username already exists");
    document.getElementById("userUsername").reportValidity();
    return;
  }

  if (password.length < 8) {
    showToast("Password must be at least 8 characters long!", "error");
    document
      .getElementById("userPassword")
      .setCustomValidity("Password must be at least 8 characters");
    document.getElementById("userPassword").reportValidity();
    return;
  }

  const newUser = {
    id: generateSecureId(),
    username: username,
    email: email,
    password: password,
    phone: phone || null,
    address: address || null,
    role: role,
    createdAt: new Date().toISOString(),
  };

  try {
    const usersData = JSON.parse(localStorage.getItem("users")) || {
      users: [],
    };
    usersData.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(usersData));

    showToast("User added successfully!", "success");

    document.getElementById("addUserForm").reset();
    document.getElementById("addUserForm").classList.remove("was-validated");

    const indicator = document.getElementById("passwordStrengthIndicator");
    if (indicator) {
      indicator.remove();
    }
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
    showToast("Error saving user. Please try again.", "error");
  }
};

const setupCancelButton = () => {
  document.getElementById("cancelAddUser").addEventListener("click", () => {
    router.navigate("/admin-dashboard/sellers");
  });
};

const setupModalCleanup = () => {
  const successModal = document.getElementById("successModal");

  if (successModal) {
    successModal.addEventListener("hidden.bs.modal", () => {
      router.navigate("/admin-dashboard/sellers");
    });
  }
};

export const initializeAddUser = () => {
  setupFormValidation();
  setupCancelButton();
  setupModalCleanup();

  document.getElementById("userEmail").addEventListener("blur", () => {
    const email = document.getElementById("userEmail").value.trim();
    if (email && isEmailExists(email)) {
      document
        .getElementById("userEmail")
        .setCustomValidity("Email already exists");
      showToast("Email already exists!", "error");
    } else {
      document.getElementById("userEmail").setCustomValidity("");
    }
  });

  document.getElementById("userUsername").addEventListener("blur", () => {
    const username = document.getElementById("userUsername").value.trim();
    if (username && isUsernameExists(username)) {
      document
        .getElementById("userUsername")
        .setCustomValidity("Username already exists");
      showToast("Username already exists!", "error");
    } else {
      document.getElementById("userUsername").setCustomValidity("");
    }
  });

  document
    .getElementById("userPassword")
    .addEventListener("input", validatePasswordStrength);
};
