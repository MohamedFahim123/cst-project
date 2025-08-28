// Quantity Controls
export function initializeQuantityControls() {
  const decreaseBtn = document.getElementById("decreaseQty");
  const increaseBtn = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("quantity");

  const currentProductId = JSON.parse(localStorage.getItem("curr-product"));
  const allProducts = JSON.parse(localStorage.getItem("all-products"));
  const currentProduct = allProducts.find((product) => product.id === currentProductId);

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      let maxValue = currentProduct.stock;
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });

    quantityInput.addEventListener("change", function () {
      let value = parseInt(this.value);
      let min = 1;
      let max = currentProduct.stock;
      if (value > max) {
        this.value = max;
      } else {
        this.value = value;
      }
    });
  }
}
