// Profile Page JavaScript Functionality

// Sample user data - in real application this would come from API/localStorage
const userData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  avatar: "https://via.placeholder.com/150x150/634c9f/ffffff?text=JD"
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
  initializeProfile();
  initializeTabSwitching();
  initializeFormHandlers();
  initializeImageUpload();
  loadUserProfile();
});

// Initialize profile functionality
function initializeProfile() {
  console.log('Profile page initialized');
}

// Tab switching functionality
function initializeTabSwitching() {
  const navLinks = document.querySelectorAll('.pf-nav-link');
  const tabContents = document.querySelectorAll('.pf-tab-content');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all nav links
      navLinks.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked nav link
      this.classList.add('active');
      
      // Hide all tab contents
      tabContents.forEach(tab => tab.classList.remove('active'));
      
      // Show target tab content
      const targetTabContent = document.getElementById(targetTab + '-tab');
      if (targetTabContent) {
        targetTabContent.classList.add('active');
      }
    });
  });
}

// Load user profile data
function loadUserProfile() {
  // Try to get user data from localStorage first
  const storedUser = localStorage.getItem('user-profile');
  const currentUser = storedUser ? JSON.parse(storedUser) : userData;
  
  // Update sidebar user info
  updateElement('pf-sidebar-name', currentUser.name);
  updateElement('pf-sidebar-email', currentUser.email);
  updateImageElement('pf-avatar-img', currentUser.avatar);
  
  // Update profile display
  updateElement('pf-display-name', currentUser.name);
  updateElement('pf-display-email', currentUser.email);
  updateElement('pf-display-phone', currentUser.phone || 'Not provided');
  updateElement('pf-display-address', currentUser.address || 'Not provided');
  updateImageElement('pf-profile-img', currentUser.avatar);
  
  // Update form fields
  updateInputValue('pf-update-name', currentUser.name);
  updateInputValue('pf-update-email', currentUser.email);
  updateInputValue('pf-update-phone', currentUser.phone);
  updateInputValue('pf-update-address', currentUser.address);
  updateImageElement('pf-upload-img', currentUser.avatar);
}

// Update element text content
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || 'Not provided';
  }
}

// Update image element source
function updateImageElement(id, src) {
  const element = document.getElementById(id);
  if (element && src) {
    element.src = src;
  }
}

// Update input field value
function updateInputValue(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.value = value;
  }
}

// Initialize form handlers
function initializeFormHandlers() {
  // Update profile form
  const updateForm = document.getElementById('pf-update-form');
  if (updateForm) {
    updateForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('pf-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', handleFormCancel);
  }
  
  // Logout button
  const logoutBtn = document.getElementById('pf-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// Handle profile update
function handleProfileUpdate(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('pf-update-name').value,
    email: document.getElementById('pf-update-email').value,
    phone: document.getElementById('pf-update-phone').value,
    address: document.getElementById('pf-update-address').value
  };
  
  // Validate form data
  if (!formData.name || !formData.email) {
    showNotification('Please fill in required fields (Name and Email)', 'error');
    return;
  }
  
  // Simulate API call
  showLoadingState('pf-update-form');
  
  setTimeout(() => {
    // Update user data
    const currentUser = JSON.parse(localStorage.getItem('user-profile')) || userData;
    const updatedUser = { ...currentUser, ...formData };
    
    // Save to localStorage
    localStorage.setItem('user-profile', JSON.stringify(updatedUser));
    
    // Reload profile data
    loadUserProfile();
    
    // Hide loading state
    hideLoadingState('pf-update-form');
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
    
    // Switch back to profile tab
    document.querySelector('[data-tab="profile"]').click();
  }, 1500);
}

// Handle form cancel
function handleFormCancel() {
  // Reset form to original values
  loadUserProfile();
  showNotification('Changes cancelled', 'info');
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear user data
    localStorage.removeItem('user-profile');
    localStorage.removeItem('user-session');
    
    // Show logout message
    showNotification('Logged out successfully', 'success');
    
    // Redirect to login page after delay
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 1500);
  }
}

// Initialize image upload functionality
function initializeImageUpload() {
  const avatarInput = document.getElementById('pf-avatar-input');
  const uploadImg = document.getElementById('pf-upload-img');
  
  if (avatarInput) {
    avatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showNotification('Please select a valid image file', 'error');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification('Image size should be less than 5MB', 'error');
          return;
        }
        
        // Read and display image
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageUrl = e.target.result;
          updateImageElement('pf-upload-img', imageUrl);
          updateImageElement('pf-profile-img', imageUrl);
          updateImageElement('pf-avatar-img', imageUrl);
          
          // Save to localStorage (in real app, you'd upload to server)
          const currentUser = JSON.parse(localStorage.getItem('user-profile')) || userData;
          currentUser.avatar = imageUrl;
          localStorage.setItem('user-profile', JSON.stringify(currentUser));
          
          showNotification('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Show loading state
function showLoadingState(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const submitBtn = form.querySelector('.pf-btn-primary');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin pf-btn-icon"></i>Updating...';
    }
  }
}

// Hide loading state
function hideLoadingState(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const submitBtn = form.querySelector('.pf-btn-primary');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-save pf-btn-icon"></i>Save Changes';
    }
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingToasts = document.querySelectorAll('.pf-toast');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `pf-toast pf-toast-${type}`;
  toast.innerHTML = `
    <div class="pf-toast-content">
      <i class="fas ${getNotificationIcon(type)} pf-toast-icon"></i>
      <span class="pf-toast-message">${message}</span>
      <button class="pf-toast-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add toast styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-left: 4px solid ${getNotificationColor(type)};
    padding: 1rem;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (toast && toast.parentElement) {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  return icons[type] || icons.info;
}

// Get notification color based on type
function getNotificationColor(type) {
  const colors = {
    success: '#16a34a',
    error: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  return colors[type] || colors.info;
}

// Add notification animations to page
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .pf-toast {
    transition: all 0.3s ease;
  }
  
  .pf-toast-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .pf-toast-icon {
    font-size: 1.2rem;
  }
  
  .pf-toast-message {
    flex: 1;
    font-weight: 500;
  }
  
  .pf-toast-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: color 0.2s;
  }
  
  .pf-toast-close:hover {
    color: #374151;
  }
`;
document.head.appendChild(style);

// Sample orders data for orders tab
function loadOrderHistory() {
  const ordersContainer = document.getElementById('pf-orders-container');
  
  // Sample orders (in real app, this would come from API)
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 3
    },
    {
      id: 'ORD-2024-002',
      date: '2024-02-20',
      status: 'Processing',
      total: 159.50,
      items: 2
    }
  ];
  
  if (orders.length === 0) {
    // Show empty state
    return;
  }
  
  // Create orders HTML
  const ordersHTML = orders.map(order => `
    <div class="pf-order-card">
      <div class="pf-order-header">
        <div class="pf-order-id">${order.id}</div>
        <div class="pf-order-status pf-status-${order.status.toLowerCase()}">${order.status}</div>
      </div>
      <div class="pf-order-details">
        <span class="pf-order-date">Date: ${new Date(order.date).toLocaleDateString()}</span>
        <span class="pf-order-total">Total: $${order.total}</span>
        <span class="pf-order-items">${order.items} items</span>
      </div>
    </div>
  `).join('');
  
  ordersContainer.innerHTML = ordersHTML;
}
