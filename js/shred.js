import { cart } from "../actions/cart.js";
import { showToast } from "../actions/showToast.js";
import { wishlist } from "../actions/wishlist.js";
import { router } from "../js/router.js";

let isInitialized = false;

// Logout handler function
export function handleLogout() {
  try {
    // Clear current user from localStorage
    localStorage.removeItem("currentUser");

    // Clear cart and wishlist
    cart.clear();
    wishlist.clear();

    // Update UI states
    updateButtonStates();
    updateCartAndWishlistBadges();
    refreshCartPage();

    // Show success message
    showToast("Logged out successfully", "success");

    // Navigate to home page
    router.navigate("/");

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    showToast("Error during logout", "error");
    return false;
  }
}

// Add logout event listener to the document
export function initializeLogoutHandler() {
  document.addEventListener("click", (e) => {
    const logoutBtn = e.target.closest("[data-logout]");
    if (logoutBtn) {
      e.preventDefault();
      handleLogout();
    }
  });
}

export function refreshCartPage() {
  if (window.location.hash.includes("/cart")) {
    import("../pages/cart/mycart.js")
      .then((module) => {
        if (module.refreshCart) {
          module.refreshCart();
        }
      })
      .catch((err) => {
        console.error("Error refreshing cart page:", err);
      });
  }
}

export const cartAndWishlistLogic = () => {
  if (isInitialized) {
    updateButtonStates();
    refreshCartPage();
    return;
  }

  // Initialize logout handler
  initializeLogoutHandler();

  document.addEventListener("click", (e) => {
    const cartBtn = e.target.closest(".add-to-cart-btn");
    if (cartBtn) {
      const userLogin = localStorage.getItem("currentUser");
      if (userLogin) {
        const product = {
          id: cartBtn.dataset.id,
          name: cartBtn.dataset.name,
          price: parseFloat(cartBtn.dataset.price),
        };

        if (cart.has(product.id)) {
          cart.remove(product.id);
        } else {
          cart.add(product, 1);
        }
        updateButtonStates();
        refreshCartPage();
      } else {
        showToast("Please login to add to cart", "error");
      }
      return;
    }

    const wishlistBtn = e.target.closest(".add-to-wishlist-btn");
    if (wishlistBtn) {
      const product = {
        id: wishlistBtn.dataset.id,
        name: wishlistBtn.dataset.name,
        price: parseFloat(wishlistBtn.dataset.price),
      };

      if (wishlist.has(product.id)) {
        wishlist.remove(product.id);
      } else {
        wishlist.add(product);
      }
      updateButtonStates();
    }
  });

  const sync = () => {
    updateCartAndWishlistBadges();
    updateButtonStates();
    refreshCartPage();
  };

  cart.onChange(sync);
  wishlist.onChange(sync);

  sync();
  isInitialized = true;
};

function updateButtonStates() {
  // Update cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    const id = btn.dataset.id;
    if (cart.has(id)) {
      btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Remove from Cart`;
      btn.classList.add("in-cart");
    } else {
      btn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
      btn.classList.remove("in-cart");
    }
  });

  // Update wishlist buttons
  document.querySelectorAll(".add-to-wishlist-btn").forEach((btn) => {
    const id = btn.dataset.id;
    if (wishlist.has(id)) {
      btn.classList.remove("fa-regular");
      btn.classList.add("fa-solid", "text-danger", "in-wishlist");
    } else {
      btn.classList.add("fa-regular");
      btn.classList.remove("fa-solid", "text-danger", "in-wishlist");
    }
  });

  // Update login/logout buttons based on authentication state
  updateAuthButtons();

  updateCartAndWishlistBadges();
}

// Function to update authentication-related buttons
function updateAuthButtons() {
  const isLoggedIn = localStorage.getItem("currentUser");

  // Update login/logout buttons
  document.querySelectorAll("[data-login]").forEach((btn) => {
    btn.style.display = isLoggedIn ? "none" : "block";
  });

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.style.display = isLoggedIn ? "block" : "none";
  });

  document.querySelectorAll("[data-profile]").forEach((btn) => {
    btn.style.display = isLoggedIn ? "block" : "none";
  });
}

export function updateCartAndWishlistBadges() {
  const cartCount = document.querySelector("#cart-count");
  const wishlistCount = document.querySelector("#wishlist-count");
  const cartCountMobile = document.querySelector("#cart-count-mobile");
  const wishlistCountMobile = document.querySelector("#wishlist-count-mobile");

  if (cartCount) cartCount.textContent = cart.allItemsCount;
  if (wishlistCount) wishlistCount.textContent = wishlist.allItemsCount;
  if (cartCountMobile) cartCountMobile.textContent = cart.allItemsCount;
  if (wishlistCountMobile)
    wishlistCountMobile.textContent = wishlist.allItemsCount;
}
