const MyAppROUTES = [
  // error page
  {
    path: "/404",
    title: "404",
    description: "This Page Does Not Exist",
  },

  // home pages
  {
    path: "/",
    title: "Home",
    description: "Our Home Page",
  },
  {
    path: "/shop",
    title: "Shop",
    description: "Shop Page",
  },
  {
    path: "/shop/product-details",
    title: "Shop Details",
    description: "Shop Details Page",
  },
  {
    path: "/blogs",
    title: "Blogs",
    description: "Blog Page",
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Our Contact Page",
  },

  // carts
  {
    path: "/cart",
    title: "Cart",
    description: "Cart Page",
  },
  {
    path: "/wishlist",
    title: "Wishlist",
    description: "Wishlist Page",
  },

  // auth
  {
    path: "/login",
    title: "Login",
    description: "Login Page",
  },
  {
    path: "/register",
    title: "Register",
    description: "Register Page",
  },
];

class Router {
  #routes = { "/": "/pages/home/home.html" };
  #navBar = "";
  #footer = "";
  constructor(routes) {
    this.Routes = routes;

    window.addEventListener("popstate", () =>
      this.render(window.location.pathname, false)
    );
    window.addEventListener("load", () =>
      this.render(window.location.pathname, false)
    );
  }

  get Routes() {
    return this.#routes;
  }

  set Routes(routes) {
    this.#routes = routes;
  }

  async getNav() {
    const res = await fetch("/components/navbar.html");
    const html = await res.text();
    this.#navBar = html;
    return html;
  }

  async getFooter() {
    const res = await fetch("/components/footer.html");
    const html = await res.text();
    this.#footer = html;
    return html;
  }

  showLoader() {
    document.getElementById("loader").style.display = "flex";
  }

  hideLoader() {
    document.getElementById("loader").style.display = "none";
  }

  async render(route, push = true) {
    const app = document.getElementById("app");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
    route = "/" + route.replace(/^\/+/, "").toLowerCase();

    this.showLoader();

    if (route === "/index.html") {
      history.replaceState({}, "", "/");
      route = "/";
    }

    if (!route.includes("/dashboard")) {
      header.innerHTML = this.#navBar || (await this.getNav());
      footer.innerHTML = this.#footer || (await this.getFooter());
    } else {
      header.innerHTML = "";
      footer.innerHTML = "";
    }

    if (push && this.Routes[route]) {
      history.pushState({}, "", route);
    }
    const file = this.Routes[route];

    if (file) {
      try {
        const startTime = Date.now();

        const res = await fetch(file);
        const html = await res.text();

        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 500 - elapsed);

        setTimeout(() => {
          app.innerHTML = html;

          const currPageMeta = MyAppROUTES.find(
            (page) =>
              page.path.slice(1).toLowerCase() === route.slice(1).toLowerCase()
          );
          if (currPageMeta) {
            document.title = currPageMeta.title;
            document
              .querySelector("meta[name='description']")
              .setAttribute("content", currPageMeta.description);
          }

          this.hideLoader();
        }, delay);
      } catch (err) {
        console.error("Page load error:", err);
        this.hideLoader();
        router.navigate("/404");
      }
    } else {
      this.hideLoader();
      router.navigate("/404");
    }
  }

  navigate(route) {
    const normalizedRoute = "/" + route.replace(/^\/+/, "").toLowerCase();
    this.render(normalizedRoute, true);
  }
}

const router = new Router({
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

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    router.navigate(link.getAttribute("href"));
  }
});
