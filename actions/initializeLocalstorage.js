import { fetchData } from "../actions/fetchData.js";

export function initializeLocalStorage() {
  initializeUsers();
  initializeShopFilters();
  initializeProducts();
  // can add extra initialization functions here
}

async function initializeProducts() {
  const products = JSON.parse(localStorage.getItem("all-products"));
  if (!products) {
    const products = await fetchData("/json/products.json");
    localStorage.setItem("all-products", JSON.stringify(products));
  }
}

async function initializeShopFilters() {
  const filters = JSON.parse(localStorage.getItem("shop-filters"));
  if (!filters) {
    const filters = await fetchData("/json/shopFilters.json");
    localStorage.setItem("shop-filters", JSON.stringify(filters));
  }
}

async function initializeUsers() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users) {
    const users = await fetchData("/json/allusers.json");
    localStorage.setItem("users", JSON.stringify(users));
  }
}
