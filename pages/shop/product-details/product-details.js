import { initializeSlider } from "./utils/slider.js";
import { initializeRelatedProducts } from "./utils/showRelatedProduct.js";
import { initializeQuantityControls, initializeAddToCart } from "./utils/product-details-cart.js";
import { initializeProductInfo } from "./utils/single-product-info.js";

export function initializeProductDetailsFunctions() {
  initializeProductInfo(); // Load product data first
  initializeSlider();
  initializeQuantityControls();
  initializeAddToCart();
  initializeRelatedProducts();
}
