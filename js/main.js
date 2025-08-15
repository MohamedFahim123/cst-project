import { MyAppROUTES } from "./routes.js";

class Router {
  #routes = { "/": "/pages/home/home.html" };
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
    return html;
  }

  async getFooter() {
    const res = await fetch("/components/footer.html");
    const html = await res.text();
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

    this.showLoader();

    if (route === "/index.html") {
      history.replaceState({}, "", "/");
      route = "/";
    }

    if (!route.includes("/dashboard")) {
      header.innerHTML = await this.getNav();
      footer.innerHTML = await this.getFooter();
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
    this.render(route, true);
  }
}

const router = new Router({
  "/": "/pages/home/home.html",
  "/about": "/pages/about/about.html",
  "/contact": "/pages/contact/contact.html",
  "./about/about.html": "/pages/about/about.html",
  "/404": "/pages/404/404.html",
  "/dashboard": "/pages/dashboard/profile/profile.html",
});

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    router.navigate(e.target.getAttribute("href"));
  }
});
