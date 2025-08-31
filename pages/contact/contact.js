import { showToast } from "../../actions/showToast.js";

export function validateContactUs() {
  const form = document.getElementById("cu-contact-form");
  if (!form) return;

  // Selectors
  const firstName = document.getElementById("cu-first-name");
  const lastName = document.getElementById("cu-last-name");
  const email = document.getElementById("cu-email");
  const phone = document.getElementById("cu-phone");
  const subject = document.getElementById("cu-subject");
  const message = document.getElementById("cu-message");
  const privacy = document.getElementById("cu-privacy");

  // Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:010|011|012|015)\d{8}$/;

  // Helper: blur required check and validation border
  function blurValidation(input, validateFn) {
    input.addEventListener("blur", () => {
      if ((input.type === "checkbox" && !input.checked) || (input.tagName === "SELECT" && !input.value) || !input.value || input.value.trim() === "") {
        showToast("Required input", "error");
        input.style.border = "1.5px solid red";
      } else if (validateFn && !validateFn(input.value)) {
        input.style.border = "1.5px solid red";
      } else {
        input.style.border = "";
      }
    });
    // Remove red border on input if valid
    input.addEventListener("input", () => {
      if (validateFn && validateFn(input.value)) {
        input.style.border = "";
      }
    });
    // For checkbox
    if (input.type === "checkbox") {
      input.addEventListener("change", () => {
        if (input.checked) {
          input.style.outline = "";
        }
      });
    }
  }

  blurValidation(firstName, (val) => val && val.trim().length > 3);
  blurValidation(lastName, (val) => val && val.trim().length > 3);
  blurValidation(email, (val) => emailRegex.test(val.trim()));
  blurValidation(phone, (val) => phoneRegex.test(val.trim()));
  blurValidation(subject, (val) => val && val.trim().length > 3 && val.trim().length <= 150);
  blurValidation(message, (val) => val && val.trim().length > 0);
  blurValidation(privacy, () => privacy.checked);

  // Form submit validation
  form.addEventListener("submit", function (e) {
    let valid = true;

    // First Name
    if (!firstName.value || firstName.value.trim().length <= 3) {
      showToast("First name is not valid", "error");
      firstName.style.border = "1.5px solid red";
      valid = false;
    }

    // Last Name
    if (!lastName.value || lastName.value.trim().length <= 3) {
      showToast("Last name is not valid", "error");
      lastName.style.border = "1.5px solid red";
      valid = false;
    }

    // Email
    if (!email.value || !emailRegex.test(email.value.trim())) {
      showToast("Invalid Email", "error");
      email.style.border = "1.5px solid red";
      valid = false;
    }

    // Phone
    if (!phone.value || !phoneRegex.test(phone.value.trim())) {
      showToast("Invalid Phone Number", "error");
      phone.style.border = "1.5px solid red";
      valid = false;
    }

    // Subject
    if (!subject.value || subject.value.trim().length <= 3 || subject.value.trim().length > 150) {
      showToast("Invalid Subject", "error");
      subject.style.border = "1.5px solid red";
      valid = false;
    }

    // Message
    if (!message.value || message.value.trim().length === 0) {
      showToast("Required input", "error");
      message.style.border = "1.5px solid red";
      valid = false;
    }

    // Privacy Policy
    if (!privacy.checked) {
      showToast("Required input", "error");
      privacy.style.border = "2px solid red";
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    }
  });
}

// Call the function after DOM is loaded
