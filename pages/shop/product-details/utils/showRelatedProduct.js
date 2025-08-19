import { showNotification } from "./showNotification.js";

// Related Products Functionality
export async function initializeRelatedProducts() {
  // get the products from local storage
  const products = JSON.parse(localStorage.getItem("all-products")) || [];
  console.log(products);
  // Get 6 random products for related products
  const relatedProducts = extractRandomList(products, 6);
  renderRelatedProducts(relatedProducts);
}

function renderRelatedProducts(products) {
  const grid = document.getElementById("relatedProductsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map((product) => {
      const discountPercentage = Math.round(product.discountPercentage || 0);
      const originalPrice = product.price;
      const discountedPrice = (originalPrice * (1 - discountPercentage / 100)).toFixed(2);
      const rating = product.rating || 0;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      return `
      <div class="col-6 col-md-4 col-lg-3 col-xl-2 ">
        <div class="related-product-card">
          ${discountPercentage > 0 ? `<div class="product-badge">${discountPercentage}%</div>` : ""}
          
          <button class="wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
            <i class="far fa-heart"></i>
          </button>
          
          <div class="product-image-container">
            <img src="${product.images[0]}" alt="${product.title}" class="product-image">
          </div>
          
          <div class="product-info-card">
            <h3 class="product-name">${product.title}</h3>
            
            <div class="product-rating">
              <div class="rating-stars">
                ${generateStarRating(fullStars, hasHalfStar)}
              </div>
              <span class="rating-count">${product.reviews?.length || 0}</span>
            </div>
            
            <div class="product-price">
              <span class="current-price-card">$${discountedPrice}</span>
              ${discountPercentage > 0 ? `<span class="original-price">$${originalPrice}</span>` : ""}
            </div>
            
            <div class="stock-status-card">
              <div class="stock-indicator"></div>
              <span class="stock-text">IN STOCK</span>
            </div>
            
            <button class="add-to-cart-btn-card" data-product-id="${product.id}">
              <i class="fas fa-shopping-cart me-1"></i> IN STOCK
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Add event listeners for related product actions
  addRelatedProductsEventListeners();
}

function addRelatedProductsEventListeners() {
  // Wishlist buttons
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const icon = this.querySelector("i");

      if (icon.classList.contains("far")) {
        icon.classList.remove("far");
        icon.classList.add("fas");
        showNotification("Added to wishlist!");
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
        showNotification("Removed from wishlist!");
      }
    });
  });

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn-card").forEach((btn) => {
    btn.addEventListener("click", function () {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> ADDED';
        this.style.background = "#28a745";

        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = "";
        }, 2000);

        showNotification("Product added to cart!");
      }, 800);
    });
  });
}

// ---------- Resuable Functions ----------

// receive array and length of list needed and returns a random sample from this array
function extractRandomList(items = [], count = 5) {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

//-----

// Generate star rating HTML
function generateStarRating(fullStars, hasHalfStar) {
  let stars = "";

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  // Add empty stars to make total of 5
  const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}
