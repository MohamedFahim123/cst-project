import { cart } from "../../actions/cart.js";
import { showToast } from "../../actions/showToast.js";
import { wishlist } from "../../actions/wishlist.js";

class WishlistPage {
  constructor() {
    this.wishlistItemsContainer = document.getElementById("wishlist-items");
    this.emptyWishlistElement = document.getElementById("empty-wishlist");
    this.wishlistContentElement = document.getElementById("wishlist-content");

    // Check if elements exist before proceeding
    if (!this.wishlistItemsContainer || !this.emptyWishlistElement || !this.wishlistContentElement) {
      console.error("Required DOM elements not found");
      return;
    }

    this.init();
  }

  init() {
    this.renderWishlistItems();
    this.setupEventListeners();

    // Subscribe to wishlist changes
    wishlist.onChange(() => {
      this.renderWishlistItems();
    });
  }

  setupEventListeners() {
    // Event delegation for remove and add to cart buttons
    this.wishlistItemsContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".btn-remove");
      const addToCartBtn = e.target.closest(".btn-move");

      if (removeBtn) {
        e.preventDefault();
        const productId = removeBtn.dataset.id;
        this.removeFromWishlist(productId);
      }

      if (addToCartBtn) {
        e.preventDefault();
        const productId = addToCartBtn.dataset.id;
        this.moveToCart(productId);
      }
    });
  }

  removeFromWishlist(productId) {
    wishlist.remove(productId);
    showToast("Product removed from wishlist", "success");
  }

  moveToCart(productId) {
    const product = wishlist.items.find((item) => item.id == productId); // Use == instead of === to handle string/number mismatch

    if (product) {
      if (cart.has(productId)) {
        showToast("Product is already in your cart", "info");
      } else {
        cart.add(product, 1);
        showToast("Product added to cart", "success");
      }
    }
  }

  renderWishlistItems() {
    const items = wishlist.items;
    console.log("Wishlist items:", items);

    if (items.length === 0) {
      this.emptyWishlistElement.classList.remove("d-none");
      this.wishlistContentElement.classList.add("d-none");
      return;
    }

    this.emptyWishlistElement.classList.add("d-none");
    this.wishlistContentElement.classList.remove("d-none");

    this.wishlistItemsContainer.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>
          <div class="product-info">
            <img src="${item.image || item.img || "https://via.placeholder.com/80"}" 
                 alt="${item.name}" class="product-image">
          </div>
        </td>
        <td class="product-name">${item.name}</td>
        <td class="product-price">$${(item.price || 0).toFixed(2)}</td>
        <td class="stock-status ${item.inStock !== false ? "stock-in" : "stock-out"}">
          ${item.inStock !== false ? "In Stock" : "Out of Stock"}
        </td>
        <td>
          <button class="btn-move" data-thumbnail="${item.thumnail}" data-id="${item.id}" 
                  ${item.inStock === false ? "disabled" : ""} 
                  title="${item.inStock === false ? "Product out of stock" : "Add to cart"}">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </td>
        <td>
          <button class="btn-remove"  data-id="${item.id}" title="Remove from wishlist">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
    
    // Update button states after rendering
    this.updateButtonStates();
  }

  updateButtonStates() {
    const moveButtons = document.querySelectorAll(".btn-move");
    if (moveButtons.length === 0) return;
    
    moveButtons.forEach((btn) => {
      const productId = btn.dataset.id;
      if (cart.has(productId)) {
        btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
        btn.title = "Already in cart";
        btn.disabled = true;
      }
    });
  }
}

// Initialize the wishlist page when DOM is loaded
export const wishlistInitialization = () => {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new WishlistPage();
    });
  } else {
    // DOM is already ready
    new WishlistPage();
  }
};