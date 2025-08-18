import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

import {
  bestSellingProducts,
  getAllProducts,
  getAllUsers,
  getCategories,
  getShopFilters,
  handleRenderingRecommendedProducts,
  renderBrands,
} from "../pages/home/home.js";
<<<<<<< HEAD
import {
  initializeAddToCart,
  initializeQuantityControls,
  initializeSlider,
} from "../pages/shop/product-details/product-details.js";
import { handleFilterProductsIfExistFilters, inputsSetups } from "../pages/shop/shop.js";
=======
import { initializeProductDetailsFunctions } from "../pages/shop/product-details/product-details.js";
>>>>>>> 48d98f62136f17c8212579e3aa5b1ae9b528e7ec

export const PAGE_INITIALIZERS = {
  "/shop/product-details": () => {
    initializeProductDetailsFunctions();
  },
  "/": async () => {
    const products = JSON.parse(localStorage.getItem("all-products"));
    if (!products) {
      const products = await getAllProducts();
      localStorage.setItem("all-products", JSON.stringify(products));
    }
    const filters = JSON.parse(localStorage.getItem("shop-filters"));
    if (!filters) {
      const filters = await getShopFilters();
      localStorage.setItem("shop-filters", JSON.stringify(filters));
    }
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      const users = await getAllUsers();
      localStorage.setItem("users", JSON.stringify(users));
    }
    getCategories();
    renderBrands(Swiper);
    handleRenderingRecommendedProducts(Swiper);
    bestSellingProducts(Swiper);
  },
  "/shop": () => {
    handleFilterProductsIfExistFilters();
    inputsSetups();
  },
};
