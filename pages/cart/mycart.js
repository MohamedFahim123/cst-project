import { cart } from "../../actions/cart.js";
import { showToast } from "../../actions/showToast.js";

let cartInitialized = false;

export function initializeCart() {
  if (cartInitialized) return;

  const cartItems = cart.items;
  renderCartItems(cartItems);
  updateCartTotals(cartItems);
  toggleEmptyState(cartItems);

  document.addEventListener("click", (e) => {
    if (e.target.id == "clear-cart") clearCart();
  });
  document
    .getElementById("update-cart")
    ?.addEventListener("click", updateCartQuantities);

  // Listen for cart changes
  cart.onChange(handleCartChange);

  cartInitialized = true;
}

function handleCartChange() {
  const cartItems = cart.items;
  renderCartItems(cartItems);
  updateCartTotals(cartItems);
  toggleEmptyState(cartItems);
}

function renderCartItems(items) {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  if (!items || items.length === 0) {
    cartItemsContainer.innerHTML = "";
    return;
  }

  const allProducts = JSON.parse(localStorage.getItem("all-products") || "[]");

  cartItemsContainer.innerHTML = items
    .map((item) => {
      const product = allProducts.find((p) => p.id == item.id) || {};
      return `
      <tr data-id="${item.id}">
        <td>
          <div class="d-flex align-items-center">
            <img src="${product.thumbnail}" class="product-img me-3" alt="${
        item.name
      }">
            <div>
              <h6 class="mb-0">${item.name}</h6>
              <small class="text-muted">SKU: ${item.id}</small>
            </div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" name="quantity" autocomplete="off" value="${
            item.quantity
          }" min="1" class="quantity-input" data-id="${item.id}">
        </td>
        <td class="item-total">$${(item.price * item.quantity).toFixed(2)}</td>
        <td class="product-remove">
          <a href="#" class="delete-row" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i>
          </a>
        </td>
      </tr>
    `;
    })
    .join("");

  document.querySelectorAll(".delete-row").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      removeFromCart(id);
    });
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function (e) {
      updateSingleItemQuantity(this.dataset.id, parseInt(this.value), e.target);
    });

    input.addEventListener("input", function () {
      updateSingleItemTotal(this.dataset.id, parseInt(this.value));
    });
  });
}

function updateSingleItemQuantity(productId, quantity, input) {
  if (quantity > 0) {
    const allProducts = JSON.parse(
      localStorage.getItem("all-products") || "[]"
    );
    const item = allProducts.find(
      (p) => p.id.toString().toLowerCase() === productId.toLowerCase()
    );

    if (+quantity > +item.stock) {
      showToast("Quantity exceeds stock", "error");
      input.value = item.stock;
      return;
    } else {
      cart.updateQuantity(productId, quantity);
      showToast("Quantity updated", "success");
    }
  }
}

function updateSingleItemTotal(productId, quantity) {
  if (quantity > 0) {
    const item = cart.items.find((item) => item.id == productId);
    if (item) {
      const itemTotal = item.price * quantity;
      const totalElement = document.querySelector(
        `tr[data-id="${productId}"] .item-total`
      );
      if (totalElement) {
        totalElement.textContent = `$${itemTotal.toFixed(2)}`;
      }
    }
  }
}

function updateCartTotals(items) {
  if (!items || items.length === 0) {
    if (document.getElementById("subtotal"))
      document.getElementById("subtotal").textContent = "$0";
    if (document.getElementById("shipping"))
      document.getElementById("shipping").textContent = "$0";
    if (document.getElementById("total"))
      document.getElementById("total").textContent = "$0";
    return;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (document.getElementById("subtotal"))
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  if (document.getElementById("shipping"))
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
  if (document.getElementById("total"))
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

function toggleEmptyState(items) {
  const emptyCart = document.getElementById("empty-cart-message");
  const cartContent = document.getElementById("cart-content");

  if (!emptyCart || !cartContent) return;

  if (!items || items.length === 0) {
    emptyCart.style.display = "block";
    cartContent.style.display = "none";
  } else {
    emptyCart.style.display = "none";
    cartContent.style.display = "block";
  }
}

function removeFromCart(id) {
  try {
    cart.remove(id);
    showToast("Item removed from cart", "success");
  } catch (e) {
    console.error("Error removing from cart:", e);
    showToast("Error removing item", "error");
  }
}

export function clearCart() {
  try {
    const modal = new bootstrap.Modal(
      document.getElementById("deleteCartModal")
    );
    modal.show();

    const confirmBtn = document.getElementById("confirmDeleteCart");
    confirmBtn.onclick = () => {
      cart.clear();
      showToast("Cart cleared", "success");
      modal.hide();
    };
  } catch (e) {
    console.error("Error clearing cart:", e);
    showToast("Error clearing cart", "error");
  }
}

function updateCartQuantities(e) {
  e.preventDefault();

  try {
    const quantityInputs = document.querySelectorAll(".quantity-input");
    let updated = false;

    quantityInputs.forEach((input) => {
      const id = input.dataset.id;
      const quantity = parseInt(input.value);

      if (quantity > 0) {
        cart.updateQuantity(id, quantity);
        updated = true;
      }
    });

    if (updated) {
      showToast("Cart updated", "success");
    }
  } catch (e) {
    console.error("Error updating cart:", e);
    showToast("Error updating cart", "error");
  }
}

function applyCoupon(e) {
  e.preventDefault();
  showToast("Coupon functionality not implemented yet", "info");
}

// Export a function to manually refresh the cart
export function refreshCart() {
  const cartItems = cart.items;
  renderCartItems(cartItems);
  updateCartTotals(cartItems);
  toggleEmptyState(cartItems);
}
