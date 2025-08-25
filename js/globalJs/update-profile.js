import { showToast } from "../../actions/showToast.js";
const upUserData = {
  id: 1,
  username: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, ",
  avatar: "../../assets/avatar.jpg",
};
const defaultAvatar = "../../assets/avatar.jpg";

// Initialize update profile functionality
export function initializeUpdateProfile() {
  loadUserData();
  initializeFormHandlers();
  initializeImageUpload();
  initializeFormValidation();
}

// Load user data into form
function loadUserData() {
  // Try to get user data from localStorage first
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : upUserData;

  // Update avatar info section
  upUpdateElement("up-current-name", currentUser.username);
  upUpdateElement("up-current-email", currentUser.email);
  upUpdateImageElement("up-upload-img", currentUser.avatar || defaultAvatar);

  // Update form fields - only the basic profile fields
  upUpdateInputValue("up-update-name", currentUser.username);
  upUpdateInputValue("up-update-email", currentUser.email);
  upUpdateInputValue("up-update-phone", currentUser.phone);
  upUpdateInputValue("up-update-address", currentUser.address);
}

// Update element text content
function upUpdateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "Not provided";
  }
}

// Update image element source
function upUpdateImageElement(id, src) {
  const element = document.getElementById(id);
  if (element && src) {
    element.src = src;
  }
}

// Update input field value
function upUpdateInputValue(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.value = value;
  }
}

// Update checkbox state
function upUpdateCheckbox(id, checked) {
  const element = document.getElementById(id);
  if (element) {
    element.checked = !!checked;
  }
}

// Initialize form handlers
function initializeFormHandlers() {
  // Update profile form
  const updateForm = document.getElementById("up-update-form");
  if (updateForm) {
    updateForm.addEventListener("submit", handleProfileUpdate);
  }
}

// Handle profile update
function handleProfileUpdate(e) {
  e.preventDefault();

  // Collect form data
  const formData = {
    username: document.getElementById("up-update-name").value.trim(),
    email: document.getElementById("up-update-email").value.trim(),
    phone: document.getElementById("up-update-phone").value.trim(),
    address: document.getElementById("up-update-address").value.trim(),
    avatar: document.getElementById("up-avatar-input").files[0]
      ? URL.createObjectURL(document.getElementById("up-avatar-input").files[0])
      : defaultAvatar,
  };

  // Validate form data
  if (!validateForm(formData)) {
    return;
  }

  // Show loading state
  showLoadingState();

  // Simulate API call
  setTimeout(() => {
    try {
      // Update user data
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || upUserData;
      const updatedUser = { ...currentUser, ...formData };

      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Hide loading state
      hideLoadingState();

      // Show success message
      showToast("Profile updated successfully!", "success");

      // Update sidebar info
      upUpdateElement("pf-sidebar-name", updatedUser.username);
      upUpdateElement("pf-sidebar-email", updatedUser.email);
      upUpdateImageElement("pf-avatar-img", updatedUser.avatar);

      // Update avatar info section
      upUpdateElement("up-current-name", updatedUser.username);
      upUpdateElement("up-current-email", updatedUser.email);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error updating profile:", error);
      hideLoadingState();
      showToast("Error updating profile. Please try again.", "error");
    }
  }, 2000);
}

// Validate form data
function validateForm(formData) {
  let isValid = true;

  // Clear previous validation states
  clearValidationStates();

  // Required field validation
  if (!formData.username) {
    showFieldError("up-update-name", "Full name is required");
    isValid = false;
  }

  if (!formData.email) {
    showFieldError("up-update-email", "Email address is required");
    isValid = false;
  } else if (!isValidEmail(formData.email)) {
    showFieldError("up-update-email", "Please enter a valid email address");
    isValid = false;
  }

  // Phone validation (if provided)
  if (formData.phone && !isValidPhone(formData.phone)) {
    showFieldError("up-update-phone", "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
  const phoneRegex = /^[\+\-\s\(\)\d]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

// Show field error
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add("invalid");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".up-error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "up-error-message";
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorDiv);
  }
}

// Clear validation states
function clearValidationStates() {
  document.querySelectorAll(".up-form-control").forEach((field) => {
    field.classList.remove("invalid", "valid");
  });

  document.querySelectorAll(".up-error-message").forEach((error) => {
    error.remove();
  });
}

// Initialize image upload
function initializeImageUpload() {
  const avatarInput = document.getElementById("up-avatar-input");

  if (avatarInput) {
    avatarInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          showToast("Please select a valid image file", "error");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showToast("Image size should be less than 5MB", "error");
          return;
        }

        // Read and display image
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageUrl = e.target.result;
          upUpdateImageElement("up-upload-img", imageUrl);
          upUpdateImageElement("pf-avatar-img", imageUrl);

          // Save to user data (will be saved with form submission)
          const currentUser = JSON.parse(localStorage.getItem("currentUser")) || upUserData;
          // currentUser.avatar = imageUrl;
          currentUser.avatar = defaultAvatar; // Use a placeholder or default image path
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          // add this user to users array in local storage
          const users = JSON.parse(localStorage.getItem("users")) || [];
          const userIndex = users.users.findIndex((user) => user.id == currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem("users", JSON.stringify(users));
          }
          showToast("Profile picture updated!", "success");
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Initialize form validation
function initializeFormValidation() {
  // Real-time validation
  const formFields = document.querySelectorAll(".up-form-control");

  formFields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(this);
    });

    field.addEventListener("input", function () {
      // Clear error state on input
      this.classList.remove("invalid");
      const errorMessage = this.parentNode.querySelector(".up-error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });
}

// Validate individual field
function validateField(field) {
  const fieldId = field.id;
  const value = field.value.trim();

  switch (fieldId) {
    case "up-update-name":
      if (!value) {
        showFieldError(fieldId, "Full name is required");
      } else {
        field.classList.add("valid");
      }
      break;

    case "up-update-email":
      if (!value) {
        showFieldError(fieldId, "Email address is required");
      } else if (!isValidEmail(value)) {
        showFieldError(fieldId, "Please enter a valid email address");
      } else {
        field.classList.add("valid");
      }
      break;

    case "up-update-phone":
      if (value && !isValidPhone(value)) {
        showFieldError(fieldId, "Please enter a valid phone number");
      } else if (value) {
        field.classList.add("valid");
      }
      break;
  }
}

// Show loading state
function showLoadingState() {
  const submitBtn = document.querySelector(".up-btn-primary");
  if (submitBtn) {
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner up-btn-icon"></i>Updating Profile...';
  }
}

// Hide loading state
function hideLoadingState() {
  const submitBtn = document.querySelector(".up-btn-primary");
  if (submitBtn) {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save up-btn-icon"></i>Update Profile';
  }
}
