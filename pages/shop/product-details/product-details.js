import { initializeSlider } from "./utils/slider.js";
import { initializeRelatedProducts } from "./utils/showRelatedProduct.js";
import { initializeQuantityControls, initializeAddToCart } from "./utils/product-details-cart.js";

export function initializeProductDetailsFunctions() {
  initializeSlider();
  initializeQuantityControls();
  initializeAddToCart();
  initializeRelatedProducts();
}
