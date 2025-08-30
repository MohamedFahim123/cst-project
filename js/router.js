import { initializeLocalStorage } from "../actions/initializeLocalstorage.js";
import { handleRenderingSideBarLinks } from "../components/sidebar.js";
import { APP_ROUTES } from "./AppRoutes.js";
import { PAGE_INITIALIZERS } from "./main.js";
import { cartAndWishlistLogic, updateCartAndWishlistBadges } from "./shred.js";

class Router {
  #routeMap = {};
  #cachedNavbar = "";
  #cachedFooter = "";
  #cachedSidebar = "";
  #loaderElement = document.getElementById("loader");
  #appElement = document.getElementById("app");
  #headerElement = document.getElementById("header");
  #footerElement = document.getElementById("footer");
  #sideBarElement = document.getElementById("pf-sidebar-wrapper");
  #currentPath = "";

  #authState = {
    // Check if user is logged in
    isLoggedIn: () => {
      return localStorage.getItem("currentUser") !== null;
    },

    // Get current user role
    getUserRole: () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      return user.role || "";
    },

    // Check if user is admin
    isAdmin: () => {
      return this.#authState.getUserRole().toLowerCase() === "admin";
    },

    // Update UI based on authentication state
    updateUI: () => {
      const isLoggedIn = this.#authState.isLoggedIn();
      const isAdmin = this.#authState.isAdmin();
      const authButtons = document.getElementById("auth-buttons");
      const mobileAuthButtons = document.getElementById("mobile-auth-buttons");
      const mobileUserMenu = document.querySelectorAll(".mobile-user-menu");

      // Cart and wishlist elements
      const cartLink = document.querySelector('a[href="/cart"]');
      const wishlistLink = document.querySelector('a[href="/wishlist"]');
      const mobileCartLink = document.querySelector('#mobileMenu a[href="/cart"]');
      const mobileWishlistLink = document.querySelector('#mobileMenu a[href="/wishlist"]');

      if (isLoggedIn) {
        // User is logged in - show user menu, hide auth buttons
        if (authButtons) authButtons.classList.add("d-none");
        if (mobileAuthButtons) mobileAuthButtons.classList.add("d-none");
        if (mobileUserMenu.length) mobileUserMenu.forEach((item) => item.classList.remove("d-none"));

        // Hide cart/wishlist for admin users
        if (isAdmin) {
          if (cartLink) cartLink.style.display = "none";
          if (wishlistLink) wishlistLink.style.display = "none";
          if (mobileCartLink) mobileCartLink.parentElement.style.display = "none";
          if (mobileWishlistLink) mobileWishlistLink.parentElement.style.display = "none";
        } else {
          if (cartLink) cartLink.style.display = "block";
          if (wishlistLink) wishlistLink.style.display = "block";
          if (mobileCartLink) mobileCartLink.parentElement.style.display = "block";
          if (mobileWishlistLink) mobileWishlistLink.parentElement.style.display = "block";
        }
      } else {
        // User is not logged in - show auth buttons, hide user menu
        if (authButtons) authButtons.classList.remove("d-none");
        if (mobileAuthButtons) mobileAuthButtons.classList.remove("d-none");
        if (mobileUserMenu.length) mobileUserMenu.forEach((item) => item.classList.add("d-none"));

        // Show cart/wishlist for non-logged in users
        if (cartLink) cartLink.style.display = "block";
        if (wishlistLink) wishlistLink.style.display = "block";
        if (mobileCartLink) mobileCartLink.parentElement.style.display = "block";
        if (mobileWishlistLink) mobileWishlistLink.parentElement.style.display = "block";
      }
    },

    // Initialize authentication state listeners
    init: () => {
      // Update UI on initial load
      this.#authState.updateUI();

      // Add logout event listeners
      const logoutBtn = document.getElementById("logout-btn");
      const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          localStorage.removeItem("wishlist-items");
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent("authStateChanged"));
          // Update UI
          this.#authState.updateUI();
          // Redirect to home page
          window.location.href = "/";
        });
      }

      if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent("authStateChanged"));
          // Update UI
          this.#authState.updateUI();
          // Close mobile menu
          const mobileMenu = document.getElementById("mobileMenu");
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
          if (bsOffcanvas) bsOffcanvas.hide();
          // Redirect to home page
          window.location.href = "/";
        });
      }

      // Listen for storage events (for changes in other tabs/windows)
      window.addEventListener("storage", (e) => {
        if (e.key === "currentUser") {
          this.#authState.updateUI();
        }
      });

      // Listen for custom auth state changes
      window.addEventListener("authStateChanged", this.#authState.updateUI.bind(this));
    },
  };

  constructor(routes) {
    this.#routeMap = routes;
    this.#setupEventListeners();
    setTimeout(() => this.#authState.init(), 0);
  }

  #setupEventListeners() {
    window.addEventListener("hashchange", () => this.#handleNavigation());
    window.addEventListener("load", () => this.#handleNavigation());

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        e.preventDefault();
        const arrow = document.getElementById("arrowUp");
        arrow.classList.remove("d-none");
        this.navigate(link.getAttribute("href"));
      }
    });
  }

  #getRouteMeta(path) {
    return APP_ROUTES.find((route) => route.path.toLowerCase() === path.toLowerCase()) || null;
  }

  #normalizePath(path) {
    return path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "/";
  }
  #removeFiltersAndGoToShop = () => {
    localStorage.removeItem("curr-filters");
    router.navigate("/shop");
  };

  async #loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load template: ${url}`);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    if (doc.body && doc.body.innerHTML.trim() !== "") {
      return doc.body.innerHTML;
    }

    return text;
  }

  #updatePageMeta(meta) {
    if (!meta) return;
    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", meta.description);
  }

  #toggleLoader(show) {
    this.#loaderElement.style.display = show ? "flex" : "none";
  }

  async #handleNavigation() {
    try {
      this.#toggleLoader(true);

      const hashPath = window.location.hash.slice(1) || "/";
      const normalizedPath = this.#normalizePath(hashPath);

      // if navigate to any path this will be called
      initializeLocalStorage();

      if (this.#currentPath === normalizedPath && !normalizedPath.includes("/shop/product-details")) {
        this.#toggleLoader(false);
        return;
      }

      this.#currentPath = normalizedPath; // Update current path

      const matchingRoute = this.#findMatchingRoute(normalizedPath);
      if (!matchingRoute) {
        return this.navigate("#/404");
      }

      // Check if admin is trying to access restricted routes
      const isAdmin = this.#authState.isAdmin();
      if (isAdmin && (normalizedPath === "/cart" || normalizedPath === "/wishlist")) {
        return this.navigate("/admin-dashboard/profile");
      }

      await this.#renderRoute(matchingRoute, normalizedPath);
    } catch (error) {
      console.error("Navigation error:", error);
      this.navigate("#/404");
    } finally {
      setTimeout(() => this.#toggleLoader(false), 500);
    }
  }

  #findMatchingRoute(path) {
    const cleanPath = path.replace(/\/+$/, "");
    return Object.keys(this.#routeMap).find((key) => key.replace(/\/+$/, "") === cleanPath) || null;
  }

  async #renderRoute(routeKey, normalizedPath) {
    document.querySelectorAll("[data-link]").forEach((link) => {
      const linkPath = this.#normalizePath(link.getAttribute("href").replace("#", ""));
      link.classList.toggle("active", linkPath === normalizedPath);
    });

    if (!normalizedPath.includes("dashboard")) {
      await this.#loadLayoutComponents();
      updateCartAndWishlistBadges();
      this.#sideBarElement = "";
    } else {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) return this.navigate("/login");

      const isCustomerOk =
        user.role.toLowerCase() === "customer" &&
        (normalizedPath.split("/")[1].includes("seller") || normalizedPath.split("/")[1]).includes("admin");

      const isSellerOk =
        user.role.toLowerCase() === "seller" &&
        (normalizedPath.split("/")[1].includes("customer") || normalizedPath.split("/")[1].includes("admin"));

      const isAdminOk =
        user.role.toLowerCase() === "admin" &&
        (normalizedPath.split("/")[1].includes("customer") ||
          normalizedPath.split("/")[1].includes("seller"));

      if (isCustomerOk) {
        return this.navigate("/customer-dashboard/profile");
      } else if (isSellerOk) {
        return this.navigate("/seller-dashboard/profile");
      } else if (isAdminOk) {
        return this.navigate("/admin-dashboard/profile");
      }

      await this.#loadLayoutComponents();
      updateCartAndWishlistBadges();
      this.#footerElement.innerHTML = "";
    }

    if (normalizedPath.includes("/login") || normalizedPath.includes("/register")) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        return this.navigate(`/${currentUser.role.toLowerCase()}-dashboard/profile`);
      }
    }

    const template = await this.#loadTemplate(this.#routeMap[routeKey]);
    this.#appElement.innerHTML = template;
    const shopLink = document.getElementById("shop-direct");
    if (shopLink) {
      document.addEventListener("click", (e) => {
        const shopBtn = e.target.closest("#shop-direct");
        if (shopBtn) {
          e.preventDefault();
          this.#removeFiltersAndGoToShop();
        }
      });
    }

    this.#updatePageMeta(this.#getRouteMeta(routeKey));
    if (PAGE_INITIALIZERS[routeKey]) {
      PAGE_INITIALIZERS[routeKey]();
    }

    const dashboardContainer = document.getElementById("dashboard-grid");
    if (dashboardContainer) {
      this.#sideBarElement = document.getElementById("pf-sidebar-wrapper");
      this.#sideBarElement.innerHTML = this.#cachedSidebar;
      handleRenderingSideBarLinks(normalizedPath);
    }

    setTimeout(() => {
      this.#authState.init();

      if (!this.#authState.isAdmin()) {
        cartAndWishlistLogic();
        updateCartAndWishlistBadges();
      }
    }, 50);
  }

  async #loadLayoutComponents() {
    try {
      const [navbar, footer, sidebar] = await Promise.all([
        this.#cachedNavbar || this.#loadTemplate("/components/navbar.html"),
        this.#cachedFooter || this.#loadTemplate("/components/footer.html"),
        this.#cachedSidebar || this.#loadTemplate("/components/sidebar.html"),
      ]);

      this.#cachedNavbar = navbar;
      this.#cachedFooter = footer;
      this.#cachedSidebar = sidebar;

      this.#headerElement.innerHTML = navbar;
      this.#footerElement.innerHTML = footer;

      setTimeout(() => this.#authState.init(), 0);
    } catch (error) {
      console.error("Failed to load layout components:", error);
    }
  }

  getPath() {
    return window.location.hash.replace(/^#+/, "#");
  }

  navigate(path) {
    if (!path.startsWith("#")) {
      path = "#" + path;
    }
    window.scrollTo(0, 0);
    window.location.hash = path.replace(/^#+/, "#");
  }
}

export const router = new Router({
  "/404": "/pages/404/404.html",
  "/": "/pages/home/home.html",
  "/shop": "/pages/shop/shop.html",
  "/shop/product-details": "/pages/shop/product-details/product-details.html",
  "/our-team": "/pages/our-team/our-team.html",
  "/contact": "/pages/contact/contact.html",
  "/cart": "/pages/cart/cart.html",
  "/profile": "/pages/profile/profile.html",
  "/wishlist": "/pages/wishlist/wishlist.html",
  "/checkout": "/pages/checkout/checkout.html",
  "/register": "/pages/register/register.html",
  "/login": "/pages/login/login.html",
  "/payment": "/pages/payment/payment.html",

  // customer Dashboard
  "/customer-dashboard/profile": "/pages/customer-dashboard/profile/profile.html",
  "/customer-dashboard/orders": "/pages/customer-dashboard/orders/orders.html",
  "/customer-dashboard/update-profile": "/pages/customer-dashboard/update-profile/update-profile.html",
  "/customer-dashboard/order-details": "/pages/customer-dashboard/order-details/order-details.html",

  // seller Dashboard
  "/seller-dashboard/dashboard": "/pages/seller-dashboard/dashboard/dashboard.html",
  "/seller-dashboard/profile": "/pages/seller-dashboard/profile/profile.html",
  "/seller-dashboard/orders": "/pages/seller-dashboard/orders/orders.html",
  "/seller-dashboard/order-details": "/pages/seller-dashboard/order-details/order-details.html",
  "/seller-dashboard/update-profile": "/pages/seller-dashboard/update-profile/update-profile.html",
  "/seller-dashboard/addproduct": "/pages/seller-dashboard/addProduct/addProduct.html",
  "/seller-dashboard/my-products": "/pages/seller-dashboard/my-products/my-products.html",
  "/seller-dashboard/booked-orders": "/pages/seller-dashboard/booked-orders/booked-orders.html",
  "/seller-dashboard/booked-orders-details":
    "/pages/seller-dashboard/booked-orders-details/booked-orders-details.html",

  // admin Dashboard
  "/admin-dashboard/dashboard": "/pages/admin-dashboard/dashboard/dashboard.html",
  "/admin-dashboard/profile": "/pages/admin-dashboard/profile/profile.html",
  "/admin-dashboard/orders": "/pages/admin-dashboard/orders/orders.html",
  "/admin-dashboard/update-profile": "/pages/admin-dashboard/update-profile/update-profile.html",
  "/admin-dashboard/order-details": "/pages/admin-dashboard/order-details/order-details.html",
  "/admin-dashboard/sellers": "/pages/admin-dashboard/sellers/sellers.html",
  "/admin-dashboard/customers": "/pages/admin-dashboard/customers/customers.html",
  "/admin-dashboard/add-new-user": "/pages/admin-dashboard/add-new-user/add-new-user.html",
  "/admin-dashboard/products": "/pages/admin-dashboard/products/products.html",
  "/admin-dashboard/products/product-details":
    "/pages/admin-dashboard/products/product-details/product-details.html",
});
