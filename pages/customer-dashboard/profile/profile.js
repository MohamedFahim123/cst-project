// Profile Page JavaScript Functionality
const userData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  avatar: "",
};

export function initializeProfile() {
  loadUserProfile();
}

// Load user profile data
function loadUserProfile() {
  // Try to get user data from localStorage first
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : userData;

  // Update profile display
  updateElement("pf-display-name", currentUser.username);
  updateElement("pf-display-email", currentUser.email);
  updateElement("pf-display-phone", currentUser.phone || "Not provided");
  updateElement("pf-display-address", currentUser.address || "Not provided");
  updateImageElement("pf-profile-img", currentUser.avatar || "../../assets/avatar.jpg");
}

// Update element text content
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "Not provided";
  }
}

// Update image element source
function updateImageElement(id, src) {
  const element = document.getElementById(id);
  if (element && src) {
    element.src = src;
  }
}
