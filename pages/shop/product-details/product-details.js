// Simple Image Slider
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
export function initializeAddToCart() {
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
export function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "alert alert-success alert-dismissible fade show position-fixed";
  notification.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; max-width: 300px;";
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
