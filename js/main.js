import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { initializeOrdersPage } from "./globalJs/orders.js";
import { initializeOrderDetails } from "./globalJs/order-details.js";
import { initializeProfile } from "./globalJs/profile.js";
import { initializeUpdateProfile } from "./globalJs/update-profile.js";

import { addProductHandler } from "../pages/seller-dashboard/my-products/my-products.js";
import { dashboardInitSeller } from "../pages/seller-dashboard/dashboard/dashboard.js";
import { intiateBookedOrders } from "../pages/seller-dashboard/booked-orders/booked-orders.js";

import { initializeAddUser } from "../pages/admin-dashboard/add-new-user/add-new-user.js";
import { initializeCustomers } from "../pages/admin-dashboard/customers/customers.js";
import { dashboardInit } from "../pages/admin-dashboard/dashboard/dashboard.js";
import { initializeSellers } from "../pages/admin-dashboard/sellers/sellers.js";
import { initializeCart } from "../pages/cart/mycart.js";
import { initializeHome } from "../pages/home/home.js";
import { initializeLogin } from "../pages/login/login.js";
import displayProductSummary, { updatedCreditCaerd } from "../pages/payment/payment.js";
import { registerSubmitHandler } from "../pages/register/main.js";
import { initializeProductDetailsFunctions } from "../pages/shop/product-details/product-details.js";
import { initializeShop } from "../pages/shop/shop.js";
import { initializeWishlist, refreshWishlist } from "../pages/wishlist/mywishlist.js";
import { router } from "./router.js";
import { cartAndWishlistLogic } from "./shred.js";
import { initializeProducts } from "../pages/admin-dashboard/products/products.js";
import { initializeDashboardProductDetailsFunctions } from "../pages/admin-dashboard/products/product-details/product-details.js";
import { shuffleTeamMembers } from "../pages/our-team/our-team.js";
import { checkoutValidation } from "../pages/checkout/checkout.js";

//------------------------------------------------------------//

export const PAGE_INITIALIZERS = {
  "/": async () => {
    initializeHome(Swiper);
    cartAndWishlistLogic();
  },
  "/our-team": () => {
    shuffleTeamMembers();
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
  "/customer-dashboard/orders": () => {
    initializeOrdersPage();
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
  "/admin-dashboard/orders": () => {
    initializeOrdersPage();
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
  "/seller-dashboard/orders": () => {
    initializeOrdersPage();
  },
  "/seller-dashboard/order-details": () => {
    initializeOrderDetails();
  },

  "/seller-dashboard/my-products": () => {
    addProductHandler();
  },
  "/seller-dashboard/dashboard": () => {
    dashboardInitSeller();
  },
  "/seller-dashboard/booked-orders": () => {
    intiateBookedOrders();
  },
  "/seller-dashboard/booked-orders-details": () => {
    initializeOrderDetails();
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
    checkoutValidation();
  },
  "/login": () => {
    initializeLogin();
  },
  "/register": () => {
    registerSubmitHandler();
  },

  "/payment": () => {
    displayProductSummary();

    updatedCreditCaerd();
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
  "/admin-dashboard/products": () => {
    initializeProducts();
  },
  "/admin-dashboard/products/product-details": () => {
    initializeDashboardProductDetailsFunctions();
  },
};

document.addEventListener("click", (e) => {
  if (e.target.id == "profile-link") {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    const pathname = `/${user.role.toLowerCase()}-dashboard/profile`;
    router.navigate(pathname.trim());
  }
  if (
    e.target.id == "arrowUp" ||
    e.target.classList.contains("containerArrow") ||
    e.target.classList.contains("arrowUpIcon")
  ) {
    window.scrollTo(0, 0);
  }
});

let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const header = document.getElementById("navbar-nav");
      const arrow = document.getElementById("arrowUp");
      const scrollY = window.scrollY;

      if (!router.getPath().includes("dashboard")) {
        header.classList.toggle("navbar-fixed", scrollY > 120);
      }

      arrow.classList.toggle("visible", scrollY > 150);

      ticking = false;
    });
    ticking = true;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const imageWrappers = document.querySelectorAll(".image-wrapper");

  imageWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector("img");

    // If image is already loaded, skip
    if (img.complete && img.naturalHeight !== 0) {
      wrapper.classList.add("loaded");
      return;
    }

    // Load image
    img.onload = function () {
      wrapper.classList.add("loaded");
    };

    // In case the image is already in cache
    if (img.complete) {
      wrapper.classList.add("loaded");
    }

    // Trigger image load (if not already loading)
    if (img.src && !img.complete) {
      img.src = img.src;
    }
  });
});
