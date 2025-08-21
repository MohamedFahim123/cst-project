import { cart } from "../../actions/cart.js";
import { showToast } from "../../actions/showToast.js";
import { wishlist } from "../../actions/wishlist.js";

let wishlistInitialized = false;

export function initializeWishlist() {
  if (wishlistInitialized) return;

  // Check if user is logged in
  const userLogin = localStorage.getItem("currentUser");
  if (!userLogin) {
    showLoginRequired();
    return;
  }

  // Load wishlist items
  const wishlistItems = wishlist.items;

  // Render items and update UI based on wishlist state
  renderWishlistItems(wishlistItems);
  updateWishlistTotals(wishlistItems);
  toggleEmptyState(wishlistItems);

  // Set up event listeners
  document.addEventListener("click", (e) => {
    if (e.target.id == "clear-wishlist") clearWishlist();
    if (e.target.id == "add-all-to-cart") addAllToCart();
  });

  // Listen for wishlist changes
  wishlist.onChange(handleWishlistChange);

  wishlistInitialized = true;
}

function showLoginRequired() {
  const loginRequired = document.getElementById("login-required-message");
  const emptyWishlist = document.getElementById("empty-wishlist");
  const wishlistContent = document.getElementById("wishlist-content");

  if (loginRequired) loginRequired.classList.remove("d-none");
  if (emptyWishlist) emptyWishlist.classList.add("d-none");
  if (wishlistContent) wishlistContent.classList.add("d-none");
}

function handleWishlistChange() {
  const userLogin = localStorage.getItem("currentUser");
  if (!userLogin) {
    showLoginRequired();
    return;
  }

  const wishlistItems = wishlist.items;
  renderWishlistItems(wishlistItems);
  updateWishlistTotals(wishlistItems);
  toggleEmptyState(wishlistItems);
}

export function renderWishlistItems(items) {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  if (!wishlistItemsContainer) return;

  if (!items || items.length === 0) {
    wishlistItemsContainer.innerHTML = "";
    return;
  }

  const allProducts = JSON.parse(localStorage.getItem("all-products") || "[]");

  wishlistItemsContainer.innerHTML = items
    .map((item) => {
      const product = allProducts.find((p) => p.id == item.id) || {};
      const inStock = product.stock > 0;
      const alreadyInCart = cart.has(item.id);

      return `
      <tr data-id="${item.id}">
        <td>
          <div class="d-flex align-items-center">
            <img src="${
              product.thumbnail ||
              product.image ||
              product.img ||
              "https://via.placeholder.com/80"
            }" 
                 class="product-img me-3" alt="${
                   item.name
                 }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            <div>
              <h6 class="mb-0">${item.name}</h6>
              <small class="text-muted">SKU: ${item.id}</small>
            </div>
          </div>
        </td>
        <td class="product-price">$${(item.price || 0).toFixed(2)}</td>
        <td class="stock-status ${inStock ? "stock-in" : "stock-out"}">
          ${inStock ? "In Stock" : "Out of Stock"}
        </td>
        <td>
          <button class="btn-move" data-id="${item.id}" 
                  ${!inStock || alreadyInCart ? "disabled" : ""} 
                  title="${
                    !inStock
                      ? "Product out of stock"
                      : alreadyInCart
                      ? "Already in cart"
                      : "Add to cart"
                  }">
            <i class="fa-solid ${
              alreadyInCart ? "fa-cart-shopping" : "fa-cart-plus"
            }"></i>
          </button>
        </td>
        <td class="product-remove">
          <button class="btn-remove" data-id="${
            item.id
          }" title="Remove from wishlist">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  // Add event listeners to delete buttons
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      removeFromWishlist(id);
    });
  });

  // Add event listeners to add to cart buttons
  document.querySelectorAll(".btn-move").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      moveToCart(id);
    });
  });
}

function moveToCart(productId) {
  const product = wishlist.items.find((item) => item.id == productId);

  if (product) {
    if (cart.has(productId)) {
      showToast("Product is already in your cart", "info");
    } else {
      cart.add(product, 1);
      showToast("Product added to cart", "success");
      updateButtonState(productId);
    }
  }
}

function updateButtonState(productId) {
  const moveButton = document.querySelector(
    `.btn-move[data-id="${productId}"]`
  );
  if (moveButton && cart.has(productId)) {
    moveButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
    moveButton.title = "Already in cart";
    moveButton.disabled = true;
  }
}

function updateWishlistTotals(items) {
  const wishlistCount = document.getElementById("wishlist-count");
  const wishlistTotal = document.getElementById("wishlist-total");

  if (!wishlistCount || !wishlistTotal) return;

  if (!items || items.length === 0) {
    wishlistCount.textContent = "0";
    wishlistTotal.textContent = "$0";
    return;
  }

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  wishlistCount.textContent = items.length;
  wishlistTotal.textContent = `$${total.toFixed(2)}`;
}

function toggleEmptyState(items) {
  const emptyWishlist = document.getElementById("empty-wishlist");
  const wishlistContent = document.getElementById("wishlist-content");
  const loginRequired = document.getElementById("login-required-message");

  if (!emptyWishlist || !wishlistContent || !loginRequired) return;

  // Hide login required message if user is logged in
  loginRequired.classList.add("d-none");

  if (!items || items.length === 0) {
    // Show empty message, hide content
    emptyWishlist.classList.remove("d-none");
    wishlistContent.classList.add("d-none");
  } else {
    // Show content, hide empty message
    emptyWishlist.classList.add("d-none");
    wishlistContent.classList.remove("d-none");
  }
}

function removeFromWishlist(id) {
  try {
    wishlist.remove(id);
    showToast("Item removed from wishlist", "success");
  } catch (e) {
    console.error("Error removing from wishlist:", e);
    showToast("Error removing item", "error");
  }
}

function clearWishlist() {
  try {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      wishlist.clear();
      showToast("Wishlist cleared", "success");
    }
  } catch (e) {
    console.error("Error clearing wishlist:", e);
    showToast("Error clearing wishlist", "error");
  }
}

function addAllToCart() {
  try {
    const items = wishlist.items;
    let addedCount = 0;

    items.forEach((item) => {
      if (!cart.has(item.id)) {
        cart.add(item, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`Added ${addedCount} items to cart`, "success");

      // Update all button states
      items.forEach((item) => {
        updateButtonState(item.id);
      });
    } else {
      showToast("All items are already in your cart", "info");
    }
  } catch (e) {
    console.error("Error adding items to cart:", e);
    showToast("Error adding items to cart", "error");
  }
}

// Export a function to manually refresh the wishlist
export function refreshWishlist() {
  const userLogin = localStorage.getItem("currentUser");
  if (!userLogin) {
    showLoginRequired();
    return;
  }

  const wishlistItems = wishlist.items;
  renderWishlistItems(wishlistItems);
  updateWishlistTotals(wishlistItems);
  toggleEmptyState(wishlistItems);
}

// Initialize the wishlist when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWishlist);
} else {
  initializeWishlist();
}
