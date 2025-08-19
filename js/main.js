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
import { initializeProductDetailsFunctions } from "../pages/shop/product-details/product-details.js";
import {
  handleFilterProductsIfExistFilters,
  inputsSetups,
  resetFilters,
} from "../pages/shop/shop.js";
import { cartAndWishlistLogic } from "./shred.js";

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
    cartAndWishlistLogic();
  },
  "/shop": () => {
    handleFilterProductsIfExistFilters();
    inputsSetups();
    resetFilters();
    cartAndWishlistLogic();
  },
  "/cart": () => {
    cartAndWishlistLogic();
  },
  "/wishlist": () => {
    cartAndWishlistLogic();
  },
  "/checkout": () => {
    cartAndWishlistLogic();
  },
};
