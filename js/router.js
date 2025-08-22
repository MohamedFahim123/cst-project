import { handleRenderingSideBarLinks } from "../components/sidebar.js";
import { PAGE_INITIALIZERS } from "./main.js";
import { cartAndWishlistLogic, updateCartAndWishlistBadges } from "./shred.js";

const APP_ROUTES = [
  { path: "/404", title: "404", description: "This Page Does Not Exist" },
  { path: "/", title: "Home", description: "Our Home Page" },
  { path: "/shop", title: "Shop", description: "Shop Page" },
  {
    path: "/shop/product-details",
    title: "Shop Details",
    description: "Shop Details Page",
  },
  { path: "/blogs", title: "Blogs", description: "Blog Page" },
  { path: "/contact", title: "Contact", description: "Our Contact Page" },
  { path: "/cart", title: "Cart", description: "Cart Page" },
  { path: "/profile", title: "Profile", description: "User Profile Page" },
  { path: "/wishlist", title: "Wishlist", description: "Wishlist Page" },
  { path: "/checkout", title: "Checkout", description: "Checkout Page" },
  { path: "/login", title: "Login", description: "Login Page" },
  { path: "/register", title: "Register", description: "Register Page" },
  { path: "/payment", title: "Payment", description: "Payment Page" },

  // customer Dashboard
  {
    path: "/customer-dashboard/profile",
    title: "Profile",
    description: "User Profile Page",
  },
  {
    path: "/customer-dashboard/orders",
    title: "Orders",
    description: "Orders Page",
  },
  {
    path: "/customer-dashboard/update-profile",
    title: "Update Profile",
    description: "Update Profile Page",
  },
  {
    path: "/customer-dashboard/order-details",
    title: "Order Details",
    description: "Order Details Page",
  },

  // Seller Dashboard
  {
    path: "/seller-dashboard/profile",
    title: "Profile",
    description: "User Profile Page",
  },
  {
    path: "/seller-dashboard/orders",
    title: "Orders",
    description: "Orders Page",
  },
  {
    path: "/seller-dashboard/update-profile",
    title: "Update Profile",
    description: "Update Profile Page",
  },
  {
    path: "/seller-dashboard/order-details",
    title: "Order Details",
    description: "Order Details Page",
  },
];

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
      const mobileCartLink = document.querySelector(
        '#mobileMenu a[href="/cart"]'
      );
      const mobileWishlistLink = document.querySelector(
        '#mobileMenu a[href="/wishlist"]'
      );

      if (isLoggedIn) {
        // User is logged in - show user menu, hide auth buttons
        if (authButtons) authButtons.classList.add("d-none");
        if (mobileAuthButtons) mobileAuthButtons.classList.add("d-none");
        if (mobileUserMenu.length)
          mobileUserMenu.forEach((item) => item.classList.remove("d-none"));

        // Hide cart/wishlist for admin users
        if (isAdmin) {
          if (cartLink) cartLink.style.display = "none";
          if (wishlistLink) wishlistLink.style.display = "none";
          if (mobileCartLink)
            mobileCartLink.parentElement.style.display = "none";
          if (mobileWishlistLink)
            mobileWishlistLink.parentElement.style.display = "none";
        } else {
          if (cartLink) cartLink.style.display = "block";
          if (wishlistLink) wishlistLink.style.display = "block";
          if (mobileCartLink)
            mobileCartLink.parentElement.style.display = "block";
          if (mobileWishlistLink)
            mobileWishlistLink.parentElement.style.display = "block";
        }
      } else {
        // User is not logged in - show auth buttons, hide user menu
        if (authButtons) authButtons.classList.remove("d-none");
        if (mobileAuthButtons) mobileAuthButtons.classList.remove("d-none");
        if (mobileUserMenu.length)
          mobileUserMenu.forEach((item) => item.classList.add("d-none"));

        // Show cart/wishlist for non-logged in users
        if (cartLink) cartLink.style.display = "block";
        if (wishlistLink) wishlistLink.style.display = "block";
        if (mobileCartLink)
          mobileCartLink.parentElement.style.display = "block";
        if (mobileWishlistLink)
          mobileWishlistLink.parentElement.style.display = "block";
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
      window.addEventListener(
        "authStateChanged",
        this.#authState.updateUI.bind(this)
      );
    },
  };

  constructor(routes) {
    this.#routeMap = routes;
    this.#setupEventListeners();
    // Initialize auth state on router creation
    setTimeout(() => this.#authState.init(), 0);
  }

  #setupEventListeners() {
    window.addEventListener("hashchange", () => this.#handleNavigation());
    window.addEventListener("load", () => this.#handleNavigation());

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute("href"));
      }
    });
  }

  #getRouteMeta(path) {
    return (
      APP_ROUTES.find(
        (route) => route.path.toLowerCase() === path.toLowerCase()
      ) || null
    );
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

      const matchingRoute = this.#findMatchingRoute(normalizedPath);
      if (!matchingRoute) {
        return this.navigate("#/404");
      }

      // Check if admin is trying to access restricted routes
      const isAdmin = this.#authState.isAdmin();
      if (
        isAdmin &&
        (normalizedPath === "/cart" || normalizedPath === "/wishlist")
      ) {
        // Redirect admin users to their dashboard instead of cart/wishlist
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
    return (
      Object.keys(this.#routeMap).find(
        (key) => key.replace(/\/+$/, "") === cleanPath
      ) || null
    );
  }

  async #renderRoute(routeKey, normalizedPath) {
    document.querySelectorAll("[data-link]").forEach((link) => {
      const linkPath = this.#normalizePath(
        link.getAttribute("href").replace("#", "")
      );
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
        (normalizedPath.includes("seller") || normalizedPath.includes("admin"));

      const isSellerOk =
        user.role.toLowerCase() === "seller" &&
        (normalizedPath.includes("customer") ||
          normalizedPath.includes("admin"));

      const isAdminOk =
        user.role.toLowerCase() === "admin" &&
        (normalizedPath.includes("customer") ||
          normalizedPath.includes("seller"));

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

    if (
      normalizedPath.includes("/login") ||
      normalizedPath.includes("/register")
    ) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        return this.navigate(
          `/${currentUser.role.toLowerCase()}-dashboard/profile`
        );
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
      // Reinitialize auth state after page content is loaded
      this.#authState.init();

      // Only initialize cart and wishlist logic for non-admin users
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

      // Initialize auth state after navbar is loaded
      setTimeout(() => this.#authState.init(), 0);
    } catch (error) {
      console.error("Failed to load layout components:", error);
    }
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
  "/blogs": "/pages/blogs/blogs.html",
  "/contact": "/pages/contact/contact.html",
  "/cart": "/pages/cart/cart.html",
  "/profile": "/pages/profile/profile.html",
  "/wishlist": "/pages/wishlist/wishlist.html",
  "/checkout": "/pages/checkout/checkout.html",
  "/register": "/pages/register/register.html",
  "/login": "/pages/login/login.html",
  "/payment": "/pages/payment/payment.html",

  // customer Dashboard
  "/customer-dashboard/profile":
    "/pages/customer-dashboard/profile/profile.html",
  "/customer-dashboard/orders": "/pages/customer-dashboard/orders/orders.html",
  "/customer-dashboard/update-profile":
    "/pages/customer-dashboard/update-profile/update-profile.html",
  "/customer-dashboard/order-details":
    "/pages/customer-dashboard/order-details/order-details.html",

  // seller Dashboard
  "/seller-dashboard/profile": "/pages/seller-dashboard/profile/profile.html",
  "/seller-dashboard/addproduct": "/pages/seller-dashboard/addProduct/addProduct.html",
  "/seller-dashboard/update-profile":
    "/pages/seller-dashboard/update-profile/update-profile.html",
  "/seller-dashboard/order-details":
    "/pages/seller-dashboard/order-details/order-details.html",
});
