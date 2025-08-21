
// Quantity Controls
export function initializeQuantityControls() {
  const decreaseBtn = document.getElementById("decreaseQty");
  const increaseBtn = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("quantity");

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      let maxValue = parseInt(quantityInput.getAttribute("max")) || 10;
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });

    quantityInput.addEventListener("change", function () {
      let value = parseInt(this.value);
      let min = parseInt(this.getAttribute("min")) || 1;
      let max = parseInt(this.getAttribute("max")) || 10;

      if (isNaN(value) || value < min) {
        this.value = min;
      } else if (value > max) {
        this.value = max;
      }
    });
  }
}

// // Add to Cart Functionality
// export function initializeAddToCart() {
//   const addToCartBtn = document.querySelector(".add-to-cart-btn");
//   const quantityInput = document.getElementById("quantity");

//   if (addToCartBtn) {
//     addToCartBtn.addEventListener("click", function () {
//       const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

//       // Add loading state
//       const originalText = this.textContent;
//       this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...';
//       this.disabled = true;

//       // Simulate adding to cart
//       setTimeout(() => {
//         this.innerHTML = '<i class="fas fa-check me-2"></i>Added to Cart!';
//         this.classList.remove("btn-warning");
//         this.classList.add("btn-success");

//         setTimeout(() => {
//           this.textContent = originalText;
//           this.disabled = false;
//           this.classList.remove("btn-success");
//           this.classList.add("btn-warning");
//         }, 2000);

//         showNotification(`Added ${quantity} item(s) to cart!`);
//       }, 1000);
//     });
//   }
// }
