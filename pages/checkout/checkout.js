

export function checkoutValidation(){
    
   const form = document.querySelector(".checkout-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear old errors
    form.querySelectorAll(".error-msg").forEach(el => el.remove());

    // Validation rules
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    // Helper
    const showError = (input, msg) => {
      const error = document.createElement("small");
      error.className = "error-msg";
      error.style.color = "red";
      error.textContent = msg;
      input.parentNode.appendChild(error);
      isValid = false;
    };

    // First name & Last name
    const nameRegex = /^[A-Za-zأ-ي]+$/;
    if (!fname.value.trim() || !nameRegex.test(fname.value.trim())) {
      showError(fname, "❌ Please enter a valid first name");
    }
    if (!lname.value.trim() || !nameRegex.test(lname.value.trim())) {
      showError(lname, "❌ Please enter a valid last name");
    }

    // Address
    if (!address.value.trim()) {
      showError(address, "❌ Address is required");
    }

    // City
    if (!city.value.trim()) {
      showError(city, "❌ City is required");
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, "❌ Please enter a valid email address");
    }

    // Phone (Egyptian format example: 010xxxxxxxx / +2010xxxxxxxx)
    const phoneRegex = /^(?:\+20|0)?1[0-9]{9}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      showError(phone, "❌ Please enter a valid phone number");
    }

    // ✅ If valid → redirect
    if (isValid) {
      window.location.href = "#/payment";
    }})


}