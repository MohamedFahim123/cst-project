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
  { path: "/wishlist", title: "Wishlist", description: "Wishlist Page" },
  { path: "/checkout", title: "Checkout", description: "Checkout Page" },
  { path: "/login", title: "Login", description: "Login Page" },
  { path: "/register", title: "Register", description: "Register Page" },
];

class Router {
  #routeMap = {};
  #cachedNavbar = "";
  #cachedFooter = "";
  #loaderElement = document.getElementById("loader");
  #appElement = document.getElementById("app");
  #headerElement = document.getElementById("header");
  #footerElement = document.getElementById("footer");

  constructor(routes) {
    this.#routeMap = routes;
    this.#setupEventListeners();
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

    if (!normalizedPath.includes("/dashboard")) {
      await this.#loadLayoutComponents();
      updateCartAndWishlistBadges();
    } else {
      this.#headerElement.innerHTML = "";
      this.#footerElement.innerHTML = "";
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

    setTimeout(() => {
      cartAndWishlistLogic();
      updateCartAndWishlistBadges();
    }, 50);
  }

  async #loadLayoutComponents() {
    try {
      const [navbar, footer] = await Promise.all([
        this.#cachedNavbar || this.#loadTemplate("/components/navbar.html"),
        this.#cachedFooter || this.#loadTemplate("/components/footer.html"),
      ]);

      this.#cachedNavbar = navbar;
      this.#cachedFooter = footer;

      this.#headerElement.innerHTML = navbar;
      this.#footerElement.innerHTML = footer;
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
  "/wishlist": "/pages/wishlist/wishlist.html",
  "/checkout": "/pages/checkout/checkout.html",
  "/register": "/pages/register/register.html",
  "/login": "/pages/login/login.html",
});
