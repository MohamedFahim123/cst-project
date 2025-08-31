import { cart } from "../actions/cart.js";
import { showToast } from "../actions/showToast.js";
import { wishlist } from "../actions/wishlist.js";

let isInitialized = false;

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

  document.addEventListener("click", (e) => {
    const userLogin = JSON.parse(localStorage.getItem("currentUser")) || null;
    const isLoggedIn = userLogin !== null;

    const cartmultiElBtn = e.target.closest(".add-more-than-one-to-cart");
    const quantity = document.getElementById("quantity");

    if (cartmultiElBtn && quantity) {
      if (!isLoggedIn) {
        showToast("Please login to add to cart", "error");
        return;
      }

      if (userLogin.role && userLogin.role === "admin") {
        showToast("Admin can't add items to cart or wishlist", "error");
        return;
      }

      const currentProductId = JSON.parse(localStorage.getItem("curr-product"));
      const currentProduct = JSON.parse(
        localStorage.getItem("all-products")
      ).find((product) => +product.id === +currentProductId);

      if (
        userLogin.role &&
        userLogin.role === "seller" &&
        currentProduct.sellerID.toString().toLowerCase() ===
          userLogin.id.toString().toLowerCase()
      ) {
        showToast(
          "Seller can't add his own products to cart or wishlist",
          "error"
        );
        return;
      }

      const product = {
        id: currentProduct.id,
        name: currentProduct.title,
        price: parseFloat(currentProduct.price * quantity.value),
        sellerID: currentProduct.sellerID,
        stock: currentProduct.stock,
      };

      cart.add(product, +quantity.value);
      quantity.value = 1;

      updateButtonStates();
      refreshCartPage();
      return;
    }

    const cartBtn = e.target.closest(".add-to-cart-btn");
    if (cartBtn) {
      if (!isLoggedIn) {
        showToast("Please login to add to cart", "error");
        return;
      }

      if (userLogin.role && userLogin.role === "admin") {
        showToast("Admin can't add items to cart or wishlist", "error");
        return;
      }


      if (
        userLogin.role &&
        userLogin.role === "seller" &&
        cartBtn.dataset.seller.toString().toLowerCase() ===
          userLogin.id.toString().toLowerCase()
      ) {
        showToast(
          "Seller can't add his own products to cart or wishlist",
          "error"
        );
        return;
      }

      const product = {
        id: cartBtn.dataset.id,
        name: cartBtn.dataset.name,
        price: parseFloat(cartBtn.dataset.price),
        sellerID: cartBtn.dataset.seller,
        stock: cartBtn.dataset.stock,
      };

      if (cart.has(product.id)) {
        cart.remove(product.id);
      } else {
        cart.add(product, 1);
      }
      updateButtonStates();
      refreshCartPage();
      return;
    }

    const wishlistBtn = e.target.closest(".add-to-wishlist-btn");
    if (wishlistBtn) {
      if (!isLoggedIn) {
        showToast("Please login to add to wishlist", "error");
        return;
      }

      if (userLogin.role && userLogin.role === "admin") {
        showToast("Admin can't add items to cart or wishlist", "error");
        return;
      };

      if (
        userLogin.role &&
        userLogin.role === "seller" &&
        wishlistBtn.dataset.seller.toString().toLowerCase() ===
          userLogin.id.toString().toLowerCase()
      ) {
        showToast(
          "Seller can't add his own products to cart or wishlist",
          "error"
        );
        return;
      }

      const product = {
        id: wishlistBtn.dataset.id,
        name: wishlistBtn.dataset.name,
        price: parseFloat(wishlistBtn.dataset.price),
        sellerID: wishlistBtn.dataset.seller,
        stock: wishlistBtn.dataset.stock,
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

  updateAuthButtons();

  updateCartAndWishlistBadges();
}

function updateAuthButtons() {
  const isLoggedIn = localStorage.getItem("currentUser");

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
