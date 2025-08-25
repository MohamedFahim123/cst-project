import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { initializeOrderDetails } from "../pages/customer-dashboard/order-details/order-details.js";
import { initializeProfile } from "../pages/customer-dashboard/profile/profile.js";
import { initializeUpdateProfile } from "../pages/customer-dashboard/update-profile/update-profile.js";

import { addProductHandler } from "../pages/seller-dashboard/my-products/my-products.js";

import { initializeAddUser } from "../pages/admin-dashboard/add-new-user/add-new-user.js";
import { initializeCustomers } from "../pages/admin-dashboard/customers/customers.js";
import { dashboardInit } from "../pages/admin-dashboard/dashboard/dashboard.js";
import { initializeSellers } from "../pages/admin-dashboard/sellers/sellers.js";
import { initializeCart } from "../pages/cart/mycart.js";
import { initializeHome } from "../pages/home/home.js";
import { loginSubmitHandler } from "../pages/login/login.js";
import displayProductSummary, {
  initializePayment,
  paymentStutusFn,
  paypalGateway,
  validateBuiltPayment,
} from "../pages/payment/payment.js";
import { registerSubmitHandler } from "../pages/register/main.js";
import { initializeProductDetailsFunctions } from "../pages/shop/product-details/product-details.js";
import { initializeShop } from "../pages/shop/shop.js";
import {
  initializeWishlist,
  refreshWishlist,
} from "../pages/wishlist/mywishlist.js";
import { router } from "./router.js";
import { cartAndWishlistLogic } from "./shred.js";

//------------------------------------------------------------//

export const PAGE_INITIALIZERS = {
  "/": async () => {
    initializeHome(Swiper);
    cartAndWishlistLogic();
  },
  "/shop": () => {
    initializeShop();
    setTimeout(() => cartAndWishlistLogic(), 100);
  },
  "/shop/product-details": () => {
    try {
      setTimeout(() => {
        initializeProductDetailsFunctions(Swiper);
      }, 100);
      cartAndWishlistLogic();
    } catch (error) {
      console.error("Failed to initialize product details:", error);
    }
  },
  "/customer-dashboard/profile": () => {
    initializeProfile();
  },
  "/customer-dashboard/update-profile": () => {
    initializeUpdateProfile();
  },
  "/customer-dashboard/order-details": () => {
    initializeOrderDetails();
  },
  "/admin-dashboard/profile": () => {
    initializeProfile();
  },
  "/admin-dashboard/update-profile": () => {
    initializeUpdateProfile();
  },
  "/admin-dashboard/order-details": () => {
    initializeOrderDetails();
  },
  "/seller-dashboard/profile": () => {
    initializeProfile();
  },
  "/seller-dashboard/update-profile": () => {
    initializeUpdateProfile();
  },
  "/seller-dashboard/order-details": () => {
    initializeOrderDetails();
  },
  "/seller-dashboard/my-products": () => {
    addProductHandler();
  },
  "/cart": () => {
    initializeCart();
    cartAndWishlistLogic();
  },

  "/wishlist": () => {
    refreshWishlist();
    initializeWishlist();
    cartAndWishlistLogic();
  },
  "/checkout": () => {
    cartAndWishlistLogic();
  },
  "/login": () => {
    loginSubmitHandler();
  },
  "/register": () => {
    registerSubmitHandler();
  },

  "/payment": () => {
    initializePayment();
    displayProductSummary();
    validateBuiltPayment();
    paymentStutusFn();
    paypalGateway();
  },

  "/admin-dashboard/sellers": () => {
    initializeSellers();
  },
  "/admin-dashboard/customers": () => {
    initializeCustomers();
  },
  "/admin-dashboard/add-new-user": () => {
    initializeAddUser();
  },
  "/admin-dashboard/dashboard": () => {
    dashboardInit();
  },
};

document.addEventListener("click", (e) => {
  if (e.target.id == "profile-link") {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    const pathname = `/${user.role.toLowerCase()}-dashboard/profile`;
    router.navigate(pathname.trim());
  }
});
