import { showToast } from "../../actions/showToast.js";
import imageDB from "../../actions/indexedDB.js";
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
export async function initializeUpdateProfile() {
  await loadUserData();
  initializeFormHandlers();
  initializeImageUpload();
  initializeFormValidation();
}

// Load user data into form
async function loadUserData() {
  // Try to get user data from localStorage first
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : upUserData;

  // Update avatar info section
  upUpdateElement("up-current-name", currentUser.username);
  upUpdateElement("up-current-email", currentUser.email);

  // Load avatar from IndexedDB
  await loadUserAvatar(currentUser.avatar);

  // Update form fields - only the basic profile fields
  upUpdateInputValue("up-update-name", currentUser.username);
  upUpdateInputValue("up-update-email", currentUser.email);
  upUpdateInputValue("up-update-phone", currentUser.phone);
  upUpdateInputValue("up-update-address", currentUser.address);
}

// Load user avatar from IndexedDB
async function loadUserAvatar(avatarId) {
  // Check IndexedDB support
  if (!checkIndexedDBSupport()) {
    // Fallback to default avatar
    upUpdateImageElement("up-upload-img", defaultAvatar);
    upUpdateImageElement("pf-avatar-img", defaultAvatar);
    return;
  }

  const avatarUrl = await imageDB.getImageBlobUrl(avatarId);

  if (avatarUrl) {
    upUpdateImageElement("up-upload-img", avatarUrl);
    upUpdateImageElement("pf-avatar-img", avatarUrl);
  } else {
    // Fallback to default avatar
    upUpdateImageElement("up-upload-img", defaultAvatar);
    upUpdateImageElement("pf-avatar-img", defaultAvatar);
  }
}

// Clean up old avatar images (keep only the latest 3 for each user)
async function cleanupOldAvatars(userId) {
  try {
    const userImages = await imageDB.getUserImages(userId);
    const avatarImages = userImages
      .filter((img) => img.type === "avatar")
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Keep only the latest 3 avatars, delete the rest
    if (avatarImages.length > 3) {
      const imagesToDelete = avatarImages.slice(3);
      for (const img of imagesToDelete) {
        await imageDB.deleteImage(img.id);
      }
      console.log(`Cleaned up ${imagesToDelete.length} old avatar images for user ${userId}`);
    }
  } catch (error) {
    console.error("Error cleaning up old avatars:", error);
  }
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

// Initialize form handlers
function initializeFormHandlers() {
  // Update profile form
  const updateForm = document.getElementById("up-update-form");
  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      await handleProfileUpdate(e);
    });
  }
}

// Handle profile update
async function handleProfileUpdate(e) {
  e.preventDefault();

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || upUserData;

  // Collect form data
  const formData = {
    username: document.getElementById("up-update-name").value.trim(),
    phone: document.getElementById("up-update-phone").value.trim(),
    address: document.getElementById("up-update-address").value.trim(),
  };

  // Check if there's a new avatar image
  const avatarFile = document.getElementById("up-avatar-input").files[0];

  // Validate form data
  if (!validateForm(formData)) {
    return;
  }

  // Show loading state
  showLoadingState();

  try {
    // Handle avatar upload if there's a new image and IndexedDB is supported
    if (avatarFile && checkIndexedDBSupport()) {
      const avatarId = await imageDB.storeImage(currentUser.id, avatarFile, "avatar");
      formData.avatar = avatarId;

      // Get blob URL for immediate display
      const avatarUrl = await imageDB.getImageBlobUrl(avatarId);
      if (avatarUrl) {
        upUpdateImageElement("up-upload-img", avatarUrl);
        upUpdateImageElement("pf-avatar-img", avatarUrl);
      }

      // Clean up old avatars to prevent storage bloat
      await cleanupOldAvatars(currentUser.id);
    }

    // Update user data
    const updatedUser = { ...currentUser, ...formData };

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update users array in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.users.findIndex((user) => user.id == currentUser.id);
    if (userIndex !== -1) {
      users.users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Hide loading state
    hideLoadingState();

    // Show success message
    showToast("Profile updated successfully!", "success");

    // Update sidebar info
    upUpdateElement("pf-sidebar-name", updatedUser.username);

    // Update avatar info section
    upUpdateElement("up-current-name", updatedUser.username);
    upUpdateElement("up-current-email", updatedUser.email);

    // Clear the file input
    document.getElementById("up-avatar-input").value = "";

    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    hideLoadingState();
    showToast("Error updating profile. Please try again.", "error");
  }
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

  // Phone validation (if provided)
  if (formData.phone && !isValidPhone(formData.phone)) {
    showFieldError("up-update-phone", "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
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

// Initialize image upload with IndexedDB
function initializeImageUpload() {
  const avatarInput = document.getElementById("up-avatar-input");

  if (avatarInput) {
    avatarInput.addEventListener("change", async function (e) {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          showToast("Please select a valid image file", "error");
          this.value = "";
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showToast("Image size should be less than 5MB", "error");
          this.value = "";
          return;
        }

        // Create blob URL for immediate preview
        const previewUrl = URL.createObjectURL(file);

        // Update image elements for preview
        upUpdateImageElement("up-upload-img", previewUrl);
        upUpdateImageElement("pf-avatar-img", previewUrl);

        showToast("Image selected successfully!", "info");

        // Clean up the preview URL after a delay to prevent memory leaks
        setTimeout(() => {
          URL.revokeObjectURL(previewUrl);
        }, 60000); // Clean up after 1 minute
      } catch (error) {
        console.error("Error handling image upload:", error);
        showToast("Error processing image. Please try again.", "error");
        this.value = "";

        // Reset to default or current avatar
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || upUserData;
        loadUserAvatar(currentUser);
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

// Check IndexedDB support
function checkIndexedDBSupport() {
  if (!("indexedDB" in window)) {
    showToast(
      "Your browser does not support advanced image storage. Images will not be saved permanently.",
      "warning"
    );
    return false;
  }
  return true;
}
