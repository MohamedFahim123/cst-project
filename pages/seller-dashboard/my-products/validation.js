// --- Validation ---
function validateProduct({
  title,
  status,
  quantity,
  description,
  price,
  discount,
}) {
  const errors = {};
  const titleRegex = /^[A-Za-z0-9\s\-']{3,45}$/;
  const descRegex = /^.{8,150}$/;

  if (!titleRegex.test(title)) {
    errors.title =
      "Title must be 3–45 characters (letters, numbers, spaces, - ' allowed)";
  }
  if (!descRegex.test(description)) {
    errors.description = "Description must be 8–150 characters long";
  }

  quantity = Number(quantity);
  if (status === "inStock" && quantity === 0) {
    errors.quantity = "Quantity must be greater than 0 if in stock";
  }
  if (quantity < 0 || quantity > 1_000_000) {
    errors.quantity = "Quantity must be between 1 and 1,000,000";
  }

  price = Number(price);
  if (price <= 0 || price > 1_000_000_000) {
    errors.price = "Price must be greater than 0 and less than 1B";
  }

  discount = Number(discount);
  if (discount < 0 || discount >= 100) {
    errors.discount = "Discount must be between 0–99%";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Render validation Error Alerts

function showValidationErrors(errors) {
  // remove old alerts
  document.querySelectorAll(".error-alert").forEach((e) => e.remove());

  Object.entries(errors).forEach(([key, message]) => {
    const inputEl = inputs[key];
    if (inputEl) {
      const alert = document.createElement("div");
      alert.className = "alert alert-danger mt-2 p-1 error-alert";
      alert.innerText = message;
      inputEl.insertAdjacentElement("afterend", alert);
    }
  });
}

// Render Edit Validation Errors
function showEditValidationErrors(errors) {
  // remove old alerts
  document.querySelectorAll(".error-alert").forEach((e) => e.remove());

  Object.entries(errors).forEach(([key, message]) => {
    const inputEl = editInputs[key];
    if (inputEl) {
      const alert = document.createElement("div");
      alert.className = "alert alert-danger mt-2 p-1 error-alert";
      alert.innerText = message;
      inputEl.insertAdjacentElement("afterend", alert);
    }
  });
}

export { validateProduct, showValidationErrors, showEditValidationErrors };
