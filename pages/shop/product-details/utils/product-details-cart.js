
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
