import { cart } from "../actions/cart.js";
import { showToast } from "../actions/showToast.js";
import { wishlist } from "../actions/wishlist.js";

let isInitialized = false;

export const cartAndWishlistLogic = () => {
  if (isInitialized) {
    updateButtonStates();
    return;
  }

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
  };

  cart.onChange(sync);
  wishlist.onChange(sync);

  sync();
  isInitialized = true;
};

function updateButtonStates() {
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

  updateCartAndWishlistBadges();
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
