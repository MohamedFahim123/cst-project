import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { initializeOrderDetails } from "../pages/customer-dashboard/order-details/order-details.js";
import { initializeProfile } from "../pages/customer-dashboard/profile/profile.js";
import { initializeUpdateProfile } from "../pages/customer-dashboard/update-profile/update-profile.js";
import {
  bestSellingProducts,
  getAllProducts,
  getAllUsers,
  getCategories,
  getShopFilters,
  handleRenderingRecommendedProducts,
  renderBrands,
} from "../pages/home/home.js";
import { loginSubmitHandler } from "../pages/login/login.js";
import { registerSubmitHandler } from "../pages/register/main.js";
import { addProductHandler } from "../pages/seller-dashboard/my-products/my-products.js";
import { initializeProductDetailsFunctions } from "../pages/shop/product-details/product-details.js";
import {
  handleFilterProductsIfExistFilters,
  initializeProductCards,
  inputsSetups,
  resetFilters,
} from "../pages/shop/shop.js";
import {
  initializeWishlist,
  refreshWishlist,
} from "../pages/wishlist/mywishlist.js";
import { router } from "./router.js";
import { cartAndWishlistLogic } from "./shred.js";

export const PAGE_INITIALIZERS = {
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
    initializeProductCards();
    inputsSetups();
    resetFilters();
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
  "/cart": () => {
    import("../pages/cart/mycart.js").then((module) => {
      module.initializeCart();
    });
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
  "/payment": async () => {
    // Load PayPal SDK dynamically
    const paypalScript = document.createElement("script");
    paypalScript.src =
      "https://www.paypal.com/sdk/js?client-id=AWwGica7qOijXlw0dsQ_OYl-Tft5VkdJTDPPM5_cchS4tD-0Dk0Jayd0C53wHKoXHdsIbsqsOaAwzfSq&currency=USD";
    paypalScript.onload = () => {
      if (window.paypal) {
        paypal
          .Buttons({
            createOrder: function (data, actions) {
              return actions.order.create({
                purchase_units: [
                  {
                    description: "Ecommerce Checkout",
                    amount: {
                      currency_code: "USD",
                      value: "15.89", // fixed test total
                    },
                  },
                ],
              });
            },
            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                alert(
                  "✅ Payment completed by " + details.payer.name.given_name
                );
              });
            },
            onError: function (err) {
              console.error("PayPal Error:", err);
              alert("❌ PayPal Checkout failed: " + err.message);
            },
          })
          .render("#paypal-button-container");
      }
    };
    document.body.appendChild(paypalScript);
  },
  "/seller-dashboard/my-products": () => {
    addProductHandler();
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
