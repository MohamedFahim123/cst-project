import { cart } from "../actions/cart.js";
import { wishlist } from "../actions/wishlist.js";

export const cartAndWishlistLogic = () => {
  // Use event delegation for cart buttons
  document.addEventListener("click", (e) => {
    // Handle cart buttons
    if (e.target.closest(".add-to-cart-btn")) {
      const btn = e.target.closest(".add-to-cart-btn");
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
      };

      if (cart.has(product.id)) {
        cart.remove(product.id);
      } else {
        cart.add(product, 1);
      }
      updateButtonStates();
    }

    // Handle wishlist buttons
    if (e.target.closest(".add-to-wishlist-btn")) {
      const btn = e.target.closest(".add-to-wishlist-btn");
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
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
