import { initializeSlider } from "../../../js/globalJs/slider.js";
import { initializeProductInfo } from "../../../js/globalJs/single-product-info.js";
import { initializeRelatedProducts } from "./utils/showRelatedProduct.js";
import { initializeQuantityControls } from "./utils/product-details-cart.js";

export function initializeProductDetailsFunctions(Swiper) {
  initializeProductInfo();
  initializeSlider();
  initializeQuantityControls();
  initializeRelatedProducts(Swiper);
}
