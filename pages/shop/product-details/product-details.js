// Simple Image Slider
export function initializeProductDetailsFunctions() {
  initializeSlider();
  initializeQuantityControls();
  initializeAddToCart();
  initializeRelatedProducts();
}

export function initializeSlider() {
  const images = document.querySelectorAll(".slider-image");
  const thumbnails = document.querySelectorAll(".img-thumbnail");
  let currentIndex = 0;
  let slideInterval;

  // Show specific slide
  function showSlide(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  // Start auto-slide
  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Stop auto-slide
  function stopSlider() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Thumbnail click events
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", function () {
      showSlide(index);
      stopSlider();
      startSlider();
    });
  });

  // Pause on hover
  const slider = document.getElementById("imageSlider");
  if (slider) {
    slider.addEventListener("mouseenter", stopSlider);
    slider.addEventListener("mouseleave", startSlider);
  }

  // Start the slider
  startSlider();
}

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

// Add to Cart Functionality
function initializeAddToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  const quantityInput = document.getElementById("quantity");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      // Add loading state
      const originalText = this.textContent;
      this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...';
      this.disabled = true;

      // Simulate adding to cart
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check me-2"></i>Added to Cart!';
        this.classList.remove("btn-warning");
        this.classList.add("btn-success");

        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
          this.classList.remove("btn-success");
          this.classList.add("btn-warning");
        }, 2000);

        showNotification(`Added ${quantity} item(s) to cart!`);
      }, 1000);
    });
  }
}

// Simple Notification System
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "alert alert-success alert-dismissible fade show position-fixed";
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; max-width: 300px;";
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.remove();
    }
  }, 4000);
}

// Related Products Functionality
function initializeRelatedProducts() {
  loadRelatedProducts();
}

async function loadRelatedProducts() {
  try {
    // const response = await fetch("../../../json/products.json");
    // const products = await response.json();
    const products = JSON.parse(localStorage.getItem("all-products")) || [];

    // Get 6 random products for related products
    const relatedProducts = getRandomProducts(products, 6);
    renderRelatedProducts(relatedProducts);
  } catch (error) {
    console.error("Error loading related products:", error);
  }
}

function getRandomProducts(products, count) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
            <img src="${getProductImage(product)}" alt="${product.title}" class="product-image">
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

function getProductImage(product) {
  // Use a default image or try to get from product data
  const defaultImages = [
    "../../../assets/product-img1.jpeg",
    "../../../assets/product-img2.jpeg",
    "../../../assets/product-img3.jpeg",
    "../../../assets/product-img4.jpeg",
  ];

  // Return a random default image
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

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
