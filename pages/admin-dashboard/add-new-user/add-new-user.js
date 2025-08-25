import { generateSecureId } from "../../../actions/generateId.js";
import { showToast } from "../../../actions/showToast.js";
import { router } from "../../../js/router.js";

const setupFormValidation = () => {
    const form = document.getElementById('addUserForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            handleAddUser();
        }
    });

    document.getElementById('userConfirmPassword').addEventListener('input', validatePasswordMatch);
    document.getElementById('userPassword').addEventListener('input', validatePasswordMatch);
};

const validateForm = () => {
    const form = document.getElementById('addUserForm');

    form.classList.remove('was-validated');

    let isValid = true;
    const requiredFields = ['userUsername', 'userEmail', 'userPassword', 'userConfirmPassword', 'userRole'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.setCustomValidity('This field is required');
            isValid = false;
        } else {
            field.setCustomValidity('');
        }
    });

    const emailField = document.getElementById('userEmail');
    if (emailField.value && !isValidEmail(emailField.value)) {
        emailField.setCustomValidity('Please enter a valid email address');
        isValid = false;
    }

    if (!validatePasswordMatch()) {
        isValid = false;
    }

    const passwordField = document.getElementById('userPassword');
    if (passwordField.value && passwordField.value.length < 6) {
        passwordField.setCustomValidity('Password must be at least 6 characters');
        isValid = false;
    }

    form.classList.add('was-validated');
    
    return isValid;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePasswordMatch = () => {
    const password = document.getElementById('userPassword');
    const confirmPassword = document.getElementById('userConfirmPassword');
    
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords do not match');
        return false;
    } else {
        confirmPassword.setCustomValidity('');
        return true;
    }
};

// Check if email already exists
const isEmailExists = (email) => {
    const usersData = JSON.parse(localStorage.getItem('users')) || { users: [] };
    return usersData.users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Check if username already exists
const isUsernameExists = (username) => {
    const usersData = JSON.parse(localStorage.getItem('users')) || { users: [] };
    return usersData.users.some(user => user.username.toLowerCase() === username.toLowerCase());
};


const handleAddUser = () => {
    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const phone = document.getElementById('userPhone').value.trim();
    const address = document.getElementById('userAddress').value.trim();
    const role = document.getElementById('userRole').value;

    if (isEmailExists(email)) {
        showToast('Email already exists!', 'error');
        document.getElementById('userEmail').setCustomValidity('Email already exists');
        document.getElementById('userEmail').reportValidity();
        return;
    }

    if (isUsernameExists(username)) {
        showToast('Username already exists!', 'error');
        document.getElementById('userUsername').setCustomValidity('Username already exists');
        document.getElementById('userUsername').reportValidity();
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
        createdAt: new Date().toISOString()
    };

    const usersData = JSON.parse(localStorage.getItem('users')) || { users: [] };
    usersData.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(usersData));

    showToast('User added successfully!', 'success');

    // Reset form after successful submission
    document.getElementById('addUserForm').reset();
    document.getElementById('addUserForm').classList.remove('was-validated');
};

// Setup cancel button
const setupCancelButton = () => {
    document.getElementById('cancelAddUser').addEventListener('click', () => {
        // Go back to previous page or to users management
        router.navigate('/admin-dashboard/sellers');
    });
};

// Setup modal cleanup
const setupModalCleanup = () => {
    const successModal = document.getElementById('successModal');
    
    if (successModal) {
        successModal.addEventListener('hidden.bs.modal', () => {
            // Redirect after success modal is closed
            router.navigate('/admin-dashboard/sellers');
        });
    }
};

// Initialize add user functionality
export const initializeAddUser = () => {
    setupFormValidation();
    setupCancelButton();
    setupModalCleanup();
    
    // Add input event listeners for real-time validation
    document.getElementById('userEmail').addEventListener('blur', () => {
        const email = document.getElementById('userEmail').value.trim();
        if (email && isEmailExists(email)) {
            document.getElementById('userEmail').setCustomValidity('Email already exists');
        } else {
            document.getElementById('userEmail').setCustomValidity('');
        }
    });

    document.getElementById('userUsername').addEventListener('blur', () => {
        const username = document.getElementById('userUsername').value.trim();
        if (username && isUsernameExists(username)) {
            document.getElementById('userUsername').setCustomValidity('Username already exists');
        } else {
            document.getElementById('userUsername').setCustomValidity('');
        }
    });
};