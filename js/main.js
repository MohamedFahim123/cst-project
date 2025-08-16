/**
 * Application Route Configuration
 * Defines all routes with their metadata
 */

const APP_ROUTES = [
  // Error page
  { path: "/404", title: "404", description: "This Page Does Not Exist" },

  // Main pages
  { path: "/", title: "Home", description: "Our Home Page" },
  { path: "/shop", title: "Shop", description: "Shop Page" },
  {
    path: "/shop/product-details",
    title: "Shop Details",
    description: "Shop Details Page",
  },
  { path: "/blogs", title: "Blogs", description: "Blog Page" },
  { path: "/contact", title: "Contact", description: "Our Contact Page" },

  // Cart pages
  { path: "/cart", title: "Cart", description: "Cart Page" },
  { path: "/wishlist", title: "Wishlist", description: "Wishlist Page" },

  // Auth pages
  { path: "/login", title: "Login", description: "Login Page" },
  { path: "/register", title: "Register", description: "Register Page" },
];

/*
 * Router Class Constructor Which Handles client-side routing for SPA
 */
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
    window.addEventListener("popstate", () =>
      this.#handleNavigation(window.location.pathname, false)
    );
    window.addEventListener("load", () =>
      this.#handleNavigation(window.location.pathname, false)
    );

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
    return path ? `/${path.replace(/^\/+|\/+$/g, "").toLowerCase()}` : "/";
  }

  async #loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load template: ${url}`);
    return await response.text();
  }


  #updatePageMeta(meta) {
    if (!meta) return;

    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", meta.description);
    }
  }

  #toggleLoader(show) {
    this.#loaderElement.style.display = show ? "flex" : "none";
  }

  async #handleNavigation(rawPath, updateHistory = true) {
    try {
      this.#toggleLoader(true);

      const normalizedPath = this.#normalizePath(rawPath);
      const matchingRoute = this.#findMatchingRoute(normalizedPath);

      if (!matchingRoute) {
        return this.navigate("/404");
      }

      await this.#renderRoute(matchingRoute, normalizedPath, updateHistory);
    } catch (error) {
      console.error("Navigation error:", error);
      this.navigate("/404");
    } finally {
      this.#toggleLoader(false);
    }
  }

  #findMatchingRoute(path) {
    return (
      Object.keys(this.#routeMap).find(
        (key) => key.toLowerCase() === path.toLowerCase()
      ) || null
    );
  }

  async #renderRoute(routeKey, normalizedPath, updateHistory) {
    if (normalizedPath === "/index.html") {
      history.replaceState({}, "", "/");
      normalizedPath = "/";
    }

    if (!normalizedPath.includes("/dashboard")) {
      await this.#loadLayoutComponents();
    } else {
      this.#headerElement.innerHTML = "";
      this.#footerElement.innerHTML = "";
    }

    if (updateHistory) {
      history.pushState({}, "", routeKey);
    }

    const template = await this.#loadTemplate(this.#routeMap[routeKey]);
    this.#appElement.innerHTML = template;

    this.#updatePageMeta(this.#getRouteMeta(routeKey));
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
    this.#handleNavigation(path, true);
  }
}

const appRouter = new Router({
  "/404": "/pages/404/404.html",
  "/": "/pages/home/home.html",
  "/shop": "/pages/shop/shop.html",
  "/shop/product-details": "/pages/shop/product-details/product-details.html",
  "/blogs": "/pages/blogs/blogs.html",
  "/contact": "/pages/contact/contact.html",
  "/cart": "/pages/cart/cart.html",
  "/wishlist": "/pages/wishlist/wishlist.html",
  "/register": "/pages/register/register.html",
  "/login": "/pages/login/login.html",
});
