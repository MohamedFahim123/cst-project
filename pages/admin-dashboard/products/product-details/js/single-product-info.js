// Single Product Info - Load product data from localStorage
export function initializeProductInfo() {
  loadProductFromLocalStorage();
}

function loadProductFromLocalStorage() {
  try {
    // Get current product ID from localStorage
    const currentProductId = localStorage.getItem("curr-product");

    if (!currentProductId) {
      console.error("No current product ID found in localStorage");
      return;
    }

    // Get all products from localStorage
    const allProductsData = localStorage.getItem("all-products");

    if (!allProductsData) {
      console.error("No products data found in localStorage");
      return;
    }

    const allProducts = JSON.parse(allProductsData);

    // Find the current product by ID
    const currentProduct = allProducts.find(
      (product) => product.id == currentProductId
    );

    if (!currentProduct) {
      console.error("Product not found with ID:", currentProductId);
      return;
    }

    // Populate product information
    populateProductInfo(currentProduct);

    // Update product images
    updateProductImages(currentProduct);
  } catch (error) {
    console.error("Error loading product from localStorage:", error);
  }
}

function populateProductInfo(product) {
  // Update product title
  const productTitle = document.querySelector(".product-title");
  if (productTitle) {
    productTitle.textContent = product.title;
  }

  // Update page title
  const pageTitle = document.querySelector("title");
  if (pageTitle) {
    pageTitle.textContent = `Product Details - ${product.title}`;
  }

  // Update price
  const currentPrice = document.querySelector(".current-price");
  if (currentPrice) {
    const discountPercentage = product.discountPercentage || 0;
    const originalPrice = product.price;
    const discountedPrice =
      discountPercentage > 0
        ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        : originalPrice.toFixed(2);

    if (discountPercentage > 0) {
      currentPrice.innerHTML = `
        <span class="discounted-price">$${discountedPrice}</span>
        <span class="original-price ms-2">$${originalPrice}</span>
      `;
    } else {
      currentPrice.textContent = `$${discountedPrice}`;
    }
  }

  const stockStatus = document.getElementById("stockStatus");
  if (stockStatus) {
    if (product.stock > 0) {
      stockStatus.textContent = "In Stock";
    } else {
      stockStatus.textContent = "Out of Stock";
      stockStatus.classList.add("text-danger");
    }
  }

  // Update product description
  const productDescription = document.querySelector(".product-description p");
  if (productDescription) {
    productDescription.textContent =
      product.description || "No description available.";
  }

  const productSeller = document.querySelector(".product-seller p");
  if (productSeller) {
    const users = JSON.parse(localStorage.getItem("users")).users;
    const seller = users.find(
      (user) =>
        user.id.toString() === product.sellerID.toString() &&
        user.role.toLowerCase() === "seller"
    );

    if (seller) {
      productSeller.innerHTML =
        `<strong>Seller:</strong> ${seller.username}` ||
        "No seller information available.";
    }
  }

  // Update rating
  updateProductRating(product);

  // Update stock status
  updateStockStatus(product);

  // Update quantity max value based on stock
  const quantityInput = document.getElementById("quantity");
  if (quantityInput && product.stock) {
    quantityInput.setAttribute("max", Math.min(product.stock, 10));
  }
}

function updateProductRating(product) {
  const starsContainer = document.querySelector(".stars");
  if (!starsContainer) return;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = "";

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  // Add half star if needed
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  starsContainer.innerHTML = starsHTML;

  // Add rating text if reviews exist
  const writeReviewLink = document.querySelector(".write-review");
  if (writeReviewLink && product.reviews) {
    const reviewCount = product.reviews.length;
    writeReviewLink.textContent = `${reviewCount} Review${
      reviewCount !== 1 ? "s" : ""
    }`;
  }
}

function updateStockStatus(product) {
  const stockStatusContainer = document.querySelector(".stock-status");
  if (!stockStatusContainer) return;

  const stock = product.stock || 0;
  const availabilityStatus = product.availabilityStatus || "In Stock";

  let stockHTML = "";
  let stockClass = "in-stock";
  let stockText = "In Stock";
  let iconColor = "#28a745"; // Green

  if (stock === 0 || availabilityStatus === "Out of Stock") {
    stockClass = "out-of-stock";
    stockText = "Out of Stock";
    iconColor = "#dc3545"; // Red
  } else if (stock < 5) {
    stockClass = "low-stock";
    stockText = `Only ${stock} Left`;
    iconColor = "#ffc107"; // Yellow
  }

  stockHTML = `
    <span class="${stockClass}">
      <i class="fas fa-circle" style="color: ${iconColor}"></i>
      ${stockText}
    </span>
  `;

  stockStatusContainer.innerHTML = stockHTML;

  // Disable add to cart button if out of stock
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    if (stock === 0 || availabilityStatus === "Out of Stock") {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Out of Stock";
      addToCartBtn.classList.remove("btn-warning");
      addToCartBtn.classList.add("btn-secondary");
    } else {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = "Add to cart";
      addToCartBtn.classList.remove("btn-secondary");
      addToCartBtn.classList.add("btn-warning");
    }
  }
}

function updateProductImages(product) {
  // Get product images (you might want to modify this based on your product data structure)
  const productImages = getProductImages(product);

  // Update slider images
  updateSliderImages(productImages, product.title);

  // Update thumbnail images
  updateThumbnailImages(productImages, product.title);
}

function getProductImages(product) {
  // Default images fallback
  const defaultImages = [
    "../../../assets/product-img1.jpeg",
    "../../../assets/product-img2.jpeg",
    "../../../assets/product-img3.jpeg",
    "../../../assets/product-img4.jpeg",
  ];

  // Check if product has images property
  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images;
  }

  // Check if product has thumbnail property
  if (product.thumbnail) {
    return [product.thumbnail, ...defaultImages.slice(1)];
  }

  // Use default images
  return defaultImages;
}

function updateSliderImages(images, productTitle) {
  const sliderContainer = document.querySelector(".slider-container");
  if (!sliderContainer) return;

  // Clear existing images
  sliderContainer.innerHTML = "";

  // Add new images
  images.forEach((imageSrc, index) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.className = `slider-image ${index === 0 ? "active" : ""}`;
    img.alt = `${productTitle} - Image ${index + 1}`;
    img.onerror = function () {
      // Fallback to default image if image fails to load
      this.src = "../../../assets/product-img1.jpeg";
    };
    sliderContainer.appendChild(img);
  });
}

function updateThumbnailImages(images, productTitle) {
  const thumbnailContainer = document.querySelector(".thumbnail-images");
  if (!thumbnailContainer) return;

  // Clear existing thumbnails
  thumbnailContainer.innerHTML = "";

  // Add new thumbnails
  images.forEach((imageSrc, index) => {
    const thumbWrapper = document.createElement("div");
    thumbWrapper.className = "thumb-wrapper";

    const img = document.createElement("img");
    img.src = imageSrc;
    img.className = `img-thumbnail ${index === 0 ? "active" : ""}`;
    img.setAttribute("data-slide", index.toString());
    img.alt = `${productTitle} - Thumbnail ${index + 1}`;
    img.onerror = function () {
      // Fallback to default image if image fails to load
      this.src = "../../../assets/product-img1.jpeg";
    };

    thumbWrapper.appendChild(img);
    thumbnailContainer.appendChild(thumbWrapper);
  });
}

// Export for external use
export { loadProductFromLocalStorage };
